"""Pydantic schemas for Organizations and Workspaces."""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

OrganizationStatus = Literal["active", "suspended", "trial"]


class CreateOrganizationInput(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=100)
    status: OrganizationStatus = "active"
    default_timezone: str = "UTC"
    default_locale: str = "en-US"


class OrganizationDto(BaseModel):
    id: str
    name: str
    slug: str
    status: OrganizationStatus
    default_timezone: str
    default_locale: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreateWorkspaceInput(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None


class WorkspaceDto(BaseModel):
    id: str
    organization_id: str
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
