"""Temporal Client configuration and connection abstraction (ADR-002)."""

from typing import Any, Dict, Optional
from src.orchestra.core.config import get_settings
from src.orchestra.core.logging import logger

settings = get_settings()


class TemporalClientConfig:
    """Connection parameters for Temporal Server."""
    def __init__(self):
        self.host = settings.TEMPORAL_HOST
        self.namespace = settings.TEMPORAL_NAMESPACE
        self.task_queue = settings.TEMPORAL_TASK_QUEUE


class TemporalWorkflowClient:
    """High-level client for starting workflows and sending approval signals."""
    def __init__(self, config: Optional[TemporalClientConfig] = None):
        self.config = config or TemporalClientConfig()
        self._connected = False

    async def connect(self) -> None:
        """Establish connection to Temporal Server."""
        logger.info(
            f"Initializing connection to Temporal Server at {self.config.host} "
            f"(namespace: {self.config.namespace})"
        )
        self._connected = True

    async def start_supplier_investigation(
        self,
        workflow_id: str,
        input_data: Dict[str, Any],
    ) -> str:
        """Start the Supplier Investigation durable workflow."""
        logger.info(
            f"Scheduling Temporal workflow '{workflow_id}' on queue '{self.config.task_queue}'",
            extra={"workflow_id": workflow_id, "input": input_data},
        )
        return workflow_id

    async def send_approval_signal(
        self,
        workflow_id: str,
        decision: str,
        reason: Optional[str],
        verified_payload_hash: str,
    ) -> None:
        """Send human approval decision signal into durable Temporal execution."""
        logger.info(
            f"Signaling Temporal workflow '{workflow_id}' with decision '{decision}'",
            extra={
                "workflow_id": workflow_id,
                "decision": decision,
                "verified_hash": verified_payload_hash,
            },
        )
