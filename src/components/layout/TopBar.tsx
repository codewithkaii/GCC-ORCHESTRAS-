import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  Menu, 
  ChevronRight,
  RotateCcw,
  User,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { currentUser } from '../../data/mockData';

export const TopBar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    setCommandPaletteOpen, 
    setNotificationsOpen,
    notifications,
    setCreateTaskModalOpen,
    setMobileNavOpen,
    resetToDefaults
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabLabels: Record<string, string> = {
    overview: 'Executive Overview',
    operations: 'AI Operations Command Centre',
    tasks: 'Task Management',
    approvals: 'Approval Centre',
    workflows: 'Workflow Builder',
    intelligence: 'Business Intelligence',
    knowledge: 'Knowledge Base',
    integrations: 'Integrations Marketplace',
    activity: 'Audit & Activity Log',
    team: 'Team & Organization',
    settings: 'Settings'
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 bg-[#F8F8F6]/85 dark:bg-[#0D0F14]/85 backdrop-blur-xl border-b border-neutral-200/70 dark:border-neutral-800/70 transition-colors">
      {/* Zone 1: Breadcrumbs & Mobile trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-medium">
          <span className="text-neutral-400 dark:text-neutral-500 font-mono tracking-tight text-[11px]">
            ORCHESTRA
          </span>
          <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
          <span className="text-neutral-900 dark:text-neutral-100 font-semibold truncate max-w-[200px] sm:max-w-none text-[13px] tracking-tight">
            {tabLabels[activeTab] || 'Workspace'}
          </span>
        </nav>
      </div>

      {/* Zone 2: Command palette search trigger */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161821] border border-neutral-200/80 dark:border-neutral-800/80 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
            <span className="text-[12px] text-neutral-400 dark:text-neutral-500">Search operations, tasks, records...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-400 rounded border border-neutral-200/60 dark:border-neutral-700/60">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search trigger on small screens */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="sm:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-neutral-200/60 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white dark:hover:bg-[#161821] transition-all shadow-2xs"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setNotificationsOpen((prev) => !prev)}
          className="relative p-2 rounded-xl border border-neutral-200/60 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white dark:hover:bg-[#161821] transition-all shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2F68F3] ring-2 ring-white dark:ring-[#0D0F14]" />
          )}
        </button>

        {/* Primary Action Button: Create Task */}
        <button
          onClick={() => setCreateTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-2xs active:scale-98 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create new task</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* User Avatar & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center rounded-full p-0.5 ring-2 ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-700 transition-all"
            aria-label="User profile options"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#181B22] border border-neutral-200 dark:border-neutral-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1.5 inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {currentUser.workspace}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Workspace Settings</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('team');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Team Directory</span>
                </button>
                <button
                  onClick={() => {
                    resetToDefaults();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo State</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
