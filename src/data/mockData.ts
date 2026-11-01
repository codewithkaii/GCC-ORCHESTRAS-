import { 
  Agent, 
  Task, 
  Approval, 
  Workflow, 
  ActivityLog, 
  Integration, 
  KnowledgeDoc, 
  AppNotification, 
  TimelineEvent 
} from '../types';

export const currentUser = {
  name: 'Mohammed Al-Hashimi',
  role: 'Chief Operating Officer',
  email: 'mohammed.alhashimi@orchestra-ops.io',
  avatarUrl: '/src/assets/images/avatar_mohammed_executive_1793515308593.jpg',
  workspace: 'Acme Global Logistics & Trade',
  organizationId: 'ORG-AE-7049',
  timezone: 'GST (UTC+4)',
};

export const mockAgents: Agent[] = [
  {
    id: 'agent-ops-coord',
    name: 'Operations Coordinator',
    role: 'Root Orchestration & Dispatch',
    status: 'active',
    currentAssignment: 'Cross-functional dispatch & PO-2026-1042 tracking',
    tasksCompleted: 84,
    lastActivity: '2 minutes ago',
    avatarFallback: 'OC',
    description: 'Decomposes complex inbound operations briefs, assigns specialized sub-agents, and guarantees execution accountability.',
    autonomyLevel: 'Full Autonomy',
    authorizedTools: ['Workflow Dispatcher', 'Agent Spawner', 'ERP Query', 'Slack Bridge', 'Audit Verifier'],
    systemDirectives: [
      'Prioritize customer SLAs above internal queuing.',
      'Always route financial adjustments > $1,000 for human approval.',
      'Maintain an unbroken audit trail for all decentralized agent handoffs.'
    ],
    latencyAvg: '180ms'
  },
  {
    id: 'agent-procure',
    name: 'Procurement Agent',
    role: 'Supplier Coordination & Invoicing',
    status: 'active',
    currentAssignment: 'Analyzing port delays with Nordic Freight Ltd.',
    tasksCompleted: 42,
    lastActivity: '4 minutes ago',
    avatarFallback: 'PA',
    description: 'Tracks purchase orders, coordinates logistics suppliers, reconciles line items, and resolves delivery exceptions.',
    autonomyLevel: 'Human in the Loop',
    authorizedTools: ['SAP S/4HANA Connector', 'Supplier Webhook Receiver', 'Invoice Matcher', 'Freight Estimator'],
    systemDirectives: [
      'Verify delivery window against contractual penalty clauses.',
      'Check alternative regional fulfillment hubs if delay exceeds 48 hours.',
      'Never commit price escalations without procurement lead sign-off.'
    ],
    latencyAvg: '240ms'
  },
  {
    id: 'agent-cust-ops',
    name: 'Customer Operations Agent',
    role: 'Client SLA & Communication',
    status: 'active',
    currentAssignment: 'Drafting proactive delivery notice for Vertex Health',
    tasksCompleted: 53,
    lastActivity: '1 minute ago',
    avatarFallback: 'CO',
    description: 'Maintains customer commitments, drafts context-aware incident notifications, and tracks client satisfaction.',
    autonomyLevel: 'Human in the Loop',
    authorizedTools: ['Salesforce CRM', 'Zendesk Ticket Sync', 'Email Draft Generator', 'SLA Calculator'],
    systemDirectives: [
      'Communicate proactively before client inquires.',
      'Tone must be transparent, calm, and solution-focused.',
      'Include revised delivery estimates with 95% confidence intervals.'
    ],
    latencyAvg: '310ms'
  },
  {
    id: 'agent-doc-intel',
    name: 'Document Intelligence Agent',
    role: 'OCR, Extraction & Validation',
    status: 'idle',
    currentAssignment: 'Standing by for incoming bill of lading & customs forms',
    tasksCompleted: 67,
    lastActivity: '18 minutes ago',
    avatarFallback: 'DI',
    description: 'Extracts tabular line items, verifies tax compliance, and flags discrepancies between contracts and purchase orders.',
    autonomyLevel: 'Full Autonomy',
    authorizedTools: ['Deep OCR Engine', 'Tax Compliance Matcher', 'PDF Line Parser', 'Contract Diff'],
    systemDirectives: [
      'Flag any VAT rate deviation > 0.05% for compliance review.',
      'Normalize multi-currency pricing to corporate standard (USD/EUR).'
    ],
    latencyAvg: '420ms'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'TSK-1042',
    title: 'Supplier Delay Resolution — PO-2026-1042',
    objective: 'Resolve 3-day transit delay on medical-grade sensors from Nordic Freight Ltd without breaching Vertex Health contract SLA.',
    description: 'Nordic Freight alerted a customs hold in Rotterdam for vessel MV Nordic Star carrying PO-2026-1042. ORCHESTRA investigated cargo contents, identified critical client commitments, evaluated air freight rerouting, and prepared a structured customer notification for executive sign-off.',
    assignedAgentId: 'agent-procure',
    assignedAgentName: 'Procurement Agent',
    status: 'awaiting_approval',
    priority: 'critical',
    createdAt: 'Today, 09:41',
    updatedAt: 'Today, 09:46',
    dueDate: 'Today, 12:00',
    humanReviewer: 'Mohammed Al-Hashimi',
    executionSteps: [
      { id: 's1', text: 'New supplier notification received from Nordic Freight EDI gateway', status: 'completed', timestamp: '09:41' },
      { id: 's2', text: 'Extracted order manifest & purchase order PO-2026-1042 line items', status: 'completed', timestamp: '09:42' },
      { id: 's3', text: 'Cross-referenced SAP ERP records; identified 72-hour port delay', status: 'completed', timestamp: '09:43' },
      { id: 's4', text: 'Audited customer delivery commitments; Vertex Health SLA flagged', status: 'completed', timestamp: '09:44' },
      { id: 's5', text: 'Formulated mitigation options: Sea-to-Air transfer vs. split shipment', status: 'completed', timestamp: '09:45' },
      { id: 's6', text: 'Generated customer notification & contingency plan awaiting executive authorization', status: 'running', timestamp: '09:46' },
      { id: 's7', text: 'Dispatch approved communication & update ERP tracking state', status: 'pending', timestamp: 'Pending Approval' }
    ],
    evidence: [
      {
        title: 'Supplier EDI Transit Exception notice',
        type: 'document',
        refNumber: 'EDI-NF-99214',
        snippet: 'Rotterdam Port Terminal 4 container inspection delay. Estimated vessel departure rescheduled +72h.',
        date: 'Today, 09:40'
      },
      {
        title: 'Purchase Order Record PO-2026-1042',
        type: 'erp_record',
        refNumber: 'SAP-PO-1042',
        snippet: 'Value: $184,200. Line 1: Bio-sensors 4,000 units. Critical path for Q4 Assembly line.',
        date: 'Oct 24, 2026'
      },
      {
        title: 'Vertex Health Master Services Agreement — Clause 8.2',
        type: 'sla_policy',
        refNumber: 'MSA-VH-2025',
        snippet: 'Requires 48-hour advance notice of delivery variance to waive liquidated damages of $5,000/day.',
        date: 'Jan 15, 2025'
      }
    ],
    toolActivity: [
      { tool: 'SAP ERP Connector', action: 'getPurchaseOrder("PO-2026-1042")', params: 'includeLineItems=true', timestamp: '09:42:15', durationMs: 142, status: 'success' },
      { tool: 'Salesforce CRM Bridge', action: 'queryClientContract("Vertex Health")', params: 'activeOnly=true', timestamp: '09:43:08', durationMs: 215, status: 'success' },
      { tool: 'Freight Quoting Engine', action: 'calculateExpeditedAir("AMS-DXB")', params: 'weight=420kg', timestamp: '09:44:33', durationMs: 480, status: 'success' }
    ],
    approvalHistory: [
      { action: 'Approval Requested', timestamp: '09:46', by: 'Customer Operations Agent', note: 'Requires executive authorization before client dispatch.' }
    ],
    outcomeSummary: 'Pending executive sign-off on Approval #APP-7821. Action will notify Vertex Health and reserve air-freight contingency slot.'
  },
  {
    id: 'TSK-1041',
    title: 'Customer Inquiry Escalation — Apex Robotics',
    objective: 'Reconcile firmware delivery schedules and update enterprise support portal.',
    description: 'Apex Robotics reported discrepancy between automated shipment notices and received bill of lading for hardware batch #HB-990.',
    assignedAgentId: 'agent-cust-ops',
    assignedAgentName: 'Customer Operations Agent',
    status: 'executing',
    priority: 'high',
    createdAt: 'Today, 08:30',
    updatedAt: 'Today, 09:35',
    dueDate: 'Today, 14:00',
    humanReviewer: 'Sarah Jenkins',
    executionSteps: [
      { id: 's1', text: 'Zendesk ticket #4401 ingested and classified as high severity', status: 'completed', timestamp: '08:30' },
      { id: 's2', text: 'Retrieved serial numbers from Warehouse Management System (WMS)', status: 'completed', timestamp: '08:45' },
      { id: 's3', text: 'Contacting local logistics depot for manifest verification', status: 'running', timestamp: '09:30' },
      { id: 's4', text: 'Prepare consolidated delivery summary for Apex account team', status: 'pending', timestamp: 'Waiting' }
    ],
    evidence: [
      { title: 'Zendesk Ticket #4401', type: 'email_thread', refNumber: 'TKT-4401', snippet: 'Discrepancy in Box 4 serial numbers vs packing slip.', date: 'Today, 08:28' }
    ],
    toolActivity: [
      { tool: 'Zendesk API', action: 'fetchTicketDetails("4401")', params: 'attachments=true', timestamp: '08:31:02', durationMs: 190, status: 'success' }
    ],
    approvalHistory: []
  },
  {
    id: 'TSK-1040',
    title: 'Invoice Discrepancy Reconciliation — GlobalTech EMEA',
    objective: 'Reconcile 1.8% withholding tax mismatch on $62,000 professional services invoice.',
    description: 'Automated invoice validator flagged difference between standard VAT treatment and Gulf corporate withholding tax declaration.',
    assignedAgentId: 'agent-doc-intel',
    assignedAgentName: 'Document Intelligence Agent',
    status: 'completed',
    priority: 'medium',
    createdAt: 'Yesterday, 14:15',
    updatedAt: 'Today, 08:10',
    dueDate: 'Yesterday, 18:00',
    humanReviewer: 'Mohammed Al-Hashimi',
    executionSteps: [
      { id: 's1', text: 'PDF Invoice INV-2026-880 parsed via OCR', status: 'completed', timestamp: '14:15' },
      { id: 's2', text: 'Cross-checked against UAE Corporate Tax treaty guidelines', status: 'completed', timestamp: '14:22' },
      { id: 's3', text: 'Generated credit memo adjustor for $1,116 discrepancy', status: 'completed', timestamp: '14:40' },
      { id: 's4', text: 'ERP accounts payable updated and vendor confirmation transmitted', status: 'completed', timestamp: '08:10' }
    ],
    evidence: [
      { title: 'Invoice INV-2026-880', type: 'document', refNumber: 'INV-880', snippet: 'Original subtotal $62,000. Withholding tax rate applied 5% vs required 3.2%.', date: 'Oct 30, 2026' }
    ],
    toolActivity: [
      { tool: 'OCR Extraction', action: 'parseInvoiceTable("INV-880.pdf")', params: 'engine=deep_ocr_v3', timestamp: '14:16:40', durationMs: 820, status: 'success' }
    ],
    approvalHistory: [
      { action: 'Approved by Mohammed Al-Hashimi', timestamp: 'Yesterday, 16:30', by: 'Mohammed Al-Hashimi', note: 'Corrected calculation matches local tax treaty.' }
    ],
    outcomeSummary: 'Successfully reconciled. Credit memo issued and vendor ledger cleared with zero manual audit overhead.'
  },
  {
    id: 'TSK-1039',
    title: 'Automated Supplier Re-contracting Audit',
    objective: 'Review 18 annual tier-2 transport suppliers against new Q4 carbon emission and delivery SLA thresholds.',
    description: 'Analyzed vendor telemetry, fuel surcharges, and compliance certifications across EMEA corridors.',
    assignedAgentId: 'agent-procure',
    assignedAgentName: 'Procurement Agent',
    status: 'completed',
    priority: 'low',
    createdAt: 'Oct 29, 2026',
    updatedAt: 'Oct 30, 2026',
    dueDate: 'Nov 05, 2026',
    humanReviewer: 'Sarah Jenkins',
    executionSteps: [
      { id: 's1', text: 'Ingested 18 supplier compliance packages', status: 'completed', timestamp: 'Oct 29' },
      { id: 's2', text: 'Scored against ISO 14064 carbon standards', status: 'completed', timestamp: 'Oct 29' },
      { id: 's3', text: 'Generated vendor compliance matrix', status: 'completed', timestamp: 'Oct 30' }
    ],
    evidence: [
      { title: 'Emissions Audit Dossier', type: 'document', snippet: '16 of 18 suppliers met 2026 fleet electrification baseline.', date: 'Oct 30, 2026' }
    ],
    toolActivity: [],
    approvalHistory: [],
    outcomeSummary: 'Audit completed. Two suppliers placed on 30-day corrective action plans.'
  },
  {
    id: 'TSK-1038',
    title: 'Customs Clearance Exception — Dubai Airport Cargo Terminal',
    objective: 'Provide verified declaration documents for hazardous material declaration on battery cells.',
    description: 'Customs authority requested supplementary UN38.3 test summaries and MSDS certificates for air parcel DXB-4091.',
    assignedAgentId: 'agent-doc-intel',
    assignedAgentName: 'Document Intelligence Agent',
    status: 'failed',
    priority: 'high',
    createdAt: 'Oct 28, 2026',
    updatedAt: 'Oct 29, 2026',
    dueDate: 'Oct 29, 2026',
    humanReviewer: 'Alex Chen',
    executionSteps: [
      { id: 's1', text: 'Customs hold alert parsed from DACC portal', status: 'completed', timestamp: 'Oct 28' },
      { id: 's2', text: 'Queried document repository for supplier MSDS certificate', status: 'completed', timestamp: 'Oct 28' },
      { id: 's3', text: 'Supplier MSDS certificate was expired (dated 2023)', status: 'failed', timestamp: 'Oct 29' },
      { id: 's4', text: 'Escalated to human procurement officer for urgent supplier re-certification', status: 'completed', timestamp: 'Oct 29' }
    ],
    evidence: [
      { title: 'Expired MSDS Certificate', type: 'document', refNumber: 'MSDS-EXP-2023', snippet: 'Validity lapsed June 2026. Needs manufacturer re-issuance.', date: 'Oct 28, 2026' }
    ],
    toolActivity: [],
    approvalHistory: [],
    outcomeSummary: 'Operation paused: Required current 2026 manufacturer chemical safety sheet from battery supplier.'
  },
  {
    id: 'TSK-1037',
    title: 'Weekly Cross-Dock Inventory Reconciliation',
    objective: 'Reconcile barcoded pallet positions across Jebel Ali Freezone facility with Oracle WMS.',
    description: 'Automated nightly sync between automated guided vehicle (AGV) scan logs and enterprise inventory balance.',
    assignedAgentId: 'agent-ops-coord',
    assignedAgentName: 'Operations Coordinator',
    status: 'completed',
    priority: 'medium',
    createdAt: 'Oct 30, 2026',
    updatedAt: 'Today, 06:00',
    dueDate: 'Today, 07:00',
    humanReviewer: 'Alex Chen',
    executionSteps: [
      { id: 's1', text: 'Extracted 1,480 telemetry scans from AGV fleet', status: 'completed', timestamp: '05:30' },
      { id: 's2', text: 'Identified 3 misplaced pallets in Zone B-7', status: 'completed', timestamp: '05:45' },
      { id: 's3', text: 'Dispatched automated restack instruction to morning shift supervisor', status: 'completed', timestamp: '06:00' }
    ],
    evidence: [],
    toolActivity: [],
    approvalHistory: [],
    outcomeSummary: 'Reconciliation 100% complete. Zero missing stock units.'
  }
];

