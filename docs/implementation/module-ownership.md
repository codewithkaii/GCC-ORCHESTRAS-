# ORCHESTRA — Multi-Agent Module Ownership Matrix (Phase 2)

**Document ID:** ORC-OWN-001  
**Date:** 1 November 2026  
**Status:** Approved  
**Author:** Lead Principal Architect & Engineering Coordinator  

---

## 1. Multi-Agent Team Structure

| Agent Identifier | Role | Primary Focus |
|---|---|---|
| **Agent 0** | Lead Architect / Coordinator | System architecture, contracts, ADRs, PR reviews, integration |
| **Agent 1** | Backend Engineering | FastAPI, SQLAlchemy 2.x, PostgreSQL schemas, core REST APIs |
| **Agent 2** | AI Engineering | Pydantic planner, policy engine, tool registry, verifier |
| **Agent 3** | Workflow & HITL | Temporal workflows, approval state machine, activity recovery |
| **Agent 4** | Frontend Integration | React UI connection, API client, SSE streaming, UX states |
| **Agent 5** | QA & Security | Test automation, tenant isolation tests, security evaluations |
| **Agent 6** | DevOps & Infrastructure | Docker, CI/CD, migrations, OpenTelemetry, Redis, backups |

---

## 2. File and Directory Ownership Rules

To prevent code collisions, each AI agent works exclusively within its designated filesystem boundary. Modifications to shared boundaries require Lead Architect sign-off.

```
orchestra/
├── docs/                               <-- Agent 0 (Lead Architect)
│   ├── architecture/
│   ├── specifications/
│   ├── adr/
│   └── quality/
│
├── apps/
│   ├── api/main.py                     <-- Agent 1 (Backend)
│   └── workers/
│       ├── agent_worker.py             <-- Agent 2 (AI Engineering)
│       ├── integration_worker.py       <-- Agent 1 & Agent 2
│       └── document_worker.py          <-- Agent 1 (Backend)
│
├── src/orchestra/
│   ├── core/                           <-- Agent 1 (Backend: db, security, tenancy)
│   ├── modules/
│   │   ├── identity/                   <-- Agent 1 (Backend)
│   │   ├── organizations/              <-- Agent 1 (Backend)
│   │   ├── authorization/              <-- Agent 1 (Backend)
│   │   ├── requests/                   <-- Agent 1 (Backend)
│   │   ├── tasks/                      <-- Agent 1 (Backend)
│   │   ├── workflows/                  <-- Agent 3 (Workflow & HITL)
│   │   ├── approvals/                  <-- Agent 3 (Workflow & HITL)
│   │   ├── agents/                     <-- Agent 2 (AI Engineering)
│   │   ├── policies/                   <-- Agent 2 (AI Engineering)
│   │   ├── tools/                      <-- Agent 2 (AI Engineering)
│   │   ├── integrations/               <-- Agent 1 (Backend)
│   │   ├── documents/                  <-- Agent 1 (Backend)
│   │   ├── knowledge/                  <-- Agent 1 & Agent 2
│   │   └── audit/                      <-- Agent 1 (Backend)
│   │
│   └── infrastructure/
│       ├── temporal/                   <-- Agent 3 (Workflow & HITL)
│       ├── llm/                        <-- Agent 2 (AI Engineering)
│       └── connectors/                 <-- Agent 1 (Backend)
│
├── tests/
│   ├── unit/                           <-- Individual agent for owned modules
│   ├── integration/                    <-- Agent 5 (QA & Security)
│   ├── security/                       <-- Agent 5 (QA & Security)
│   └── evaluations/                    <-- Agent 5 (QA & Security)
│
├── deployment/                         <-- Agent 6 (DevOps)
│
└── src/ (React Frontend)               <-- Agent 4 (Frontend Integration)
    ├── api/client.ts
    ├── context/AppContext.tsx
    └── types/api.ts
```

---

## 3. Collaboration Protocol & Branching Model

1. **Git Branching:**
   * `feat/backend-core-<ticket>` (Agent 1)
   * `feat/ai-runtime-<ticket>` (Agent 2)
   * `feat/workflow-hitl-<ticket>` (Agent 3)
   * `feat/frontend-api-<ticket>` (Agent 4)
   * `feat/qa-security-<ticket>` (Agent 5)
   * `feat/devops-infra-<ticket>` (Agent 6)
2. **Contract Immutability:** Shared contracts in `docs/specifications/DTS.md` and `src/types/api.ts` are **FROZEN**. No agent may unilaterally alter JSON keys or endpoint schemas.
3. **Pull Request Protocol:** Every PR must include passing unit tests and a verified check against tenant isolation.
