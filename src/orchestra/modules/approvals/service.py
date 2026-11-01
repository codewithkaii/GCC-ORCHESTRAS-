"""Deterministic Approval State Machine and Canonical Payload Hashing (ADR-004)."""

import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from src.orchestra.core.errors import (
    ApprovalStateError,
    EntityNotFoundError,
    InvalidPayloadHashError,
    TenantAccessViolation,
)
from src.orchestra.modules.approvals.models import ApprovalDecision, ApprovalRequest
from src.orchestra.modules.approvals.schemas import CreateApprovalInput


def compute_canonical_payload_hash(payload: Dict[str, Any]) -> str:
    """Produce deterministic SHA-256 hash of canonical action payload.

    In accordance with ADR-004, keys are sorted alphabetically and whitespace
    is removed prior to hashing to guarantee determinism across runtimes.
    """
    canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()


class ApprovalService:
    def __init__(self, db: Session):
        self.db = db

    def create_approval_request(
        self,
        organization_id: str,
        input_data: CreateApprovalInput,
    ) -> ApprovalRequest:
        """Create a pending approval request with canonical payload hash."""
        now = datetime.now(timezone.utc)
        payload_hash = compute_canonical_payload_hash(input_data.action_payload)
        expires_at = now + timedelta(hours=input_data.expires_in_hours)

        approval = ApprovalRequest(
            organization_id=organization_id,
            workflow_run_id=input_data.workflow_run_id,
            workflow_step_id=input_data.workflow_step_id,
            action_type=input_data.action_type,
            action_payload=input_data.action_payload,
            payload_hash=payload_hash,
            target_system=input_data.target_system,
            risk_level=input_data.risk_level,
            status="pending",
            requested_by_type=input_data.requested_by_type,
            requested_by_id=input_data.requested_by_id,
            expires_at=expires_at,
        )
        self.db.add(approval)
        self.db.commit()
        self.db.refresh(approval)
        return approval

    def get_approval(self, approval_id: str, organization_id: str) -> ApprovalRequest:
        """Retrieve approval request enforcing tenant boundary."""
        approval = self.db.query(ApprovalRequest).filter(
            ApprovalRequest.id == approval_id,
        ).first()
        if not approval:
            raise EntityNotFoundError(f"Approval request '{approval_id}' not found")
        if approval.organization_id != organization_id:
            raise TenantAccessViolation("Access to cross-tenant approval request is forbidden")
        return approval

    def approve(
        self,
        approval_id: str,
        organization_id: str,
        actor_id: str,
        reason: Optional[str] = None,
    ) -> ApprovalRequest:
        """Record human approval with state invariant validation."""
        approval = self.get_approval(approval_id, organization_id)
        now = datetime.now(timezone.utc)

        # Invariant 1: Terminal or non-pending states cannot be approved
        if approval.status != "pending":
            raise ApprovalStateError(f"Cannot approve request in '{approval.status}' state")

        # Invariant 2: Expired approvals cannot be approved
        if approval.expires_at.replace(tzinfo=timezone.utc) < now:
            approval.status = "expired"
            self.db.commit()
            raise ApprovalStateError("Approval request has expired and cannot be approved")

        # Invariant 3: Verify payload integrity against stored hash
        current_hash = compute_canonical_payload_hash(approval.action_payload)
        if current_hash != approval.payload_hash:
            approval.status = "invalidated"
            self.db.commit()
            raise InvalidPayloadHashError("Action payload has been altered since request creation")

        approval.status = "approved"
        approval.decided_at = now
        approval.decided_by = actor_id
        approval.decision_reason = reason

        decision = ApprovalDecision(
            approval_request_id=approval.id,
            decided_by=actor_id,
            decision="approved",
            reason=reason,
            verified_payload_hash=approval.payload_hash,
            decided_at=now,
        )
        self.db.add(decision)
        self.db.commit()
        self.db.refresh(approval)
        return approval

    def reject(
        self,
        approval_id: str,
        organization_id: str,
        actor_id: str,
        reason: str,
    ) -> ApprovalRequest:
        """Record human rejection with state invariant validation."""
        approval = self.get_approval(approval_id, organization_id)
        now = datetime.now(timezone.utc)

        if approval.status != "pending":
            raise ApprovalStateError(f"Cannot reject request in '{approval.status}' state")

        approval.status = "rejected"
        approval.decided_at = now
        approval.decided_by = actor_id
        approval.decision_reason = reason

        decision = ApprovalDecision(
            approval_request_id=approval.id,
            decided_by=actor_id,
            decision="rejected",
            reason=reason,
            verified_payload_hash=approval.payload_hash,
            decided_at=now,
        )
        self.db.add(decision)
        self.db.commit()
        self.db.refresh(approval)
        return approval

    def request_changes(
        self,
        approval_id: str,
        organization_id: str,
        actor_id: str,
        reason: str,
    ) -> ApprovalRequest:
        """Request modifications from agent proposer."""
        approval = self.get_approval(approval_id, organization_id)
        now = datetime.now(timezone.utc)

        if approval.status != "pending":
            raise ApprovalStateError(f"Cannot request changes in '{approval.status}' state")

        approval.status = "rejected"  # Returns to agent with revision requirements
        approval.decided_at = now
        approval.decided_by = actor_id
        approval.decision_reason = f"Changes requested: {reason}"

        decision = ApprovalDecision(
            approval_request_id=approval.id,
            decided_by=actor_id,
            decision="requested_changes",
            reason=reason,
            verified_payload_hash=approval.payload_hash,
            decided_at=now,
        )
        self.db.add(decision)
        self.db.commit()
        self.db.refresh(approval)
        return approval

    def verify_and_lock_for_execution(
        self,
        approval_id: str,
        organization_id: str,
        execution_payload: Dict[str, Any],
    ) -> ApprovalRequest:
        """Verify that an approved action payload exactly matches what was human-approved."""
        approval = self.get_approval(approval_id, organization_id)
        if approval.status != "approved":
            raise ApprovalStateError(
                f"Action execution forbidden: request is in '{approval.status}' state (must be 'approved')"
            )

        calculated_hash = compute_canonical_payload_hash(execution_payload)
        if calculated_hash != approval.payload_hash:
            approval.status = "invalidated"
            self.db.commit()
            raise InvalidPayloadHashError(
                f"Security violation: Executing payload hash '{calculated_hash}' "
                f"does not match approved hash '{approval.payload_hash}'"
            )

        approval.status = "executing"
        self.db.commit()
        self.db.refresh(approval)
        return approval
