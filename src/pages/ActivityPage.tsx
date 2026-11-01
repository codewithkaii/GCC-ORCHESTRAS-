import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Cpu, 
  User, 
  X,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityLog } from '../types';

export const ActivityPage: React.FC = () => {
  const { activityLogs, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [actorFilter, setActorFilter] = useState<'all' | 'agent' | 'user'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'warning' | 'blocked'>('all');
  const [inspectEvent, setInspectEvent] = useState<ActivityLog | null>(null);

  const filteredLogs = activityLogs.filter((log) => {
    if (actorFilter !== 'all' && log.actor.type !== actorFilter) return false;
    if (resultFilter !== 'all' && log.result !== resultFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.executionId.toLowerCase().includes(q) ||
        log.actor.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Execution ID', 'Actor', 'Actor Type', 'Action', 'Resource', 'Result', 'Description'];
    const rows = filteredLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.executionId}"`,
      `"${log.actor.name}"`,
      `"${log.actor.type}"`,
      `"${log.action}"`,
      `"${log.resource.replace(/"/g, '""')}"`,
      `"${log.result}"`,
      `"${(log.details.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ORCHESTRA_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Log Exported',
      message: `Exported ${filteredLogs.length} verified audit records as CSV.`,
      type: 'success'
    });
  };

  const renderResult = (result: ActivityLog['result']) => {
    switch (result) {
      case 'success':
        return (
          <span className="inline-flex items-center text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
            Success
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" />
            Warning
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center text-xs font-medium text-red-700 dark:text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shrink-0" />
            Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mr-1.5 shrink-0" />
            Nominal
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
            <History className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Cryptographic Execution Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Activity & Audit Log
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Immutable chronological ledger of every autonomous agent action, tool invocation, and human approval.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs self-start sm:self-auto shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Audit Ledger:</strong> Historical events reflect simulated autonomous runs. User authorizations, newly created tasks, and CSV exports reflect live client-side data.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search execution IDs, actions, resources..."
            className="w-full pl-8 pr-3 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#356DF3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Actor Filter Segmented */}
          <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl">
            {(['all', 'agent', 'user'] as const).map((af) => (
              <button
                key={af}
                onClick={() => setActorFilter(af)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  actorFilter === af
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {af === 'all' ? 'All Actors' : af}
              </button>
            ))}
          </div>

          {/* Result Filter */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">All Results</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 pl-4 font-mono">Timestamp</th>
                <th className="py-2.5">Actor</th>
                <th className="py-2.5">Action Type</th>
                <th className="py-2.5">Resource Target</th>
                <th className="py-2.5">Result</th>
                <th className="py-2.5 font-mono">Execution ID</th>
                <th className="py-2.5 pr-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No activity logs matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setInspectEvent(log)}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 pl-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap tabular-nums">
                      {log.timestamp}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {log.actor.type === 'agent' ? (
                          <Cpu className="w-3.5 h-3.5 text-[#356DF3] shrink-0" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        )}
                        <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[150px]">
                          {log.actor.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 font-medium">
                      {log.action}
                    </td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
                      {log.resource}
                    </td>
                    <td className="py-3">
                      {renderResult(log.result)}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-neutral-400 tabular-nums">
                      {log.executionId}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 group-hover:text-[#356DF3] transition-colors">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-[#356DF3]" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Drawer */}
      {inspectEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#15171F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-neutral-400 tabular-nums">
                  {inspectEvent.id} · {inspectEvent.executionId}
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  Audit Event Dossier
                </h3>
              </div>
              <button
                onClick={() => setInspectEvent(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Action</span>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{inspectEvent.action}</p>
                <p className="text-neutral-500 text-[11px]">{inspectEvent.resource}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-neutral-400 block">Actor</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{inspectEvent.actor.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Status</span>
                  {renderResult(inspectEvent.result)}
                </div>
                <div>
                  <span className="text-neutral-400 block">Timestamp</span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400 tabular-nums">{inspectEvent.timestamp}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Latency</span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400 tabular-nums">{inspectEvent.details.metadata?.durationMs || '120ms'}</span>
                </div>
              </div>

              {inspectEvent.details.description && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Payload Description</span>
                  <p className="mt-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] leading-relaxed">
                    {inspectEvent.details.description}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
                <button
                  onClick={() => setInspectEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
