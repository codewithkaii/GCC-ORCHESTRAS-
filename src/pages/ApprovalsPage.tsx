import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Ban, 
  RotateCcw, 
  Cpu, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Approval } from '../types';

export const ApprovalsPage: React.FC = () => {
  const { 
    approvals, 
    approveApproval, 
    rejectApproval, 
    setSelectedApprovalId 
  } = useApp();

  const [filterTab, setFilterTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredApprovals = approvals.filter((appr) => {
    if (filterTab === 'pending' && appr.status !== 'pending') return false;
    if (filterTab === 'approved' && appr.status !== 'approved') return false;
    if (filterTab === 'rejected' && appr.status !== 'rejected' && appr.status !== 'changes_requested') return false;
    if (selectedRisk !== 'all' && appr.riskLevel !== selectedRisk) return false;
    return true;
  });

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected' || a.status === 'changes_requested').length;

  const renderRisk = (level: string) => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shrink-0" />
            High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" />
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
            Low Risk
          </span>
        );
    }
  };

  const renderStatus = (status: Approval['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
            Authorized
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center text-xs font-medium text-red-700 dark:text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shrink-0" />
            Declined
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" />
            Changes Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0 animate-pulse" />
            Awaiting Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Approval Centre
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Authorize critical autonomous steps, supplier communications, and financial adjustments before execution.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 font-semibold tabular-nums">
            {pendingCount} Pending Authorization{pendingCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Governance Gateway:</strong> Actions originate from simulated autonomous agent triggers. Authorizations, rejections, and adjustment directives execute real frontend mutations and update the audit ledger.
          </span>
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filterTab === 'pending'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filterTab === 'approved'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filterTab === 'rejected'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Declined ({rejectedCount})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filterTab === 'all'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            All History
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-neutral-400 font-medium">Risk:</span>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">All Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Dossier Cards List */}
      <div className="space-y-3.5">
        {filteredApprovals.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70">
            <CheckCircle2 className="w-7 h-7 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              No Approvals in Queue
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              All autonomous agent workflows are executing within authorized safety parameters.
            </p>
          </div>
        ) : (
          filteredApprovals.map((appr) => (
            <div
              key={appr.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-neutral-400 shrink-0">
                    {appr.id}
                  </span>
                  {renderRisk(appr.riskLevel)}
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  {renderStatus(appr.status)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Requested {appr.timestamp}</span>
                </div>
              </div>

              {/* Title & Agent info */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-50 leading-snug">
                  {appr.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                  <Cpu className="w-3.5 h-3.5 text-[#356DF3]" />
                  <span>Originating Agent: <strong className="font-medium text-neutral-700 dark:text-neutral-300">{appr.agentName}</strong></span>
                </div>
              </div>

              {/* Requested Action Box */}
              <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
                <h4 className="text-[10px] uppercase font-semibold text-neutral-400 mb-1 tracking-wider">
                  Requested Action
                </h4>
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed">
                  {appr.requestedAction}
                </p>
              </div>

              {/* Reason & Evidence preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="text-[10px] uppercase font-semibold text-neutral-400 mb-1 tracking-wider">
                    Operational Rationale
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                    {appr.reason}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-semibold text-neutral-400 mb-1 tracking-wider">
                    Supporting Invariant Evidence
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono text-[11px]">
                    {appr.supportingEvidence}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedApprovalId(appr.id)}
                  className="text-xs font-medium text-[#356DF3] hover:text-[#2554CA] dark:text-[#5B8DFE] dark:hover:text-[#7DA4FF] inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
                >
                  <span>Open comprehensive review dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {appr.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectApproval(appr.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setSelectedApprovalId(appr.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => approveApproval(appr.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorize Step</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 font-mono tabular-nums">
                    Logged: {appr.reviewedAt || 'Archived'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
