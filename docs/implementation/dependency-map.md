# ORCHESTRA — Module Dependency and Implementation Sequence Map

**Document ID:** ORC-DEP-001  
**Date:** 1 November 2026  
**Status:** Approved  
**Author:** Lead Principal Architect & Engineering Coordinator  

---

## 1. Inter-Module Dependency Graph

```
[Core Tenancy & Security]
       |
       v
[Identity & Organizations] ---> [Authorization (RBAC)]
                                       |
    +----------------------------------+-----------------------+
    |                                  |                       |
    v                                  v                       v
[Requests Module]               [Tasks Module]          [Documents Module]
    |                                  |                       |
    v                                  |                       v
[AI Planner & Intent Classifier]       |                [Knowledge Base]
    |                                  |                       |
    v                                  |                       |
[Deterministic Policy Engine] <--------+                       |
    |                                                          |
    +-------------------+                                      |
    |                   |                                      |
    v                   v                                      |
[Approvals (HITL)]   [Temporal Workflows]                      |
    |                   |                                      |
    +--------->---------+                                      |
                        |                                      |
                        v                                      v
                 [Tool Registry] ----------------------> [Integrations]
                        |
                        v
                 [Verifier & Evidence]
                        |
                        v
                 [Append-Only Audit Log]
                        |
                        v
                 [SSE Event Broadcaster]
                        |
                        v
                 [Frontend React UI]
```

---

## 2. Phased Implementation Sequence

| Stage | Focus Area | Status | Prerequisites | Primary Owner | Target Deliverables |
|---|---|---|---|---|---|
| **Stage 1** | Foundation & Assessment | ✅ Completed | Repository inspection | Lead Architect | `repository-assessment.md`, `ADRs`, `api.ts` |
| **Stage 2** | Core Tenancy & DB Schemas | ✅ Completed | Stage 1 approval | Agent 1 (Backend) | PostgreSQL schema, SQLAlchemy models, Alembic migrations |
| **Stage 3** | Authentication & RBAC | ✅ Completed | Stage 2 | Agent 1 (Backend) | OIDC verification interface, tenant context injection, RBAC guards |
| **Stage 4** | Workflow & Approval Engine | ✅ Scaffolding Complete | Stage 3 | Agent 3 (Workflow) | Temporal workflow definitions, approval lifecycle, payload hashing |
| **Stage 5** | AI Runtime & Policy Engine | Pending Stage 2 Review | Stage 3, Stage 4 | Agent 2 (AI Eng) | Pydantic planner, tool registry, policy check, verifier |
| **Stage 6** | Integration Adapters | Pending | Stage 5 | Agent 1 & Agent 2 | SAP, Email (SMTP/Graph), S3 adapter |
| **Stage 7** | Frontend API Client & SSE | Pending | Stage 3, Stage 4 | Agent 4 (Frontend) | `src/api/client.ts`, SSE hook, removal of mock mutation state |
| **Stage 8** | QA & Security Test Suite | ✅ Stage 2 Gate Verified | Stage 4, Stage 5 | Agent 5 (QA) | Isolation tests, HITL tests, injection benchmarks |
| **Stage 9** | Docker & Deployment Setup | Pending | Stage 2 - Stage 7 | Agent 6 (DevOps) | Docker compose, multi-worker topology, OTEL setup |
| **Stage 10** | Pilot Validation Run | Pending | Stage 8, Stage 9 | Full Team | Rotterdam supplier delay scenario end-to-end |
