"""FastAPI router for Organizations and Workspaces."""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.orchestra.core.database import get_db
from src.orchestra.core.envelope import wrap_response
from src.orchestra.core.security import TenantContext, get_current_tenant_context, require_permission
from src.orchestra.modules.organizations.schemas import (
    CreateOrganizationInput,
    CreateWorkspaceInput,
    OrganizationDto,
    WorkspaceDto,
)
from src.orchestra.modules.organizations.service import OrganizationService

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_organization(
    input_data: CreateOrganizationInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Create a new tenant organization."""
    service = OrganizationService(db)
    org = service.create_organization(input_data)
    return wrap_response(OrganizationDto.model_validate(org).model_dump(mode="json"))


@router.get("/{organization_id}")
def get_organization(
    organization_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Retrieve organization details within tenant boundary."""
    service = OrganizationService(db)
    org = service.get_organization(
        organization_id,
        requesting_org_id=None if tenant_ctx.is_system_admin else tenant_ctx.organization_id,
    )
    return wrap_response(OrganizationDto.model_validate(org).model_dump(mode="json"))


@router.get("/{organization_id}/workspaces")
def list_workspaces(
    organization_id: str,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """List workspaces belonging to an organization."""
    service = OrganizationService(db)
    # Enforce tenant isolation
    service.get_organization(
        organization_id,
        requesting_org_id=None if tenant_ctx.is_system_admin else tenant_ctx.organization_id,
    )
    workspaces = service.list_workspaces(organization_id)
    return wrap_response([WorkspaceDto.model_validate(w).model_dump(mode="json") for w in workspaces])


@router.post("/{organization_id}/workspaces", status_code=status.HTTP_201_CREATED)
def create_workspace(
    organization_id: str,
    input_data: CreateWorkspaceInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Create a workspace within an organization."""
    service = OrganizationService(db)
    service.get_organization(
        organization_id,
        requesting_org_id=None if tenant_ctx.is_system_admin else tenant_ctx.organization_id,
    )
    workspace = service.create_workspace(organization_id, input_data)
    return wrap_response(WorkspaceDto.model_validate(workspace).model_dump(mode="json"))
