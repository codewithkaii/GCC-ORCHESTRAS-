# ADR-001: Modular Monolith Architecture for Backend Services

**Status:** Accepted  
**Date:** 1 November 2026  
**Context:** Multi-agent development of ORCHESTRA SaaS backend  
**Deciders:** Lead Principal Architect  

---

## Context and Problem Statement

ORCHESTRA requires multiple domain services: Identity, Organizations, Tasks, Requests, Workflows, Approvals, Integrations, Documents, Knowledge, and Audit. Splitting these into separate microservices during initial development introduces distributed transactions, network latency, complex local setup for coding agents, and high integration friction.

## Decision

We will implement a **Modular Monolith** using **Python FastAPI** and **SQLAlchemy 2.x**.

1. All domain modules reside inside `src/orchestra/modules/<module_name>/`.
2. Each module encapsulates its own `models.py`, `schemas.py`, `repository.py`, `service.py`, and `router.py`.
3. Modules communicate in-process through well-defined service interfaces and domain events, avoiding direct cross-module database table joins wherever practical.
4. Independent worker processes (`agent_worker.py`, `integration_worker.py`, `document_worker.py`) will run asynchronously from the same codebase, consuming tasks via Temporal and task queues.

## Consequences

* **Positive:** Fast development velocity, single database transaction boundary when needed, straightforward type checking, unified migrations with Alembic, and simple deployment.
* **Negative:** Requires strict internal discipline to prevent spaghetti cross-module dependencies. Enforced via linting rules and code review checkpoints.
