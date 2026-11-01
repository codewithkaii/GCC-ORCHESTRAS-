import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Send, 
  Loader2, 
  Database, 
  Search, 
  FileText, 
  Check, 
  Play, 
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  FileSearch,
  Activity,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimelineEvent, TaskStatus } from '../types';

interface OperationPlanStep {
  id: string;
  stepNumber: number;
  title: string;
  agent: string;
  agentFallback: string;
  status: 'completed' | 'executing' | 'awaiting_approval' | 'pending';
  timestamp: string;
  summary: string;
  toolUsed?: string;
  requiresHuman?: boolean;
}

interface OperationToolCall {
  id: string;
  timestamp: string;
  agent: string;
  tool: string;
  service: string;
  params: string;
  durationMs: number;
  status: 'success' | 'warning' | 'in_progress';
  resultSummary: string;
}

interface OperationEvidence {
  id: string;
  title: string;
  category: 'ERP Record' | 'EDI Payload' | 'SLA Contract' | 'Sensor Telemetry';
  refNumber: string;
  date: string;
  excerpt: string;
  verified: boolean;
}

interface OperationInvariant {
  id: string;
  title: string;
  constraint: string;
  status: 'satisfied' | 'enforced' | 'in_progress';
  verificationDetail: string;
}

interface AutonomousOperation {
  id: string;
  title: string;
  objective: string;
  primaryAgent: string;
  customerOrResource: string;
  status: 'awaiting_approval' | 'executing' | 'completed';
  phase: string;
  phaseNumber: number;
  totalPhases: number;
  linkedApprovalId?: string;
  linkedTaskId?: string;
  eta: string;
  planSteps: OperationPlanStep[];
  toolCalls: OperationToolCall[];
  evidence: OperationEvidence[];
  invariants: OperationInvariant[];
}

