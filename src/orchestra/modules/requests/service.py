"""Service layer for Operational Requests."""

from typing import List, Optional
from sqlalchemy.orm import Session
from src.orchestra.core.context import get_correlation_id
from src.orchestra.core.errors import EntityNotFoundError, TenantAccessViolation
from src.orchestra.modules.audit.models import AuditEvent
from src.orchestra.modules.requests.models import Request
from src.orchestra.modules.requests.schemas import CreateRequestInput


class RequestService:
    def __init__(self, db: Session):
        self.db = db

    def create_request(
        self,
        organization_id: str,
        user_id: str,
        input_data: CreateRequestInput,
    ) -> Request:
        cid = get_correlation_id()

        # Idempotency check if key provided
        if input_data.idempotency_key:
            existing = self.db.query(Request).filter(
                Request.organization_id == organization_id,
                Request.idempotency_key == input_data.idempotency_key,
            ).first()
            if existing:
                return existing

        req = Request(
            organization_id=organization_id,
            workspace_id=input_data.workspace_id,
            created_by=user_id,
            source=input_data.source,
            input_text=input_data.input_text,
            status="received",
            priority=input_data.priority,
            execution_mode=input_data.execution_mode,
            idempotency_key=input_data.idempotency_key,
            correlation_id=cid,
        )
        self.db.add(req)
        self.db.flush()

        # Log immutable audit event
        audit = AuditEvent(
            organization_id=organization_id,
            actor_type="user",
            actor_id=user_id,
            action="request.created",
            resource_type="request",
            resource_id=req.id,
            correlation_id=cid,
            metadata_={"priority": input_data.priority, "source": input_data.source},
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(req)
        return req

    def get_request(self, request_id: str, organization_id: str) -> Request:
        req = self.db.query(Request).filter(
            Request.id == request_id,
        ).first()
        if not req:
            raise EntityNotFoundError(f"Request '{request_id}' not found")
        if req.organization_id != organization_id:
            raise TenantAccessViolation("Access to cross-tenant request is forbidden")
        return req

    def list_requests(self, organization_id: str, limit: int = 50) -> List[Request]:
        return self.db.query(Request).filter(
            Request.organization_id == organization_id,
        ).order_by(Request.created_at.desc()).limit(limit).all()
