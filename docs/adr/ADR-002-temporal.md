# ADR-002: Temporal for Durable Workflow Progression and Recovery

**Status:** Accepted  
**Date:** 1 November 2026  
**Context:** Durable execution, timer management, and crash recovery for autonomous agent tasks  
**Deciders:** Lead Principal Architect  

---

## Context and Problem Statement

Autonomous business workflows frequently span hours or days, awaiting human approvals, supplier email responses, or external system batch jobs. Traditional in-memory or cron-based task engines lose state on worker restarts and fail to guarantee reliable resumption without custom state machines.

## Decision

We adopt **Temporal** as the durable workflow orchestration engine.

1. **Temporal Owns:** Workflow execution graphs, step sequencing, durable timers, activity retries, approval signals, and automatic worker crash recovery.
2. **PostgreSQL Owns:** Authoritative business records (`requests`, `tasks`, `workflow_runs`, `approval_requests`, `tool_executions`, `evidence`, `audit_events`).
3. **Workflow Code Rules:** Temporal workflow definitions must be deterministic (no random numbers, direct network I/O, or system clock calls inside workflows). All side effects and external API calls must be wrapped inside Temporal Activities with idempotent keys.
4. **Human Approval Wait:** Implemented as a Temporal `workflow.wait_condition` or signal handler. Worker restarts while waiting for approval preserve state seamlessly.

## Consequences

* **Positive:** Guaranteed at-least-once activity execution, zero lost workflows during deployments, built-in retry backoff, and full history event sourcing.
* **Negative:** Requires running Temporal Server alongside the application stack and strict adherence to workflow determinism.
