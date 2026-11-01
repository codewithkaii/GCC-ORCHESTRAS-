import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  CheckSquare, 
  ShieldCheck, 
  GitFork, 
  History, 
  BookOpen, 
  BarChart3, 
  Cable, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { currentUser } from '../../data/mockData';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'blue' | 'amber' | 'neutral';
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    tasks,
    approvals,
    setMobileNavOpen
  } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeTasksCount = tasks.filter((t) => t.status === 'executing' || t.status === 'planning' || t.status === 'awaiting_approval').length;

  const workspaceNav: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'operations', label: 'AI Operations', icon: Cpu },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: activeTasksCount, badgeVariant: 'blue' },
    { id: 'approvals', label: 'Approvals', icon: ShieldCheck, badge: pendingApprovalsCount, badgeVariant: 'amber' },
    { id: 'workflows', label: 'Workflows', icon: GitFork },
    { id: 'activity', label: 'Activity', icon: History }
  ];

  const intelligenceNav: NavItem[] = [
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'intelligence', label: 'Business Insights', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Cable }
  ];

  const managementNav: NavItem[] = [
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: TabType) => {
    setActiveTab(id);
    setMobileNavOpen(false);
  };

  const renderNavList = (items: NavItem[], sectionTitle?: string) => (
    <div className="mb-5">
      {sectionTitle && !sidebarCollapsed && (
        <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400/90 dark:text-neutral-500">
          {sectionTitle}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-white dark:bg-[#1C1F2B] text-neutral-900 dark:text-white shadow-2xs border border-neutral-200/70 dark:border-neutral-700/60 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#2F68F3] dark:text-[#5B8DFE]' : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200'
                }`} />

                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left tracking-tight">{item.label}</span>
                )}

                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto text-[11px] font-mono tabular-nums px-2 py-0.2 rounded-full font-semibold ${
                      item.badgeVariant === 'amber'
                        ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300'
                        : 'bg-neutral-200/70 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#2F68F3]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col border-r border-neutral-200/70 dark:border-neutral-800/80 bg-[#FBFBFA] dark:bg-[#101217] transition-all duration-200 ease-out z-30 select-none ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[252px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200/60 dark:border-neutral-800/70">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold tracking-tight text-neutral-900 dark:text-white leading-none">
                ORCHESTRA
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 tracking-normal mt-0.5 font-medium">
                AI Operations Platform
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3.5">
        {renderNavList(workspaceNav, 'Workspace')}
        {renderNavList(intelligenceNav, 'Intelligence')}
        {renderNavList(managementNav, 'Management')}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-neutral-200/60 dark:border-neutral-800/70 space-y-2">
        {/* Workspace Switcher */}
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-[#161821] border border-neutral-200/70 dark:border-neutral-800 text-xs shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <div className="truncate flex-1 min-w-0">
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate tracking-tight text-[11px]">
                {currentUser.workspace}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono">
                {currentUser.organizationId}
              </p>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors ${
            sidebarCollapsed ? 'justify-center p-1.5' : ''
          }`}
          title={sidebarCollapsed ? currentUser.name : undefined}
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate tracking-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