export const mockApprovals: Approval[] = [
  {
    id: 'APP-7821',
    title: 'Send supplier delay notification to customer',
    requestedAction: 'Send proactive delay advisory & revised delivery schedule to Vertex Health procurement team.',
    agentId: 'agent-cust-ops',
    agentName: 'Customer Operations Agent',
    businessContext: 'Purchase order delivery is delayed by three working days due to Rotterdam customs congestion.',
    reason: 'Purchase order delivery PO-2026-1042 has a 72-hour delay. Vertex Health contract requires 48-hour advance notice to avoid a $5,000/day penalty clause.',
    supportingEvidence: 'Purchase Order PO-2026-1042, Nordic Freight EDI Notice #99214, MSA Clause 8.2.',
    evidenceRef: 'PO-2026-1042',
    riskLevel: 'medium',
    timestamp: '12 minutes ago',
    status: 'pending',
    impactAnalysis: 'Prevents $15,000 penalty clause; provides customer 2 alternate shipment options (partial air freight vs consolidated sea).',
    linkedTaskId: 'TSK-1042'
  },
  {
    id: 'APP-7820',
    title: 'Authorize expedited air-freight surcharge ($1,850)',
    requestedAction: 'Disburse $1,850 carrier expedite surcharge to transfer 500 critical biosensors via Emirates SkyCargo.',
    agentId: 'agent-procure',
    agentName: 'Procurement Agent',
    businessContext: 'Mitigates total assembly line shutdown for hospital customer by splitting delivery.',
    reason: 'Partial shipment of 500 units arrives 4 days ahead of sea cargo, protecting customer patient-monitor production.',
    supportingEvidence: 'Emirates SkyCargo quote #EK-8812, Inventory consumption forecast.',
    evidenceRef: 'EK-QUOTE-8812',
    riskLevel: 'high',
    timestamp: '35 minutes ago',
    status: 'pending',
    impactAnalysis: 'Cost impact: +$1,850. Value protected: $184,200 contract and zero downtime penalty.',
    linkedTaskId: 'TSK-1042'
  },
  {
    id: 'APP-7819',
    title: 'Reissue invoice with corrected VAT withholding to GlobalTech',
    requestedAction: 'Issue amended invoice INV-2026-880-R1 reflecting 3.2% UAE-France bilateral tax treaty rate.',
    agentId: 'agent-doc-intel',
    agentName: 'Document Intelligence Agent',
    businessContext: 'Customer finance team requested adjustment before executing Q4 wire transfer.',
    reason: 'Initial automated bill applied default 5% withholding without reciprocal treaty certification.',
    supportingEvidence: 'French Tax Residence Certificate #FR-2026, UAE Ministry of Finance Treaty Circular.',
    evidenceRef: 'INV-880',
    riskLevel: 'low',
    timestamp: '2 hours ago',
    status: 'approved',
    impactAnalysis: 'Releases $62,000 trapped cash flow within current banking cycle.',
    reviewedAt: '1 hour ago',
    reviewerName: 'Mohammed Al-Hashimi'
  },
  {
    id: 'APP-7818',
    title: 'Grant temporary supplier portal access to Nordic Freight QA',
    requestedAction: 'Provision time-limited, read-only token to Nordic Freight technical auditor for cold-chain temperature telemetry logs.',
    agentId: 'agent-ops-coord',
    agentName: 'Operations Coordinator',
    businessContext: 'Audit required for ISO 13485 pharmaceutical transit compliance.',
    reason: 'Vendor needs to verify uninterrupted +4°C temperature log during maritime transfer.',
    supportingEvidence: 'Audit request docket #AUD-2026-19.',
    evidenceRef: 'AUD-2026-19',
    riskLevel: 'low',
    timestamp: '3 hours ago',
    status: 'approved',
    impactAnalysis: 'Zero write permissions; expires automatically in 24 hours.',
    reviewedAt: '2 hours ago',
    reviewerName: 'Mohammed Al-Hashimi'
  },
  {
    id: 'APP-7817',
    title: 'Override standard vendor payment terms for emergency fuel surcharge',
    requestedAction: 'Authorize Net-7 payment terms instead of Net-30 for Red Sea bunkering vendor.',
    agentId: 'agent-procure',
    agentName: 'Procurement Agent',
    businessContext: 'Unscheduled bunkering stop required during rerouted maritime cape route.',
    reason: 'Vendor requires upfront bunkering clearance for vessel bunkering in Salalah.',
    supportingEvidence: 'Vessel captain voyage plan #VOY-992.',
    evidenceRef: 'BUNKER-SALALAH',
    riskLevel: 'high',
    timestamp: 'Yesterday',
    status: 'rejected',
    impactAnalysis: 'Rejected: Treasury confirmed standard letter of credit must be utilized instead.',
    reviewedAt: 'Yesterday',
    reviewerName: 'Mohammed Al-Hashimi'
  }
];

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-supplier-delay',
    name: 'Supplier Delay Resolution',
    description: 'Autonomous exception handling for vendor shipping slips, customs holds, and port congestion.',
    assignedAgent: 'Procurement Agent',
    status: 'active',
    priority: 'critical',
    lastUpdated: '10 minutes ago',
    nodesCount: 9,
    executionsCount: 342,
    successRate: 98.2,
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Incoming Request', subtitle: 'EDI Notification or Vendor Email', status: 'completed', x: 80, y: 180 },
      { id: 'n2', type: 'extraction', title: 'Information Extraction', subtitle: 'Extract PO, dates & container IDs', status: 'completed', agent: 'Document Intelligence Agent', x: 280, y: 180 },
      { id: 'n3', type: 'retrieval', title: 'Business Record Retrieval', subtitle: 'Fetch SAP PO & Contract Terms', status: 'completed', agent: 'Operations Coordinator', x: 480, y: 180 },
      { id: 'n4', type: 'investigation', title: 'AI Investigation', subtitle: 'Analyze delay impact on SLAs', status: 'completed', agent: 'Procurement Agent', x: 680, y: 180 },
      { id: 'n5', type: 'plan', title: 'Execution Plan', subtitle: 'Evaluate Sea-Air split vs buffer stock', status: 'completed', agent: 'Operations Coordinator', x: 880, y: 180 },
      { id: 'n6', type: 'approval_gate', title: 'Approval Required?', subtitle: 'Executive authorization for client SLA notice', status: 'active', x: 1080, y: 180 },
      { id: 'n7', type: 'action', title: 'Execute Action', subtitle: 'Send customer notice & book freight slot', status: 'idle', agent: 'Customer Operations Agent', x: 1280, y: 180 },
      { id: 'n8', type: 'verify', title: 'Verify Outcome', subtitle: 'Confirm client read receipt & carrier booking', status: 'idle', x: 1480, y: 180 },
      { id: 'n9', type: 'completed', title: 'Completed', subtitle: 'Update ERP & Log Audit Trace', status: 'idle', x: 1680, y: 180 }
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', label: 'Structured Payload' },
      { id: 'e2-3', source: 'n2', target: 'n3', label: 'Entity IDs' },
      { id: 'e3-4', source: 'n3', target: 'n4', label: 'Order + SLA Records' },
      { id: 'e4-5', source: 'n4', target: 'n5', label: 'Variance Impact' },
      { id: 'e5-6', source: 'n5', target: 'n6', label: 'Plan & Risk Analysis' },
      { id: 'e6-7', source: 'n6', target: 'n7', label: 'Approved' },
      { id: 'e7-8', source: 'n7', target: 'n8', label: 'Dispatch Confirmation' },
      { id: 'e8-9', source: 'n8', target: 'n9', label: 'Resolution Verified' }
    ]
  },
  {
    id: 'wf-cust-followup',
    name: 'Customer Follow-up & SLA Protection',
    description: 'Proactively notifies enterprise clients before they experience order discrepancies or delivery variance.',
    assignedAgent: 'Customer Operations Agent',
    status: 'active',
    priority: 'high',
    lastUpdated: '1 hour ago',
    nodesCount: 7,
    executionsCount: 512,
    successRate: 99.4,
    nodes: [],
    edges: []
  },
  {
    id: 'wf-invoice-verify',
    name: 'Invoice Verification & Tax Reconciler',
    description: 'Multi-jurisdictional tax matching, line item cross-checks, and automatic credit adjustments.',
    assignedAgent: 'Document Intelligence Agent',
    status: 'active',
    priority: 'medium',
    lastUpdated: '2 hours ago',
    nodesCount: 8,
    executionsCount: 820,
    successRate: 97.6,
    nodes: [],
    edges: []
  },
  {
    id: 'wf-order-investigate',
    name: 'Order Status Investigation',
    description: 'Deep-dives into stuck purchase orders across freight forwarders, marine AIS tracking, and warehouses.',
    assignedAgent: 'Operations Coordinator',
    status: 'active',
    priority: 'high',
    lastUpdated: '3 hours ago',
    nodesCount: 6,
    executionsCount: 290,
    successRate: 96.1,
    nodes: [],
    edges: []
  },
  {
    id: 'wf-doc-processing',
    name: 'Document Processing & Ingestion',
    description: 'Extracts customs declarations, packing slips, phytosanitary certificates, and MSDS sheets into semantic graph.',
    assignedAgent: 'Document Intelligence Agent',
    status: 'active',
    priority: 'medium',
    lastUpdated: '5 hours ago',
    nodesCount: 6,
    executionsCount: 1140,
    successRate: 99.1,
    nodes: [],
    edges: []
  }
];

