import React from 'react';
import { 
  X, 
  Download, 
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentPreviewDrawer: React.FC = () => {
  const { selectedDocId, setSelectedDocId, knowledgeDocs, addToast } = useApp();

  if (!selectedDocId) return null;

  const doc = knowledgeDocs.find((d) => d.id === selectedDocId);
  if (!doc) return null;

  const handleDownload = () => {
    addToast({
      title: 'Download Initiated',
      message: `Exporting "${doc.title}" verified payload.`,
      type: 'info'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
        onClick={() => setSelectedDocId(null)}
      >
        <div 
          className="w-screen max-w-2xl bg-white dark:bg-[#15171F] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-neutral-400">
                {doc.fileType}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="inline-flex items-center text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                Vector Indexed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Download export"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDocId(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {doc.title}
              </h2>
              <p className="mt-1 text-neutral-500 text-[11px]">
                Category: <span className="capitalize font-medium text-neutral-700 dark:text-neutral-300">{doc.category.replace('_', ' ')}</span> · Size: {doc.size}
              </p>
            </div>

            {/* Vector stats */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60">
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Vector Chunks</span>
                <p className="font-mono font-medium text-neutral-900 dark:text-neutral-100 mt-0.5 tabular-nums">
                  {doc.vectorChunks} indexed
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Last Synced</span>
                <p className="font-medium text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {doc.lastUpdated}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Embedding Engine</span>
                <p className="font-mono text-[11px] text-neutral-900 dark:text-neutral-100 mt-0.5">
                  text-embedding-3
                </p>
              </div>
            </div>

            {/* Linked Agents */}
            <div>
              <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] mb-1.5">
                Authorized Agents with RAG Access
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {doc.linkedAgents.map((ag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-[11px]"
                  >
                    <Cpu className="w-3 h-3 text-[#356DF3]" />
                    {ag}
                  </span>
                ))}
              </div>
            </div>

            {/* Text Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">
                  Document Content Preview
                </h4>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Full text extraction verified
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/70 text-neutral-800 dark:text-neutral-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap selection:bg-blue-100 dark:selection:bg-blue-900/40">
                {doc.contentPreview}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-end bg-neutral-50/50 dark:bg-neutral-900/40">
            <button
              onClick={() => setSelectedDocId(null)}
              className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
