# ADR-005: Frontend API Integration and State Migration Strategy

**Status:** Accepted  
**Date:** 1 November 2026  
**Context:** Connecting existing React UI to FastAPI backend while eliminating client mock state  
**Deciders:** Lead Principal Architect  

---

## Context and Problem Statement

The existing React application has high design quality and an established Apple-inspired aesthetic. We must avoid breaking existing visual components, layout structures, and user interactions while replacing client-authoritative `localStorage` mock mutations with real FastAPI endpoints.

## Decision

1. **Retain Frontend Components:** Keep all pages, drawers, modals, and design tokens intact.
2. **Centralized Typed API Client:** Build `src/api/client.ts` implementing a contract-backed HTTP client configured with baseURL, Bearer auth headers, correlation IDs, and unified error parsing.
3. **Dual-Mode Adapter Layer:** The `AppContext.tsx` will be adapted to interface with `src/api/client.ts`. While running in connected mode, UI actions (`createTask`, `approveApproval`, `dispatchOperationCommand`) send requests to `/api/v1/*` endpoints and listen for Server-Sent Events (SSE) on `/api/v1/requests/{id}/events`.
4. **SSE Event Stream:** Live operational timeline events and step status changes will stream directly from the backend rather than synthetic `setTimeout` loops.

## Consequences

* **Positive:** Zero visual regression, clean transition from prototype to production SaaS, and robust type safety across TypeScript and Pydantic schemas.
* **Negative:** Requires handling network latency, offline states, and server error toasts gracefully across all views.
