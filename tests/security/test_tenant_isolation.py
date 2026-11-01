"""Security test suite validating strict multi-tenant boundary isolation (ADR-003).

Mandatory Acceptance Gate B: Proves Tenant A cannot read, modify, or delete Tenant B's records.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.orchestra.core.database import Base
from src.orchestra.core.errors import EntityNotFoundError, TenantAccessViolation
from src.orchestra.modules.approvals.schemas import CreateApprovalInput
from src.orchestra.modules.approvals.service import ApprovalService
from src.orchestra.modules.organizations.models import Organization, Workspace
from src.orchestra.modules.organizations.schemas import CreateWorkspaceInput
from src.orchestra.modules.organizations.service import OrganizationService
from src.orchestra.modules.requests.schemas import CreateRequestInput
from src.orchestra.modules.requests.service import RequestService


@pytest.fixture
def multi_tenant_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Seed Tenant A
    org_a = Organization(id="org_tenant_alpha", name="Alpha Logistics Inc", slug="alpha-logistics")
    # Seed Tenant B
    org_b = Organization(id="org_tenant_beta", name="Beta Procurement Corp", slug="beta-procurement")
    session.add_all([org_a, org_b])
    session.commit()

    yield session
    session.close()


def test_tenant_cannot_read_another_tenants_requests(multi_tenant_db):
    req_service = RequestService(multi_tenant_db)

    # 1. Tenant Alpha creates an operational request
    req_alpha = req_service.create_request(
        organization_id="org_tenant_alpha",
        user_id="usr_alice",
        input_data=CreateRequestInput(
            input_text="Investigate customs hold on container MSCU781290",
            priority="critical",
        ),
    )
    assert req_alpha.id is not None
    assert req_alpha.organization_id == "org_tenant_alpha"

    # 2. Tenant Alpha reads its own request -> SUCCEEDS
    fetched = req_service.get_request(req_alpha.id, "org_tenant_alpha")
    assert fetched.id == req_alpha.id

    # 3. Tenant Beta attempts to read Tenant Alpha's request -> FORBIDDEN
    with pytest.raises(TenantAccessViolation, match="cross-tenant"):
        req_service.get_request(req_alpha.id, "org_tenant_beta")


def test_tenant_cannot_list_another_tenants_requests(multi_tenant_db):
    req_service = RequestService(multi_tenant_db)

    # Create 3 requests for Tenant Alpha
    for i in range(3):
        req_service.create_request(
            organization_id="org_tenant_alpha",
            user_id="usr_alice",
            input_data=CreateRequestInput(input_text=f"Alpha Request {i}"),
        )

    # Create 1 request for Tenant Beta
    req_service.create_request(
        organization_id="org_tenant_beta",
        user_id="usr_bob",
        input_data=CreateRequestInput(input_text="Beta Request 1"),
    )

    # List as Tenant Beta
    beta_requests = req_service.list_requests("org_tenant_beta")
    assert len(beta_requests) == 1
    assert beta_requests[0].organization_id == "org_tenant_beta"
    assert "Alpha" not in beta_requests[0].input_text

    # Verify zero cross-tenant leakage
    for r in beta_requests:
        assert r.organization_id != "org_tenant_alpha"


def test_tenant_cannot_approve_or_modify_another_tenants_approvals(multi_tenant_db):
    approval_service = ApprovalService(multi_tenant_db)

    # Tenant Alpha creates an approval request
    approval_alpha = approval_service.create_approval_request(
        organization_id="org_tenant_alpha",
        input_data=CreateApprovalInput(
            workflow_run_id="wf_alpha_01",
            action_type="wire_transfer",
            action_payload={"beneficiary": "Alpha Supplier", "amount": 85000},
            target_system="Wire Gateway",
            risk_level="high",
        ),
    )
    assert approval_alpha.organization_id == "org_tenant_alpha"

    # Tenant Beta attempts to read approval -> REJECTED
    with pytest.raises(TenantAccessViolation):
        approval_service.get_approval(approval_alpha.id, "org_tenant_beta")

    # Tenant Beta attempts to approve Tenant Alpha's request -> REJECTED
    with pytest.raises(TenantAccessViolation):
        approval_service.approve(
            approval_id=approval_alpha.id,
            organization_id="org_tenant_beta",
            actor_id="usr_attacker_bob",
            reason="Malicious cross-tenant approval",
        )

    # Invariant: Approval status remains un-mutated in database
    refreshed = multi_tenant_db.query(type(approval_alpha)).filter_by(id=approval_alpha.id).first()
    assert refreshed.status == "pending"
    assert refreshed.decided_by is None


def test_workspace_isolation_across_tenants(multi_tenant_db):
    org_service = OrganizationService(multi_tenant_db)

    # Create workspace in Tenant Alpha
    ws_alpha = org_service.create_workspace(
        "org_tenant_alpha",
        CreateWorkspaceInput(name="Alpha Middle East Ops", slug="alpha-me"),
    )
    assert ws_alpha.organization_id == "org_tenant_alpha"

    # Tenant Beta attempts to query Tenant Alpha's organization/workspaces -> REJECTED
    with pytest.raises(TenantAccessViolation):
        org_service.get_organization("org_tenant_alpha", requesting_org_id="org_tenant_beta")
