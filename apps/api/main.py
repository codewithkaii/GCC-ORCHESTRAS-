"""FastAPI Application Entry Point for ORCHESTRA (apps/api/main.py)."""

import time
from typing import Any, Dict
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from src.orchestra.core.config import get_settings
from src.orchestra.core.context import set_correlation_id, set_request_id
from src.orchestra.core.database import SessionLocal, engine
from src.orchestra.core.errors import (
    OrchestraError,
    orchestra_exception_handler,
    unhandled_exception_handler,
)
from src.orchestra.core.logging import logger, setup_logging
from src.orchestra.modules.approvals.router import router as approvals_router
from src.orchestra.modules.identity.router import router as identity_router
from src.orchestra.modules.organizations.router import router as organizations_router
from src.orchestra.modules.requests.router import router as requests_router
from src.orchestra.modules.workflows.router import router as workflows_router

settings = get_settings()
setup_logging(level=settings.LOG_LEVEL, json_logs=settings.JSON_LOGS)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Autonomous AI operations platform for enterprise workflow coordination, record investigation, proactive resolution, and approval management.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json",
)

# ---------------------------------------------------------------------------
# Middleware: CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Middleware: Correlation ID and Request Timing
# ---------------------------------------------------------------------------
@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next) -> Response:
    start_time = time.time()
    cid = request.headers.get("X-Correlation-ID")
    rid = request.headers.get("X-Request-ID")
    cid = set_correlation_id(cid)
    rid = set_request_id(rid)

    response: Response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)

    response.headers["X-Correlation-ID"] = cid
    response.headers["X-Request-ID"] = rid
    response.headers["X-Response-Time-Ms"] = str(duration_ms)

    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": duration_ms,
            "correlation_id": cid,
        },
    )
    return response


# ---------------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------------
app.add_exception_handler(OrchestraError, orchestra_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


# ---------------------------------------------------------------------------
# Health and Readiness Endpoints
# ---------------------------------------------------------------------------
@app.get("/health", tags=["System"])
def health_check() -> Dict[str, Any]:
    """Basic liveness probe."""
    return {
        "status": "healthy",
        "service": "orchestra-api",
        "environment": settings.ENVIRONMENT,
        "timestamp": time.time(),
    }


@app.get("/ready", tags=["System"])
def readiness_check() -> Dict[str, Any]:
    """Readiness probe checking database connectivity."""
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            db_ok = True
    except Exception as exc:
        logger.error(f"Database readiness check failed: {str(exc)}")
        return {
            "status": "unready",
            "database": "disconnected",
            "error": str(exc),
        }

    return {
        "status": "ready",
        "database": "connected",
        "environment": settings.ENVIRONMENT,
    }


# ---------------------------------------------------------------------------
# Mount Modular Domain Routers under /api/v1
# ---------------------------------------------------------------------------
app.include_router(organizations_router, prefix=settings.API_V1_PREFIX)
app.include_router(identity_router, prefix=settings.API_V1_PREFIX)
app.include_router(requests_router, prefix=settings.API_V1_PREFIX)
app.include_router(approvals_router, prefix=settings.API_V1_PREFIX)
app.include_router(workflows_router, prefix=settings.API_V1_PREFIX)
