"""Structured JSON logging with correlation ID propagation."""

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Dict
from src.orchestra.core.context import get_correlation_id, get_request_id, get_tenant_context


class JsonFormatter(logging.Formatter):
    """Formats log records as structured JSON."""

    def format(self, record: logging.LogRecord) -> str:
        tenant_ctx = get_tenant_context()
        log_payload: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "correlation_id": get_correlation_id(),
            "request_id": get_request_id(),
        }

        if tenant_ctx:
            log_payload["organization_id"] = tenant_ctx.organization_id
            log_payload["user_id"] = tenant_ctx.user_id

        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)

        # Include custom extra fields if present
        extra_keys = set(record.__dict__.keys()) - {
            "args", "asctime", "created", "exc_info", "exc_text", "filename",
            "funcName", "id", "levelname", "levelno", "lineno", "module",
            "msecs", "message", "msg", "name", "pathname", "process",
            "processName", "relativeCreated", "stack_info", "thread", "threadName"
        }
        for k in extra_keys:
            log_payload[k] = getattr(record, k)

        return json.dumps(log_payload)


def setup_logging(level: str = "INFO", json_logs: bool = True) -> logging.Logger:
    """Configure root and orchestra loggers."""
    root_logger = logging.getLogger("orchestra")
    root_logger.setLevel(level.upper())
    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    if json_logs:
        handler.setFormatter(JsonFormatter())
    else:
        handler.setFormatter(
            logging.Formatter("[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s")
        )

    root_logger.addHandler(handler)
    root_logger.propagate = False
    return root_logger


logger = logging.getLogger("orchestra")
