import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles,
  PieChart as PieIcon,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { mockPerformanceCharts } from '../data/mockData';

export const IntelligencePage: React.FC = () => {
  const { theme, setActiveTab } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const COLORS = ['#356DF3', '#10B981', '#F59E0B', '#8B5CF6'];

  const insights = [
    {
      id: 'ins-1',
      title: 'Supplier Delay Resolution has reduced SLA liquidated damages by 42%',
      category: 'Procurement Efficiency',
      impact: '+$38,500 Saved',
      detail: 'Automated 48-hour advance notice triggers for sea freight variance successfully averted 6 contractual penalty claims across EMEA health customers this month.',
      action: 'View Supplier Workflows',
      linkTab: 'workflows' as const
    },
    {
      id: 'ins-2',
      title: 'Invoicing tax anomalies cluster on Thursdays during multi-currency wire cycles',
      category: 'Financial Accuracy',
      impact: '100% Tax Match',
      detail: 'Withholding tax differences between UAE domestic accounts and French/Dutch trading partners were reconciled autonomously in 14.2 seconds on average.',
      action: 'Inspect Audit Logs',
      linkTab: 'activity' as const
    },
    {
      id: 'ins-3',
      title: 'Autonomous document vectorization decreased customs hold duration by 64%',
      category: 'Logistics Velocity',
      impact: '-18.4 hrs/shipment',
      detail: 'Direct ingestion of MSDS safety sheets and bill of lading barcodes through the Document Intelligence Agent eliminated customs demurrage in Dubai Airport Cargo.',
      action: 'Review Knowledge Base',
      linkTab: 'knowledge' as const
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Executive Operational Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Business Intelligence
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Real-time operations velocity, economic impact metrics, and autonomous pattern observations.
          </p>
        </div>

        {/* Time range Apple segmented control */}
        <div className="flex items-center p-0.5 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl shrink-0">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === r
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
        <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
        <span>
          <strong>Operational Model:</strong> Telemetry metrics and cost ratios reflect synthetic operational execution for Acme Global Logistics & Trade (Dubai GST).
        </span>
      </div>

      {/* 6 High-Density Executive KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Operations Volume</span>
          <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">1,420</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+24% vs last mo</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Workflow Success</span>
          <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">96.4%</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+1.8% nominal</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Avg Resolution</span>
          <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">4.2 min</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">-83% vs human</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Human Checkpoints</span>
          <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">8.6%</p>
          <span className="text-[10px] text-neutral-400 font-medium">Authorizations only</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Cost Per Operation</span>
          <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">$0.18</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">vs $45 manual</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Time Saved</span>
          <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">684 hrs</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">4.2 FTE equiv</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Operations Volume Trend */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Operations Volume Velocity
              </h3>
              <p className="text-[11px] text-neutral-500">Autonomous workflow dispatches over 7-day window</p>
            </div>
            <span className="text-xs font-mono text-neutral-400">7-Day Run</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceCharts.tasksOverTime}>
                <defs>
                  <linearGradient id="colorAutoOps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#356DF3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#356DF3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#181B24' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#2A2E3B' : '#E5E7EB',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#356DF3" strokeWidth={2} fill="url(#colorAutoOps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workflow Distribution Donut */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Workload Distribution by Discipline
              </h3>
              <p className="text-[11px] text-neutral-500">Breakdown of 948 completed monthly flows</p>
            </div>
            <PieIcon className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 h-60">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPerformanceCharts.workflowDistribution}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {mockPerformanceCharts.workflowDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#181B24' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#2A2E3B' : '#E5E7EB',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              {mockPerformanceCharts.workflowDistribution.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }} 
                    />
                    <span className="text-neutral-700 dark:text-neutral-300 truncate text-[11px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-neutral-400 font-medium tabular-nums text-[11px]">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latency & Bottleneck Diagnostics */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Pipeline Latency & Bottleneck Diagnostics
          </h3>
          <p className="text-[11px] text-neutral-500">Autonomous execution stages vs human checkpoint dwell time</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {mockPerformanceCharts.bottlenecks.map((b) => (
            <div key={b.stage} className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 text-xs">
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block truncate">
                {b.stage}
              </span>
              <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">
                {b.avgMs > 1000 ? `${(b.avgMs / 1000).toFixed(1)}s` : `${b.avgMs}ms`}
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Pass Rate:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">{b.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Operational Observations */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#356DF3]" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Autonomous Observations & Insights
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500">
            Operational efficiencies identified across ongoing execution cycles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                    {ins.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {ins.impact}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {ins.title}
                </h4>
                <p className="mt-2 text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {ins.detail}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                <button
                  onClick={() => setActiveTab(ins.linkTab)}
                  className="text-xs font-medium text-[#356DF3] hover:text-[#2554CA] dark:text-[#5B8DFE] inline-flex items-center gap-1 transition-colors"
                >
                  <span>{ins.action}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
