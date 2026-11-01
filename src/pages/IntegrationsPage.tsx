import React, { useState } from 'react';
import { 
  Cable, 
  Search, 
  X,
  Mail,
  MessageSquare,
  Database,
  Users,
  Compass,
  FolderSync,
  HardDrive,
  ShoppingBag,
  CreditCard,
  PhoneCall,
  Receipt,
  MailCheck,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Integration } from '../types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, toggleIntegration, addToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [configureModalItem, setConfigureModalItem] = useState<Integration | null>(null);

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'communication', label: 'Communication' },
    { id: 'business', label: 'Business & ERP' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'storage', label: 'Storage' },
    { id: 'finance', label: 'Finance' }
  ];

  const getIntegrationIcon = (name: string) => {
    switch (name) {
      case 'Gmail & Google Workspace':
        return <Mail className="w-4 h-4 text-red-500" />;
      case 'Microsoft Outlook 365':
        return <MailCheck className="w-4 h-4 text-blue-500" />;
      case 'Slack Enterprise Grid':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'SAP S/4HANA Cloud':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'Salesforce CRM':
        return <Users className="w-4 h-4 text-sky-500" />;
      case 'HubSpot':
        return <Compass className="w-4 h-4 text-orange-500" />;
      case 'Google Drive':
        return <FolderSync className="w-4 h-4 text-amber-500" />;
      case 'Microsoft OneDrive / SharePoint':
        return <HardDrive className="w-4 h-4 text-blue-400" />;
      case 'Shopify Plus B2B':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'Stripe Billing & Payments':
        return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case 'WhatsApp Business API':
        return <PhoneCall className="w-4 h-4 text-green-500" />;
      default:
        return <Receipt className="w-4 h-4 text-neutral-500" />;
    }
  };

  const filteredIntegrations = integrations.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfigureSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configureModalItem) return;

    addToast({
      title: 'Configuration Updated',
      message: `${configureModalItem.name} operating parameters saved.`,
      type: 'success'
    });
    setConfigureModalItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <Cable className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Authorized Enterprise Connectors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Integrations Marketplace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Authorize enterprise systems, communications channels, and ERP tools for autonomous agent execution.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium tabular-nums shrink-0">
          {integrations.filter((i) => i.status === 'connected').length} of {integrations.length} Active Connectors
        </span>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Connectors Sandbox:</strong> Enterprise toolings (SAP, Salesforce, Stripe, SkyCargo) demonstrate authorized agent capabilities. Connecting, disconnecting, and configuring tools update live interactive state.
          </span>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enterprise connectors..."
              className="w-full pl-8 pr-3 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#356DF3]"
            />
          </div>
          <div className="text-[11px] text-neutral-400">
            Simulated enterprise sandbox environment
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  {getIntegrationIcon(item.name)}
                </div>
                <span className="inline-flex items-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === 'connected' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  {item.status === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {item.name}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono tabular-nums">
                <span>{item.authType}</span>
                {item.lastSync && (
                  <span>Sync {item.lastSync}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => setConfigureModalItem(item)}
                      className="flex-1 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => toggleIntegration(item.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleIntegration(item.id)}
                    className="w-full py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs"
                  >
                    Connect Service
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {configureModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#15171F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-neutral-200/80 dark:border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  {getIntegrationIcon(configureModalItem.name)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Configure {configureModalItem.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500">Autonomous bridge parameters</p>
                </div>
              </div>
              <button
                onClick={() => setConfigureModalItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfigureSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Sync Cadence
                </label>
                <select className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden">
                  <option>Real-time Webhook Streaming (Sub-second)</option>
                  <option>Every 5 minutes</option>
                  <option>Hourly Reconciliation Batch</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Agent Autonomous Access Level
                </label>
                <select className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden">
                  <option>Read & Write (Human in the Loop on external messages)</option>
                  <option>Read-Only Query Access</option>
                  <option>Full Autonomous Dispatch</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold block mb-0.5 text-neutral-800 dark:text-neutral-200">
                  Security Boundary:
                </span>
                All actions executed through this connector emit cryptographic audit hashes logged to the permanent audit record.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setConfigureModalItem(null)}
                  className="px-3.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold"
                >
                  Save Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