export const mockLiveTimeline: TimelineEvent[] = [
  {
    id: 'ev-1',
    time: '09:41',
    title: 'New supplier notification received',
    detail: 'Nordic Freight EDI gateway received webhook with transit status update for container MSCU-882194.',
    agent: 'Operations Coordinator',
    status: 'completed',
    tags: ['Webhook', 'EDI-Gateway']
  },
  {
    id: 'ev-2',
    time: '09:42',
    title: 'Extracting supplier and order information',
    detail: 'Identified vendor code #VND-882, purchase order reference PO-2026-1042, and Port of Rotterdam departure.',
    agent: 'Document Intelligence Agent',
    status: 'completed',
    tags: ['Entity Extraction', 'Regex Match']
  },
  {
    id: 'ev-3',
    time: '09:43',
    title: 'Retrieving purchase order PO-2026-1042',
    detail: 'Queried SAP S/4HANA ERP. Returned 4,000 units of medical sensors destined for Vertex Health assembly hub in Dubai.',
    agent: 'Procurement Agent',
    status: 'completed',
    tags: ['SAP-ERP', 'Query']
  },
  {
    id: 'ev-4',
    time: '09:43',
    title: 'Identified delivery delay',
    detail: 'Calculated 72-hour delay variance against contracted baseline delivery date of Nov 02, 2026.',
    agent: 'Procurement Agent',
    status: 'alert',
    tags: ['Variance Detected', '+72 Hours']
  },
  {
    id: 'ev-5',
    time: '09:44',
    title: 'Checking customer commitments',
    detail: 'Cross-referenced Vertex Health Master Services Agreement Clause 8.2: 48h advance notice mandatory to waive $5k/day penalty.',
    agent: 'Customer Operations Agent',
    status: 'completed',
    tags: ['Salesforce', 'SLA Policy']
  },
  {
    id: 'ev-6',
    time: '09:45',
    title: 'Preparing resolution plan',
    detail: 'Evaluated air cargo split (500 units via Emirates SkyCargo) to prevent hospital client line halt. Drafted transparent customer notification.',
    agent: 'Operations Coordinator',
    status: 'completed',
    tags: ['Plan Formulated', 'Mitigation']
  },
  {
    id: 'ev-7',
    time: '09:46',
    title: 'Waiting for human approval',
    detail: 'Generated Approval #APP-7821 for Mohammed Al-Hashimi (COO). Execution paused pending executive authorization.',
    agent: 'Customer Operations Agent',
    status: 'waiting',
    tags: ['Human in the Loop', 'Pending Approval']
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'ACT-9021',
    executionId: 'EX-98214-A',
    timestamp: 'Today, 09:46:12',
    actor: { name: 'Customer Operations Agent', type: 'agent' },
    action: 'DISPATCH_APPROVAL_REQUEST',
    resource: 'Approval #APP-7821 (Customer Delay Notice)',
    result: 'success',
    details: {
      targetId: 'APP-7821',
      description: 'Submitted approval card to Executive Dashboard for Mohammed Al-Hashimi.',
      metadata: { priority: 'Critical', contractRef: 'MSA-VH-2025' }
    }
  },
  {
    id: 'ACT-9020',
    executionId: 'EX-98214-A',
    timestamp: 'Today, 09:44:50',
    actor: { name: 'Procurement Agent', type: 'agent' },
    action: 'QUERY_FREIGHT_SCHEDULES',
    resource: 'Carrier API: Emirates SkyCargo',
    result: 'success',
    details: {
      description: 'Retrieved expedited air quotes for 500kg urgent split allocation.',
      metadata: { quoteAmount: '$1,850', flight: 'EK-078' }
    }
  },
  {
    id: 'ACT-9019',
    executionId: 'EX-98102-C',
    timestamp: 'Today, 09:30:00',
    actor: { name: 'Mohammed Al-Hashimi', type: 'user' },
    action: 'APPROVE_SECURITY_POLICY',
    resource: 'Nordic Freight QA Portal Token',
    result: 'success',
    details: {
      description: 'Authorized 24-hour read-only temperature telemetry access token.',
      metadata: { securityLevel: 'Tier-1 Restricted' }
    }
  },
  {
    id: 'ACT-9018',
    executionId: 'EX-98012-D',
    timestamp: 'Today, 08:10:44',
    actor: { name: 'Document Intelligence Agent', type: 'agent' },
    action: 'RECONCILE_INVOICE_LEDGER',
    resource: 'Invoice INV-2026-880',
    result: 'success',
    details: {
      description: 'Adjusted withholding tax ledger and generated French-UAE reciprocal treaty certificate.',
      metadata: { deltaAmount: '$1,116', ledgerCode: 'AP-4100' }
    }
  },
  {
    id: 'ACT-9017',
    executionId: 'EX-97992-B',
    timestamp: 'Yesterday, 18:22:10',
    actor: { name: 'Operations Coordinator', type: 'agent' },
    action: 'BLOCK_UNAUTHORIZED_SURCHARGE',
    resource: 'Vendor #BUNKER-SALALAH',
    result: 'blocked',
    details: {
      description: 'Blocked Net-7 emergency disbursement exceeding $25k autonomy policy limit.',
      metadata: { reason: 'Requires Board Treasury Sign-off' }
    }
  },
  {
    id: 'ACT-9016',
    executionId: 'EX-97880-F',
    timestamp: 'Yesterday, 16:45:00',
    actor: { name: 'Sarah Jenkins', type: 'user' },
    action: 'UPDATE_SUPPLIER_SCORECARD',
    resource: 'Nordic Freight Ltd.',
    result: 'success',
    details: {
      description: 'Adjusted Q4 on-time delivery score from 98.4% to 94.1%.',
      metadata: { reviewer: 'Sarah Jenkins, Procurement Director' }
    }
  }
];

