"""Request context and Tenant Context interfaces using contextvars."""

from contextvars import ContextVar
from dataclasses import dataclass, field
from typing import List, Optional
import uuid

_correlation_id_ctx: ContextVar[str] = ContextVar("correlation_id", default="")
_request_id_ctx: ContextVar[str] = ContextVar("request_id", default="")


@dataclass(frozen=True)
class TenantContext:
    """Immutable context representing the authenticated tenant and actor."""
    organization_id: str
    user_id: str
    roles: List[str] = field(default_factory=list)
    permissions: List[str] = field(default_factory=list)
    workspace_id: Optional[str] = None
    is_system_admin: bool = False

    def has_permission(self, permission: str) -> bool:
        """Check if tenant context holds a specific permission."""
        if self.is_system_admin:
            return True
        return permission in self.permissions or "*" in self.permissions


_tenant_context_ctx: ContextVar[Optional[TenantContext]] = ContextVar("tenant_context", default=None)


def set_correlation_id(correlation_id: Optional[str] = None) -> str:
    """Set or generate correlation ID in request context."""
    cid = correlation_id or f"corr_{uuid.uuid4().hex[:12]}"
    _correlation_id_ctx.set(cid)
    return cid


def get_correlation_id() -> str:
    """Get correlation ID for current execution context."""
    cid = _correlation_id_ctx.get()
    if not cid:
        cid = f"corr_{uuid.uuid4().hex[:12]}"
        _correlation_id_ctx.set(cid)
    return cid


def set_request_id(request_id: Optional[str] = None) -> str:
    """Set or generate request ID."""
    rid = request_id or f"req_{uuid.uuid4().hex[:12]}"
    _request_id_ctx.set(rid)
    return rid


def get_request_id() -> str:
    """Get request ID."""
    return _request_id_ctx.get() or "req_system"


def set_tenant_context(context: Optional[TenantContext]) -> None:
    """Set tenant context for current request."""
    _tenant_context_ctx.set(context)


def get_tenant_context() -> Optional[TenantContext]:
    """Retrieve tenant context for current execution."""
    return _tenant_context_ctx.get()


def require_tenant_context() -> TenantContext:
    """Retrieve tenant context or raise TenantAccessViolation."""
    ctx = _tenant_context_ctx.get()
    if ctx is None or not ctx.organization_id:
        from src.orchestra.core.errors import TenantAccessViolation
        raise TenantAccessViolation("Operation requires authenticated tenant context")
    return ctx
