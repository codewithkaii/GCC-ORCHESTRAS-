"""Pydantic schemas for Approvals lifecycle."""

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

ApprovalStatus = Literal[
    "pending",
    "approved",
    "rejected",
    "expired",
    "invalidated",
    "cancelled",
    "executing",
    "executed",
    "execution_failed",
]

RiskLevel = Literal["low", "medium", "high"]


class CreateApprovalInput(BaseModel):
    workflow_run_id: str
    workflow_step_id: Optional[str] = None
    action_type: str
    action_payload: Dict[str, Any]
    target_system: str
    risk_level: RiskLevel = "medium"
    requested_by_type: Literal["agent", "user"] = "agent"
    requested_by_id: Optional[str] = None
    expires_in_hours: int = 72


class ApproveActionInput(BaseModel):
    reason: Optional[str] = None


class RejectActionInput(BaseModel):
    reason: str = Field(..., min_length=3)


class RequestChangesActionInput(BaseModel):
    reason: str = Field(..., min_length=3)


class ApprovalRequestDto(BaseModel):
    id: str
    organization_id: str
    workflow_run_id: str
    workflow_step_id: Optional[str] = None
    action_type: str
    action_payload: Dict[str, Any]
    payload_hash: str
    target_system: str
    risk_level: RiskLevel
    status: ApprovalStatus
    requested_by_type: Literal["agent", "user"]
    requested_by_id: Optional[str] = None
    expires_at: datetime
    decided_at: Optional[datetime] = None
    evidence_references: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
