import React from 'react';
import { 
  X, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgentDetailModal: React.FC = () => {
  const { selectedAgentId, setSelectedAgentId, agents } = useApp();

  if (!selectedAgentId) return null;

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#15171F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shadow-2xs">
              {agent.avatarFallback}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {agent.name}
                </h2>
                <span className="inline-flex items-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  {agent.status === 'active' ? 'Active' : 'Idle'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">{agent.role}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAgentId(null)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-xs">
            {agent.description}
          </p>

          {/* Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Autonomy Tier</span>
              <p className="font-medium text-neutral-900 dark:text-neutral-100 mt-0.5 truncate text-xs">
                {agent.autonomyLevel}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Tasks Resolved</span>
              <p className="font-mono font-medium text-neutral-900 dark:text-neutral-100 mt-0.5 tabular-nums text-xs">
                {agent.tasksCompleted}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Avg Latency</span>
              <p className="font-mono font-medium text-neutral-900 dark:text-neutral-100 mt-0.5 tabular-nums text-xs">
                {agent.latencyAvg}
              </p>
            </div>
          </div>

          {/* System Directives */}
          <div>
            <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1.5">
              Governing Directives & Safety Boundaries
            </h4>
            <ul className="space-y-1.5">
              {agent.systemDirectives.map((dir, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#356DF3] shrink-0 mt-0.5" />
                  <span>{dir}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Authorized Tools */}
          <div>
            <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1.5">
              Authorized Integrations & Tool Registry
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.authorizedTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] border border-neutral-200/60 dark:border-neutral-700/60"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Current Assignment */}
          <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <h4 className="font-semibold text-blue-950 dark:text-blue-200 text-[10px] uppercase tracking-wider mb-1">
              Active Focus
            </h4>
            <p className="text-neutral-800 dark:text-neutral-200 text-xs">
              {agent.currentAssignment}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-end bg-neutral-50/50 dark:bg-neutral-900/40">
          <button
            onClick={() => setSelectedAgentId(null)}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
