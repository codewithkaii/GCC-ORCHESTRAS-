"""Pydantic schemas for Workflows."""

from datetime import datetime
from typing import Any, Dict, Literal, Optional
from pydantic import BaseModel, ConfigDict

WorkflowRunStatus = Literal[
    "running",
    "completed",
    "failed",
    "cancelled",
    "timed_out",
    "awaiting_approval",
]

StepStatus = Literal["pending", "running", "completed", "failed", "skipped"]


class WorkflowStepDto(BaseModel):
    id: str
    organization_id: str
    workflow_run_id: str
    step_key: str
    step_type: str
    status: StepStatus
    input_reference: Optional[Dict[str, Any]] = None
    output_reference: Optional[Dict[str, Any]] = None
    attempt_count: int = 1
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class WorkflowRunDto(BaseModel):
    id: str
    organization_id: str
    workflow_id: str
    workflow_version_id: str
    request_id: Optional[str] = None
    temporal_workflow_id: str
    status: WorkflowRunStatus
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    failure_code: Optional[str] = None
    failure_summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
