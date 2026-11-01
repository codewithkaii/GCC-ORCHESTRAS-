"""FastAPI router for Approval Management (/api/v1/approvals)."""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.orchestra.core.database import get_db
from src.orchestra.core.envelope import wrap_response
from src.orchestra.core.security import TenantContext, get_current_tenant_context, require_permission
from src.orchestra.modules.approvals.models import ApprovalRequest
from src.orchestra.modules.approvals.schemas import (
    ApprovalRequestDto,
    ApproveActionInput,
    CreateApprovalInput,
    RejectActionInput,
    RequestChangesActionInput,
)
from src.orchestra.modules.approvals.service import ApprovalService

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_approval(
    input_data: CreateApprovalInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Create a new Human-in-the-Loop approval request with canonical payload hash."""
    service = ApprovalService(db)
    approval = service.create_approval_request(
        organization_id=tenant_ctx.organization_id,
        input_data=input_data,
    )
    return wrap_response(ApprovalRequestDto.model_validate(approval).model_dump(mode="json"))


@router.get("")
def list_approvals(
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """List pending and historical approvals for the current tenant."""
    approvals = db.query(ApprovalRequest).filter(
        ApprovalRequest.organization_id == tenant_ctx.organization_id,
    ).order_by(ApprovalRequest.created_at.desc()).all()
    return wrap_response([ApprovalRequestDto.model_validate(a).model_dump(mode="json") for a in approvals])


@router.get("/{approval_id}")
def get_approval(
    approval_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Retrieve approval request details within tenant boundary."""
    service = ApprovalService(db)
    approval = service.get_approval(approval_id, tenant_ctx.organization_id)
    return wrap_response(ApprovalRequestDto.model_validate(approval).model_dump(mode="json"))


@router.post("/{approval_id}/approve")
def approve_action(
    approval_id: str,
    input_data: ApproveActionInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(require_permission("approvals.decide")),
) -> Dict[str, Any]:
    """Approve a consequential action."""
    service = ApprovalService(db)
    approval = service.approve(
        approval_id=approval_id,
        organization_id=tenant_ctx.organization_id,
        actor_id=tenant_ctx.user_id,
        reason=input_data.reason,
    )
    return wrap_response(ApprovalRequestDto.model_validate(approval).model_dump(mode="json"))


@router.post("/{approval_id}/reject")
def reject_action(
    approval_id: str,
    input_data: RejectActionInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(require_permission("approvals.decide")),
) -> Dict[str, Any]:
    """Reject a proposed action."""
    service = ApprovalService(db)
    approval = service.reject(
        approval_id=approval_id,
        organization_id=tenant_ctx.organization_id,
        actor_id=tenant_ctx.user_id,
        reason=input_data.reason,
    )
    return wrap_response(ApprovalRequestDto.model_validate(approval).model_dump(mode="json"))


@router.post("/{approval_id}/request-changes")
def request_changes_action(
    approval_id: str,
    input_data: RequestChangesActionInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(require_permission("approvals.decide")),
) -> Dict[str, Any]:
    """Request modifications to a proposed action."""
    service = ApprovalService(db)
    approval = service.request_changes(
        approval_id=approval_id,
        organization_id=tenant_ctx.organization_id,
        actor_id=tenant_ctx.user_id,
        reason=input_data.reason,
    )
    return wrap_response(ApprovalRequestDto.model_validate(approval).model_dump(mode="json"))
