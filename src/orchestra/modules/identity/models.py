"""User and Membership database models."""

import uuid
from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from src.orchestra.core.database import Base, TimestampMixin


class User(Base, TimestampMixin):
    """Global user record mapped to external OIDC identity provider subject."""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    identity_subject = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(255), nullable=False)
    status = Column(String(32), default="active", nullable=False)  # active, invited, deactivated
    avatar_url = Column(Text, nullable=True)

    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")


class Membership(Base, TimestampMixin):
    """Tenant membership binding a User to an Organization with specific roles."""
    __tablename__ = "memberships"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(32), default="active", nullable=False)  # active, pending, revoked

    organization = relationship("Organization", back_populates="memberships")
    user = relationship("User", back_populates="memberships")
    membership_roles = relationship("MembershipRole", back_populates="membership", cascade="all, delete-orphan")
