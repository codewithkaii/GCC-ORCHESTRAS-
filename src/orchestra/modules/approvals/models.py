"""Approval and Human-in-the-Loop database models."""

import uuid
from sqlalchemy import Column, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from src.orchestra.core.database import Base, TenantModelMixin


class ApprovalRequest(Base, TenantModelMixin):
    """Authoritative Human-in-the-Loop decision gate for consequential actions (ADR-004)."""
    __tablename__ = "approval_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_run_id = Column(String(36), nullable=False, index=True)
    workflow_step_id = Column(String(36), nullable=True)
    action_type = Column(String(100), nullable=False)
    action_payload = Column(JSON, nullable=False)
    payload_hash = Column(String(64), nullable=False, index=True)  # SHA-256 of canonical action_payload
    target_system = Column(String(100), nullable=False)
    risk_level = Column(String(16), default="medium", nullable=False)  # low, medium, high
    status = Column(String(32), default="pending", nullable=False, index=True)
    requested_by_type = Column(String(16), default="agent", nullable=False)  # agent, user
    requested_by_id = Column(String(255), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    decided_by = Column(String(255), nullable=True)
    decision_reason = Column(Text, nullable=True)

    decisions = relationship("ApprovalDecision", back_populates="approval_request", cascade="all, delete-orphan")


class ApprovalDecision(Base):
    """Immutable audit record of human decision on an approval request."""
    __tablename__ = "approval_decisions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    approval_request_id = Column(
        String(36),
        ForeignKey("approval_requests.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    decided_by = Column(String(255), nullable=False)
    decision = Column(String(32), nullable=False)  # approved, rejected, requested_changes
    reason = Column(Text, nullable=True)
    verified_payload_hash = Column(String(64), nullable=False)
    decided_at = Column(DateTime(timezone=True), nullable=False)

    approval_request = relationship("ApprovalRequest", back_populates="decisions")