export const mockIntegrations: Integration[] = [
  {
    id: 'int-gmail',
    name: 'Gmail & Google Workspace',
    category: 'communication',
    icon: 'Mail',
    description: 'Autonomous email triage, draft preparation, supplier correspondence, and customer escalation routing.',
    status: 'connected',
    lastSync: '1 minute ago',
    permissionsCount: 8,
    authType: 'Enterprise OAuth 2.0'
  },
  {
    id: 'int-slack',
    name: 'Slack Enterprise Grid',
    category: 'communication',
    icon: 'MessageSquare',
    description: 'Operations channel dispatch, urgent interactive approval cards, and agent investigation status notifications.',
    status: 'connected',
    lastSync: '2 minutes ago',
    permissionsCount: 6,
    authType: 'Bot Token'
  },
  {
    id: 'int-outlook',
    name: 'Microsoft Outlook 365',
    category: 'communication',
    icon: 'MailCheck',
    description: 'Corporate calendar coordination, executive meeting scheduling for vendor disputes, and formal audit notices.',
    status: 'connected',
    lastSync: '10 minutes ago',
    permissionsCount: 7,
    authType: 'Azure AD App'
  },
  {
    id: 'int-sap',
    name: 'SAP S/4HANA Cloud',
    category: 'business',
    icon: 'Database',
    description: 'Master purchase order data, goods receipts, accounts payable vouchers, and bill of materials queries.',
    status: 'connected',
    lastSync: 'Live Connector',
    permissionsCount: 14,
    authType: 'Mutual TLS API'
  },
  {
    id: 'int-salesforce',
    name: 'Salesforce CRM',
    category: 'business',
    icon: 'Users',
    description: 'Client account SLAs, executive contacts, opportunity pipelines, and support case synchronization.',
    status: 'connected',
    lastSync: '5 minutes ago',
    permissionsCount: 9,
    authType: 'Connected App'
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot',
    category: 'business',
    icon: 'Compass',
    description: 'Inbound marketing inquiry routing, customer onboarding tracking, and feedback loop capture.',
    status: 'available',
    permissionsCount: 5,
    authType: 'Private App Token'
  },
  {
    id: 'int-gdrive',
    name: 'Google Drive',
    category: 'storage',
    icon: 'FolderSync',
    description: 'Ingestion directory for vendor contracts, freight packing slips, regulatory MSDS sheets, and export licenses.',
    status: 'connected',
    lastSync: '15 minutes ago',
    permissionsCount: 6,
    authType: 'Service Account'
  },
  {
    id: 'int-onedrive',
    name: 'Microsoft OneDrive / SharePoint',
    category: 'storage',
    icon: 'HardDrive',
    description: 'Enterprise compliance repository, board policy guidelines, and standard operating procedure manuals.',
    status: 'available',
    permissionsCount: 6,
    authType: 'Microsoft Graph'
  },
  {
    id: 'int-shopify',
    name: 'Shopify Plus B2B',
    category: 'productivity',
    icon: 'ShoppingBag',
    description: 'Fulfillment order sync, wholesale inventory allocations, and direct-to-retailer tracking notices.',
    status: 'available',
    permissionsCount: 7,
    authType: 'Custom App API'
  },
  {
    id: 'int-stripe',
    name: 'Stripe Billing & Payments',
    category: 'finance',
    icon: 'CreditCard',
    description: 'Invoice settlements, foreign exchange wire triggers, and vendor fee reconciliations.',
    status: 'connected',
    lastSync: '3 minutes ago',
    permissionsCount: 8,
    authType: 'Restricted Key'
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business API',
    category: 'communication',
    icon: 'PhoneCall',
    description: 'Instant mobile alerts for urgent field delivery exceptions and regional driver confirmations.',
    status: 'available',
    permissionsCount: 4,
    authType: 'Meta Cloud API'
  },
  {
    id: 'int-zoho',
    name: 'Zoho Books',
    category: 'finance',
    icon: 'Receipt',
    description: 'Secondary regional subsidiary accounting sync and tax voucher filing.',
    status: 'available',
    permissionsCount: 5,
    authType: 'OAuth 2.0'
  }
];

