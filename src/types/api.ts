/**
 * @file api.ts
 * @description Formal TypeScript API Contracts for ORCHESTRA SaaS Backend (FastAPI /api/v1)
 * Document Ref: ORC-DTS-001
 */

// ---------------------------------------------------------------------------
// 1. Generic API Envelope & Error Types
// ---------------------------------------------------------------------------

export interface ApiMeta {
  request_id: string;
  correlation_id: string;
  timestamp?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, any>;
  correlation_id: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

// ---------------------------------------------------------------------------
// 2. Identity, User & Organization Schemas
// ---------------------------------------------------------------------------

export type OrganizationStatus = 'active' | 'suspended' | 'trial';
export type UserStatus = 'active' | 'invited' | 'deactivated';
export type MembershipStatus = 'active' | 'pending' | 'revoked';

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  default_timezone: string;
  default_locale: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceDto {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UserDto {
  id: string;
  identity_subject: string;
  email: string;
  display_name: string;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipDto {
  id: string;
  organization_id: string;
  user_id: string;
  status: MembershipStatus;
  roles: string[];
  permissions: string[];
  created_at: string;
}

// ---------------------------------------------------------------------------
// 3. Request Management Schemas (/api/v1/requests)
// ---------------------------------------------------------------------------

export type RequestStatus = 
  | 'received'
  | 'classifying'
  | 'awaiting_information'
  | 'planning'
  | 'ready'
  | 'running'
  | 'awaiting_approval'
  | 'verifying'
  | 'escalated'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface CreateRequestInput {
  input_text: string;
  source: 'workspace' | 'email' | 'slack' | 'webhook';
  priority?: 'critical' | 'high' | 'normal' | 'low';
  execution_mode?: 'automatic' | 'approval_required' | 'dry_run';
  workspace_id?: string;
  idempotency_key?: string;
}

export interface RequestDto {
  id: string;
  organization_id: string;
  workspace_id?: string;
  created_by: string;
  source: string;
  input_text: string;
  status: RequestStatus;
  priority: string;
  correlation_id: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 4. Task Management Schemas (/api/v1/tasks)
// ---------------------------------------------------------------------------

export type TaskStatusBackend = 
  | 'open'
  | 'in_progress'
  | 'blocked'
  | 'awaiting_approval'
  | 'completed'
  | 'cancelled';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  due_at?: string;
  assignee_user_id?: string;
  assignee_agent_id?: string;
  request_id?: string;
  workspace_id?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatusBackend;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  due_at?: string;
  assignee_user_id?: string;
  assignee_agent_id?: string;
}

export interface TaskDto {
  id: string;
  organization_id: string;
  workspace_id?: string;
  request_id?: string;
  title: string;
  description?: string;
  status: TaskStatusBackend;
  priority: string;
  assignee_user_id?: string;
  assignee_agent_id?: string;
  due_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 5. Approval Management Schemas (/api/v1/approvals)
// ---------------------------------------------------------------------------

export type ApprovalStatusBackend = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'invalidated'
  | 'cancelled'
  | 'executing'
  | 'executed'
  | 'execution_failed';

export interface ApprovalRequestDto {
  id: string;
  organization_id: string;
  workflow_run_id: string;
  workflow_step_id?: string;
  action_type: string;
  action_payload: Record<string, any>;
  payload_hash: string;
  target_system: string;
  risk_level: 'low' | 'medium' | 'high';
  status: ApprovalStatusBackend;
  requested_by_type: 'agent' | 'user';
  requested_by_id?: string;
  expires_at: string;
  decided_at?: string;
  evidence_references?: string[];
  created_at: string;
  updated_at: string;
}

export interface ApproveActionInput {
  reason?: string;
}

export interface RejectActionInput {
  reason: string;
}

export interface RequestChangesActionInput {
  reason: string;
}

// ---------------------------------------------------------------------------
// 6. Workflow & Execution Schemas (/api/v1/workflows)
// ---------------------------------------------------------------------------

export type WorkflowRunStatus = 
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timed_out'
  | 'awaiting_approval';

export interface WorkflowRunDto {
  id: string;
  organization_id: string;
  workflow_id: string;
  workflow_version_id: string;
  request_id?: string;
  temporal_workflow_id: string;
  status: WorkflowRunStatus;
  started_at?: string;
  finished_at?: string;
  failure_code?: string;
  failure_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStepDto {
  id: string;
  organization_id: string;
  workflow_run_id: string;
  step_key: string;
  step_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input_reference?: Record<string, any>;
  output_reference?: Record<string, any>;
  attempt_count: number;
  started_at?: string;
  finished_at?: string;
}

// ---------------------------------------------------------------------------
// 7. Integrations Schemas (/api/v1/integrations)
// ---------------------------------------------------------------------------

export interface IntegrationDto {
  id: string;
  organization_id: string;
  provider: string;
  display_name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  granted_scopes: string[];
  last_health_check?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 8. Documents & Evidence Schemas (/api/v1/documents)
// ---------------------------------------------------------------------------

export interface DocumentDto {
  id: string;
  organization_id: string;
  workspace_id?: string;
  filename: string;
  media_type: string;
  file_size_bytes: number;
  checksum: string;
  processing_status: 'pending' | 'processing' | 'indexed' | 'failed';
  classification?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 9. Audit Event Schemas (/api/v1/audit-events)
// ---------------------------------------------------------------------------

export interface AuditEventDto {
  id: string;
  organization_id?: string;
  actor_type: 'agent' | 'user' | 'system';
  actor_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  correlation_id: string;
  workflow_run_id?: string;
  metadata: Record<string, any>;
  occurred_at: string;
}

// ---------------------------------------------------------------------------
// 10. Server-Sent Events (SSE) Envelope
// ---------------------------------------------------------------------------

export type SseEventType = 
  | 'request.received'
  | 'request.classified'
  | 'request.needs_information'
  | 'workflow.started'
  | 'workflow.step.started'
  | 'workflow.step.completed'
  | 'workflow.step.failed'
  | 'approval.requested'
  | 'approval.approved'
  | 'approval.rejected'
  | 'approval.expired'
  | 'tool.execution.started'
  | 'tool.execution.completed'
  | 'tool.execution.failed'
  | 'workflow.verification.started'
  | 'workflow.verification.completed'
  | 'workflow.escalated'
  | 'workflow.completed'
  | 'workflow.failed'
  | 'workflow.cancelled';

export interface SseEventEnvelope<T = any> {
  event_id: string;
  event_type: SseEventType;
  organization_id: string;
  workflow_run_id?: string;
  sequence: number;
  occurred_at: string;
  data: T;
}
