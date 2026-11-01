# ADR-004: Deterministic Policy Engine and Human-in-the-Loop Approval Architecture

**Status:** Accepted  
**Date:** 1 November 2026  
**Context:** Enforcing strict boundaries on autonomous agent actions  
**Deciders:** Lead Principal Architect  

---

## Context and Problem Statement

AI models can hallucinate, experience prompt injection, or propose erroneous financial/communication side effects. Allowing an LLM to directly invoke external write APIs without deterministic guardrails is unacceptable for enterprise operations.

## Decision

1. **LLM Boundary:** The LLM acts strictly as a **Proposer**. It generates candidate plans and structured tool arguments. It has zero capability to authorize or execute external actions directly.
2. **Deterministic Policy Engine:** An in-process rules engine inspects the proposed action type, arguments, monetary values, and recipient against immutable platform constraints and tenant-configured `approval_policies`.
3. **Canonical Payload Hashing:** When an approval is requested, the system serializes the canonical action payload, generates a SHA-256 `payload_hash`, and stores it in `approval_requests`.
4. **Execution Invariant:** When a human decision is recorded (`approve`), the execution worker re-hashes the proposed payload and verifies that `current_hash == approved_payload_hash`. Any material alteration invalidates the approval.
5. **No Self-Approval:** Agent identities cannot approve actions. Approvers must possess `approvals.decide` permission for the specific tenant and action scope.

## Consequences

* **Positive:** Complete protection against unauthorized external communications, purchase order modifications, or data deletion.
* **Negative:** Introduces latency for actions flagged as high-risk pending human review.
