"""Role, Permission, and RBAC assignment models."""

import uuid
from sqlalchemy import Column, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from src.orchestra.core.database import Base, TimestampMixin


class Role(Base, TimestampMixin):
    """Authorization role defining functional capabilities."""
    __tablename__ = "roles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_role_org_name"),
    )

    role_permissions = relationship("RolePermission", back_populates="role", cascade="all, delete-orphan")
    membership_roles = relationship("MembershipRole", back_populates="role", cascade="all, delete-orphan")


class Permission(Base):
    """Granular platform permission code."""
    __tablename__ = "permissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    role_permissions = relationship("RolePermission", back_populates="permission", cascade="all, delete-orphan")


class RolePermission(Base):
    """Association table linking Roles to Permissions."""
    __tablename__ = "role_permissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    role_id = Column(String(36), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)
    permission_id = Column(String(36), ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False, index=True)

    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")

    __table_args__ = (
        UniqueConstraint("role_id", "permission_id", name="uq_role_permission"),
    )


class MembershipRole(Base):
    """Assignment table linking Memberships to Roles."""
    __tablename__ = "membership_roles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    membership_id = Column(String(36), ForeignKey("memberships.id", ondelete="CASCADE"), nullable=False, index=True)
    role_id = Column(String(36), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)

    membership = relationship("Membership", back_populates="membership_roles")
    role = relationship("Role", back_populates="membership_roles")

    __table_args__ = (
        UniqueConstraint("membership_id", "role_id", name="uq_membership_role"),
    )
