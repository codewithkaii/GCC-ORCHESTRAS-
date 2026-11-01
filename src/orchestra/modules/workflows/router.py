"""FastAPI router for Workflow Runs and Steps (/api/v1/workflows)."""

from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.orchestra.core.database import get_db
from src.orchestra.core.envelope import wrap_response
from src.orchestra.core.errors import EntityNotFoundError, TenantAccessViolation
from src.orchestra.core.security import TenantContext, get_current_tenant_context
from src.orchestra.modules.workflows.models import WorkflowRun, WorkflowStep
from src.orchestra.modules.workflows.schemas import WorkflowRunDto, WorkflowStepDto

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.get("/runs/{run_id}")
def get_workflow_run(
    run_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Retrieve workflow execution status within tenant boundary."""
    run = db.query(WorkflowRun).filter(WorkflowRun.id == run_id).first()
    if not run:
        raise EntityNotFoundError(f"Workflow run '{run_id}' not found")
    if run.organization_id != tenant_ctx.organization_id:
        raise TenantAccessViolation("Access to cross-tenant workflow run is forbidden")
    return wrap_response(WorkflowRunDto.model_validate(run).model_dump(mode="json"))


@router.get("/runs/{run_id}/steps")
def list_workflow_steps(
    run_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """List execution steps for a workflow run."""
    run = db.query(WorkflowRun).filter(WorkflowRun.id == run_id).first()
    if not run:
        raise EntityNotFoundError(f"Workflow run '{run_id}' not found")
    if run.organization_id != tenant_ctx.organization_id:
        raise TenantAccessViolation("Access to cross-tenant workflow run is forbidden")
    
    steps = db.query(WorkflowStep).filter(WorkflowStep.workflow_run_id == run_id).all()
    return wrap_response([WorkflowStepDto.model_validate(s).model_dump(mode="json") for s in steps])


@router.post("/supplier-delay/investigate")
def run_supplier_delay_investigation(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Execute autonomous investigation on Rotterdam supplier delay (Steps 1-5)."""
    from src.orchestra.modules.workflows.supplier_delay import SupplierDelayOrchestrator
    orchestrator = SupplierDelayOrchestrator(db, tenant_ctx.organization_id, tenant_ctx.user_id)
    request_id = payload.get("request_id")
    po_number = payload.get("po_number", "PO-2026-8821")
    result = orchestrator.run_investigation(request_id=request_id, po_number=po_number)
    return wrap_response(result)


@router.post("/supplier-delay/execute")
def execute_supplier_delay_mitigation(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Execute human-approved mitigation with post-action verification (Steps 6-7)."""
    from src.orchestra.modules.workflows.supplier_delay import SupplierDelayOrchestrator
    orchestrator = SupplierDelayOrchestrator(db, tenant_ctx.organization_id, tenant_ctx.user_id)
    approval_id = payload.get("approval_id")
    result = orchestrator.execute_approved_resolution(approval_id)
    return wrap_response(result)
