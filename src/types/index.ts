export type TabType = 
  | 'overview' 
  | 'operations' 
  | 'tasks' 
  | 'approvals' 
  | 'workflows' 
  | 'intelligence' 
  | 'knowledge' 
  | 'integrations' 
  | 'activity' 
  | 'team' 
  | 'settings';

export type TaskStatus = 
  | 'queued' 
  | 'planning' 
  | 'executing' 
  | 'awaiting_approval' 
  | 'completed' 
  | 'failed';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'busy' | 'paused';
  currentAssignment: string;
  tasksCompleted: number;
  lastActivity: string;
  avatarUrl?: string;
  avatarFallback: string;
  description: string;
  autonomyLevel: 'Full Autonomy' | 'Human in the Loop' | 'Supervised';
  authorizedTools: string[];
  systemDirectives: string[];
  latencyAvg: string;
}

export interface ExecutionStep {
  id: string;
  text: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  timestamp: string;
  detail?: string;
}

export interface TaskEvidence {
  title: string;
  type: 'document' | 'erp_record' | 'email_thread' | 'sla_policy' | 'tracking';
  refNumber?: string;
  snippet: string;
  date: string;
}

export interface ToolActivity {
  tool: string;
  action: string;
  params: string;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'warning' | 'error';
}

export interface Task {
  id: string;
  title: string;
  objective: string;
  description: string;
  assignedAgentId: string;
  assignedAgentName: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  humanReviewer: string;
  executionSteps: ExecutionStep[];
  evidence: TaskEvidence[];
  toolActivity: ToolActivity[];
  approvalHistory: Array<{
    action: string;
    timestamp: string;
    by: string;
    note?: string;
  }>;
  outcomeSummary?: string;
}

export interface Approval {
  id: string;
  title: string;
  requestedAction: string;
  agentId: string;
  agentName: string;
  businessContext: string;
  reason: string;
  supportingEvidence: string;
  evidenceRef: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  impactAnalysis: string;
  changesFeedback?: string;
  reviewedAt?: string;
  reviewerName?: string;
  linkedTaskId?: string;
}

export interface WorkflowNode {
  id: string;
  type: 
    | 'trigger' 
    | 'extraction' 
    | 'retrieval' 
    | 'investigation' 
    | 'plan' 
    | 'approval_gate' 
    | 'action' 
    | 'verify' 
    | 'completed';
  title: string;
  subtitle: string;
  status: 'idle' | 'active' | 'completed' | 'warning';
  agent?: string;
  x: number;
  y: number;
  config?: Record<string, string | number | boolean>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  status: 'active' | 'draft' | 'paused';
  priority: Priority;
  lastUpdated: string;
  nodesCount: number;
  executionsCount: number;
  successRate: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ActivityLog {
  id: string;
  executionId: string;
  timestamp: string;
  actor: {
    name: string;
    type: 'agent' | 'user';
    avatar?: string;
  };
  action: string;
  resource: string;
  result: 'success' | 'warning' | 'blocked' | 'error';
  details: {
    targetId?: string;
    description: string;
    metadata?: Record<string, string>;
  };
}

export interface Integration {
  id: string;
  name: string;
  category: 'communication' | 'business' | 'productivity' | 'storage' | 'finance';
  icon: string;
  description: string;
  status: 'connected' | 'available';
  lastSync?: string;
  permissionsCount: number;
  authType: string;
  config?: {
    webhookUrl?: string;
    syncInterval?: string;
    autoTrigger?: boolean;
  };
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'supplier' | 'customer' | 'policy' | 'purchase_order' | 'operational' | 'sop';
  status: 'indexed' | 'syncing' | 'review_required';
  lastUpdated: string;
  size: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'JSON' | 'CSV';
  vectorChunks: number;
  excerpt: string;
  linkedAgents: string[];
  contentPreview: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'approval' | 'system' | 'task' | 'alert';
  linkTab?: TabType;
  linkId?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  detail: string;
  agent: string;
  status: 'completed' | 'in_progress' | 'waiting' | 'alert';
  tags?: string[];
  rawPayload?: Record<string, any>;
}
