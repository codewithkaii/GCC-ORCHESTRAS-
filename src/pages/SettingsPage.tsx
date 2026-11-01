import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  User, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Palette, 
  Cpu, 
  RotateCcw,
  Check,
  Save,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { currentUser } from '../data/mockData';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, resetToDefaults, addToast, agents } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'workspace' | 'profile' | 'permissions' | 'notifications' | 'security' | 'appearance'>('general');

  // Form states
  const [workspaceName, setWorkspaceName] = useState(currentUser.workspace);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [autoApprovalThreshold, setAutoApprovalThreshold] = useState('500');
  const [requireDualApprovalOver, setRequireDualApprovalOver] = useState('10000');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [mfaEnabled, setMfaEnabled] = useState(true);

  const handleSave = (section: string) => {
    addToast({
      title: 'Settings Saved',
      message: `${section} preferences updated successfully.`,
      type: 'success'
    });
  };

  const navTabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'permissions', label: 'Agent Permissions', icon: Cpu },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & 2FA', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ] as const;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Settings & Policies
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Configure autonomous agent safety boundaries, approval thresholds and workspace parameters
        </p>
      </div>

      {/* Demonstration Banner */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-400 text-xs">
        <Info className="w-4 h-4 text-[#356DF3] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-neutral-200">Demonstration Governance:</span>{' '}
          Settings and policy thresholds are persisted in client storage for this demonstration. Changes take immediate effect across workflow authorization checks and toast alerts.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Subnav */}
        <div className="md:col-span-3 p-2 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#356DF3]' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container */}
        <div className="md:col-span-9 p-6 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Platform Operating Rules
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Core execution mode and supervisory constraints
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Autonomous Dispatch Mode
                  </label>
                  <select className="w-full max-w-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden">
                    <option>Supervised Production (Human sign-off on client communications & financial actions)</option>
                    <option>High Autonomy (Only high-risk actions queued for approval)</option>
                    <option>Sandbox / Simulation Only (Zero external actions dispatched)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                    System Maintenance & Demo Controls
                  </h4>
                  <p className="text-neutral-500 mb-3">
                    Reset local demonstration storage to default seeded Dubai Logistics Hub scenario.
                  </p>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Demonstration State</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleSave('General')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Workspace Profile
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Enterprise organization details and operating hub
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Workspace Entity Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full max-w-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Operational Timezone
                  </label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full max-w-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Organization Identifier
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.organizationId}
                    className="w-full max-w-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleSave('Workspace')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Workspace
                </button>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  User Profile
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Executive identity and approval authority credentials
                </p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {currentUser.name}
                  </h4>
                  <p className="text-neutral-500">{currentUser.role}</p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.name}
                    className="w-full max-w-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Corporate Role
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.role}
                    className="w-full max-w-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleSave('Profile')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* AGENT PERMISSIONS TAB */}
          {activeTab === 'permissions' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Agent Action Boundaries & Thresholds
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Define spending caps and requirements for human executive approval
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Max Autonomous Spending Cap (USD)
                  </label>
                  <input
                    type="number"
                    value={autoApprovalThreshold}
                    onChange={(e) => setAutoApprovalThreshold(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Any freight surcharge, credit adjustment, or procurement fee above ${autoApprovalThreshold} requires manual sign-off in Approval Centre.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Dual Executive Sign-off Threshold (USD)
                  </label>
                  <input
                    type="number"
                    value={requireDualApprovalOver}
                    onChange={(e) => setRequireDualApprovalOver(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Disbursements above ${requireDualApprovalOver} require secondary review by VP of Procurement.
                  </p>
                </div>

                {/* Per Agent Autonomy Matrix */}
                <div className="pt-2">
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                    Individual Agent Autonomy Matrix
                  </h4>
                  <div className="space-y-2">
                    {agents.map((ag) => (
                      <div key={ag.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{ag.name}</p>
                          <p className="text-[11px] text-neutral-500">{ag.role}</p>
                        </div>
                        <select
                          defaultValue={ag.autonomyLevel}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                        >
                          <option>Full Autonomy</option>
                          <option>Human in the Loop</option>
                          <option>Supervised</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleSave('Agent Permissions')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Boundaries
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Notification Channels & Alerts
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Route urgent approvals and system milestones
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 cursor-pointer">
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Real-time Email Alerts
                    </span>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Receive executive alerts when high-risk actions are queued for authorization.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#356DF3]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 cursor-pointer">
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Slack Operations Channel Dispatch
                    </span>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Post interactive approval cards to #ops-executive-room.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={slackAlerts}
                    onChange={(e) => setSlackAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#356DF3]"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleSave('Notifications')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Security & Audit Compliance
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Multi-factor authentication and session boundaries
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Two-Factor Authentication (FIDO2 / TOTP)
                      </h4>
                      <p className="text-neutral-500 text-[11px]">Enforced for all executive approvers</p>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-600 font-semibold">Active</span>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Idle Session Expiration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleSave('Security')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Security
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Visual Theme & Interface
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Switch between Apple-inspired warm light theme and crisp dark console
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
                <div
                  onClick={() => {
                    if (theme === 'dark') toggleTheme();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-[#356DF3] ring-2 ring-[#356DF3]/30 bg-white shadow-md'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                  }`}
                >
                  <div className="h-20 rounded-xl bg-[#F7F7F5] border border-neutral-200 p-2 mb-3">
                    <div className="w-1/3 h-2 rounded bg-neutral-300 mb-1.5" />
                    <div className="w-2/3 h-2 rounded bg-neutral-200" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">Light Theme (Primary)</span>
                    {theme === 'light' && <Check className="w-4 h-4 text-[#356DF3]" />}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Warm off-white #F7F7F5</p>
                </div>

                <div
                  onClick={() => {
                    if (theme === 'light') toggleTheme();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-[#356DF3] ring-2 ring-[#356DF3]/30 bg-[#161820] shadow-md'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                  }`}
                >
                  <div className="h-20 rounded-xl bg-[#0F1115] border border-neutral-800 p-2 mb-3">
                    <div className="w-1/3 h-2 rounded bg-neutral-700 mb-1.5" />
                    <div className="w-2/3 h-2 rounded bg-neutral-800" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-100">Dark Theme</span>
                    {theme === 'dark' && <Check className="w-4 h-4 text-[#356DF3]" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Clean dark slate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
