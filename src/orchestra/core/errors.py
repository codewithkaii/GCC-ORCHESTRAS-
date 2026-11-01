"""Centralized application domain exceptions and error handling."""

from typing import Any, Dict, Optional
from fastapi import Request
from fastapi.responses import JSONResponse
from src.orchestra.core.context import get_correlation_id
from src.orchestra.core.logging import logger


class OrchestraError(Exception):
    """Base exception for all ORCHESTRA domain errors."""
    code: str = "INTERNAL_ERROR"
    status_code: int = 500

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}


class EntityNotFoundError(OrchestraError):
    """Raised when a requested resource does not exist in the tenant boundary."""
    code = "ENTITY_NOT_FOUND"
    status_code = 404


class TenantAccessViolation(OrchestraError):
    """Raised when cross-tenant data access is detected or tenant context is missing."""
    code = "TENANT_ACCESS_VIOLATION"
    status_code = 403


class AuthenticationError(OrchestraError):
    """Raised when token is missing, invalid, or expired."""
    code = "AUTHENTICATION_FAILED"
    status_code = 401


class AuthorizationError(OrchestraError):
    """Raised when user lacks required permission."""
    code = "PERMISSION_DENIED"
    status_code = 403


class InvalidPayloadHashError(OrchestraError):
    """Raised when canonical SHA-256 action hash does not match approved hash."""
    code = "PAYLOAD_HASH_MISMATCH"
    status_code = 409


class ApprovalStateError(OrchestraError):
    """Raised when an illegal approval state transition is requested."""
    code = "INVALID_APPROVAL_STATE"
    status_code = 400


class ConflictError(OrchestraError):
    """Raised on uniqueness or idempotency conflict."""
    code = "CONFLICT"
    status_code = 409


class ValidationError(OrchestraError):
    """Raised on business logic validation failure."""
    code = "VALIDATION_FAILED"
    status_code = 422


async def orchestra_exception_handler(request: Request, exc: OrchestraError) -> JSONResponse:
    """Format OrchestraError as ApiErrorResponse conforming to ORC-DTS-001."""
    cid = get_correlation_id()
    logger.warning(
        f"Domain error [{exc.code}] on {request.method} {request.url.path}: {exc.message}",
        extra={"error_code": exc.code, "details": exc.details, "correlation_id": cid},
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "correlation_id": cid,
            }
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Format unexpected errors safely without leaking internal stack traces."""
    cid = get_correlation_id()
    logger.exception(
        f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}",
        extra={"correlation_id": cid},
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing the request.",
                "details": {},
                "correlation_id": cid,
            }
        },
    )
