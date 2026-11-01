"""Append-only audit event ledger database model."""

from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, JSON, String, Text
from src.orchestra.core.database import Base


class AuditEvent(Base):
    """Immutable, append-only operational audit log record."""
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), nullable=True, index=True)
    actor_type = Column(String(32), nullable=False)  # agent, user, system
    actor_id = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False, index=True)
    resource_id = Column(String(255), nullable=True, index=True)
    correlation_id = Column(String(128), nullable=False, index=True)
    workflow_run_id = Column(String(36), nullable=True, index=True)
    metadata_ = Column("metadata", JSON, default=dict, nullable=False)
    occurred_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
