"""FastAPI router for Operational Requests (/api/v1/requests)."""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.orchestra.core.database import get_db
from src.orchestra.core.envelope import wrap_response
from src.orchestra.core.security import TenantContext, get_current_tenant_context, require_permission
from src.orchestra.modules.requests.schemas import CreateRequestInput, RequestDto
from src.orchestra.modules.requests.service import RequestService

router = APIRouter(prefix="/requests", tags=["Requests"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_request(
    input_data: CreateRequestInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(require_permission("requests.create")),
) -> Dict[str, Any]:
    """Create a new operational request."""
    service = RequestService(db)
    req = service.create_request(
        organization_id=tenant_ctx.organization_id,
        user_id=tenant_ctx.user_id,
        input_data=input_data,
    )
    return wrap_response(RequestDto.model_validate(req).model_dump(mode="json"))


@router.get("")
def list_requests(
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """List operational requests belonging to the current tenant."""
    service = RequestService(db)
    requests = service.list_requests(tenant_ctx.organization_id)
    return wrap_response([RequestDto.model_validate(r).model_dump(mode="json") for r in requests])


@router.get("/{request_id}")
def get_request(
    request_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Retrieve details of a single request, enforcing tenant isolation."""
    service = RequestService(db)
    req = service.get_request(request_id, tenant_ctx.organization_id)
    return wrap_response(RequestDto.model_validate(req).model_dump(mode="json"))


@router.get("/{request_id}/events")
def get_request_events(
    request_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Retrieve operational event log and execution trace for the request."""
    service = RequestService(db)
    req = service.get_request(request_id, tenant_ctx.organization_id)
    
    # Synthetic operational events matching first vertical-slice investigation
    events = [
        {
            "event_id": f"evt_{req.id[:8]}_1",
            "event_type": "request.received",
            "organization_id": tenant_ctx.organization_id,
            "sequence": 1,
            "occurred_at": req.created_at.isoformat() if req.created_at else "",
            "data": {"input_text": req.input_text, "source": req.source},
        },
        {
            "event_id": f"evt_{req.id[:8]}_2",
            "event_type": "request.classified",
            "organization_id": tenant_ctx.organization_id,
            "sequence": 2,
            "occurred_at": req.created_at.isoformat() if req.created_at else "",
            "data": {
                "category": "supplier_investigation",
                "assigned_agent": "Logistics Dispatch Specialist",
                "risk_profile": "medium",
            },
        },
        {
            "event_id": f"evt_{req.id[:8]}_3",
            "event_type": "workflow.started",
            "organization_id": tenant_ctx.organization_id,
            "sequence": 3,
            "occurred_at": req.created_at.isoformat() if req.created_at else "",
            "data": {
                "workflow_id": f"wf_{req.id[:8]}",
                "step": "investigate_rotterdam_delay",
            },
        },
    ]
    return wrap_response(events)
