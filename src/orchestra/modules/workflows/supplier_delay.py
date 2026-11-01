"""End-to-End Rotterdam Supplier Delay Resolution Orchestrator (Stage 3)."""

from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from src.orchestra.core.context import get_correlation_id
from src.orchestra.core.errors import ApprovalStateError, EntityNotFoundError, InvalidPayloadHashError
from src.orchestra.core.logging import logger
from src.orchestra.modules.approvals.models import ApprovalRequest
from src.orchestra.modules.approvals.schemas import CreateApprovalInput
from src.orchestra.modules.approvals.service import ApprovalService, compute_canonical_payload_hash
from src.orchestra.modules.audit.models import AuditEvent
from src.orchestra.modules.requests.models import Request
from src.orchestra.modules.tools.registry import tool_registry
from src.orchestra.modules.workflows.models import WorkflowRun, WorkflowStep


class SupplierDelayOrchestrator:
    """Orchestrates the 7-step Rotterdam Supplier Delay Resolution vertical slice."""

    def __init__(self, db: Session, organization_id: str, actor_id: str):
        self.db = db
        self.organization_id = organization_id
        self.actor_id = actor_id
        self.cid = get_correlation_id()

    def run_investigation(self, request_id: str, po_number: str = "PO-2026-8821") -> Dict[str, Any]:
        """Steps 1-4: Query ERP, query tracking, calculate mitigation, and stage approval."""
        req = self.db.query(Request).filter(
            Request.id == request_id,
            Request.organization_id == self.organization_id,
        ).first()
        if not req:
            raise EntityNotFoundError(f"Request '{request_id}' not found")

        # Create or retrieve WorkflowRun record
        wf_run = WorkflowRun(
            organization_id=self.organization_id,
            workflow_id="wf_supplier_delay_resolution",
            workflow_version_id="v1.0",
            request_id=req.id,
            temporal_workflow_id=f"wf_delay_{req.id[:8]}",
            status="running",
            started_at=datetime.now(timezone.utc),
        )
        self.db.add(wf_run)
        self.db.flush()

        # Step 2: Query ERP
        erp_record = tool_registry.execute_tool(
            "query_erp_purchase_order",
            {"po_number": po_number},
            idempotency_key=f"idemp_erp_{req.id[:8]}",
        )
        s1 = WorkflowStep(
            organization_id=self.organization_id,
            workflow_run_id=wf_run.id,
            step_key="query_erp_records",
            step_type="investigation",
            status="completed",
            output_reference=erp_record.output,
            started_at=datetime.now(timezone.utc),
            finished_at=datetime.now(timezone.utc),
        )
        self.db.add(s1)

        # Step 3: Query Carrier Tracking
        tracking_record = tool_registry.execute_tool(
            "query_carrier_tracking",
            {"shipment_id": "MSKU-ROT-9921"},
            idempotency_key=f"idemp_track_{req.id[:8]}",
        )
        s2 = WorkflowStep(
            organization_id=self.organization_id,
            workflow_run_id=wf_run.id,
            step_key="query_carrier_tracking",
            step_type="investigation",
            status="completed",
            output_reference=tracking_record.output,
            started_at=datetime.now(timezone.utc),
            finished_at=datetime.now(timezone.utc),
        )
        self.db.add(s2)

        # Step 4: Calculate Mitigation Plan
        mitigation_record = tool_registry.execute_tool(
            "calculate_mitigation_plan",
            {
                "po_number": po_number,
                "delay_days": tracking_record.output.get("delay_days", 8),
                "sla_cutoff_date": "2026-11-04",
            },
            idempotency_key=f"idemp_plan_{req.id[:8]}",
        )
        s3 = WorkflowStep(
            organization_id=self.organization_id,
            workflow_run_id=wf_run.id,
            step_key="formulate_mitigation",
            step_type="plan",
            status="completed",
            output_reference=mitigation_record.output,
            started_at=datetime.now(timezone.utc),
            finished_at=datetime.now(timezone.utc),
        )
        self.db.add(s3)

        # Step 5: Prepare Human Approval Request (Safety Invariant ADR-004)
        proposed_action_payload = {
            "action": "split_consignment_air_freight",
            "purchase_order": po_number,
            "carrier": "Emirates SkyCargo / KLM",
            "air_freight_units": 24,
            "quota_percentage": 20,
            "cost_eur": 3850,
            "target_system": "Freight EDI & SAP S/4HANA",
        }
        approval_service = ApprovalService(self.db)
        approval_input = CreateApprovalInput(
            workflow_run_id=wf_run.id,
            workflow_step_id=s3.id,
            action_type="dispatch_air_freight",
            action_payload=proposed_action_payload,
            target_system="Logistics EDI",
            risk_level="high",
            expires_in_hours=48,
        )
        approval_req = approval_service.create_approval_request(
            organization_id=self.organization_id,
            input_data=approval_input,
        )

        wf_run.status = "awaiting_approval"
        req.status = "awaiting_approval"

        # Audit Event
        self.db.add(
            AuditEvent(
                organization_id=self.organization_id,
                actor_type="agent",
                actor_id="agent_operations_coordinator",
                action="workflow.approval_requested",
                resource_type="approval_request",
                resource_id=approval_req.id,
                correlation_id=self.cid,
                workflow_run_id=wf_run.id,
                metadata_={
                    "payload_hash": approval_req.payload_hash,
                    "po_number": po_number,
                    "confidence_score": mitigation_record.output.get("confidence_score"),
                },
            )
        )
        self.db.commit()

        return {
            "workflow_run_id": wf_run.id,
            "request_id": req.id,
            "status": "awaiting_approval",
            "investigation": {
                "erp": erp_record.output,
                "tracking": tracking_record.output,
                "mitigation": mitigation_record.output,
            },
            "approval_request_id": approval_req.id,
            "canonical_payload_hash": approval_req.payload_hash,
            "requires_human_approval": True,
        }

    def execute_approved_resolution(self, approval_id: str) -> Dict[str, Any]:
        """Steps 6-7: Re-verify approval hash and execute mitigation."""
        approval_service = ApprovalService(self.db)
        approval = approval_service.get_approval(approval_id, self.organization_id)

        if approval.status != "approved":
            raise ApprovalStateError(
                f"Cannot execute resolution: approval is in '{approval.status}' state (must be 'approved')"
            )

        # Invariant check: re-verify payload hash at execution time
        current_hash = compute_canonical_payload_hash(approval.action_payload)
        if current_hash != approval.payload_hash:
            approval.status = "invalidated"
            self.db.commit()
            raise InvalidPayloadHashError("Execution halted: payload hash mismatch")

        # Execute through allowlisted tool
        exec_record = tool_registry.execute_tool(
            "execute_mitigation_action",
            {
                "approval_id": approval.id,
                "action_type": approval.action_type,
                "action_payload": approval.action_payload,
                "verified_hash": approval.payload_hash,
            },
            idempotency_key=f"idemp_exec_{approval.id[:8]}",
        )

        approval.status = "executed"

        # Update Workflow Run
        wf_run = self.db.query(WorkflowRun).filter(WorkflowRun.id == approval.workflow_run_id).first()
        if wf_run:
            wf_run.status = "completed"
            wf_run.finished_at = datetime.now(timezone.utc)

        # Update Request
        if wf_run and wf_run.request_id:
            req = self.db.query(Request).filter(Request.id == wf_run.request_id).first()
            if req:
                req.status = "completed"

        # Audit Event
        self.db.add(
            AuditEvent(
                organization_id=self.organization_id,
                actor_type="agent",
                actor_id=self.actor_id,
                action="workflow.mitigation_executed",
                resource_type="approval_request",
                resource_id=approval.id,
                correlation_id=self.cid,
                workflow_run_id=approval.workflow_run_id,
                metadata_={
                    "booking_reference": exec_record.output.get("booking_reference"),
                    "verified": True,
                },
            )
        )
        self.db.commit()

        return {
            "status": "completed",
            "approval_id": approval.id,
            "execution": exec_record.output,
            "completion_report": {
                "po_number": approval.action_payload.get("purchase_order"),
                "mitigation_action": "Air freight split quota dispatched",
                "booking_reference": exec_record.output.get("booking_reference"),
                "sla_safeguarded": True,
                "verified_at": datetime.now(timezone.utc).isoformat(),
            },
        }
