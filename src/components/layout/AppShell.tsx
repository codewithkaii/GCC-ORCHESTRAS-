import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { NotificationsPanel } from './NotificationsPanel';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailDrawer } from '../tasks/TaskDetailDrawer';
import { ApprovalDetailModal } from '../approvals/ApprovalDetailModal';
import { AgentDetailModal } from '../agents/AgentDetailModal';
import { DocumentPreviewDrawer } from '../knowledge/DocumentPreviewDrawer';
import { ToastContainer } from '../shared/ToastContainer';

// Pages
import { OverviewPage } from '../../pages/OverviewPage';
import { OperationsPage } from '../../pages/OperationsPage';
import { TasksPage } from '../../pages/TasksPage';
import { ApprovalsPage } from '../../pages/ApprovalsPage';
import { WorkflowsPage } from '../../pages/WorkflowsPage';
import { IntelligencePage } from '../../pages/IntelligencePage';
import { KnowledgePage } from '../../pages/KnowledgePage';
import { IntegrationsPage } from '../../pages/IntegrationsPage';
import { ActivityPage } from '../../pages/ActivityPage';
import { TeamPage } from '../../pages/TeamPage';
import { SettingsPage } from '../../pages/SettingsPage';

export const AppShell: React.FC = () => {
  const { activeTab, mobileNavOpen, setMobileNavOpen } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'operations':
        return <OperationsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'workflows':
        return <WorkflowsPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'activity':
        return <ActivityPage />;
      case 'team':
        return <TeamPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F7F5] dark:bg-[#0F1115] text-[#171717] dark:text-[#F3F4F6] transition-colors duration-150 antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Slide-Over Sidebar */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 flex flex-col w-72 max-w-full bg-[#FAFAFA] dark:bg-[#12141A]">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals, Drawers & Toasts */}
      <CommandPalette />
      <NotificationsPanel />
      <CreateTaskModal />
      <TaskDetailDrawer />
      <ApprovalDetailModal />
      <AgentDetailModal />
      <DocumentPreviewDrawer />
      <ToastContainer />
    </div>
  );
};
