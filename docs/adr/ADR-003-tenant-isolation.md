# ADR-003: Multi-Tenant Data Isolation Strategy

**Status:** Accepted  
**Date:** 1 November 2026  
**Context:** Enforcing strict tenant boundaries across database, storage, search, and workers  
**Deciders:** Lead Principal Architect  

---

## Context and Problem Statement

ORCHESTRA is a multi-tenant platform handling confidential financial records, supplier invoices, contracts, and customer emails. Cross-tenant data leakage is a critical P0 release blocker.

## Decision

We enforce multi-tenancy at multiple defense-in-depth layers:

1. **Mandatory Schema Column:** Every tenant-owned table contains `organization_id UUID NOT NULL` indexed for query isolation.
2. **PostgreSQL Row Level Security (RLS):** Enabled on all tenant tables, enforcing `organization_id = current_setting('app.current_org_id')::uuid`. Connection pool checkouts must reset this setting.
3. **Server-Side Token Resolution:** Client requests never dictate tenant authority. The backend resolves `organization_id` strictly from the cryptographically verified JWT bearer token and database `memberships` table.
4. **Tenant-Scoped Object Storage:** Document keys are formatted as `org_{organization_id}/{document_id}/{filename}`. Presigned URLs are strictly time-bound and tenant-validated.
5. **Worker Context Propagation:** Background workers and Temporal activities must carry verified `tenant_context` in their execution payloads.

## Consequences

* **Positive:** Mathematical certainty of isolation; queries accidentally omitting `WHERE organization_id = ...` fail safely at the database RLS layer.
* **Negative:** Requires thorough test coverage across all repositories and explicit setup in test fixtures.
