"""FastAPI router for Identity, Users, and Memberships."""

from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.orchestra.core.database import get_db
from src.orchestra.core.envelope import wrap_response
from src.orchestra.core.security import TenantContext, get_current_tenant_context
from src.orchestra.modules.identity.schemas import CreateMembershipInput, CreateUserInput, MembershipDto, UserDto
from src.orchestra.modules.identity.service import IdentityService

router = APIRouter(tags=["Identity"])


@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(
    input_data: CreateUserInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Create or sync user record from verified OIDC identity provider."""
    service = IdentityService(db)
    user = service.get_or_create_user(input_data)
    return wrap_response(UserDto.model_validate(user).model_dump(mode="json"))


@router.post("/organizations/{organization_id}/memberships", status_code=status.HTTP_201_CREATED)
def create_membership(
    organization_id: str,
    input_data: CreateMembershipInput,
    db: Session = Depends(get_db),
    tenant_ctx: TenantContext = Depends(get_current_tenant_context),
) -> Dict[str, Any]:
    """Assign user to organization with specified roles."""
    service = IdentityService(db)
    membership = service.add_membership(organization_id, input_data)
    
    # Format membership roles for DTO
    roles = [mr.role.name for mr in membership.membership_roles if mr.role]
    dto_data = {
        "id": membership.id,
        "organization_id": membership.organization_id,
        "user_id": membership.user_id,
        "status": membership.status,
        "roles": roles,
        "permissions": tenant_ctx.permissions,
        "created_at": membership.created_at,
    }
    return wrap_response(dto_data)