export const mockKnowledgeDocs: KnowledgeDoc[] = [
  {
    id: 'doc-sop-01',
    title: 'Standard Operating Procedure: Maritime Freight Exception Protocols',
    category: 'sop',
    status: 'indexed',
    lastUpdated: 'Oct 20, 2026',
    size: '1.4 MB',
    fileType: 'PDF',
    vectorChunks: 64,
    excerpt: 'Defines mandatory escalation thresholds for vessel deviations exceeding 48 hours, demurrage risk formulas, and insurance claim triggers.',
    linkedAgents: ['Procurement Agent', 'Operations Coordinator'],
    contentPreview: `STANDARD OPERATING PROCEDURE: MARITIME LOGISTICS EXCEPTION MANAGEMENT
Document ID: SOP-OPS-2026-042 | Version 3.1
Effective Date: October 1, 2026 | Authority: Chief Operating Officer

1. PURPOSE & SCOPE
This document prescribes automated protocols when carrier telematics or port authority EDI messages indicate arrival delays exceeding 48 hours for contracted ocean freight.

2. MANDATORY ESCALATION PATHS
2.1 When carrier delay delta is <= 48 hours: Automated schedule update transmitted to warehouse receiving dock. No client communication required unless flagged critical.
2.2 When carrier delay delta is > 48 hours: Procurement Agent initiates immediate contract cross-reference against customer MSA SLAs.
2.3 If customer SLA contains liquidated damages: An expedited mitigation plan (air cargo split or regional warehouse swap) must be formulated within 60 minutes and routed to COO for authorization.`
  },
  {
    id: 'doc-po-1042',
    title: 'Purchase Order Manifest PO-2026-1042 (Nordic Freight Ltd.)',
    category: 'purchase_order',
    status: 'indexed',
    lastUpdated: 'Oct 24, 2026',
    size: '840 KB',
    fileType: 'PDF',
    vectorChunks: 28,
    excerpt: 'Line item manifest for 4,000 units of medical biometric sensor assemblies, container MSCU-882194, Port of Rotterdam to Jebel Ali Port.',
    linkedAgents: ['Procurement Agent', 'Document Intelligence Agent'],
    contentPreview: `PURCHASE ORDER: PO-2026-1042
Issued By: Acme Global Logistics & Trade | Vendor: Nordic Freight Ltd. (Helsinki)
Vessel: MV Nordic Star | Container: MSCU-882194

Line 1: Model BS-900 Medical Biosensor Module | Quantity: 4,000 units | Unit Price: $46.05 | Total: $184,200.00
Incoterms: CIF Jebel Ali | Packaging: Temperature-controlled cold chain (+2°C to +8°C)
Customer Allocation: Vertex Health Care Systems (PO Ref: VH-Q4-MED)`
  },
  {
    id: 'doc-sla-vertex',
    title: 'Customer Master Services Agreement — Vertex Health Care Systems',
    category: 'customer',
    status: 'indexed',
    lastUpdated: 'Jan 15, 2025',
    size: '2.8 MB',
    fileType: 'PDF',
    vectorChunks: 142,
    excerpt: 'Section 8: Delivery commitments, force majeure exclusions, and Clause 8.2 advance notification requirements for medical equipment lines.',
    linkedAgents: ['Customer Operations Agent', 'Operations Coordinator'],
    contentPreview: `MASTER SERVICES AGREEMENT: SECTION 8 (DELIVERY & LIQUIDATED DAMAGES)
Between Acme Global Logistics ('Supplier') and Vertex Health Care Systems ('Client')

8.1 Time is of the essence regarding critical clinical manufacturing supplies.
8.2 Notice of Variance: Supplier shall provide written notice of any forecasted delivery delay exceeding twenty-four (24) hours immediately upon discovery, and in all events no later than forty-eight (48) hours prior to the scheduled delivery date.
8.3 Liquidated Damages: Failure to provide timely notice under Clause 8.2 shall incur liquidated damages of USD $5,000 per calendar day of delay until full delivery is accomplished.`
  },
  {
    id: 'doc-policy-tax',
    title: 'Corporate Withholding Tax Harmonization Policy (UAE & EMEA Corridors)',
    category: 'policy',
    status: 'indexed',
    lastUpdated: 'Aug 14, 2026',
    size: '1.1 MB',
    fileType: 'PDF',
    vectorChunks: 48,
    excerpt: 'Detailed rate tables for cross-border engineering services, tax residency certificate verification, and VAT offset schedules.',
    linkedAgents: ['Document Intelligence Agent'],
    contentPreview: `TAX COMPLIANCE BRIEF: CROSS-BORDER WITHHOLDING ADJUSTMENTS
Reference: MOF-TAX-2026-CIRCULAR-14

Under bilateral double taxation agreements between the UAE and EU member states:
Standard withholding on cross-border technical consulting is capped at 3.2% where certified Tax Residence Certificates (TRC) are furnished within 90 days of invoice date. The Document Intelligence Agent is authorized to automatically apply treaty rates upon cryptographic validation of TRC digital signatures.`
  },
  {
    id: 'doc-supp-nordic',
    title: 'Supplier Profile & Master Agreement: Nordic Freight Ltd.',
    category: 'supplier',
    status: 'indexed',
    lastUpdated: 'Sep 01, 2026',
    size: '950 KB',
    fileType: 'PDF',
    vectorChunks: 36,
    excerpt: 'Fleet ratings, primary logistics lanes, insurance coverage limits ($10M maritime liability), and escalation contacts.',
    linkedAgents: ['Procurement Agent'],
    contentPreview: `SUPPLIER PROFILE: NORDIC FREIGHT LTD
Vendor ID: VND-882 | Registry: Helsinki Commercial Court #778-912
Key Contacts:
- Maritime Operations Desk: ops-rotterdam@nordicfreight.eu (+31 10 599 0122)
- Account Executive: Maren Lindqvist (maren.l@nordicfreight.eu)
Primary Corridors: Baltic Sea, North Sea to Gulf/Indian Ocean`
  },
  {
    id: 'doc-sop-customs',
    title: 'Dubai Customs Single Window Electronic Documentation Guidelines',
    category: 'operational',
    status: 'review_required',
    lastUpdated: 'Oct 28, 2026',
    size: '3.2 MB',
    fileType: 'PDF',
    vectorChunks: 82,
    excerpt: 'Updated Mirsal II declaration guidelines for lithium storage cells, dangerous goods classification, and inspection fast-track protocols.',
    linkedAgents: ['Document Intelligence Agent', 'Operations Coordinator'],
    contentPreview: `DUBAI CUSTOMS NOTICE: DACC / MIRSAL II COMPLIANCE
Directive Ref: DC-2026-NOT-88

Effective November 1, 2026: All air cargo imports containing UN3480 / UN3481 lithium-ion battery cells require dual-signoff chemical safety datasheets (MSDS) dated within the preceding 12 calendar months. Older certificates will trigger automated physical hold at Dubai Cargo Village.`
  }
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Executive Approval Required',
    description: 'Customer Operations Agent submitted Approval #APP-7821 for PO-2026-1042 customer delay notice.',
    time: '12m ago',
    read: false,
    type: 'approval',
    linkTab: 'approvals',
    linkId: 'APP-7821'
  },
  {
    id: 'notif-2',
    title: 'Expedited Air Freight Surcharge Proposed',
    description: 'Procurement Agent requests $1,850 sign-off for Emirates SkyCargo split shipment.',
    time: '35m ago',
    read: false,
    type: 'approval',
    linkTab: 'approvals',
    linkId: 'APP-7820'
  },
  {
    id: 'notif-3',
    title: 'Invoice Discrepancy Reconciled',
    description: 'Document Intelligence Agent finalized $1,116 credit memo for GlobalTech invoice #INV-880.',
    time: '2h ago',
    read: true,
    type: 'task',
    linkTab: 'tasks',
    linkId: 'TSK-1040'
  },
  {
    id: 'notif-4',
    title: 'AGV Inventory Sync Complete',
    description: '1,480 automated pallet scans verified across Jebel Ali Zone B with 100% integrity.',
    time: '4h ago',
    read: true,
    type: 'system',
    linkTab: 'activity'
  }
];

