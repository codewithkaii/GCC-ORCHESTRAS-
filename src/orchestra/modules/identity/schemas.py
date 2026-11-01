"""Pydantic schemas for Identity and Memberships."""

from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

UserStatus = Literal["active", "invited", "deactivated"]
MembershipStatus = Literal["active", "pending", "revoked"]


class CreateUserInput(BaseModel):
    identity_subject: str = Field(..., min_length=3, max_length=255)
    email: EmailStr
    display_name: str = Field(..., min_length=2, max_length=255)
    avatar_url: Optional[str] = None


class UserDto(BaseModel):
    id: str
    identity_subject: str
    email: str
    display_name: str
    status: UserStatus
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreateMembershipInput(BaseModel):
    user_id: str
    role_names: List[str] = ["operator"]


class MembershipDto(BaseModel):
    id: str
    organization_id: str
    user_id: str
    status: MembershipStatus
    roles: List[str] = []
    permissions: List[str] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
