"""Integration tests for FastAPI REST endpoints and API envelopes."""

import pytest
from starlette.testclient import TestClient
from apps.api.main import app
from src.orchestra.core.database import Base, SessionLocal, engine


from src.orchestra.modules.organizations.models import Organization


@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    existing_org = session.query(Organization).filter_by(id="org_gcc_logistics").first()
    if not existing_org:
        org = Organization(
            id="org_gcc_logistics",
            name="GCC Logistics",
            slug="gcc-logistics",
            status="active",
            default_timezone="Asia/Dubai",
            default_locale="en-US",
        )
        session.add(org)
        session.commit()
    session.close()
    yield


@pytest.fixture
def client():
    return TestClient(app)


def test_health_and_readiness_endpoints(client):
    res_health = client.get("/health")
    assert res_health.status_code == 200
    data = res_health.json()
    assert data["status"] == "healthy"
    assert data["service"] == "orchestra-api"

    res_ready = client.get("/ready")
    assert res_ready.status_code == 200
    ready_data = res_ready.json()
    assert ready_data["status"] == "ready"
    assert ready_data["database"] == "connected"


def test_create_and_query_organization(client):
    import uuid
    unique_slug = f"gcc-ops-{uuid.uuid4().hex[:8]}"
    headers = {"Authorization": "Bearer usr_admin:org_gcc_logistics:system_admin:*"}

    # 1. Create Organization
    res = client.post(
        "/api/v1/organizations",
        headers=headers,
        json={
            "name": "Global Cargo Consortium",
            "slug": unique_slug,
            "status": "active",
            "default_timezone": "Asia/Dubai",
            "default_locale": "en-US",
        },
    )
    assert res.status_code == 201
    body = res.json()
    assert "data" in body
    assert "meta" in body
    org = body["data"]
    assert org["slug"] == unique_slug
    org_id = org["id"]

    # 2. Create Workspace
    ws_res = client.post(
        f"/api/v1/organizations/{org_id}/workspaces",
        headers=headers,
        json={
            "name": "Jebel Ali Port Logistics",
            "slug": "jebel-ali-hub",
            "description": "Container dispatch and customs clearance operations",
        },
    )
    assert ws_res.status_code == 201
    ws = ws_res.json()["data"]
    assert ws["name"] == "Jebel Ali Port Logistics"


def test_request_lifecycle_and_events(client):
    headers = {"Authorization": "Bearer usr_alex:org_gcc_logistics:operator:requests.create,requests.read"}

    # 1. Create operational request
    create_res = client.post(
        "/api/v1/requests",
        headers=headers,
        json={
            "input_text": "Supplier Rotterdam Marine Spares reported 8-day delay on PO-2026-8821. Investigate and mitigate.",
            "source": "workspace",
            "priority": "critical",
            "execution_mode": "approval_required",
            "idempotency_key": "idemp_po_8821_01",
        },
    )
    assert create_res.status_code == 201
    req = create_res.json()["data"]
    assert req["status"] == "received"
    assert req["priority"] == "critical"
    req_id = req["id"]

    # 2. Retrieve request events trace
    events_res = client.get(f"/api/v1/requests/{req_id}/events", headers=headers)
    assert events_res.status_code == 200
    events = events_res.json()["data"]
    assert len(events) >= 3
    assert events[0]["event_type"] == "request.received"
    assert events[1]["event_type"] == "request.classified"


def test_approval_lifecycle_via_api(client):
    headers_lead = {"Authorization": "Bearer usr_sarah:org_gcc_logistics:operations_lead:approvals.decide"}

    # 1. Create approval request
    create_res = client.post(
        "/api/v1/approvals",
        headers=headers_lead,
        json={
            "workflow_run_id": "wf_run_api_test",
            "action_type": "expedite_air_freight",
            "action_payload": {"carrier": "Emirates SkyCargo", "cost_aed": 14500, "po": "PO-8821"},
            "target_system": "Freight EDI",
            "risk_level": "medium",
            "expires_in_hours": 48,
        },
    )
    assert create_res.status_code == 201
    approval = create_res.json()["data"]
    assert approval["status"] == "pending"
    assert approval["payload_hash"] is not None
    approval_id = approval["id"]

    # 2. Approve via API
    approve_res = client.post(
        f"/api/v1/approvals/{approval_id}/approve",
        headers=headers_lead,
        json={"reason": "Approved: customer delivery window preserved"},
    )
    assert approve_res.status_code == 200
    approved = approve_res.json()["data"]
    assert approved["status"] == "approved"
    assert approved["decided_at"] is not None


def test_permission_denied_when_lacking_permission(client):
    # Actor without 'approvals.decide' permission
    headers_viewer = {"Authorization": "Bearer usr_guest:org_gcc_logistics:viewer:requests.read"}

    # Create an approval to target
    headers_admin = {"Authorization": "Bearer usr_admin:org_gcc_logistics:system_admin:*"}
    create_res = client.post(
        "/api/v1/approvals",
        headers=headers_admin,
        json={
            "workflow_run_id": "wf_perm_test",
            "action_type": "test_action",
            "action_payload": {"test": True},
            "target_system": "Test System",
        },
    )
    approval_id = create_res.json()["data"]["id"]

    # Attempt to approve without permission
    denied_res = client.post(
        f"/api/v1/approvals/{approval_id}/approve",
        headers=headers_viewer,
        json={"reason": "Should fail"},
    )
    assert denied_res.status_code == 403
    error_body = denied_res.json()
    assert error_body["error"]["code"] == "PERMISSION_DENIED"
