import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  FileText,
  ExternalLink,
  RotateCcw,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { currentUser, mockPerformanceCharts } from '../data/mockData';
import { Priority, TaskStatus } from '../types';

export const OverviewPage: React.FC = () => {
  const { 
    tasks, 
    approvals, 
    workflows, 
    liveTimeline, 
    setActiveTab, 
    setSelectedTaskId, 
    setSelectedApprovalId, 
    setCreateTaskModalOpen,
    approveApproval,
    theme
  } = useApp();

  const [activityFilter, setActivityFilter] = useState<'all' | 'alerts' | 'completed'>('all');

  // Computed values
  const activeTasksCount = tasks.filter((t) => t.status === 'executing' || t.status === 'planning').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const filteredTimeline = liveTimeline.filter((item) => {
    if (activityFilter === 'alerts') return item.status === 'alert' || item.status === 'waiting';
    if (activityFilter === 'completed') return item.status === 'completed';
    return true;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-50 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900';
      case 'high':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'medium':
        return 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      default:
        return 'text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
    }
  };

  const attentionItems = [
    ...approvals.filter((a) => a.status === 'pending').map((a) => ({
      id: a.id,
      title: a.title,
      type: 'approval' as const,
      subtitle: `Requested by ${a.agentName} · Risk: ${a.riskLevel}`,
      urgent: a.riskLevel === 'high'
    })),
    ...tasks.filter((t) => t.status === 'failed' || t.priority === 'critical').slice(0, 2).map((t) => ({
      id: t.id,
      title: t.title,
      type: 'task' as const,
      subtitle: `Status: ${t.status.replace('_', ' ')} · ${t.assignedAgentName}`,
      urgent: t.priority === 'critical'
    }))
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-1">
            <span>Saturday, October 31, 2026</span>
            <span>·</span>
            <span>Dubai, GST (UTC+4)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Good morning, Mohammed.
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Here’s what’s happening across your autonomous operations today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('operations')}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors shadow-2xs"
          >
            Open Command Centre
          </button>
          <button
            onClick={() => setCreateTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create new task</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Demonstration Environment:</strong> AI agent actions, autonomous decisions, and metrics reflect a high-fidelity Dubai logistics simulation (Acme Global Trade). All user authorizations, task creation, and filters execute real client-side state.
          </span>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tracking-tight">Active Operations</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[#2F68F3] flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono tabular-nums">
              24
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Across 4 autonomous agent clusters
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tracking-tight">Completed Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono tabular-nums">
              186
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            96.4% resolved without human intervention
          </p>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setActiveTab('approvals')}
          className="p-5 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs hover:border-amber-300 dark:hover:border-amber-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tracking-tight group-hover:text-amber-600 transition-colors">
              Pending Approvals
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono tabular-nums">
              7
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -8%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            2 critical items awaiting your sign-off
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tracking-tight">Time Saved</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 font-mono tabular-nums">
              42.5 hrs
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Estimated operations staff hours saved
          </p>
        </div>
      </div>

      {/* TWO COLUMN SECTION: AI ACTIVITY TIMELINE + NEEDS YOUR ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: AI Operations Activity (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  AI Operations Activity
                </h3>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                Real-time autonomous investigation and execution feed
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl">
              <button
                onClick={() => setActivityFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activityFilter === 'all'
                    ? 'bg-white dark:bg-[#1C1F2B] text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActivityFilter('alerts')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activityFilter === 'alerts'
                    ? 'bg-white dark:bg-[#1C1F2B] text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Checkpoints
              </button>
              <button
                onClick={() => setActivityFilter('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activityFilter === 'completed'
                    ? 'bg-white dark:bg-[#1C1F2B] text-neutral-900 dark:text-neutral-50 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Timeline Stream */}
          <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-neutral-200 dark:before:bg-neutral-800 pl-8">
            {filteredTimeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Node indicator */}
                <span className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#151821] ${
                  item.status === 'alert'
                    ? 'bg-amber-500 text-white'
                    : item.status === 'waiting'
                    ? 'bg-[#2F68F3] text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {item.status === 'alert' ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : item.status === 'waiting' ? (
                    <ShieldCheck className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                </span>

                <div className="p-3.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-neutral-400">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.detail}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#2F68F3]" />
                      <span className="text-neutral-500 dark:text-neutral-400">{item.agent}</span>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                        {item.tags.map((tg, i) => (
                          <span key={i}>
                            {tg}{i < item.tags!.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-end">
            <button
              onClick={() => setActiveTab('operations')}
              className="text-xs font-semibold text-[#2F68F3] dark:text-[#5B8DFE] hover:underline flex items-center gap-1"
            >
              <span>View full AI console execution stream</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Needs Your Attention (4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs space-y-4">
          <div>
            <h3 className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Needs Your Attention
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              High-priority approvals and intervention checkpoints
            </p>
          </div>

          <div className="space-y-2.5">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'approval') {
                    setActiveTab('approvals');
                    setSelectedApprovalId(item.id);
                  } else {
                    setActiveTab('tasks');
                    setSelectedTaskId(item.id);
                  }
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  item.urgent
                    ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/50 hover:border-amber-300'
                    : 'bg-neutral-50/50 dark:bg-neutral-900/40 border-neutral-200/60 dark:border-neutral-800/70 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.type === 'approval' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    )}
                    <span className="font-mono text-[10px] text-neutral-400">{item.id}</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#2F68F3] hover:underline">
                    Inspect
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-[11px] text-neutral-500 truncate">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stats Summary */}
          <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Human Intervention Rate</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">8.6%</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Avg Resolution Latency</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">4.2 mins</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Autonomous Compliance</span>
              <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: ACTIVE WORKFLOWS TABLE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#151821] border border-neutral-200/70 dark:border-neutral-800/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Active Workflows
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Autonomous business processes continuously operating in your workspace
            </p>
          </div>
          <button
            onClick={() => setActiveTab('workflows')}
            className="text-xs font-semibold text-[#2F68F3] dark:text-[#5B8DFE] hover:underline flex items-center gap-1"
          >
            <span>Open visual workflow builder</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200/60 dark:border-neutral-800/60 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 pl-2">Workflow</th>
                <th className="pb-2.5">Assigned Agent</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Priority</th>
                <th className="pb-2.5">Success Rate</th>
                <th className="pb-2.5 pr-2 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
              {workflows.map((wf) => (
                <tr
                  key={wf.id}
                  onClick={() => setActiveTab('workflows')}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/30 cursor-pointer transition-colors group"
                >
                  <td className="py-3 pl-2 font-semibold text-neutral-900 dark:text-neutral-100">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#2F68F3] transition-colors" />
                      <span className="tracking-tight">{wf.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-400">
                    {wf.assignedAgent}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-neutral-700 dark:text-neutral-300 capitalize text-[11px] font-medium">
                        {wf.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        wf.priority === 'critical' ? 'bg-red-500' : wf.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-[11px] font-medium capitalize text-neutral-700 dark:text-neutral-300">
                        {wf.priority}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    {wf.successRate}%
                  </td>
                  <td className="py-3 pr-2 text-right text-neutral-400 font-mono text-[11px]">
                    {wf.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: OPERATIONS PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Tasks Completed Over Time */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Tasks Completed Over Time
              </h3>
              <p className="text-xs text-neutral-500">Autonomous resolution vs human review</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#356DF3]" /> Autonomous
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" /> Manual
              </span>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceCharts.tasksOverTime}>
                <defs>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#356DF3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#356DF3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val}`} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#181B24' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#2A2E3B' : '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="automated" 
                  stroke="#356DF3" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorAuto)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="manual" 
                  stroke="#9CA3AF" 
                  strokeWidth={1.5} 
                  fillOpacity={0} 
                  fill="#9CA3AF" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Resolution Time Reduction */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Average Resolution Time (Hours)
              </h3>
              <p className="text-xs text-neutral-500">From 4.8 hrs human average to 0.8 hrs with ORCHESTRA</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              -83% Latency
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPerformanceCharts.resolutionTimeHours}>
                <XAxis 
                  dataKey="month" 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  unit="h" 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#181B24' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#2A2E3B' : '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#356DF3" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