export const mockTeamMembers = [
  {
    id: 'usr-1',
    name: 'Mohammed Al-Hashimi',
    role: 'Chief Operating Officer',
    email: 'mohammed.alhashimi@orchestra-ops.io',
    avatarUrl: '/src/assets/images/avatar_mohammed_executive_1793515308593.jpg',
    accessLevel: 'Super Administrator',
    status: 'online',
    lastActive: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    role: 'VP of Global Procurement',
    email: 'sarah.jenkins@orchestra-ops.io',
    avatarUrl: '/src/assets/images/avatar_sarah_procurement_1793515310632.jpg',
    accessLevel: 'Operations Lead',
    status: 'online',
    lastActive: '5m ago'
  },
  {
    id: 'usr-3',
    name: 'Alex Chen',
    role: 'Head of Supply Chain & Fulfillment',
    email: 'alex.chen@orchestra-ops.io',
    avatarUrl: '/src/assets/images/avatar_alex_logistics_1793515310542.jpg',
    accessLevel: 'Operations Lead',
    status: 'offline',
    lastActive: '2h ago'
  },
  {
    id: 'usr-4',
    name: 'Fatima Al-Mansouri',
    role: 'Director of Customer Experience & SLAs',
    email: 'fatima.m@orchestra-ops.io',
    avatarFallback: 'FM',
    accessLevel: 'Operations Reviewer',
    status: 'online',
    lastActive: '12m ago'
  }
];

