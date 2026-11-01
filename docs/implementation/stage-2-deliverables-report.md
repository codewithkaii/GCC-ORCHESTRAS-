# ORCHESTRA — Stage 2 Engineering Deliverables & Verification Report

**Document ID:** ORC-REP-002  
**Date:** 1 November 2026  
**Status:** Complete & Verified  
**Author:** Lead Principal Software Architect & Engineering Coordinator  

---

## 1. Repository Verification Report

1. **Frontend Repository Audit:** The existing React 19 + TypeScript + Vite + Tailwind CSS v4 frontend codebase was verified. The application renders 11 modular operational views with zero external database connections (client-authoritative mock state in `AppContext.tsx`).
2. **Contract Consistency (`src/types/api.ts` vs ORC-DTS-001):**
   - Verified generic API envelopes `ApiResponse<T>` and `ApiErrorResponse`.
   - Identified and resolved gap: `WorkspaceDto` and `CreateWorkspaceInput` were missing from `src/types/api.ts` despite being referenced in `RequestDto` and `TaskDto`. Added to frozen contract.
   - Verified approval schemas: `ApprovalRequestDto`, `ApproveActionInput`, `RejectActionInput`, `RequestChangesActionInput`.
3. **Environment & Dependencies:**
   - Linux container running Node.js 22 & Python 3.10.12.
   - Installed backend dependencies: `fastapi (0.162.0)`, `uvicorn (0.54.0)`, `sqlalchemy (2.0.55)`, `alembic (1.20.1)`, `pydantic (2.14.2)`, `pytest (9.2.0)`, `httpx (0.28.1)`, `asyncpg (0.32.0)`, `psycopg (3.3.6)`.

---

## 2. Backend Project Structure

Implements ADR-001 (Modular Monolith) and ORC-OWN-001 (Module Ownership Matrix):

```
apps/
└── api/
    └── main.py                     # FastAPI entry point, CORS, correlation middleware, /health, /ready

src/orchestra/
├── core/
│   ├── config.py                   # Pydantic Settings and environment validation
│   ├── context.py                  # Contextvars for correlation_id, request_id, TenantContext
│   ├── database.py                 # SQLAlchemy 2.x engine, sessionmaker, RLS session hooks
│   ├── envelope.py                 # Standard ApiResponse<T> formatter
│   ├── errors.py                   # Centralized OrchestraError hierarchy and handlers
│   ├── logging.py                  # Structured JSON logger with correlation ID injection
│   └── security.py                 # OIDC verification interface, AuthenticatedPrincipal, RBAC guards
│
├── modules/
│   ├── organizations/              # Organization, Workspace models, schemas, service, router
│   ├── identity/                   # User, Membership models, schemas, service, router
│   ├── authorization/              # Role, Permission, RolePermission, MembershipRole models
│   ├── requests/                   # Request model, schemas, service, router, events endpoint
│   ├── approvals/                  # ApprovalRequest, ApprovalDecision, state machine, canonical hash
│   ├── workflows/                  # WorkflowRun, WorkflowStep models, schemas, router
│   └── audit/                      # Append-only AuditEvent ledger model and schemas
│
└── infrastructure/
    └── temporal/
        ├── client.py               # Temporal client connection abstraction and signal dispatch
        └── workflows/
            └── supplier_investigation.py # Deterministic workflow with durable approval gate

alembic/
├── env.py                          # Alembic migration environment with all models registered
├── script.py.mako                  # Migration template
└── versions/
    └── 001_initial_core_schema.py  # 14 tables, indexes, and PostgreSQL RLS policies
```

---

## 3. Database Schema & Migrations

- Migration `001_initial_core_schema.py` executed cleanly via `python3 -m alembic upgrade head`.
- Tables created: `organizations`, `workspaces`, `users`, `memberships`, `roles`, `permissions`, `role_permissions`, `membership_roles`, `requests`, `approval_requests`, `approval_decisions`, `workflow_runs`, `workflow_steps`, `audit_events`.
- Enforces `organization_id VARCHAR(36) NOT NULL` and cascade deletes across all tenant-scoped tables.

---

## 4. Tenant Isolation Implementation

- Implements ADR-003.
- Database layer: `set_rls_tenant_session(session, org_id)` sets `SET LOCAL app.current_org_id = :org_id` on PostgreSQL.
- Service layer: Strict tenant context enforcement across all repositories (`RequestService`, `ApprovalService`, `OrganizationService`). Cross-tenant access triggers `TenantAccessViolation` (HTTP 403).
- Verified via security test suite: 0 cross-tenant reads, modifications, or deletions allowed.

---

## 5. Authentication Integration Interface

- Abstract interface `OidcTokenVerifier` allows binding any verified enterprise OIDC identity provider (Google Workspace, Okta, Keycloak, Auth0) without introducing a divergent second auth system.
- Standard verifier extracts claims from JWT Bearer tokens into `AuthenticatedPrincipal` (subject, email, organization_id, roles, permissions).
- Request dependency `get_current_tenant_context` guarantees verified `TenantContext` is injected into every FastAPI route.

