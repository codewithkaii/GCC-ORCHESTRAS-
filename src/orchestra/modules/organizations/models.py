"""Organization and Workspace database models."""

import uuid
from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from src.orchestra.core.database import Base, TimestampMixin


class Organization(Base, TimestampMixin):
    """Authoritative tenant organization boundary."""
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    status = Column(String(32), default="active", nullable=False)  # active, suspended, trial
    default_timezone = Column(String(64), default="UTC", nullable=False)
    default_locale = Column(String(16), default="en-US", nullable=False)

    workspaces = relationship("Workspace", back_populates="organization", cascade="all, delete-orphan")
    memberships = relationship("Membership", back_populates="organization", cascade="all, delete-orphan")


class Workspace(Base, TimestampMixin):
    """Sub-tenant operational workspace within an organization."""
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    organization = relationship("Organization", back_populates="workspaces")
