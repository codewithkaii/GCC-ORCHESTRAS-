"""Unit tests for Supplier Investigation Temporal workflow scaffolding."""

import pytest
from src.orchestra.infrastructure.temporal.workflows.supplier_investigation import (
    SupplierInvestigationWorkflow,
    WorkflowState,
)


def test_supplier_investigation_end_to_end_flow():
    workflow = SupplierInvestigationWorkflow("wf_rotterdam_01", "org_gcc_logistics")
    assert workflow.state == WorkflowState.INITIALIZED

    # Step 1: Investigation
    inquiry = {
        "supplier_id": "SUP-NL-042",
        "supplier_name": "Rotterdam Marine Spares B.V.",
        "po_number": "PO-2026-8821",
    }
    results = workflow.execute_investigation_step(inquiry)
    assert workflow.state == WorkflowState.INVESTIGATING
    assert results["delay_days"] == 8
    assert results["sla_breach_risk"] == "High"

    # Step 2: Formulate proposed action requiring approval
    proposed_payload = {
        "action": "split_consignment_air_freight",
        "carrier": "KLM Cargo",
        "consignment_ratio": 0.20,
        "cost_eur": 3850,
        "po": "PO-2026-8821",
        "target_system": "SAP S/4HANA",
    }
    payload_hash = workflow.propose_consequential_action("air_freight_dispatch", proposed_payload)
    assert workflow.state == WorkflowState.AWAITING_APPROVAL
    assert workflow.canonical_payload_hash == payload_hash

    # Step 3: Human Approval Signal received
    success = workflow.signal_approval("approved", "SLA breach approved by Ops Lead", payload_hash)
    assert success is True
    assert workflow.state == WorkflowState.APPROVED

    # Step 4: Execution & Verification
    summary = workflow.execute_and_verify()
    assert workflow.state == WorkflowState.COMPLETED
    assert summary["status"] == "completed"
    assert summary["mitigation_executed"] is True
    assert len(workflow.events) >= 6


def test_workflow_tamper_detection_halts_execution():
    workflow = SupplierInvestigationWorkflow("wf_rotterdam_tamper", "org_gcc_logistics")
    workflow.execute_investigation_step({"po_number": "PO-9999"})
    workflow.propose_consequential_action("dispatch", {"amount": 500})

    # Signal with forged / mismatched payload hash
    forged_hash = "0000000000000000000000000000000000000000000000000000000000000000"
    success = workflow.signal_approval("approved", "Approved", forged_hash)
    assert success is False
    assert workflow.state == WorkflowState.FAILED

    # Invariant: Cannot execute failed workflow
    with pytest.raises(ValueError, match="prior approved decision"):
        workflow.execute_and_verify()