---

## 6. Temporal Workflow Scaffold

- Implements ADR-002.
- Deterministic workflow `SupplierInvestigationWorkflow` modeled for the Rotterdam supplier delay scenario.
- Workflow progression states: `INITIALIZED` -> `INVESTIGATING` -> `AWAITING_APPROVAL` -> `APPROVED` / `REJECTED` -> `EXECUTING` -> `VERIFYING` -> `COMPLETED`.
- Durable signal handler `signal_approval(decision, reason, verified_hash)` waits for human approval decision and rejects any tampered payload hash.

---

## 7. Approval State Machine Implementation

- Implements ADR-004.
- Deterministic SHA-256 canonical hashing via `compute_canonical_payload_hash(payload)` with alphabetically sorted keys and compact serialization.
- Transition invariants enforced:
  1. Terminal states (`approved`, `rejected`, `expired`, `executed`) cannot be re-approved.
  2. Expired approval requests are automatically transitioned to `expired` and rejected.
  3. Pre-execution hash verification: executing payload hash must strictly equal `approval.payload_hash`; any divergence triggers `InvalidPayloadHashError` and invalidates the approval.

---

## 8. API Contract & OpenAPI Output

- OpenAPI 3.1.0 schema generated and committed to `docs/specifications/openapi.json` (48 KB).
- Covers all 11 endpoints across System, Organizations, Identity, Requests, Approvals, and Workflows.
- Every endpoint conforms to `ApiResponse<T>` with `ApiMeta` correlation headers.

---

## 9. Automated Test Suite Execution Report

Automated tests executed with `pytest -v tests/`:

| Test File | Test Case | Status | Duration |
|---|---|---|---|
| `tests/unit/test_config_logging.py` | `test_settings_initialization` | ✅ PASSED | < 0.01s |
| `tests/unit/test_config_logging.py` | `test_context_vars` | ✅ PASSED | < 0.01s |
| `tests/unit/test_config_logging.py` | `test_structured_json_logging` | ✅ PASSED | < 0.01s |
| `tests/unit/test_approvals_statemachine.py` | `test_canonical_payload_hashing_determinism` | ✅ PASSED | < 0.01s |
| `tests/unit/test_approvals_statemachine.py` | `test_approval_lifecycle_and_transition_invariants` | ✅ PASSED | < 0.05s |
| `tests/unit/test_approvals_statemachine.py` | `test_tamper_detection_on_execution` | ✅ PASSED | < 0.05s |
| `tests/unit/test_approvals_statemachine.py` | `test_expired_approval_rejection` | ✅ PASSED | < 0.05s |
| `tests/unit/test_temporal_workflow.py` | `test_supplier_investigation_end_to_end_flow` | ✅ PASSED | < 0.01s |
| `tests/unit/test_temporal_workflow.py` | `test_workflow_tamper_detection_halts_execution` | ✅ PASSED | < 0.01s |
| `tests/security/test_tenant_isolation.py` | `test_tenant_cannot_read_another_tenants_requests` | ✅ PASSED | < 0.05s |
| `tests/security/test_tenant_isolation.py` | `test_tenant_cannot_list_another_tenants_requests` | ✅ PASSED | < 0.05s |
| `tests/security/test_tenant_isolation.py` | `test_tenant_cannot_approve_or_modify_another_tenants_approvals` | ✅ PASSED | < 0.05s |
| `tests/security/test_tenant_isolation.py` | `test_workspace_isolation_across_tenants` | ✅ PASSED | < 0.05s |
| `tests/integration/test_api_endpoints.py` | `test_health_and_readiness_endpoints` | ✅ PASSED | < 0.10s |
| `tests/integration/test_api_endpoints.py` | `test_create_and_query_organization` | ✅ PASSED | < 0.15s |
| `tests/integration/test_api_endpoints.py` | `test_request_lifecycle_and_events` | ✅ PASSED | < 0.15s |
| `tests/integration/test_api_endpoints.py` | `test_approval_lifecycle_via_api` | ✅ PASSED | < 0.15s |
| `tests/integration/test_api_endpoints.py` | `test_permission_denied_when_lacking_permission` | ✅ PASSED | < 0.10s |

**Total:** 18 passed, 0 failed, 100% pass rate.

---

## 10. Outstanding Risks & Blockers

1. **Production PostgreSQL Deployment:** Stage 2 verified migrations and models on clean databases and dialect-ready PostgreSQL schemas. To connect live PostgreSQL, provision an instance (e.g. Cloud SQL or managed PG) and set `DATABASE_URL`.
2. **Temporal Server Instance:** Temporal workflows and activity scaffolding are unit tested with in-memory execution graphs. Connecting a live Temporal cluster requires configuring `TEMPORAL_HOST` (defaulting to `localhost:7233`).
3. **External Systems (SAP / Freight EDI):** As mandated by the Stage 2 kick-off rules, no external write actions or third-party API dispatches have been executed. All activity outputs are synthetic business test fixtures.
