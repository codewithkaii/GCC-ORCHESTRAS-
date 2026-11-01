import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  CheckSquare, 
  Info, 
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

export const NotificationsPanel: React.FC = () => {
  const { 
    notificationsOpen, 
    setNotificationsOpen, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    setActiveTab, 
    setSelectedApprovalId, 
    setSelectedTaskId 
  } = useApp();

  if (!notificationsOpen) return null;

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
      if (item.linkTab === 'approvals' && item.linkId) {
        setSelectedApprovalId(item.linkId);
      } else if (item.linkTab === 'tasks' && item.linkId) {
        setSelectedTaskId(item.linkId);
      }
    }
    setNotificationsOpen(false);
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'approval':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-[#356DF3]" />;
      case 'alert':
        return <Info className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={() => setNotificationsOpen(false)}
      >
        <div 
          className="w-screen max-w-md bg-white dark:bg-[#15171E] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Notifications
              </h2>
              <p className="text-xs text-neutral-500">
                Operational alerts and action checkpoints
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={clearAllNotifications}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 p-2">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-colors relative group ${
                    item.read
                      ? 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 opacity-75'
                      : 'bg-neutral-50/80 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {!item.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#356DF3]" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {item.description}
                      </p>
                      {item.linkTab && (
                        <div className="mt-2 flex items-center text-[11px] font-medium text-[#356DF3] group-hover:underline gap-1">
                          <span>View in {item.linkTab}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
