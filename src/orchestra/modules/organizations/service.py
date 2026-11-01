"""Service layer for Organizations and Workspaces."""

from typing import List, Optional
from sqlalchemy.orm import Session
from src.orchestra.core.errors import ConflictError, EntityNotFoundError, TenantAccessViolation
from src.orchestra.modules.organizations.models import Organization, Workspace
from src.orchestra.modules.organizations.schemas import CreateOrganizationInput, CreateWorkspaceInput


class OrganizationService:
    def __init__(self, db: Session):
        self.db = db

    def create_organization(self, input_data: CreateOrganizationInput) -> Organization:
        existing = self.db.query(Organization).filter(Organization.slug == input_data.slug).first()
        if existing:
            raise ConflictError(f"Organization with slug '{input_data.slug}' already exists")
        
        org = Organization(
            name=input_data.name,
            slug=input_data.slug,
            status=input_data.status,
            default_timezone=input_data.default_timezone,
            default_locale=input_data.default_locale,
        )
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        return org

    def get_organization(self, org_id: str, requesting_org_id: Optional[str] = None) -> Organization:
        if requesting_org_id and org_id != requesting_org_id:
            raise TenantAccessViolation(f"Cannot access organization '{org_id}' from context '{requesting_org_id}'")
        org = self.db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise EntityNotFoundError(f"Organization '{org_id}' not found")
        return org

    def list_workspaces(self, organization_id: str) -> List[Workspace]:
        return self.db.query(Workspace).filter(Workspace.organization_id == organization_id).all()

    def create_workspace(self, organization_id: str, input_data: CreateWorkspaceInput) -> Workspace:
        # Verify organization exists
        self.get_organization(organization_id)
        workspace = Workspace(
            organization_id=organization_id,
            name=input_data.name,
            slug=input_data.slug,
            description=input_data.description,
        )
        self.db.add(workspace)
        self.db.commit()
        self.db.refresh(workspace)
        return workspace
