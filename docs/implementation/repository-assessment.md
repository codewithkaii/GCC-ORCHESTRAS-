# ORCHESTRA — Repository & Engineering Assessment Report (Phase 0)

**Document ID:** ORC-ASSESS-001  
**Date:** 1 November 2026  
**Status:** Approved Baseline  
**Author:** Lead Principal Architect & Engineering Coordinator  

---

## 1. Executive Summary

This assessment audits the existing repository prior to multi-agent backend development and frontend integration. 

* **Frontend Architecture:** The application is an enterprise-grade React 19 single-page application built with Vite 8.3 and Tailwind CSS v4. It features a complete Apple-inspired operations design system, modular tabbed views, command palette (`⌘K`), drawer inspectors, modal dialogs, and interactive client-side state.
* **Authentication & Backend Integration:** Currently, there is **no direct connection to Supabase** or any external database. All authentication is currently handled via a client-side mock persona (`currentUser` in `src/data/mockData.ts`), and all mutations are handled in React Context (`AppContext.tsx`) with `localStorage` persistence.
* **Backend Status:** No Python FastAPI backend, PostgreSQL database, or Temporal workflow workers exist in the repository today.
* **Integration Strategy:** The existing frontend is fully modular and clean. Rather than rewriting working UI components, we will introduce a typed API client (`src/api/client.ts`) and data providers that map existing UI actions directly to the FastAPI endpoints specified in **ORC-DTS-001**, preserving all UI design and interaction patterns while removing simulated local state.

---

## 2. Technical Stack & Repository Inventory

| Layer | Current Implementation | Target Production Specification (ORC-SAD-001) |
|---|---|---|
| **Frontend Framework** | React 19.0.1 + TypeScript 7.0.2 (ES2022) | Retained as presentation layer |
| **Bundler & Build Tool** | Vite 8.3.0 | Retained |
| **Styling & Design System** | Tailwind CSS v4 (`@tailwindcss/vite`), Inter & JetBrains Mono | Retained |
| **Iconography & Motion** | Lucide React 0.546.0, Motion 12.23.24, Recharts 3.10.1 | Retained |
| **Frontend Routing** | Custom tab router (`activeTab` in `AppContext.tsx` + `AppShell.tsx`) | Retained with URL synchronization |
| **Frontend State** | React Context (`AppContext.tsx`) with `localStorage` persistence | Replaced with React Query / Typed API client |
| **Backend Service** | None (static Vite preview server) | Python 3.12 + FastAPI modular monolith |
| **Database** | None | PostgreSQL 16 + SQLAlchemy 2.x + Alembic |
| **Durable Workflows** | Client timer simulation | Temporal Server + Temporal Python SDK |
| **Agent Runtime** | Client mock planner and trace log | Pydantic v2 planner, policy engine, typed tools, verifier |
| **External Integrations** | Mock toggle states in local storage | Adapter pattern connectors (Email, Storage, CRM/ERP) |
| **Audit Ledger** | Client mock array in `mockData.ts` | Append-only PostgreSQL table (`audit_events`) |

---

## 3. Detailed Component & View Audit

The repository contains 11 complete operational pages rendered via `src/components/layout/AppShell.tsx`:

1. **`OverviewPage.tsx`**: Executive operations dashboard showing active operations, completed tasks, approval queues, time saved metrics, active workflow table, and urgent attention queues.
2. **`OperationsPage.tsx`**: Autonomous operations command centre with deep-dive dossiers (`OP-8821`, `OP-8822`, `OP-8823`), multi-tab inspectors (Execution Graph, Tool Matrix, Evidence Dossier, Invariants), directive injector, and live trace stream.
3. **`TasksPage.tsx`**: Dual Kanban and Table task manager, filterable by status, priority, and agent, with interactive status transitions.
4. **`ApprovalsPage.tsx`**: Human-in-the-Loop review centre with risk evaluation, evidence inspector, decision buttons (Approve, Reject, Request Changes), and instant status updates.
5. **`WorkflowsPage.tsx`**: DAG visualizer and workflow manager with pause/resume and trigger executions.
6. **`IntelligencePage.tsx`**: Business telemetry, agent velocity, SLA compliance, and human intervention rates.
7. **`KnowledgePage.tsx`**: Ingested SOPs, purchase orders, policies, and document preview drawer.
8. **`IntegrationsPage.tsx`**: Connectors for SAP S/4HANA, Salesforce, Descartes, Maersk EDI, Slack, Zendesk, WhatsApp.
9. **`ActivityPage.tsx`**: Chronological audit log with filterable actor/result columns and CSV export.
10. **`TeamPage.tsx`**: Workspace personnel directory with role-based access management and invitation modal.
11. **`SettingsPage.tsx`**: Workspace parameters, agent safety boundaries, dual-approval thresholds, and session policies.

### Shared Modals and Drawers:
* `CommandPalette.tsx`: Global search across all routes, tasks, and records (`⌘K`).
* `NotificationsPanel.tsx`: Notification drawer for pending approvals and system alerts.
* `CreateTaskModal.tsx`: Task creation form with agent assignment, priority, and due dates.
* `TaskDetailDrawer.tsx`: Detailed execution steps, tools used, and evidence drawer.
* `ApprovalDetailModal.tsx`: Consequential action confirmation dialog.
* `AgentDetailModal.tsx`: Agent autonomy level, system directives, and tool allowlist inspector.
* `DocumentPreviewDrawer.tsx`: Document reader and vector chunk viewer.

---

## 4. Current Gaps & Architectural Divergence

1. **Client-Authoritative State:** In the current code, `approveApproval()`, `rejectApproval()`, and `createTask()` mutate browser memory and write to `localStorage`. In production, these must be asynchronous HTTP requests to `/api/v1/approvals/{id}/approve` and `/api/v1/tasks`.
2. **Missing Real Tenant Context:** The app assumes a single static tenant (`ORG-AE-7049`). The backend must enforce server-side tenant isolation (`organization_id`) on all queries and mutations via PostgreSQL RLS and FastAPI dependencies.
3. **Simulated Agent Execution:** `dispatchOperationCommand` simulates multi-agent execution with sequential `setTimeout` delays. In production, this will invoke `POST /api/v1/requests` and stream real execution progress via Server-Sent Events (`/api/v1/requests/{id}/events`).
4. **No Direct Supabase Usage Detected:** Inspection confirmed that there are **no Supabase dependencies, imports, or direct database connections** in the frontend. This eliminates the risk of conflicting client-direct database queries bypassing FastAPI.

---

## 5. Architectural Recommendations for Phase 1

1. **Preserve UI Code:** Do not rewrite or refactor the React components. They are clean, robust, accessible, and strictly adhere to the Apple-inspired design constitution.
2. **Introduce Typed API Contracts:** Generate and commit `src/types/api.ts` containing the exact TypeScript interfaces for all FastAPI requests, responses, and SSE envelopes defined in **ORC-DTS-001**.
3. **Freeze Backend Specifications:** Establish the database schema, Pydantic domain models, and API OpenAPI contracts before spawning backend and agent development workers.
4. **Isolate Agent Workstreams:** Strictly enforce file ownership per agent as specified in Section 4 of the Engineering Pack.
