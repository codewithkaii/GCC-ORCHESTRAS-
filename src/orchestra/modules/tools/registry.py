"""Strongly-typed allowlisted tool registry and execution ledger (ORC-DTS-001)."""

from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional
from pydantic import BaseModel, Field
from src.orchestra.core.errors import InvalidPayloadHashError, OrchestraError, ValidationError
from src.orchestra.core.logging import logger
from src.orchestra.modules.approvals.service import compute_canonical_payload_hash


class ToolExecutionRecord(BaseModel):
    """Immutable ledger record of a tool invocation."""
    tool_name: str
    idempotency_key: str
    arguments: Dict[str, Any]
    output: Dict[str, Any]
    duration_ms: float
    status: str  # success, failed, blocked_by_policy
    invoked_at: str
    verified: bool = False


# Tool Input Schemas
class QueryErpInput(BaseModel):
    po_number: str = Field(..., description="Purchase order identifier, e.g. PO-2026-8821")


class QueryCarrierTrackingInput(BaseModel):
    shipment_id: str = Field(..., description="Carrier consignment tracking ID")


class CalculateMitigationInput(BaseModel):
    po_number: str
    delay_days: int
    sla_cutoff_date: str


class ExecuteMitigationActionInput(BaseModel):
    approval_id: str
    action_type: str
    action_payload: Dict[str, Any]
    verified_hash: str


class ToolRegistry:
    """Deterministic, allowlisted tool execution engine."""

    def __init__(self):
        self._tools: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {}
        self._ledger: List[ToolExecutionRecord] = []
        self._register_default_tools()

    def _register_default_tools(self) -> None:
        self._tools["query_erp_purchase_order"] = self._tool_query_erp
        self._tools["query_carrier_tracking"] = self._tool_query_tracking
        self._tools["calculate_mitigation_plan"] = self._tool_calculate_mitigation
        self._tools["execute_mitigation_action"] = self._tool_execute_mitigation

    def _tool_query_erp(self, args: Dict[str, Any]) -> Dict[str, Any]:
        QueryErpInput.model_validate(args)
        po = args["po_number"]
        return {
            "po_number": po,
            "vendor_name": "Rotterdam Marine Spares B.V.",
            "vendor_id": "VEND-NL-042",
            "items": [
                {"part_no": "RMS-9912", "description": "High-Pressure Seal Assemblies", "quantity": 120, "unit_price_eur": 240}
            ],
            "total_value_eur": 28800,
            "payment_terms": "Net 60",
            "required_delivery_date": "2026-11-04",
            "status": "in_transit",
        }

    def _tool_query_tracking(self, args: Dict[str, Any]) -> Dict[str, Any]:
        QueryCarrierTrackingInput.model_validate(args)
        shipment_id = args["shipment_id"]
        return {
            "shipment_id": shipment_id,
            "carrier": "Maersk Line",
            "vessel": "Maersk Mc-Kinney Moller",
            "origin_port": "Port of Rotterdam (Waalhaven)",
            "destination_port": "Jebel Ali Port, UAE",
            "current_status": "Vessel delayed at Waalhaven Terminal due to customs physical inspection backlog",
            "original_eta": "2026-11-04",
            "revised_eta": "2026-11-12",
            "delay_days": 8,
        }

    def _tool_calculate_mitigation(self, args: Dict[str, Any]) -> Dict[str, Any]:
        CalculateMitigationInput.model_validate(args)
        return {
            "po_number": args["po_number"],
            "recommended_strategy": "split_consignment_air_freight",
            "air_freight_quota_pct": 20,
            "air_freight_units": 24,
            "expedited_transit_carrier": "Emirates SkyCargo / KLM",
            "estimated_air_delivery": "2026-11-03",
            "sea_freight_remaining_units": 96,
            "estimated_cost_eur": 3850,
            "sla_breach_avoided": True,
            "confidence_score": 0.942,
            "requires_human_approval": True,
        }

    def _tool_execute_mitigation(self, args: Dict[str, Any]) -> Dict[str, Any]:
        ExecuteMitigationActionInput.model_validate(args)
        approval_id = args["approval_id"]
        payload = args["action_payload"]
        verified_hash = args["verified_hash"]

        # Deterministic Policy Invariant: Hash must match payload
        computed = compute_canonical_payload_hash(payload)
        if computed != verified_hash:
            raise InvalidPayloadHashError(
                f"Tool execution rejected: provided hash '{verified_hash}' does not match computed hash '{computed}'"
            )

        # Consequential execution simulation (writes disabled until stage approval)
        return {
            "execution_id": f"exec_{approval_id[:8]}",
            "status": "executed",
            "action_type": args.get("action_type", "dispatch_air_freight"),
            "target_system": payload.get("target_system", "Freight EDI"),
            "booking_reference": "KLM-CARGO-EXP-981023",
            "executed_at": datetime.now(timezone.utc).isoformat(),
            "verified": True,
        }

    def execute_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        idempotency_key: str,
    ) -> ToolExecutionRecord:
        """Invoke an allowlisted tool with idempotency and audit logging."""
        if tool_name not in self._tools:
            raise ValidationError(f"Tool '{tool_name}' is not in the allowlisted tool registry")

        # Idempotency check: return cached execution if identical key found
        for record in self._ledger:
            if record.idempotency_key == idempotency_key:
                logger.info(f"Returning cached idempotent tool output for {idempotency_key}")
                return record

        start = datetime.now(timezone.utc)
        t_start = datetime.now().timestamp()

        try:
            handler = self._tools[tool_name]
            result = handler(arguments)
            duration_ms = round((datetime.now().timestamp() - t_start) * 1000, 2)
            status = "success"
        except Exception as exc:
            duration_ms = round((datetime.now().timestamp() - t_start) * 1000, 2)
            status = "failed"
            result = {"error": str(exc)}
            logger.error(f"Tool execution {tool_name} failed: {str(exc)}")
            raise

        record = ToolExecutionRecord(
            tool_name=tool_name,
            idempotency_key=idempotency_key,
            arguments=arguments,
            output=result,
            duration_ms=duration_ms,
            status=status,
            invoked_at=start.isoformat(),
            verified=result.get("verified", False),
        )
        self._ledger.append(record)
        return record

    def get_ledger(self) -> List[ToolExecutionRecord]:
        """Retrieve complete immutable tool execution history."""
        return list(self._ledger)


# Global allowlisted registry instance
tool_registry = ToolRegistry()
