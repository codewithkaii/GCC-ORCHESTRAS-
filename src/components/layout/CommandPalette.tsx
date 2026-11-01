import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Cpu, 
  CheckSquare, 
  ShieldCheck, 
  GitFork, 
  BookOpen, 
  BarChart3, 
  Cable, 
  History,
  Users,
  Settings, 
  ArrowRight, 
  Sparkles,
  X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const CommandPalette: React.FC = () => {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    setActiveTab, 
    tasks, 
    approvals, 
    setSelectedTaskId, 
    setSelectedApprovalId,
    dispatchOperationCommand
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickNavItems: Array<{ id: TabType; title: string; category: string; icon: React.ElementType }> = [
    { id: 'overview', title: 'Executive Overview', category: 'Navigation', icon: LayoutDashboard },
    { id: 'operations', title: 'AI Operations Console', category: 'Navigation', icon: Cpu },
    { id: 'tasks', title: 'Task Management', category: 'Navigation', icon: CheckSquare },
    { id: 'approvals', title: 'Approval Centre', category: 'Navigation', icon: ShieldCheck },
    { id: 'workflows', title: 'Workflow Builder', category: 'Navigation', icon: GitFork },
    { id: 'activity', title: 'Activity & Audit Log', category: 'Navigation', icon: History },
    { id: 'intelligence', title: 'Business Intelligence', category: 'Navigation', icon: BarChart3 },
    { id: 'knowledge', title: 'Knowledge Base', category: 'Navigation', icon: BookOpen },
    { id: 'integrations', title: 'Integrations Marketplace', category: 'Navigation', icon: Cable },
    { id: 'team', title: 'Team & Operators', category: 'Navigation', icon: Users },
    { id: 'settings', title: 'Settings', category: 'Navigation', icon: Settings }
  ];

  const suggestedCommands = [
    'Investigate delayed supplier orders',
    'Identify outstanding customer requests',
    'Prepare follow-ups for overdue invoices',
    'Review pending purchase orders'
  ];

  // Filter items based on query
  const filteredNav = quickNavItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredApprovals = approvals.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelectNav = (tab: TabType) => {
    setActiveTab(tab);
    setCommandPaletteOpen(false);
  };

  const handleSelectTask = (id: string) => {
    setActiveTab('tasks');
    setSelectedTaskId(id);
    setCommandPaletteOpen(false);
  };

  const handleSelectApproval = (id: string) => {
    setActiveTab('approvals');
    setSelectedApprovalId(id);
    setCommandPaletteOpen(false);
  };

  const handleRunCommand = (cmd: string) => {
    setActiveTab('operations');
    dispatchOperationCommand(cmd);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#16181F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setCommandPaletteOpen(false);
              }
              if (e.key === 'Enter' && query.trim()) {
                handleRunCommand(query.trim());
              }
            }}
            placeholder="Type a command or search operations..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Custom Command Dispatcher Prompt */}
          {query.trim() && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Autonomous Directive
              </div>
              <button
                onClick={() => handleRunCommand(query.trim())}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left bg-neutral-100 dark:bg-neutral-800/60 hover:bg-[#356DF3]/10 text-neutral-900 dark:text-neutral-100 group transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#356DF3] shrink-0" />
                  <span className="text-xs truncate font-medium">
                    Dispatch: "{query.trim()}"
                  </span>
                </div>
                <span className="text-[11px] text-[#356DF3] shrink-0 font-medium flex items-center gap-1">
                  Run <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          )}

          {/* Suggested Agent Commands */}
          {!query && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Suggested Directives
              </div>
              <div className="space-y-1">
                {suggestedCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleRunCommand(cmd)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{cmd}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Execute</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Pages & Workspaces
              </div>
              <div className="space-y-0.5">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectNav(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">Jump</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks match */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Active Tasks
              </div>
              <div className="space-y-0.5">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTask(t.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-left"
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono text-neutral-400 mr-2">{t.id}</span>
                      <span className="text-neutral-800 dark:text-neutral-200">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono capitalize text-neutral-400 shrink-0">
                      {t.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Approvals match */}
          {filteredApprovals.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Approvals
              </div>
              <div className="space-y-0.5">
                {filteredApprovals.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelectApproval(a.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-left"
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono text-amber-600 dark:text-amber-400 mr-2">{a.id}</span>
                      <span className="text-neutral-800 dark:text-neutral-200">{a.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">Review</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span>ORCHESTRA v2.4</span>
        </div>
      </div>
    </div>
  );
};
