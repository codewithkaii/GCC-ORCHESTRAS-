"""Unit tests for the Approval state machine, invariants, and canonical SHA-256 hashing."""

import pytest
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.orchestra.core.database import Base
from src.orchestra.core.errors import (
    ApprovalStateError,
    InvalidPayloadHashError,
    TenantAccessViolation,
)
from src.orchestra.modules.approvals.models import ApprovalRequest
from src.orchestra.modules.approvals.schemas import CreateApprovalInput
from src.orchestra.modules.approvals.service import ApprovalService, compute_canonical_payload_hash
from src.orchestra.modules.organizations.models import Organization


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Seed organization
    org = Organization(id="org_test", name="Test Org", slug="test-org")
    session.add(org)
    session.commit()

    yield session
    session.close()


def test_canonical_payload_hashing_determinism():
    # Verify key ordering invariance
    payload1 = {"target": "SAP", "action": "update_po", "amount": 15000, "po": "PO-100"}
    payload2 = {"po": "PO-100", "amount": 15000, "action": "update_po", "target": "SAP"}

    hash1 = compute_canonical_payload_hash(payload1)
    hash2 = compute_canonical_payload_hash(payload2)

    assert hash1 == hash2
    assert len(hash1) == 64  # SHA-256 hex length

    # Altering value must alter hash
    payload_altered = {"po": "PO-100", "amount": 15001, "action": "update_po", "target": "SAP"}
    assert compute_canonical_payload_hash(payload_altered) != hash1


def test_approval_lifecycle_and_transition_invariants(db_session):
    service = ApprovalService(db_session)

    # 1. Create approval request
    input_data = CreateApprovalInput(
        workflow_run_id="wf_run_001",
        action_type="dispatch_air_freight",
        action_payload={"po": "PO-8821", "carrier": "KLM", "cost_usd": 4200},
        target_system="Logistics EDI",
        risk_level="high",
        expires_in_hours=24,
    )
    approval = service.create_approval_request("org_test", input_data)
    assert approval.status == "pending"
    assert approval.payload_hash is not None

    # 2. Approve request
    approved = service.approve(
        approval_id=approval.id,
        organization_id="org_test",
        actor_id="usr_manager",
        reason="Verified logistics SLA breach warrants expedite",
    )
    assert approved.status == "approved"
    assert approved.decided_by == "usr_manager"
    assert approved.decided_at is not None

    # Invariant: Cannot approve already approved request
    with pytest.raises(ApprovalStateError):
        service.approve(approval.id, "org_test", "usr_manager_2")

    # Invariant: Cannot reject already approved request
    with pytest.raises(ApprovalStateError):
        service.reject(approval.id, "org_test", "usr_manager_2", "Reason")


def test_tamper_detection_on_execution(db_session):
    service = ApprovalService(db_session)
    original_payload = {"po": "PO-8821", "amount": 4200}

    input_data = CreateApprovalInput(
        workflow_run_id="wf_run_tamper",
        action_type="payment_release",
        action_payload=original_payload,
        target_system="Banking Gateway",
        risk_level="high",
    )
    approval = service.create_approval_request("org_test", input_data)
    service.approve(approval.id, "org_test", "usr_cfo", "Approved")

    # Invariant: Executing exact approved payload succeeds
    locked = service.verify_and_lock_for_execution(approval.id, "org_test", original_payload)
    assert locked.status == "executing"

    # Now create another approval and test payload tampering detection
    input_tamper = CreateApprovalInput(
        workflow_run_id="wf_run_tamper_2",
        action_type="payment_release",
        action_payload={"po": "PO-8822", "amount": 1000},
        target_system="Banking Gateway",
    )
    approval_tamper = service.create_approval_request("org_test", input_tamper)
    service.approve(approval_tamper.id, "org_test", "usr_cfo", "Approved")

    # Tampered execution payload (amount changed from 1000 to 90000)
    tampered_payload = {"po": "PO-8822", "amount": 90000}
    with pytest.raises(InvalidPayloadHashError):
        service.verify_and_lock_for_execution(approval_tamper.id, "org_test", tampered_payload)


def test_expired_approval_rejection(db_session):
    service = ApprovalService(db_session)
    input_data = CreateApprovalInput(
        workflow_run_id="wf_expired",
        action_type="urgent_action",
        action_payload={"item": "spare_part"},
        target_system="Inventory",
        expires_in_hours=1,
    )
    approval = service.create_approval_request("org_test", input_data)

    # Force expiration in database
    approval.expires_at = datetime.now(timezone.utc) - timedelta(hours=2)
    db_session.commit()

    with pytest.raises(ApprovalStateError, match="expired"):
        service.approve(approval.id, "org_test", "usr_lead")
