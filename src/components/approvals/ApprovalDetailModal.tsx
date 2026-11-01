import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Ban, 
  RotateCcw, 
  FileText, 
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApprovalDetailModal: React.FC = () => {
  const { 
    selectedApprovalId, 
    setSelectedApprovalId, 
    approvals, 
    approveApproval, 
    rejectApproval, 
    requestChangesApproval 
  } = useApp();

  const [feedbackText, setFeedbackText] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showChangesInput, setShowChangesInput] = useState(false);

  if (!selectedApprovalId) return null;

  const approval = approvals.find((a) => a.id === selectedApprovalId);
  if (!approval) return null;

  const handleApprove = () => {
    approveApproval(approval.id);
    setSelectedApprovalId(null);
  };

  const handleReject = () => {
    rejectApproval(approval.id, feedbackText || undefined);
    setSelectedApprovalId(null);
  };

  const handleRequestChanges = () => {
    if (!feedbackText.trim()) return;
    requestChangesApproval(approval.id, feedbackText.trim());
    setSelectedApprovalId(null);
  };

  const renderRisk = (level: string) => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
            High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Low Risk
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#15171F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-neutral-400 tabular-nums">
              {approval.id}
            </span>
            {renderRisk(approval.riskLevel)}
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="inline-flex items-center text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${approval.status === 'approved' ? 'bg-emerald-500' : approval.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
              {approval.status.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={() => setSelectedApprovalId(null)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 leading-snug">
              {approval.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-neutral-500 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-[#356DF3]" />
              <span>Requested by <strong className="text-neutral-700 dark:text-neutral-300 font-medium">{approval.agentName}</strong></span>
              <span>·</span>
              <span className="font-mono">{approval.timestamp}</span>
            </div>
          </div>

          {/* Requested Action Box */}
          <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
            <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1">
              Requested Authorization
            </h4>
            <p className="text-xs text-neutral-900 dark:text-neutral-100 font-medium leading-relaxed">
              {approval.requestedAction}
            </p>
          </div>

          {/* Business Context & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900/30">
              <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1">
                Business Context
              </h4>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                {approval.businessContext}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900/30">
              <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1">
                Autonomous Root Rationale
              </h4>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                {approval.reason}
              </p>
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-900/30">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                <FileText className="w-3.5 h-3.5 text-[#356DF3]" />
                <span>Supporting Evidence Records</span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400">
                {approval.evidenceRef}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] font-mono">
              {approval.supportingEvidence}
            </p>
          </div>

          {/* Impact Analysis */}
          <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#356DF3] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-950 dark:text-blue-200 mb-0.5 text-xs">
                Impact & Invariant Assessment
              </h4>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                {approval.impactAnalysis}
              </p>
            </div>
          </div>

          {/* Status review confirmation if not pending */}
          {approval.status !== 'pending' && (
            <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">
                Decision recorded: {approval.status.replace('_', ' ')} by {approval.reviewerName}
              </p>
              {approval.changesFeedback && (
                <p className="mt-1 text-neutral-500 text-[11px]">
                  Feedback note: "{approval.changesFeedback}"
                </p>
              )}
            </div>
          )}

          {/* Feedback input for reject / request changes */}
          {(showRejectInput || showChangesInput) && (
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                {showChangesInput ? 'Specify required operational adjustments:' : 'Reason for rejection:'}
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Directive instructions for the autonomous agent..."
                className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden text-xs"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-end gap-2 bg-neutral-50/50 dark:bg-neutral-900/40">
          {approval.status === 'pending' ? (
            <>
              {showChangesInput ? (
                <>
                  <button
                    onClick={() => setShowChangesInput(false)}
                    className="px-3.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestChanges}
                    className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-2xs"
                  >
                    Submit Adjustments
                  </button>
                </>
              ) : showRejectInput ? (
                <>
                  <button
                    onClick={() => setShowRejectInput(false)}
                    className="px-3.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-2xs"
                  >
                    Confirm Rejection
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setShowChangesInput(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
                  >
                    Request Adjustments
                  </button>
                  <button
                    onClick={handleApprove}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize Step</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={() => setSelectedApprovalId(null)}
              className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs"
            >
              Close Dossier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
