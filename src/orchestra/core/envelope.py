"""API Response envelope matching TypeScript ApiResponse<T> contract."""

from datetime import datetime, timezone
from typing import Any, Dict, Generic, TypeVar
from pydantic import BaseModel
from src.orchestra.core.context import get_correlation_id, get_request_id

T = TypeVar("T")


class ApiMeta(BaseModel):
    request_id: str
    correlation_id: str
    timestamp: str


class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: ApiMeta


def wrap_response(data: Any) -> Dict[str, Any]:
    """Wraps data into the standard API envelope with correlation metadata."""
    return {
        "data": data,
        "meta": {
            "request_id": get_request_id(),
            "correlation_id": get_correlation_id(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    }
