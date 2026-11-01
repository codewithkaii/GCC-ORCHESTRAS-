"""Pydantic schemas for Audit Events."""

from datetime import datetime
from typing import Any, Dict, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

ActorType = Literal["agent", "user", "system"]


class AuditEventDto(BaseModel):
    id: str
    organization_id: Optional[str] = None
    actor_type: ActorType
    actor_id: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    correlation_id: str
    workflow_run_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict, alias="metadata_")
    occurred_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
