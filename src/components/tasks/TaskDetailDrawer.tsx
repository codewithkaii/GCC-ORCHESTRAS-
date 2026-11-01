import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  Terminal, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskStatus } from '../../types';

export const TaskDetailDrawer: React.FC = () => {
  const { 
    selectedTaskId, 
    setSelectedTaskId, 
    tasks, 
    updateTaskStatus, 
    setSelectedApprovalId, 
    setActiveTab,
    addToast
  } = useApp();

  const [activeTab, setActiveStepsTab] = useState<'steps' | 'evidence' | 'tools'>('steps');

  if (!selectedTaskId) return null;

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const handleRerun = () => {
    updateTaskStatus(task.id, 'executing');
    addToast({
      title: 'Simulation Rerun Triggered',
      message: `${task.id} execution pipeline reset and re-evaluating tools.`,
      type: 'info'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
        onClick={() => setSelectedTaskId(null)}
      >
        <div 
          className="w-screen max-w-2xl bg-white dark:bg-[#15171F] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-neutral-400 tabular-nums">
                {task.id}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${task.status === 'completed' ? 'bg-emerald-500' : task.status === 'awaiting_approval' ? 'bg-amber-500 animate-pulse' : 'bg-[#356DF3]'}`} />
                {task.status.replace('_', ' ')}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-400">
                {task.priority} Priority
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRerun}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Rerun agent execution"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rerun</span>
              </button>
              <button
                onClick={() => setSelectedTaskId(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Title & Objective */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-50 leading-snug">
                {task.title}
              </h2>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                {task.objective}
              </p>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 text-xs">
              <div>
                <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Assigned Agent</p>
                <div className="flex items-center gap-1.5 mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                  <Cpu className="w-3.5 h-3.5 text-[#356DF3] shrink-0" />
                  <span className="truncate">{task.assignedAgentName}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Reviewer</p>
                <div className="flex items-center gap-1.5 mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                  <UserCheck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{task.humanReviewer}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Due Window</p>
                <p className="mt-1 font-mono font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {task.dueDate}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Last Activity</p>
                <p className="mt-1 text-neutral-500 font-mono text-[11px] tabular-nums">
                  {task.updatedAt}
                </p>
              </div>
            </div>

            {/* Status Override Banner if Awaiting Approval */}
            {task.status === 'awaiting_approval' && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                      Authorization Required Before Dispatch
                    </h4>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                      The autonomous plan includes actions that require executive review.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTaskId(null);
                    setActiveTab('approvals');
                    setSelectedApprovalId('APP-7821');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs shrink-0"
                >
                  Review Dossier
                </button>
              </div>
            )}

            {/* Detailed Description */}
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Operational Context
              </h3>
              <div className="p-3.5 rounded-2xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {task.description}
              </div>
            </div>

            {/* Apple Segmented Tabs for Execution Details */}
            <div>
              <div className="flex items-center p-0.5 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl mb-3">
                <button
                  onClick={() => setActiveStepsTab('steps')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'steps'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  Execution Steps ({task.executionSteps.length})
                </button>
                <button
                  onClick={() => setActiveStepsTab('evidence')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'evidence'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  Evidence ({task.evidence.length})
                </button>
                <button
                  onClick={() => setActiveStepsTab('tools')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'tools'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  Tool Calls ({task.toolActivity.length})
                </button>
              </div>

              {/* Steps Tab */}
              {activeTab === 'steps' && (
                <div className="space-y-2">
                  {task.executionSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800"
                    >
                      <div className="mt-0.5 shrink-0">
                        {step.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {step.status === 'running' && (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#356DF3] border-t-transparent animate-spin" />
                        )}
                        {step.status === 'pending' && (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 dark:border-neutral-700" />
                        )}
                        {step.status === 'failed' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${
                            step.status === 'completed'
                              ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                              : step.status === 'running'
                              ? 'text-[#356DF3] font-semibold'
                              : 'text-neutral-400'
                          }`}>
                            {step.text}
                          </p>
                          <span className="text-[10px] font-mono text-neutral-400 ml-2 shrink-0 tabular-nums">
                            {step.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Evidence Tab */}
              {activeTab === 'evidence' && (
                <div className="space-y-2.5">
                  {task.evidence.length === 0 ? (
                    <p className="text-xs text-neutral-400 p-4 text-center">No documentary evidence recorded.</p>
                  ) : (
                    task.evidence.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#356DF3]" />
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                              {item.title}
                            </span>
                          </div>
                          {item.refNumber && (
                            <span className="text-[10px] font-mono text-neutral-400">
                              {item.refNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/60">
                          {item.snippet}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono tabular-nums">
                          Source date: {item.date}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tool Calls Tab */}
              {activeTab === 'tools' && (
                <div className="space-y-2">
                  {task.toolActivity.length === 0 ? (
                    <p className="text-xs text-neutral-400 p-4 text-center">No external tool calls logged yet.</p>
                  ) : (
                    task.toolActivity.map((tool, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between text-neutral-400">
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>{tool.tool}</span>
                          </div>
                          <span className="text-[10px] tabular-nums">{tool.durationMs}ms</span>
                        </div>
                        <p className="text-white font-medium">
                          {tool.action}
                        </p>
                        <p className="text-neutral-400 text-[10px]">
                          args: {tool.params}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Resolution Summary */}
            {task.outcomeSummary && (
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Resolution Summary
                </h3>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200">
                  {task.outcomeSummary}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Status:</span>
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                className="px-2.5 py-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
              >
                <option value="queued">Queued</option>
                <option value="planning">Planning</option>
                <option value="executing">Executing</option>
                <option value="awaiting_approval">Awaiting Approval</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <button
              onClick={() => setSelectedTaskId(null)}
              className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
