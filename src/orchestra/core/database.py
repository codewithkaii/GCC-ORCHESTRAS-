"""SQLAlchemy 2.x database connection, session management, and RLS hooks."""

from datetime import datetime, timezone
from typing import Generator
import uuid

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Text,
    create_engine,
    event,
    text,
)
from sqlalchemy.orm import DeclarativeBase, Session, declared_attr, sessionmaker
from src.orchestra.core.config import get_settings
from src.orchestra.core.context import get_tenant_context
from src.orchestra.core.logging import logger

settings = get_settings()

# Engine configuration with dialect-specific options
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=settings.DATABASE_ECHO,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base declarative model for ORCHESTRA domain models."""
    pass


class TimestampMixin:
    """Standard UTC timestamps mixin."""
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class TenantModelMixin(TimestampMixin):
    """Mandatory tenant-scoped model mixin enforcing organization_id and RLS (ADR-003)."""
    @declared_attr
    def organization_id(cls):
        return Column(
            String(36),
            ForeignKey("organizations.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        )


@event.listens_for(engine, "connect")
def on_engine_connect(dbapi_connection, connection_record):
    """Enable SQLite foreign keys when running SQLite dialect."""
    if settings.DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def set_rls_tenant_session(session: Session, organization_id: str) -> None:
    """Set the PostgreSQL session variable for Row Level Security (RLS)."""
    if "postgresql" in settings.DATABASE_URL:
        # PostgreSQL RLS: SET LOCAL app.current_org_id = :org_id
        session.execute(
            text("SET LOCAL app.current_org_id = :org_id"),
            {"org_id": organization_id},
        )


def get_db() -> Generator[Session, None, None]:
    """FastAPI database session dependency with tenant context isolation."""
    session = SessionLocal()
    tenant_ctx = get_tenant_context()
    try:
        if tenant_ctx and tenant_ctx.organization_id:
            set_rls_tenant_session(session, tenant_ctx.organization_id)
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
