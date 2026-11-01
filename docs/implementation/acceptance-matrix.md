# ORCHESTRA — Engineering Acceptance & Quality Gate Matrix

**Document ID:** ORC-ACC-001  
**Date:** 1 November 2026  
**Status:** Approved  
**Author:** Lead Principal Architect & Engineering Coordinator  

---

## 1. Quality Gates (Release Blockers)

In accordance with **ORC-VVP-001**, progress across implementation stages must satisfy the following strict gating criteria:

| Gate | Name | Mandatory Criteria | Responsible Agent |
|---|---|---|---|
| **Gate A** | Architecture Readiness | All ADRs accepted; OpenAPI & TypeScript contracts frozen; schema ERD reviewed | Agent 0 (Lead) |
| **Gate B** | Core Platform Readiness | Database migrations pass on clean DB; tenant RLS enforced; JWT authentication verified | Agent 1 (Backend) |
| **Gate C** | Workflow & HITL Readiness | Temporal durable state survives worker restart; canonical SHA-256 action hashing verified; zero unapproved side effects | Agent 3 (Workflow) |
| **Gate D** | AI Execution Readiness | Planner output conforms strictly to Pydantic schemas; deterministic policy blocks prohibited actions; independent outcome verification passes | Agent 2 (AI Eng) |
| **Gate E** | Integration Readiness | Real email/ERP adapter completes end-to-end; normalized error handling; mock execution paths removed | Agent 1 & Agent 4 |
| **Gate F** | Production & Security Readiness | 0 critical security defects; 0 cross-tenant leakages; backup restoration tested; p95 latency targets met | Agent 5 & Agent 6 |

---

## 2. Agent-Specific Acceptance Criteria

### Agent 1 (Backend Engineering)
* `pytest tests/unit/test_tenancy.py` passes with 100% tenant isolation (cross-tenant reads/writes rejected).
* All models define `organization_id UUID NOT NULL REFERENCES organizations(id)`.
* Every mutation persists an immutable record in `audit_events`.

### Agent 2 (AI Engineering)
* LLM receives zero database connection strings and zero raw external credentials.
* All tool proposals declare strongly-typed Pydantic arguments with strict validation.
* Every proposed write action is validated by the deterministic policy engine before any external dispatch.

### Agent 3 (Workflow & HITL)
* Re-hashing the action payload at execution matches the approved hash; mismatch halts execution immediately.
* Expired approvals are rejected at runtime.
* Worker restarts mid-workflow cleanly resume from Temporal history.

### Agent 4 (Frontend Integration)
* Zero reliance on `localStorage` for authoritative operational state.
* Network error states, loading skeletons, and reconnecting SSE banners render cleanly.
* Apple-inspired visual clarity and responsive layout maintained across all 11 routes.
