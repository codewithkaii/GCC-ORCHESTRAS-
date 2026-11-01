# ORCHESTRA — Code-Level Audit Reference Guide

**Document ID:** ORC-AUDIT-001  
**Target Package:** `orchestra-stage2-repository.zip` (2.18 MB)  
**Date:** 1 November 2026  
**Author:** Lead Principal Software Architect & Engineering Coordinator  

---

## 1. How to Access the Codebase ZIP Archive

The complete source codebase package (`orchestra-stage2-repository.zip`) can be accessed through three methods:

1. **Direct In-App Download:**
   - Click the **"Download Source ZIP (2.18 MB)"** button in the top navigation bar of the running application.
   - Or open the User Menu in the top right and click **"Download Codebase (.zip)"**.
2. **Direct Browser URL:**
   - `https://ais-dev-uo4uqyxibjsadsqkwszhw5-636186699225.asia-east1.run.app/orchestra-stage2-repository.zip`
3. **Artifact Directory:**
   - `/.aistudio/artifacts/brain/72014eb6-c0c4-4da2-adb5-4ddcc8b6f9a1/orchestra-stage2-repository.zip`

---

## 2. Audit Map: Controlling Documents to Concrete Source Code

| Audit Area | Controlling Specification | Concrete Source Files to Inspect | Verification Test File |
|---|---|---|---|
| **Architecture Compliance** | ORC-SAD-001, ADR-001 | `apps/api/main.py`<br>`src/orchestra/core/`<br>`src/orchestra/modules/` | `tests/unit/test_config_logging.py` |
| **Multi-Tenant Security & RLS** | ORC-SAD-001 §3, ADR-003 | `alembic/versions/001_initial_core_schema.py`<br>`src/orchestra/core/database.py`<br>`src/orchestra/core/context.py` | `tests/security/test_tenant_isolation.py` |
| **OIDC Auth & RBAC** | ORC-DTS-001 §2, ADR-003 | `src/orchestra/core/security.py`<br>`src/orchestra/modules/authorization/models.py`<br>`src/orchestra/modules/identity/` | `tests/integration/test_api_endpoints.py` |
| **Deterministic Approvals** | ADR-004, ORC-DTS-001 §5 | `src/orchestra/modules/approvals/service.py`<br>`src/orchestra/modules/approvals/models.py` | `tests/unit/test_approvals_statemachine.py` |
| **Allowlisted Tools & Ledger** | ORC-DTS-001 §4 | `src/orchestra/modules/tools/registry.py` | `tests/integration/test_rotterdam_workflow.py` |
| **Temporal Workflow** | ADR-002, ORC-DTS-001 §6 | `src/orchestra/infrastructure/temporal/client.py`<br>`src/orchestra/infrastructure/temporal/workflows/` | `tests/unit/test_temporal_workflow.py` |
| **Rotterdam Vertical Slice** | Stage 3 Specification | `src/orchestra/modules/workflows/supplier_delay.py`<br>`src/orchestra/modules/workflows/router.py` | `tests/integration/test_rotterdam_workflow.py` |
| **Frontend Integration** | ADR-005, ORC-DTS-001 | `src/api/client.ts`<br>`src/types/api.ts`<br>`src/context/AppContext.tsx` | Applet compilation & `tsc --noEmit` |

---

## 3. Key Invariants Implemented in Source Code

### Invariant 1: Multi-Tenant Boundary Isolation (ADR-003)
- Inspect `src/orchestra/core/database.py` lines 46-58 (`set_rls_tenant_session`) and `alembic/versions/001_initial_core_schema.py` lines 180-196.
- Enforced with PostgreSQL RLS:
  `CREATE POLICY requests_tenant_isolation ON requests USING (organization_id = NULLIF(current_setting('app.current_org_id', true), '')::varchar);`
- Tested in `tests/security/test_tenant_isolation.py`:
  - Tenant A creates records.
  - Tenant B queries Tenant A's record -> raises `TenantAccessViolation` (HTTP 403).
  - Tenant B lists requests -> returns 0 records from Tenant A (0% cross-tenant leakage).

### Invariant 2: Canonical Payload Hashing & Tamper Invalidation (ADR-004)
- Inspect `src/orchestra/modules/approvals/service.py` lines 19-32:
  ```python
  def compute_canonical_payload_hash(payload: Dict[str, Any]) -> str:
      canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
      return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()
  ```
- Inspect lines 150-180 (`verify_and_lock_for_execution`):
  If the payload executed at runtime has even one character or number altered compared to the approved payload, the status is set to `invalidated`, execution halts, and `InvalidPayloadHashError` is raised.

### Invariant 3: Allowlisted Tool Execution Ledger
- Inspect `src/orchestra/modules/tools/registry.py`:
  - Only registered tools can be invoked (`query_erp_purchase_order`, `query_carrier_tracking`, `calculate_mitigation_plan`, `execute_mitigation_action`).
  - Unregistered or unauthorized tools throw `ValidationError`.
  - Every call requires an `idempotency_key` and is appended to `_ledger`.

### Invariant 4: Rotterdam 7-Step Workflow Orchestration
- Inspect `src/orchestra/modules/workflows/supplier_delay.py`:
  1. `run_investigation()` runs ERP query, tracking query, calculates 20% air-freight split mitigation plan, and creates `approval_requests` with canonical SHA-256 hash.
  2. Safety gate: `execute_approved_resolution()` rejects execution if approval status is not `approved`.
  3. When human approval is granted (`approve_action`), it verifies the hash and executes the mitigation tool, updating workflow state and logging immutable audit events.

---

## 4. How to Reproduce All 19 Automated Tests

From the workspace root:
```bash
python3 -m pytest -v tests/
```

Expected result:
```
tests/unit/test_config_logging.py::test_settings_initialization PASSED
tests/unit/test_config_logging.py::test_context_vars PASSED
tests/unit/test_config_logging.py::test_structured_json_logging PASSED
tests/unit/test_approvals_statemachine.py::test_canonical_payload_hashing_determinism PASSED
tests/unit/test_approvals_statemachine.py::test_approval_lifecycle_and_transition_invariants PASSED
tests/unit/test_approvals_statemachine.py::test_tamper_detection_on_execution PASSED
tests/unit/test_approvals_statemachine.py::test_expired_approval_rejection PASSED
tests/unit/test_temporal_workflow.py::test_supplier_investigation_end_to_end_flow PASSED
tests/unit/test_temporal_workflow.py::test_workflow_tamper_detection_halts_execution PASSED
tests/security/test_tenant_isolation.py::test_tenant_cannot_read_another_tenants_requests PASSED
tests/security/test_tenant_isolation.py::test_tenant_cannot_list_another_tenants_requests PASSED
tests/security/test_tenant_isolation.py::test_tenant_cannot_approve_or_modify_another_tenants_approvals PASSED
tests/security/test_tenant_isolation.py::test_workspace_isolation_across_tenants PASSED
tests/integration/test_api_endpoints.py::test_health_and_readiness_endpoints PASSED
tests/integration/test_api_endpoints.py::test_create_and_query_organization PASSED
tests/integration/test_api_endpoints.py::test_request_lifecycle_and_events PASSED
tests/integration/test_api_endpoints.py::test_approval_lifecycle_via_api PASSED
tests/integration/test_api_endpoints.py::test_permission_denied_when_lacking_permission PASSED
tests/integration/test_rotterdam_workflow.py::test_rotterdam_supplier_delay_complete_vertical_slice PASSED

======================== 19 passed, 1 warning in 1.75s =========================
```
