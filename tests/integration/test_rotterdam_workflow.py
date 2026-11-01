"""End-to-end integration test for the Rotterdam Supplier Delay Resolution vertical slice.

Verifies the 7-step business workflow against all safety gates and deterministic invariants:
1. Receive request
2. Investigate authorized order & shipment records via tool registry
3. Identify customer SLA impact (8-day delay at Waalhaven)
4. Formulate proposed resolution (air freight split 20% quota)
5. Request human approval with canonical SHA-256 hash
6. Human decision recorded with tamper validation
7. Consequential execution through allowlisted tool producing auditable completion report
"""

import pytest
from starlette.testclient import TestClient
from apps.api.main import app
from src.orchestra.core.database import Base, SessionLocal, engine
from src.orchestra.modules.organizations.models import Organization


@pytest.fixture(scope="module", autouse=True)
def setup_rotterdam_db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    org = session.query(Organization).filter_by(id="org_gcc_logistics").first()
    if not org:
        session.add(
            Organization(
                id="org_gcc_logistics",
                name="GCC Logistics",
                slug="gcc-logistics",
                status="active",
            )
        )
        session.commit()
    session.close()
    yield


@pytest.fixture
def client():
    return TestClient(app)


def test_rotterdam_supplier_delay_complete_vertical_slice(client):
    import uuid
    unique_idemp = f"idemp_rotterdam_{uuid.uuid4().hex[:8]}"
    headers_lead = {"Authorization": "Bearer usr_sarah:org_gcc_logistics:operations_lead:*"}

    # -------------------------------------------------------------------------
    # Step 1: Receive supplier-delay request
    # -------------------------------------------------------------------------
    create_res = client.post(
        "/api/v1/requests",
        headers=headers_lead,
        json={
            "input_text": "Supplier Rotterdam Marine Spares B.V. notified 8-day customs inspection delay on PO-2026-8821. Mitigate to prevent Jebel Ali assembly line stoppage.",
            "source": "workspace",
            "priority": "critical",
            "execution_mode": "approval_required",
            "idempotency_key": unique_idemp,
        },
    )
    assert create_res.status_code == 201
    request_data = create_res.json()["data"]
    request_id = request_data["id"]
    assert request_data["status"] == "received"

    # -------------------------------------------------------------------------
    # Steps 2-5: Autonomous Investigation & Human Approval Gate Generation
    # -------------------------------------------------------------------------
    investigate_res = client.post(
        "/api/v1/workflows/supplier-delay/investigate",
        headers=headers_lead,
        json={"request_id": request_id, "po_number": "PO-2026-8821"},
    )
    assert investigate_res.status_code == 200
    investigation = investigate_res.json()["data"]
    assert investigation["status"] == "awaiting_approval"
    assert investigation["requires_human_approval"] is True
    
    # Check ERP and Tracking evidence retrieved
    erp = investigation["investigation"]["erp"]
    assert erp["po_number"] == "PO-2026-8821"
    assert erp["vendor_name"] == "Rotterdam Marine Spares B.V."

    tracking = investigation["investigation"]["tracking"]
    assert tracking["delay_days"] == 8
    assert "Waalhaven" in tracking["current_status"]

    mitigation = investigation["investigation"]["mitigation"]
    assert mitigation["confidence_score"] == 0.942
    assert mitigation["sla_breach_avoided"] is True

    approval_id = investigation["approval_request_id"]
    canonical_hash = investigation["canonical_payload_hash"]
    assert len(canonical_hash) == 64

    # -------------------------------------------------------------------------
    # Safety Invariant: Pre-mature execution attempt must be REJECTED
    # -------------------------------------------------------------------------
    premature_exec = client.post(
        "/api/v1/workflows/supplier-delay/execute",
        headers=headers_lead,
        json={"approval_id": approval_id},
    )
    assert premature_exec.status_code == 400
    assert premature_exec.json()["error"]["code"] == "INVALID_APPROVAL_STATE"

    # -------------------------------------------------------------------------
    # Step 6: Human Approval Decision Recorded
    # -------------------------------------------------------------------------
    approve_res = client.post(
        f"/api/v1/approvals/{approval_id}/approve",
        headers=headers_lead,
        json={"reason": "Approved: Air freight split quota is essential to prevent plant stoppage"},
    )
    assert approve_res.status_code == 200
    approved_data = approve_res.json()["data"]
    assert approved_data["status"] == "approved"
    assert approved_data["payload_hash"] == canonical_hash

    # -------------------------------------------------------------------------
    # Step 7: Execution through Allowlisted Tool & Completion Report
    # -------------------------------------------------------------------------
    exec_res = client.post(
        "/api/v1/workflows/supplier-delay/execute",
        headers=headers_lead,
        json={"approval_id": approval_id},
    )
    assert exec_res.status_code == 200
    exec_data = exec_res.json()["data"]
    assert exec_data["status"] == "completed"

    report = exec_data["completion_report"]
    assert report["po_number"] == "PO-2026-8821"
    assert report["sla_safeguarded"] is True
    assert "KLM-CARGO" in report["booking_reference"]

    # Verify request status transitioned to completed
    req_check = client.get(f"/api/v1/requests/{request_id}", headers=headers_lead)
    assert req_check.status_code == 200
    assert req_check.json()["data"]["status"] == "completed"
