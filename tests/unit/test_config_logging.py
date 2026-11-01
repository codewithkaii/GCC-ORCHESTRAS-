"""Unit tests for configuration, context, and structured logging."""

import json
import logging
from io import StringIO
from src.orchestra.core.config import get_settings
from src.orchestra.core.context import (
    TenantContext,
    get_correlation_id,
    get_request_id,
    get_tenant_context,
    set_correlation_id,
    set_request_id,
    set_tenant_context,
)
from src.orchestra.core.logging import JsonFormatter


def test_settings_initialization():
    settings = get_settings()
    assert settings.PROJECT_NAME.startswith("ORCHESTRA")
    assert settings.API_V1_PREFIX == "/api/v1"
    assert settings.DATABASE_URL is not None


def test_context_vars():
    cid = set_correlation_id("test-corr-123")
    assert get_correlation_id() == "test-corr-123"

    rid = set_request_id("test-req-456")
    assert get_request_id() == "test-req-456"

    ctx = TenantContext(
        organization_id="org_test_1",
        user_id="usr_test_1",
        roles=["operator"],
        permissions=["requests.create", "requests.read"],
    )
    set_tenant_context(ctx)

    current_ctx = get_tenant_context()
    assert current_ctx is not None
    assert current_ctx.organization_id == "org_test_1"
    assert current_ctx.has_permission("requests.create") is True
    assert current_ctx.has_permission("approvals.decide") is False


def test_structured_json_logging():
    set_correlation_id("corr-json-test")
    set_request_id("req-json-test")
    set_tenant_context(TenantContext(organization_id="org-json", user_id="usr-json"))

    formatter = JsonFormatter()
    record = logging.LogRecord(
        name="orchestra.test",
        level=logging.INFO,
        pathname="test.py",
        lineno=10,
        msg="Structured test log message",
        args=(),
        exc_info=None,
    )
    output = formatter.format(record)
    parsed = json.loads(output)

    assert parsed["level"] == "INFO"
    assert parsed["message"] == "Structured test log message"
    assert parsed["correlation_id"] == "corr-json-test"
    assert parsed["organization_id"] == "org-json"
    assert parsed["user_id"] == "usr-json"
