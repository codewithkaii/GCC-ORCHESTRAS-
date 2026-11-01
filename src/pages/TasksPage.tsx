import React, { useState } from 'react';
import { 
  Search, 
  List, 
  Kanban, 
  Cpu, 
  Plus, 
  ArrowRight,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, Priority } from '../types';

export const TasksPage: React.FC = () => {
  const { 
    tasks, 
    setSelectedTaskId, 
    setCreateTaskModalOpen,
    agents
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'my' | 'ai' | 'pending' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (activeFilterTab === 'my' && t.humanReviewer !== 'Mohammed Al-Hashimi') return false;
    if (activeFilterTab === 'ai' && !t.assignedAgentId) return false;
    if (activeFilterTab === 'pending' && t.status === 'completed') return false;
    if (activeFilterTab === 'completed' && t.status !== 'completed') return false;
    if (activeFilterTab === 'failed' && t.status !== 'failed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      const matchAgent = t.assignedAgentName.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchAgent) return false;
    }

    if (selectedAgentFilter !== 'all' && t.assignedAgentId !== selectedAgentFilter) return false;
    if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;

    return true;
  });

  const renderStatus = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" />
            Completed
          </span>
        );
      case 'awaiting_approval':
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0 animate-pulse" />
            Awaiting Approval
          </span>
        );
      case 'executing':
        return (
          <span className="inline-flex items-center text-xs font-medium text-blue-700 dark:text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#356DF3] mr-2 shrink-0" />
            Executing
          </span>
        );
      case 'planning':
        return (
          <span className="inline-flex items-center text-xs font-medium text-purple-700 dark:text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 shrink-0" />
            Planning
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center text-xs font-medium text-red-700 dark:text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 shrink-0" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mr-2 shrink-0" />
            Queued
          </span>
        );
    }
  };

  const renderPriority = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">
            <span className="w-1 h-1 rounded-full bg-red-500 mr-1.5" />
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
            <span className="w-1 h-1 rounded-full bg-amber-500 mr-1.5" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400 tracking-wide uppercase">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tracking-wide uppercase">
            Low
          </span>
        );
    }
  };

  const kanbanColumns: Array<{ id: TaskStatus; label: string }> = [
    { id: 'queued', label: 'Queued' },
    { id: 'planning', label: 'Planning' },
    { id: 'executing', label: 'Executing' },
    { id: 'awaiting_approval', label: 'Awaiting Approval' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <span>Operations Execution Hub</span>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-600 dark:text-neutral-400">All Workflows</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Task Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Supervise autonomous operations, inspect real-time tool logs, and review human-in-the-loop checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Apple-style segmented view toggle */}
          <div className="flex items-center p-0.5 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          <button
            onClick={() => setCreateTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Operations Hub:</strong> Task execution histories, tool call steps, and evidence records demonstrate autonomous task orchestration. Creating tasks, updating states, and inspection filters run live on frontend state.
          </span>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        {/* Apple Segmented Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Tasks' },
              { id: 'my', label: 'My Reviews' },
              { id: 'ai', label: 'AI Assigned' },
              { id: 'pending', label: 'Active' },
              { id: 'completed', label: 'Completed' },
              { id: 'failed', label: 'Failed' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeFilterTab === tab.id
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#356DF3] w-44 sm:w-52"
            />
          </div>

          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">All Agents</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>{ag.name}</option>
            ))}
          </select>

          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: HIGH-DENSITY LIST VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pl-4 font-mono">Identifier & Title</th>
                  <th className="py-2.5">Assigned Agent</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Priority</th>
                  <th className="py-2.5">Target Window</th>
                  <th className="py-2.5 pr-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400">
                      No tasks matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pl-4 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-neutral-400 shrink-0">{task.id}</span>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-[#356DF3] transition-colors truncate">
                            {task.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5 max-w-sm">
                          {task.objective}
                        </p>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                          <Cpu className="w-3.5 h-3.5 text-[#356DF3] shrink-0" />
                          <span className="truncate max-w-[140px]">{task.assignedAgentName}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {renderStatus(task.status)}
                      </td>
                      <td className="py-3">
                        {renderPriority(task.priority)}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-neutral-500 tabular-nums">
                        {task.dueDate}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskId(task.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: REFINED KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="p-3 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 min-h-[460px] flex flex-col"
              >
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {col.label}
                  </span>
                  <span className="font-mono text-xs text-neutral-400 tabular-nums">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#15171F] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs hover:border-[#356DF3]/60 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-neutral-400">{task.id}</span>
                        {renderPriority(task.priority)}
                      </div>
                      <h4 className="text-xs font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-[#356DF3] transition-colors leading-snug">
                        {task.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1.5 border-t border-neutral-100 dark:border-neutral-800/50">
                        <span className="truncate max-w-[100px]">{task.assignedAgentName}</span>
                        <span className="font-mono tabular-nums">{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
