"""Pydantic schemas for Request lifecycle."""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

RequestStatus = Literal[
    "received",
    "classifying",
    "awaiting_information",
    "planning",
    "ready",
    "running",
    "awaiting_approval",
    "verifying",
    "escalated",
    "completed",
    "failed",
    "cancelled",
]

PriorityLevel = Literal["critical", "high", "normal", "low"]
ExecutionMode = Literal["automatic", "approval_required", "dry_run"]
SourceType = Literal["workspace", "email", "slack", "webhook"]


class CreateRequestInput(BaseModel):
    input_text: str = Field(..., min_length=5)
    source: SourceType = "workspace"
    priority: PriorityLevel = "normal"
    execution_mode: ExecutionMode = "approval_required"
    workspace_id: Optional[str] = None
    idempotency_key: Optional[str] = None


class RequestDto(BaseModel):
    id: str
    organization_id: str
    workspace_id: Optional[str] = None
    created_by: str
    source: str
    input_text: str
    status: RequestStatus
    priority: str
    correlation_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
