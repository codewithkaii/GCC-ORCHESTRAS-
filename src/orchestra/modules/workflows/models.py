"""Workflow execution database models."""

import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from src.orchestra.core.database import Base, TenantModelMixin


class WorkflowRun(Base, TenantModelMixin):
    """Execution instance of a business operation workflow (ADR-002)."""
    __tablename__ = "workflow_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String(100), nullable=False)
    workflow_version_id = Column(String(32), default="v1.0", nullable=False)
    request_id = Column(String(36), ForeignKey("requests.id", ondelete="SET NULL"), nullable=True, index=True)
    temporal_workflow_id = Column(String(255), unique=True, nullable=False, index=True)
    status = Column(String(32), default="running", nullable=False, index=True)  # running, completed, failed, cancelled, timed_out, awaiting_approval
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    failure_code = Column(String(64), nullable=True)
    failure_summary = Column(Text, nullable=True)

    steps = relationship("WorkflowStep", back_populates="workflow_run", cascade="all, delete-orphan")


class WorkflowStep(Base, TenantModelMixin):
    """Individual activity or step inside a workflow run."""
    __tablename__ = "workflow_steps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_run_id = Column(String(36), ForeignKey("workflow_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    step_key = Column(String(100), nullable=False)
    step_type = Column(String(64), nullable=False)  # plan, investigation, policy_check, approval_gate, action, verifier
    status = Column(String(32), default="pending", nullable=False)  # pending, running, completed, failed, skipped
    input_reference = Column(JSON, nullable=True)
    output_reference = Column(JSON, nullable=True)
    attempt_count = Column(Integer, default=1, nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)

    workflow_run = relationship("WorkflowRun", back_populates="steps")
