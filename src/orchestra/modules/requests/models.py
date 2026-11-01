"""Request database models."""

import uuid
from sqlalchemy import Column, ForeignKey, String, Text
from src.orchestra.core.database import Base, TenantModelMixin


class Request(Base, TenantModelMixin):
    """External or user-submitted operational request initiated into ORCHESTRA."""
    __tablename__ = "requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="SET NULL"), nullable=True, index=True)
    created_by = Column(String(255), nullable=False)
    source = Column(String(32), default="workspace", nullable=False)  # workspace, email, slack, webhook
    input_text = Column(Text, nullable=False)
    status = Column(String(32), default="received", nullable=False, index=True)
    priority = Column(String(32), default="normal", nullable=False)  # critical, high, normal, low
    execution_mode = Column(String(32), default="approval_required", nullable=False)
    idempotency_key = Column(String(128), nullable=True, index=True)
    correlation_id = Column(String(128), nullable=False, index=True)
