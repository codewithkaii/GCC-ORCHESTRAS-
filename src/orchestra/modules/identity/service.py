"""Service layer for Identity, Users, and Memberships."""

from typing import List, Optional
from sqlalchemy.orm import Session
from src.orchestra.core.errors import ConflictError, EntityNotFoundError
from src.orchestra.modules.authorization.models import MembershipRole, Role
from src.orchestra.modules.identity.models import Membership, User
from src.orchestra.modules.identity.schemas import CreateMembershipInput, CreateUserInput


class IdentityService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_user(self, input_data: CreateUserInput) -> User:
        user = self.db.query(User).filter(
            (User.identity_subject == input_data.identity_subject) | (User.email == input_data.email)
        ).first()
        if user:
            return user
        
        user = User(
            identity_subject=input_data.identity_subject,
            email=input_data.email,
            display_name=input_data.display_name,
            avatar_url=input_data.avatar_url,
            status="active",
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def add_membership(self, organization_id: str, input_data: CreateMembershipInput) -> Membership:
        # Check user exists
        user = self.db.query(User).filter(User.id == input_data.user_id).first()
        if not user:
            raise EntityNotFoundError(f"User '{input_data.user_id}' not found")

        # Check existing membership
        existing = self.db.query(Membership).filter(
            Membership.organization_id == organization_id,
            Membership.user_id == input_data.user_id,
        ).first()
        if existing:
            raise ConflictError("User is already a member of this organization")

        membership = Membership(
            organization_id=organization_id,
            user_id=input_data.user_id,
            status="active",
        )
        self.db.add(membership)
        self.db.flush()

        # Assign requested roles
        for role_name in input_data.role_names:
            role = self.db.query(Role).filter(
                (Role.name == role_name) &
                ((Role.organization_id == organization_id) | (Role.organization_id == None))
            ).first()
            if not role:
                # Create standard tenant role if missing
                role = Role(organization_id=organization_id, name=role_name)
                self.db.add(role)
                self.db.flush()
            
            mr = MembershipRole(membership_id=membership.id, role_id=role.id)
            self.db.add(mr)

        self.db.commit()
        self.db.refresh(membership)
        return membership

    def get_membership(self, organization_id: str, user_id: str) -> Optional[Membership]:
        return self.db.query(Membership).filter(
            Membership.organization_id == organization_id,
            Membership.user_id == user_id,
        ).first()
