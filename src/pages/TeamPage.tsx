import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  X,
  Info
} from 'lucide-react';
import { mockTeamMembers } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const TeamPage: React.FC = () => {
  const { addToast } = useApp();
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Operations Reviewer');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: inviteEmail.split('@')[0].replace('.', ' '),
      role: inviteRole,
      email: inviteEmail.trim(),
      accessLevel: inviteRole,
      status: 'pending_invitation' as const,
      lastActive: 'Invitation Sent'
    };

    setTeamMembers((prev) => [...prev, newMember as any]);
    setIsInviteOpen(false);
    setInviteEmail('');

    addToast({
      title: 'Invitation Dispatched',
      message: `Sent executive invitation to ${inviteEmail}.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <Users className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Workspace Personnel & RBAC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Team & Operators
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Manage authorized human operators, approval delegates, and audit supervisors.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Demonstration Banner */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-400 text-xs">
        <Info className="w-4 h-4 text-[#356DF3] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-neutral-900 dark:text-neutral-200">Demonstration Workspace:</span>{' '}
          Role-based delegation and team invitations are interactive in local state. Invitations dynamically register new operators into this session.
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                    {member.avatarFallback || 'OP'}
                  </div>
                )}
                <span className="inline-flex items-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${member.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  {member.status === 'online' ? 'Active' : 'Offline'}
                </span>
              </div>

              <h3 className="mt-3.5 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {member.name}
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                {member.role}
              </p>
              <p className="mt-1 text-[11px] text-neutral-400 truncate font-mono">
                {member.email}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {member.accessLevel}
              </span>
              <span className="text-[10px] text-neutral-400 tabular-nums">{member.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#15171F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Invite Operational Operator
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="operator@company.com"
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#356DF3]"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Access Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                >
                  <option value="Operations Reviewer">Operations Reviewer (Review & Authorize)</option>
                  <option value="Executive Admin">Executive Admin (Full Governance)</option>
                  <option value="Audit Supervisor">Audit Supervisor (Read-only Compliance)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
