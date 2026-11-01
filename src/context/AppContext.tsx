import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TabType, 
  Task, 
  Approval, 
  Agent, 
  Workflow, 
  ActivityLog, 
  Integration, 
  KnowledgeDoc, 
  AppNotification, 
  TimelineEvent,
  TaskStatus 
} from '../types';
import { 
  mockTasks, 
  mockApprovals, 
  mockAgents, 
  mockWorkflows, 
  mockActivityLogs, 
  mockIntegrations, 
  mockKnowledgeDocs, 
  mockNotifications, 
  mockLiveTimeline,
  currentUser 
} from '../data/mockData';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileNavOpen: boolean;
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notificationsOpen: boolean;
  setNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createTaskModalOpen: boolean;
  setCreateTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Selected drawers/modals
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedApprovalId: string | null;
  setSelectedApprovalId: (id: string | null) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;

  // Domain state
  tasks: Task[];
  approvals: Approval[];
  agents: Agent[];
  workflows: Workflow[];
  activityLogs: ActivityLog[];
  integrations: Integration[];
  knowledgeDocs: KnowledgeDoc[];
  notifications: AppNotification[];
  liveTimeline: TimelineEvent[];
  isExecutingCommand: boolean;
  activeCommandLog: string[];

  // Mutations
  approveApproval: (id: string) => void;
  rejectApproval: (id: string, reason?: string) => void;
  requestChangesApproval: (id: string, feedback: string) => void;
  createTask: (task: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleIntegration: (id: string) => void;
  dispatchOperationCommand: (commandText: string) => Promise<void>;
  uploadKnowledgeDoc: (doc: Partial<KnowledgeDoc>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDefaults: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'orchestra_theme',
  SIDEBAR: 'orchestra_sidebar',
  TASKS: 'orchestra_tasks',
  APPROVALS: 'orchestra_approvals',
  INTEGRATIONS: 'orchestra_integrations',
  NOTIFICATIONS: 'orchestra_notifications',
  TIMELINE: 'orchestra_timeline',
  DOCS: 'orchestra_docs',
  ACTIVITY: 'orchestra_activity'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR) === 'true';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  // Inspector States
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default theme is light
  });

  // Domain States with persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : mockTasks;
  });

  const [approvals, setApprovals] = useState<Approval[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    return saved ? JSON.parse(saved) : mockApprovals;
  });

  const [agents] = useState<Agent[]>(mockAgents);
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return saved ? JSON.parse(saved) : mockActivityLogs;
  });

  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    return saved ? JSON.parse(saved) : mockIntegrations;
  });

  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
    return saved ? JSON.parse(saved) : mockKnowledgeDocs;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [liveTimeline, setLiveTimeline] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    return saved ? JSON.parse(saved) : mockLiveTimeline;
  });

  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [activeCommandLog, setActiveCommandLog] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync theme with <html> class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Save domain states to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(liveTimeline));
  }, [liveTimeline]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(knowledgeDocs));
  }, [knowledgeDocs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Keyboard shortcut for Cmd+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const approveApproval = (id: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    setApprovals((prev) =>
      prev.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'approved',
              reviewedAt: 'Just now',
              reviewerName: currentUser.name
            }
          : appr
      )
    );

    // If linked to a task, update the task execution step
    if (target.linkedTaskId) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === target.linkedTaskId) {
            return {
              ...t,
              status: 'executing',
              executionSteps: t.executionSteps.map((step) =>
                step.status === 'running' || step.text.includes('authorization')
                  ? { ...step, status: 'completed', timestamp: 'Just now' }
                  : step
              ),
              approvalHistory: [
                ...t.approvalHistory,
                {
                  action: `Approved by ${currentUser.name}`,
                  timestamp: 'Just now',
                  by: currentUser.name,
                  note: 'Executive sign-off confirmed.'
                }
              ]
            };
          }
          return t;
        })
      );
    }

    // Add activity log
    const newLog: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      executionId: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: 'Just now',
      actor: { name: currentUser.name, type: 'user', avatar: currentUser.avatarUrl },
      action: 'APPROVE_ACTION',
      resource: `${target.title} (${target.id})`,
      result: 'success',
      details: {
        targetId: target.id,
        description: `Executive authorized action: "${target.requestedAction}"`,
        metadata: { agent: target.agentName, riskLevel: target.riskLevel }
      }
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    // Add timeline event
    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: 'Just now',
      title: `Authorization granted for ${target.id}`,
      detail: `${currentUser.name} signed off on: ${target.requestedAction}`,
      agent: target.agentName,
      status: 'completed',
      tags: ['Approved', 'Executive Action']
    };
    setLiveTimeline((prev) => [newTimelineEvent, ...prev]);

    addToast({
      title: 'Action Approved',
      message: `"${target.requestedAction}" is now queued for autonomous dispatch.`,
      type: 'success'
    });
  };

  const rejectApproval = (id: string, reason?: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    setApprovals((prev) =>
      prev.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'rejected',
              reviewedAt: 'Just now',
              reviewerName: currentUser.name,
              changesFeedback: reason || 'Rejected by executive review.'
            }
          : appr
      )
    );

    const newLog: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      executionId: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: 'Just now',
      actor: { name: currentUser.name, type: 'user', avatar: currentUser.avatarUrl },
      action: 'REJECT_ACTION',
      resource: `${target.title} (${target.id})`,
      result: 'blocked',
      details: {
        targetId: target.id,
        description: `Action rejected: ${reason || 'Denied authorization by COO'}`,
        metadata: { agent: target.agentName }
      }
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast({
      title: 'Action Rejected',
      message: `The proposed action was blocked and the requesting agent has been notified.`,
      type: 'warning'
    });
  };

  const requestChangesApproval = (id: string, feedback: string) => {
    const target = approvals.find((a) => a.id === id);
    if (!target) return;

    setApprovals((prev) =>
      prev.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'changes_requested',
              reviewedAt: 'Just now',
              reviewerName: currentUser.name,
              changesFeedback: feedback
            }
          : appr
      )
    );

    const newLog: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      executionId: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: 'Just now',
      actor: { name: currentUser.name, type: 'user', avatar: currentUser.avatarUrl },
      action: 'REQUEST_CHANGES',
      resource: `${target.title} (${target.id})`,
      result: 'warning',
      details: {
        targetId: target.id,
        description: `Modification requested: ${feedback}`,
        metadata: { agent: target.agentName }
      }
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast({
      title: 'Changes Requested',
      message: `Feedback returned to ${target.agentName}. Agent will revise resolution plan.`,
      type: 'info'
    });
  };

  const createTask = (taskData: Partial<Task>) => {
    const newId = `TSK-${Math.floor(1043 + Math.random() * 100)}`;
    const assignedAgent = agents.find((a) => a.id === taskData.assignedAgentId) || agents[0];

    const newTask: Task = {
      id: newId,
      title: taskData.title || 'Untitled Operation',
      objective: taskData.objective || 'Autonomous resolution',
      description: taskData.description || 'Investigation initiated by user.',
      assignedAgentId: assignedAgent.id,
      assignedAgentName: assignedAgent.name,
      status: 'planning',
      priority: taskData.priority || 'medium',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      dueDate: taskData.dueDate || 'Today, 18:00',
      humanReviewer: currentUser.name,
      executionSteps: [
        { id: 's1', text: 'Task ingested into ORCHESTRA root queue', status: 'completed', timestamp: 'Just now' },
        { id: 's2', text: `Assigned to ${assignedAgent.name} for record investigation`, status: 'running', timestamp: 'Just now' },
        { id: 's3', text: 'Evaluate ERP and document evidence', status: 'pending', timestamp: 'Queued' },
        { id: 's4', text: 'Formulate execution plan & prepare approval package', status: 'pending', timestamp: 'Queued' }
      ],
      evidence: [],
      toolActivity: [
        {
          tool: 'Queue Orchestrator',
          action: 'enqueueTask()',
          params: `taskId=${newId}`,
          timestamp: 'Just now',
          durationMs: 85,
          status: 'success'
        }
      ],
      approvalHistory: []
    };

    setTasks((prev) => [newTask, ...prev]);

    setActivityLogs((prev) => [
      {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        executionId: `EX-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: 'Just now',
        actor: { name: currentUser.name, type: 'user', avatar: currentUser.avatarUrl },
        action: 'CREATE_TASK',
        resource: `${newTask.title} (${newId})`,
        result: 'success',
        details: {
          targetId: newId,
          description: `Dispatched new operation to ${assignedAgent.name}.`,
          metadata: { priority: newTask.priority }
        }
      },
      ...prev
    ]);

    addToast({
      title: 'Task Created & Dispatched',
      message: `Assigned to ${assignedAgent.name}. Autonomous planning active.`,
      type: 'success'
    });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: 'Just now' } : t))
    );
    addToast({
      title: 'Task Updated',
      message: `Status changed to ${status.replace('_', ' ')}.`,
      type: 'info'
    });
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'connected' ? 'available' : 'connected';
          const isNowConnected = nextStatus === 'connected';

          addToast({
            title: isNowConnected ? 'Integration Connected' : 'Integration Disconnected',
            message: `${item.name} status updated to ${nextStatus}.`,
            type: isNowConnected ? 'success' : 'info'
          });

          return {
            ...item,
            status: nextStatus,
            lastSync: isNowConnected ? 'Just now' : undefined
          };
        }
        return item;
      })
    );
  };

  const dispatchOperationCommand = async (commandText: string) => {
    if (!commandText.trim() || isExecutingCommand) return;

    setIsExecutingCommand(true);
    setActiveCommandLog([`Received directive: "${commandText}"`]);

    const steps = [
      'Parsing business intent & identifying domain entities...',
      'Routing to Operations Coordinator & querying SAP S/4HANA records...',
      'Cross-referencing enterprise knowledge base & customer contract terms...',
      'Formulating structured resolution plan...',
      'Operation established. Dispatched task & execution checkpoint ready.'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 600));
      setActiveCommandLog((prev) => [...prev, steps[i]]);
    }

    // Determine target agent
    const lower = commandText.toLowerCase();
    let assignedAgent = agents[0]; // Operations Coordinator default
    if (lower.includes('supplier') || lower.includes('vendor') || lower.includes('purchase order')) {
      assignedAgent = agents[1]; // Procurement Agent
    } else if (lower.includes('customer') || lower.includes('client') || lower.includes('inquiry')) {
      assignedAgent = agents[2]; // Customer Operations Agent
    } else if (lower.includes('invoice') || lower.includes('document') || lower.includes('tax')) {
      assignedAgent = agents[3]; // Document Intelligence Agent
    }

    const newId = `TSK-${Math.floor(1050 + Math.random() * 50)}`;
    const newTask: Task = {
      id: newId,
      title: commandText.length > 50 ? `${commandText.slice(0, 47)}...` : commandText,
      objective: `Execute autonomous resolution for: ${commandText}`,
      description: `Dispatched from Command Console by ${currentUser.name}. Investigating records and coordinating resolution steps across relevant enterprise integrations.`,
      assignedAgentId: assignedAgent.id,
      assignedAgentName: assignedAgent.name,
      status: 'executing',
      priority: 'high',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      dueDate: 'Today, 17:00',
      humanReviewer: currentUser.name,
      executionSteps: [
        { id: 's1', text: 'Command interpreted and decomposed into execution targets', status: 'completed', timestamp: 'Just now' },
        { id: 's2', text: `Assigned to ${assignedAgent.name}`, status: 'completed', timestamp: 'Just now' },
        { id: 's3', text: 'Cross-verifying current ERP status and active carrier tickets', status: 'running', timestamp: 'In progress' },
        { id: 's4', text: 'Prepare draft action for executive review', status: 'pending', timestamp: 'Next' }
      ],
      evidence: [
        {
          title: 'Command Execution Dossier',
          type: 'document',
          snippet: `Intent: "${commandText}" | Target Agent: ${assignedAgent.name}`,
          date: 'Just now'
        }
      ],
      toolActivity: [
        {
          tool: 'Natural Language Router',
          action: 'decomposeIntent()',
          params: `query="${commandText}"`,
          timestamp: 'Just now',
          durationMs: 240,
          status: 'success'
        }
      ],
      approvalHistory: []
    };

    setTasks((prev) => [newTask, ...prev]);

    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: 'Just now',
      title: `Operation dispatched: ${commandText.slice(0, 42)}...`,
      detail: `Assigned to ${assignedAgent.name}. Autonomous investigation active.`,
      agent: assignedAgent.name,
      status: 'in_progress',
      tags: ['Command Triggered', assignedAgent.role]
    };
    setLiveTimeline((prev) => [newTimelineEvent, ...prev]);

    setIsExecutingCommand(false);

    addToast({
      title: 'Operation Dispatched',
      message: `Created Task ${newId} assigned to ${assignedAgent.name}.`,
      type: 'success'
    });
  };

  const uploadKnowledgeDoc = (doc: Partial<KnowledgeDoc>) => {
    const newDoc: KnowledgeDoc = {
      id: `doc-${Date.now().toString().slice(-5)}`,
      title: doc.title || 'Uploaded Document',
      category: doc.category || 'operational',
      status: 'indexed',
      lastUpdated: 'Just now',
      size: doc.size || '1.2 MB',
      fileType: doc.fileType || 'PDF',
      vectorChunks: Math.floor(20 + Math.random() * 80),
      excerpt: doc.excerpt || 'Newly uploaded enterprise record indexed into ORCHESTRA semantic retrieval graph.',
      linkedAgents: ['Document Intelligence Agent', 'Operations Coordinator'],
      contentPreview: doc.contentPreview || `DOCUMENT PREVIEW: ${doc.title}\nStatus: Indexed and verified for autonomous retrieval.`
    };

    setKnowledgeDocs((prev) => [newDoc, ...prev]);

    addToast({
      title: 'Document Uploaded & Vectorized',
      message: `"${newDoc.title}" is now available to all AI agents.`,
      type: 'success'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info'
    });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setTasks(mockTasks);
    setApprovals(mockApprovals);
    setWorkflows(mockWorkflows);
    setActivityLogs(mockActivityLogs);
    setIntegrations(mockIntegrations);
    setKnowledgeDocs(mockKnowledgeDocs);
    setNotifications(mockNotifications);
    setLiveTimeline(mockLiveTimeline);
    setTheme('light');
    setSelectedTaskId(null);
    setSelectedApprovalId(null);
    setSelectedAgentId(null);
    setSelectedDocId(null);

    addToast({
      title: 'Data Reset',
      message: 'Platform state restored to initial enterprise demonstration data.',
      type: 'info'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        setMobileNavOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationsOpen,
        setNotificationsOpen,
        createTaskModalOpen,
        setCreateTaskModalOpen,
        selectedTaskId,
        setSelectedTaskId,
        selectedApprovalId,
        setSelectedApprovalId,
        selectedAgentId,
        setSelectedAgentId,
        selectedDocId,
        setSelectedDocId,
        tasks,
        approvals,
        agents,
        workflows,
        activityLogs,
        integrations,
        knowledgeDocs,
        notifications,
        liveTimeline,
        isExecutingCommand,
        activeCommandLog,
        approveApproval,
        rejectApproval,
        requestChangesApproval,
        createTask,
        updateTaskStatus,
        toggleIntegration,
        dispatchOperationCommand,
        uploadKnowledgeDoc,
        markNotificationRead,
        clearAllNotifications,
        resetToDefaults,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
