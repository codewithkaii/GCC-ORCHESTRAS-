import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority } from '../../types';

export const CreateTaskModal: React.FC = () => {
  const { createTaskModalOpen, setCreateTaskModalOpen, createTask, agents, setActiveTab } = useApp();

  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [description, setDescription] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState(agents[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('high');
  const [dueDate, setDueDate] = useState('Today, 18:00');

  if (!createTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !objective.trim()) return;

    createTask({
      title: title.trim(),
      objective: objective.trim(),
      description: description.trim() || objective.trim(),
      assignedAgentId,
      priority,
      dueDate
    });

    setCreateTaskModalOpen(false);
    setActiveTab('tasks');
    // Reset form
    setTitle('');
    setObjective('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#16181F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Create Autonomous Operation
              </h2>
              <p className="text-xs text-neutral-500">
                Dispatch an operational goal to specialized AI agents
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreateTaskModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Operation Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Investigate customs discrepancy for Hamburg container #701"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#356DF3] transition-colors"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Target Objective *
            </label>
            <textarea
              required
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What concrete business resolution must be delivered?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#356DF3] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Assign to AI Agent
              </label>
              <select
                value={assignedAgentId}
                onChange={(e) => setAssignedAgentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#356DF3]"
              >
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Priority Tier
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['critical', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-2 rounded-lg font-medium text-center uppercase tracking-wider text-[10px] transition-all ${
                      priority === p
                        ? p === 'critical'
                          ? 'bg-red-500 text-white font-semibold'
                          : p === 'high'
                          ? 'bg-amber-500 text-white font-semibold'
                          : p === 'medium'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-neutral-700 text-white font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Target Resolution Window
            </label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="e.g. Today, 18:00 or Nov 04, 2026"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#356DF3]"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#356DF3] shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
              ORCHESTRA will decompose this task into execution steps, query authorized tools, cross-reference ERP records, and submit any client-facing or financial actions for approval.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <button
              type="button"
              onClick={() => setCreateTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
            >
              Dispatch Operation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