export const mockPerformanceCharts = {
  tasksOverTime: [
    { day: 'Mon', completed: 28, automated: 25, manual: 3 },
    { day: 'Tue', completed: 34, automated: 31, manual: 3 },
    { day: 'Wed', completed: 38, automated: 35, manual: 3 },
    { day: 'Thu', completed: 42, automated: 39, manual: 3 },
    { day: 'Fri', completed: 48, automated: 44, manual: 4 },
    { day: 'Sat', completed: 36, automated: 34, manual: 2 },
    { day: 'Sun', completed: 22, automated: 21, manual: 1 }
  ],
  resolutionTimeHours: [
    { month: 'Jun', hours: 4.8 },
    { month: 'Jul', hours: 3.9 },
    { month: 'Aug', hours: 2.7 },
    { month: 'Sep', hours: 1.8 },
    { month: 'Oct', hours: 0.8 }
  ],
  workflowDistribution: [
    { name: 'Supplier Delay', count: 342, percentage: 36 },
    { name: 'Customer Follow-up', count: 284, percentage: 30 },
    { name: 'Invoice Verification', count: 182, percentage: 19 },
    { name: 'Order Investigation', count: 142, percentage: 15 }
  ],
  bottlenecks: [
    { stage: 'OCR & Parsing', avgMs: 420, rate: '99.8%' },
    { stage: 'ERP Data Pull', avgMs: 240, rate: '99.2%' },
    { stage: 'Investigation', avgMs: 890, rate: '98.6%' },
    { stage: 'Human Approval', avgMs: 14200, rate: '94.2%' },
    { stage: 'Dispatch Action', avgMs: 310, rate: '99.9%' }
  ]
};