export const OperationsPage: React.FC = () => {
  const { 
    agents, 
    liveTimeline, 
    dispatchOperationCommand, 
    isExecutingCommand, 
    activeCommandLog,
    setSelectedAgentId,
    setActiveTab,
    setSelectedApprovalId,
    setSelectedTaskId,
    approvals,
    approveApproval,
    rejectApproval,
    addToast
  } = useApp();

  const [commandInput, setCommandInput] = useState('');
  const [selectedOperationId, setSelectedOperationId] = useState<string>('OP-8821');
  const [activeCommandTab, setActiveCommandTab] = useState<'plan' | 'tools' | 'evidence' | 'invariants'>('plan');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'tools' | 'evidence' | 'checkpoints'>('all');
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>('EV-01');

  // Realistic Autonomous Operations Dossiers
  const operations: AutonomousOperation[] = useMemo(() => [
    {
      id: 'OP-8821',
      title: 'Rotterdam Port Delay & Cold-Chain SLA Mitigation',
      objective: 'Avert $5,000/day SLA penalty and supply line halt for Vertex Health Dubai assembly hub following 72h marine freight delay.',
      primaryAgent: 'Operations Coordinator',
      customerOrResource: 'Vertex Health UAE · PO-2026-1042',
      status: 'awaiting_approval',
      phase: 'Human Authorization Gateway',
      phaseNumber: 5,
      totalPhases: 6,
      linkedApprovalId: 'APP-7821',
      linkedTaskId: 'TSK-1042',
      eta: 'Awaiting COO Sign-off',
      planSteps: [
        {
          id: 's1',
          stepNumber: 1,
          title: 'EDI Ingestion & Anomaly Detection',
          agent: 'Operations Coordinator',
          agentFallback: 'OC',
          status: 'completed',
          timestamp: '09:41 GST',
          summary: 'Received Nordic Freight carrier webhook. Detected 72-hour marine ETA variance on container MSCU-882194.',
          toolUsed: 'nordic_freight_edi_stream'
        },
        {
          id: 's2',
          stepNumber: 2,
          title: 'Structured Order Extraction',
          agent: 'Document Intelligence Agent',
          agentFallback: 'DI',
          status: 'completed',
          timestamp: '09:42 GST',
          summary: 'Vectorized bill of lading. Matched purchase order PO-2026-1042, vendor #VND-882, and Rotterdam ECT terminal berth.',
          toolUsed: 'pdf_vector_entity_extractor'
        },
        {
          id: 's3',
          stepNumber: 3,
          title: 'ERP & Customer Commitment Cross-Reference',
          agent: 'Procurement Agent',
          agentFallback: 'PA',
          status: 'completed',
          timestamp: '09:43 GST',
          summary: 'Queried SAP S/4HANA: 4,000 medical temperature sensors. Cross-referenced Vertex Health Master Services Agreement Clause 8.2.',
          toolUsed: 'sap_s4hana_po_query'
        },
        {
          id: 's4',
          stepNumber: 4,
          title: 'Expedited Split-Freight Feasibility Study',
          agent: 'Operations Coordinator',
          agentFallback: 'OC',
          status: 'completed',
          timestamp: '09:44 GST',
          summary: 'Queried Emirates SkyCargo booking API for 500 units air split ($1,850). Calculated hospital surgery buffer cushion: +48 hours.',
          toolUsed: 'skycargo_schedule_quote_engine'
        },
        {
          id: 's5',
          stepNumber: 5,
          title: 'Human Authorization Gate (Executive Review)',
          agent: 'Customer Operations Agent',
          agentFallback: 'CO',
          status: 'awaiting_approval',
          timestamp: '09:46 GST',
          summary: 'Approval #APP-7821 submitted to Mohammed Al-Hashimi (COO). Authorize $1,850 split disbursement & client notification.',
          toolUsed: 'executive_approval_router',
          requiresHuman: true
        },
        {
          id: 's6',
          stepNumber: 6,
          title: 'Dispatch Client Notice & Airway Booking',
          agent: 'Customer Operations Agent',
          agentFallback: 'CO',
          status: 'pending',
          timestamp: 'Standby',
          summary: 'Transmit transparent delay memo via WhatsApp Business API & book EK-078 air cargo slot upon authorization.',
          toolUsed: 'whatsapp_business_dispatch'
        }
      ],
      toolCalls: [
        {
          id: 'TC-101',
          timestamp: '09:41:22',
          agent: 'Operations Coordinator',
          tool: 'edi_webhook_listen',
          service: 'Nordic Freight Gateway',
          params: 'container="MSCU-882194", port="RTM"',
          durationMs: 42,
          status: 'success',
          resultSummary: 'Returned status: Delayed due to storm system North Sea (+72h)'
        },
        {
          id: 'TC-102',
          timestamp: '09:42:05',
          agent: 'Document Intelligence Agent',
          tool: 'ocr_entity_extract',
          service: 'Semantic Document Graph',
          params: 'doc_id="BOL-MSCU-882194.pdf", target="PO_NUMBER"',
          durationMs: 310,
          status: 'success',
          resultSummary: 'Confidence: 0.998. Extracted PO-2026-1042'
        },
        {
          id: 'TC-103',
          timestamp: '09:43:18',
          agent: 'Procurement Agent',
          tool: 'sap_s4hana_po_query',
          service: 'SAP S/4HANA Cloud',
          params: 'po_id="PO-2026-1042", company_code="1000"',
          durationMs: 148,
          status: 'success',
          resultSummary: 'Returned 4,000 units BioSens-X200, Dest: Dubai Freezone'
        },
        {
          id: 'TC-104',
          timestamp: '09:44:02',
          agent: 'Procurement Agent',
          tool: 'salesforce_sla_lookup',
          service: 'Salesforce CRM',
          params: 'account_id="ACC-VERTEX-01", clause="8.2_LIQ_DAMAGES"',
          durationMs: 96,
          status: 'success',
          resultSummary: 'Liquidated damages $5,000/day waived if 48h notice provided'
        },
        {
          id: 'TC-105',
          timestamp: '09:44:50',
          agent: 'Operations Coordinator',
          tool: 'skycargo_quote_engine',
          service: 'Emirates SkyCargo API',
          params: 'origin="AMS", dest="DXB", weight_kg=120, flight="EK-078"',
          durationMs: 235,
          status: 'success',
          resultSummary: 'Confirmed quote $1,850. Space held for 60 minutes'
        }
      ],
      evidence: [
        {
          id: 'EV-01',
          title: 'Carrier EDI Delay Notice (MSCU-882194)',
          category: 'EDI Payload',
          refNumber: 'EDI-RTM-882194',
          date: 'Nov 01, 2026 · 09:40 GST',
          excerpt: 'Vessel MSC ANNA voyage 264W delayed berth entry at ECT Delta Terminal Rotterdam due to force majeure gale conditions. Estimated departure revised to Nov 05, 2026 14:00 CET.',
          verified: true
        },
        {
          id: 'EV-02',
          title: 'SAP Purchase Order PO-2026-1042 Line Items',
          category: 'ERP Record',
          refNumber: 'SAP-PO-2026-1042',
          date: 'Oct 14, 2026',
          excerpt: 'Line 001: 4,000 EA Medical Grade Temperature Sensors (SKU #MED-TS-88). Total value: $148,000.00. Destination: Dubai Healthcare City Assembly Hub.',
          verified: true
        },
        {
          id: 'EV-03',
          title: 'Vertex Health MSA Master Contract — Clause 8.2',
          category: 'SLA Contract',
          refNumber: 'MSA-VH-2025-C8',
          date: 'Jan 15, 2025',
          excerpt: 'Supplier warrants delivery on or before contracted dates. In the event of transit delay, Supplier shall notify Purchaser in writing within 48 hours of carrier notification to avert contractual liquidated damages ($5,000/calendar day).',
          verified: true
        },
        {
          id: 'EV-04',
          title: 'Emirates SkyCargo Slot Hold & Flight Allocation',
          category: 'Sensor Telemetry',
          refNumber: 'EK-AWB-078-HLD',
          date: 'Nov 01, 2026 · 09:44 GST',
          excerpt: 'Flight EK-078 (Amsterdam Schiphol to Dubai International). 500 units / 120 kg allocated in Temperature Controlled Cargo Bay 2 (+2°C to +8°C). Confirmed rate: $1,850 USD.',
          verified: true
        }
      ],
      invariants: [
        {
          id: 'INV-1',
          title: 'Executive Financial Threshold Constraint',
          constraint: 'Autonomous disbursement must not exceed $500 without COO authorization.',
          status: 'enforced',
          verificationDetail: 'Air freight quote is $1,850. Enforced mandatory human-in-the-loop checkpoint #APP-7821.'
        },
        {
          id: 'INV-2',
          title: 'Customer Contractual Notice Window',
          constraint: 'Written notice must reach customer within 48h of carrier delay event.',
          status: 'satisfied',
          verificationDetail: 'Carrier delay logged 09:41 GST. Notification drafted 09:45 GST. Lead time remaining: 47h 56m.'
        },
        {
          id: 'INV-3',
          title: 'Cold-Chain Environmental Envelope (+2°C to +8°C)',
          constraint: 'Medical sensor batch requires continuous pharma cold-chain integrity.',
          status: 'satisfied',
          verificationDetail: 'SkyCargo booking confirmed active cooling container specification code RAP-e2.'
        }
      ]
    },
    {
      id: 'OP-8822',
      title: 'Jebel Ali Cargo Hold & HS Tariff Cross-Check',
      objective: 'Resolve electronic customs hold on 12 container pallets held at Dubai Jebel Ali Freezone Berth 4.',
      primaryAgent: 'Document Intelligence Agent',
      customerOrResource: 'Customs Clearance · Container JBAL-4412',
      status: 'executing',
      phase: 'Autonomous Classification & Filing',
      phaseNumber: 3,
      totalPhases: 5,
      eta: '4.5 min remaining',
      planSteps: [
        {
          id: 's2-1',
          stepNumber: 1,
          title: 'Customs Hold Ingestion',
          agent: 'Document Intelligence Agent',
          agentFallback: 'DI',
          status: 'completed',
          timestamp: '08:30 GST',
          summary: 'Ingested Dubai Customs electronic hold notification #DC-9811 for HS tariff discrepancy.',
          toolUsed: 'dubai_customs_mirsal2_api'
        },
        {
          id: 's2-2',
          stepNumber: 2,
          title: 'MSDS & Technical Datasheet Semantic Audit',
          agent: 'Document Intelligence Agent',
          agentFallback: 'DI',
          status: 'completed',
          timestamp: '08:32 GST',
          summary: 'Scanned 48-page chemical composition dossier. Re-classified tariff code from 2933.99 to 2934.10.',
          toolUsed: 'vector_rag_policy_query'
        },
        {
          id: 's2-3',
          stepNumber: 3,
          title: 'Automated Amended Declaration Dispatch',
          agent: 'Document Intelligence Agent',
          agentFallback: 'DI',
          status: 'executing',
          timestamp: '08:35 GST',
          summary: 'Submitting amended e-Mirsal II customs declaration with attached cryptographic audit certificates.',
          toolUsed: 'mirsal2_declaration_submit'
        },
        {
          id: 's2-4',
          stepNumber: 4,
          title: 'Gate Pass Release Verification',
          agent: 'Operations Coordinator',
          agentFallback: 'OC',
          status: 'pending',
          timestamp: 'Expected 08:42 GST',
          summary: 'Confirm automated release barcode issuance from Dubai Trade portal and notify bonded logistics team.',
          toolUsed: 'dubai_trade_gatepass_query'
        }
      ],
      toolCalls: [
        {
          id: 'TC-201',
          timestamp: '08:30:11',
          agent: 'Document Intelligence Agent',
          tool: 'mirsal2_hold_poll',
          service: 'Dubai Customs Mirsal II',
          params: 'declaration_no="DEC-2026-9921"',
          durationMs: 110,
          status: 'success',
          resultSummary: 'Returned Tariff code mismatch hold code #H-401'
        },
        {
          id: 'TC-202',
          timestamp: '08:32:44',
          agent: 'Document Intelligence Agent',
          tool: 'vector_hs_classifier',
          service: 'GCC Common Tariff RAG',
          params: 'substance="Polyethylene glycol medical grade 400"',
          durationMs: 280,
          status: 'success',
          resultSummary: 'Verified correct HS Code: 2934.10.00 (0% Customs Duty under Freezone exempt)'
        }
      ],
      evidence: [
        {
          id: 'EV-21',
          title: 'Dubai Customs Electronic Hold Notice',
          category: 'ERP Record',
          refNumber: 'DC-HLD-9811',
          date: 'Nov 01, 2026 · 08:30 GST',
          excerpt: 'Declaration DEC-2026-9921 placed under administrative verification. Required: Technical datasheet verifying exemption under GCC Unified Customs Law.',
          verified: true
        }
      ],
      invariants: [
        {
          id: 'INV-21',
          title: 'Demurrage Clock Limit Constraint',
          constraint: 'Resolution must be submitted within 24h to avoid $150/container daily port detention.',
          status: 'satisfied',
          verificationDetail: 'Resolution elapsed time: 12 minutes. Port demurrage avoided.'
        }
      ]
    },
    {
      id: 'OP-8823',
      title: 'Multi-Currency Withholding Tax Auto-Reconciliation',
      objective: 'Autonomously reconcile $38,500 withholding tax variance between UAE mainland and Dutch trade treaty accounts.',
      primaryAgent: 'Document Intelligence Agent',
      customerOrResource: 'Finance & Tax · INV-2026-088',
      status: 'completed',
      phase: 'Resolution Verified & Audited',
      phaseNumber: 4,
      totalPhases: 4,
      eta: 'Completed Nominal',
      planSteps: [
        {
          id: 's3-1',
          stepNumber: 1,
          title: 'Invoice Discrepancy Flagged',
          agent: 'Operations Coordinator',
          agentFallback: 'OC',
          status: 'completed',
          timestamp: '07:15 GST',
          summary: 'Wire transfer matched $142,500 against gross invoice of $181,000. Variance: $38,500.',
          toolUsed: 'stripe_billing_reconciler'
        },
        {
          id: 's3-2',
          stepNumber: 2,
          title: 'Double Tax Treaty Clause Retrieval',
          agent: 'Document Intelligence Agent',
          agentFallback: 'DI',
          status: 'completed',
          timestamp: '07:16 GST',
          summary: 'Retrieved UAE-Netherlands Bilateral Double Taxation Treaty Article 11 (0% WHT on trade royalties).',
          toolUsed: 'knowledge_base_treaty_query'
        },
        {
          id: 's3-3',
          stepNumber: 3,
          title: 'Tax Residency Certificate Verification',
          agent: 'Document Intelligence Agent',
          agentFallback: 'DI',
          status: 'completed',
          timestamp: '07:18 GST',
          summary: 'Verified active UAE Ministry of Finance Tax Residency Certificate #TRC-2026-8812. Formulated zero-liability credit adjustment.',
          toolUsed: 'mof_trc_verification_api'
        },
        {
          id: 's3-4',
          stepNumber: 4,
          title: 'Ledger Post & Invariant Audit Sign-off',
          agent: 'Operations Coordinator',
          agentFallback: 'OC',
          status: 'completed',
          timestamp: '07:20 GST',
          summary: 'Posted automated adjusting journal entry to SAP Financials. Invariants verified 100%.',
          toolUsed: 'sap_fi_journal_post'
        }
      ],
      toolCalls: [
        {
          id: 'TC-301',
          timestamp: '07:15:20',
          agent: 'Operations Coordinator',
          tool: 'stripe_balance_reconcile',
          service: 'Stripe Billing & Payments',
          params: 'invoice_id="INV-2026-088", currency="USD"',
          durationMs: 82,
          status: 'success',
          resultSummary: 'Identified variance $38,500 tagged as overseas withholding tax'
        },
        {
          id: 'TC-302',
          timestamp: '07:18:40',
          agent: 'Document Intelligence Agent',
          tool: 'sap_fi_journal_post',
          service: 'SAP S/4HANA Finance',
          params: 'doc_type="SA", amount=38500, account="18200_WHT_REC"',
          durationMs: 195,
          status: 'success',
          resultSummary: 'Journal entry #1000982 committed. Balance zeroed'
        }
      ],
      evidence: [
        {
          id: 'EV-31',
          title: 'UAE Ministry of Finance Tax Residency Certificate',
          category: 'ERP Record',
          refNumber: 'TRC-UAE-2026-8812',
          date: 'Jan 02, 2026',
          excerpt: 'Certificate of Tax Residence issued under the Convention between the Kingdom of the Netherlands and the United Arab Emirates for the avoidance of double taxation.',
          verified: true
        }
      ],
      invariants: [
        {
          id: 'INV-31',
          title: 'Zero General Ledger Variance Invariant',
          constraint: 'Debits must equal credits across all multi-currency clearing accounts.',
          status: 'satisfied',
          verificationDetail: 'Account 18200 variance = $0.00. Mathematical reconciliation verified.'
        }
      ]
    }
  ], []);

  const activeOp = operations.find((o) => o.id === selectedOperationId) || operations[0];

  const suggestedCommands = [
    'Investigate delayed supplier orders',
    'Audit cold-chain sensor drift for Vertex Health',
    'Reconcile customs tariff codes on Jebel Ali hold',
    'Review pending purchase order approvals'
  ];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || isExecutingCommand) return;
    dispatchOperationCommand(commandInput.trim());
    setCommandInput('');
  };

  const handleSelectSuggested = (cmd: string) => {
    dispatchOperationCommand(cmd);
  };

  const handleInlineAuthorize = (approvalId: string) => {
    approveApproval(approvalId);
    addToast({
      title: 'Action Authorized by Executive',
      message: `Operation ${activeOp.id} proceeding to autonomous execution phase.`,
      type: 'success'
    });
  };

  const handleInlineReject = (approvalId: string) => {
    rejectApproval(approvalId, 'Blocked from Command Centre inspection.');
    addToast({
      title: 'Action Declined',
      message: `Operation ${activeOp.id} paused and autonomous agent re-evaluating alternatives.`,
      type: 'warning'
    });
  };

  // Filtered Timeline
  const filteredTimeline = useMemo(() => {
    return liveTimeline.filter((ev) => {
      if (timelineFilter === 'tools') return ev.tags?.some((t) => t.toLowerCase().includes('query') || t.toLowerCase().includes('gateway') || t.toLowerCase().includes('sap'));
      if (timelineFilter === 'evidence') return ev.tags?.some((t) => t.toLowerCase().includes('extraction') || t.toLowerCase().includes('sla') || t.toLowerCase().includes('order'));
      if (timelineFilter === 'checkpoints') return ev.status === 'waiting' || ev.status === 'alert';
      return true;
    });
  }, [liveTimeline, timelineFilter]);

  // Check if current active operation has an approval that was just approved
  const currentApproval = approvals.find((a) => a.id === activeOp.linkedApprovalId);
  const isCurrentlyPending = currentApproval ? currentApproval.status === 'pending' : activeOp.status === 'awaiting_approval';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. EDITORIAL HEADER & HIGH-LEVEL SYSTEM TELEMETRY */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous Operations Command Centre</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">Runtime Engine v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            AI Operations Command Centre
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Live multi-agent execution pipeline. Inspect step decomposition, tool telemetry, invariant checks, and human authorization gateways.
          </p>
        </div>

        {/* Executive Summary Metrics Strip (Unboxed zero-pill text) */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium p-2.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-neutral-500">Agents:</span>
            <strong className="text-neutral-900 dark:text-neutral-100 font-mono">4 Online</strong>
          </div>
          <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Live Missions:</span>
            <strong className="text-neutral-900 dark:text-neutral-100 font-mono">3 In Flight</strong>
          </div>
          <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Autonomy:</span>
            <strong className="text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">96.4%</strong>
          </div>
          <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
          <button
            onClick={() => setActiveTab('approvals')}
            className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>1 Approval Required</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Operations Environment:</strong> Multi-agent directives, tool invocations, and ERP payload extracts demonstrate autonomous operations. Authorizations, directives, and filters execute real client-side state transitions.
          </span>
        </div>
      </div>

      {/* 2. NATURAL-LANGUAGE OPERATIONS COMMAND CONSOLE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Operational Directive Dispatcher
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Natural-Language Autonomous Router
          </span>
        </div>

        <form onSubmit={handleCommandSubmit} className="relative">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isExecutingCommand}
            placeholder="Instruct ORCHESTRA what needs to be investigated or resolved..."
            className="w-full px-4 py-3 pr-28 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#356DF3] focus:ring-2 focus:ring-[#356DF3]/15 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!commandInput.trim() || isExecutingCommand}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-2xs cursor-pointer"
          >
            {isExecutingCommand ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Routing...</span>
              </>
            ) : (
              <>
                <span>Dispatch</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Directives */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-neutral-400 font-medium">Quick Directives:</span>
          {suggestedCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSelectSuggested(cmd)}
              disabled={isExecutingCommand}
              className="px-2.5 py-1 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-[11px] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer text-left"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Streaming Execution Terminal Output */}
        {isExecutingCommand && (
          <div className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs space-y-1.5 border border-neutral-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-neutral-400 text-[11px] pb-1 border-b border-neutral-800">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                Autonomous Investigation in Progress...
              </span>
              <span>ORCHESTRA Trace Log</span>
            </div>
            {activeCommandLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-300">
                <span className="text-neutral-500">{'>'}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. CORE MISSION CONTROL: ACTIVE OPERATION COMMAND DOSSIER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs space-y-5">
        {/* Mission Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#356DF3]" />
              <h2 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Autonomous Operation Deep-Dive
              </h2>
            </div>
            <p className="text-[11px] text-neutral-500">
              Real-time task decomposition, active tool invocations, evidence dossier, and invariant checks.
            </p>
          </div>

          {/* Operation Selector Pill Tabs */}
          <div className="flex items-center p-0.5 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl overflow-x-auto shrink-0">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => setSelectedOperationId(op.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedOperationId === op.id
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  op.status === 'completed' 
                    ? 'bg-emerald-500' 
                    : op.status === 'awaiting_approval' 
                    ? 'bg-amber-500 animate-pulse' 
                    : 'bg-[#356DF3]'
                }`} />
                <span className="font-mono text-[11px]">{op.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Operation Header Dossier */}
        <div className="p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-neutral-400">
                {activeOp.id}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="inline-flex items-center text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  activeOp.status === 'completed'
                    ? 'bg-emerald-500'
                    : isCurrentlyPending
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-[#356DF3]'
                }`} />
                {isCurrentlyPending ? 'Awaiting Human Authorization' : activeOp.status === 'completed' ? 'Resolved & Verified' : 'Executing Autonomous Plan'}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Phase {activeOp.phaseNumber} of {activeOp.totalPhases}: {activeOp.phase}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Target: {activeOp.eta}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-50 leading-snug">
              {activeOp.title}
            </h3>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {activeOp.objective}
            </p>
          </div>

          {/* Key Entities & Agent Owner */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[#356DF3]" />
              <span>Lead Agent: <strong className="text-neutral-800 dark:text-neutral-200 font-medium">{activeOp.primaryAgent}</strong></span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <div>
              <span>Entity Scope: <strong className="text-neutral-800 dark:text-neutral-200 font-medium">{activeOp.customerOrResource}</strong></span>
            </div>
            {activeOp.linkedTaskId && (
              <>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <button
                  onClick={() => setSelectedTaskId(activeOp.linkedTaskId!)}
                  className="text-[#356DF3] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Linked Task #{activeOp.linkedTaskId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4 Deep-Dive Tabs (Plan, Tools, Evidence, Invariants) */}
        <div className="space-y-4">
          <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl">
            <button
              onClick={() => setActiveCommandTab('plan')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCommandTab === 'plan'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Task Planning & Steps ({activeOp.planSteps.length})
            </button>
            <button
              onClick={() => setActiveCommandTab('tools')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCommandTab === 'tools'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Tool Execution Matrix ({activeOp.toolCalls.length})
            </button>
            <button
              onClick={() => setActiveCommandTab('evidence')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCommandTab === 'evidence'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Evidence Collection ({activeOp.evidence.length})
            </button>
            <button
              onClick={() => setActiveCommandTab('invariants')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCommandTab === 'invariants'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Invariant Verification ({activeOp.invariants.length})
            </button>
          </div>

          {/* TAB 1: TASK PLANNING & STEP DECOMPOSITION */}
          {activeCommandTab === 'plan' && (
            <div className="space-y-3">
              {/* If awaiting approval, show immediate human intervention card */}
              {isCurrentlyPending && activeOp.linkedApprovalId && (
                <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                        Human-in-the-Loop Gateway: Approval #APP-7821 Required
                      </h4>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                        The agent has prepared the $1,850 SkyCargo split booking and transparent customer delay letter for Vertex Health. Authorize now to permit external dispatch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleInlineReject(activeOp.linkedApprovalId!)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setSelectedApprovalId(activeOp.linkedApprovalId!)}
                      className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Inspect Dossier
                    </button>
                    <button
                      onClick={() => handleInlineAuthorize(activeOp.linkedApprovalId!)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorize Step</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Plan Steps Vertical Timeline */}
              <div className="space-y-2.5">
                {activeOp.planSteps.map((step) => {
                  const isPendingReview = isCurrentlyPending && step.status === 'awaiting_approval';
                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isPendingReview
                          ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/10'
                          : step.status === 'completed'
                          ? 'border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#15171F]'
                          : step.status === 'executing'
                          ? 'border-[#356DF3]/60 bg-blue-50/20 dark:bg-blue-950/10'
                          : 'border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-50/40 dark:bg-neutral-900/20 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold ${
                            step.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isPendingReview
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                              : step.status === 'executing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                          }`}>
                            0{step.stepNumber}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                              {step.title}
                            </span>
                            <span className="text-neutral-400 text-[11px] ml-2">
                              via {step.agent}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                          {step.toolUsed && (
                            <span className="text-neutral-500">
                              tool: {step.toolUsed}
                            </span>
                          )}
                          <span className="tabular-nums">{step.timestamp}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pl-8.5">
                        {step.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TOOL EXECUTION MATRIX */}
          {activeCommandTab === 'tools' && (
            <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 pl-3.5 font-mono">Timestamp</th>
                      <th className="py-2.5">Tool Invocation</th>
                      <th className="py-2.5">Originating Agent</th>
                      <th className="py-2.5">Service & Scope</th>
                      <th className="py-2.5">Execution Result</th>
                      <th className="py-2.5 pr-3.5 text-right font-mono">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {activeOp.toolCalls.map((tc) => (
                      <tr key={tc.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-2.5 pl-3.5 font-mono text-[11px] text-neutral-400 tabular-nums">
                          {tc.timestamp}
                        </td>
                        <td className="py-2.5 font-mono font-medium text-neutral-900 dark:text-neutral-100 text-[11px]">
                          {tc.tool}
                          <p className="text-[10px] text-neutral-400 font-mono truncate max-w-xs">{tc.params}</p>
                        </td>
                        <td className="py-2.5 text-neutral-600 dark:text-neutral-400 text-[11px]">
                          {tc.agent}
                        </td>
                        <td className="py-2.5 text-neutral-700 dark:text-neutral-300 text-[11px]">
                          {tc.service}
                        </td>
                        <td className="py-2.5 text-[11px] text-neutral-600 dark:text-neutral-300 max-w-xs">
                          <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 mr-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                            Success
                          </span>
                          <span className="truncate block">{tc.resultSummary}</span>
                        </td>
                        <td className="py-2.5 pr-3.5 text-right font-mono text-[11px] text-neutral-500 tabular-nums">
                          {tc.durationMs}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE COLLECTION DOSSIER */}
          {activeCommandTab === 'evidence' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">
                Direct evidence collected by autonomous agents during ERP cross-referencing and supplier verification.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeOp.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setExpandedEvidenceId(expandedEvidenceId === ev.id ? null : ev.id)}
                    className="p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#356DF3]" />
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {ev.title}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {ev.refNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                      <span>{ev.category}</span>
                      <span>·</span>
                      <span>{ev.date}</span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Cryptographically Verified</span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono text-[11px] bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                      {ev.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVARIANT VERIFICATION */}
          {activeCommandTab === 'invariants' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">
                Safety constraints and policy invariants guaranteed by the autonomous runtime engine.
              </p>
              <div className="space-y-2.5">
                {activeOp.invariants.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-[#15171F] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {inv.title}
                        </span>
                      </div>
                      <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 pl-6">
                      Rule: {inv.constraint}
                    </p>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono pl-6 bg-neutral-50 dark:bg-neutral-900/60 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      Verification proof: {inv.verificationDetail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. ACTIVE SPECIALIZED AGENT SQUAD */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Specialized Autonomous Agents
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Continuously monitoring signals, executing authorized tools, and resolving operational variance.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            4 Configured Agents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-700/60 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-neutral-200">
                    {agent.avatarFallback}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-400'
                    }`} />
                    <span className="text-[11px] font-medium capitalize text-neutral-600 dark:text-neutral-400">
                      {agent.status}
                    </span>
                  </div>
                </div>

                <h3 className="mt-2.5 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {agent.name}
                </h3>
                <p className="text-[11px] text-neutral-400 font-medium">
                  {agent.role}
                </p>

                <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/60 text-[11px] text-neutral-600 dark:text-neutral-300">
                  <p className="font-semibold text-neutral-400 text-[10px] uppercase mb-0.5 tracking-wider">Active Directive</p>
                  <p className="leading-snug line-clamp-2">{agent.currentAssignment}</p>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5 font-mono tabular-nums">
                  <span>Tasks Resolved</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{agent.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-3 font-mono">
                  <span>Avg Latency</span>
                  <span>{agent.latencyAvg}</span>
                </div>
                <button
                  onClick={() => setSelectedAgentId(agent.id)}
                  className="w-full py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs cursor-pointer"
                >
                  Inspect Agent Parameters
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. LIVE EXECUTION TIMELINE & TRACE STREAM */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#356DF3]" />
              <h2 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Live Autonomous Execution Stream
              </h2>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Chronological log of multi-agent investigations, tool invocations, and approval checkpoints.
            </p>
          </div>

          {/* Timeline Filter Segmented */}
          <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl shrink-0">
            {(['all', 'tools', 'evidence', 'checkpoints'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimelineFilter(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  timelineFilter === tf
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {tf === 'all' ? 'All Trace' : tf}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Timeline Stream */}
        <div className="relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800 pl-8 space-y-3.5">
          {filteredTimeline.map((ev) => (
            <div
              key={ev.id}
              className="relative group"
            >
              <span className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#14161E] ${
                ev.status === 'alert'
                  ? 'bg-amber-500 text-white'
                  : ev.status === 'waiting'
                  ? 'bg-[#356DF3] text-white animate-pulse'
                  : 'bg-emerald-500 text-white'
              }`}>
                {ev.status === 'alert' ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : ev.status === 'waiting' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
              </span>

              <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {ev.time}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      {ev.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {ev.agent}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-0.5">
                  {ev.detail}
                </p>

                {/* Inline Action if Waiting on Human Approval */}
                {ev.status === 'waiting' && isCurrentlyPending && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Pending Approval #APP-7821 for Mohammed Al-Hashimi
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInlineAuthorize('APP-7821')}
                        className="px-3 py-1 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs cursor-pointer"
                      >
                        Authorize
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('approvals');
                          setSelectedApprovalId('APP-7821');
                        }}
                        className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        Inspect Dossier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
