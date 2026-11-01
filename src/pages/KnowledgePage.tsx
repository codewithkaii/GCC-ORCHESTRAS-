import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  UploadCloud, 
  FileText, 
  X,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KnowledgeDoc } from '../types';

export const KnowledgePage: React.FC = () => {
  const { knowledgeDocs, setSelectedDocId, uploadKnowledgeDoc } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<KnowledgeDoc['category']>('operational');
  const [uploadFileType, setUploadFileType] = useState<KnowledgeDoc['fileType']>('PDF');
  const [uploadExcerpt, setUploadExcerpt] = useState('');

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'supplier', label: 'Supplier Info' },
    { id: 'customer', label: 'Customer SLAs' },
    { id: 'policy', label: 'Corporate Policies' },
    { id: 'purchase_order', label: 'Purchase Orders' },
    { id: 'operational', label: 'Operational SOPs' }
  ];

  const filteredDocs = knowledgeDocs.filter((doc) => {
    if (activeCategory !== 'all' && doc.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.excerpt.toLowerCase().includes(q) ||
        doc.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    uploadKnowledgeDoc({
      title: uploadTitle.trim(),
      category: uploadCategory,
      fileType: uploadFileType,
      excerpt: uploadExcerpt.trim() || 'Custom operational record indexed into vector memory.',
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadExcerpt('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Semantic Vector Memory & RAG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Knowledge Base
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            SOPs, customs policies, purchase agreements, and client service level contracts.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Knowledge Index:</strong> Ingested SOPs, supplier guidelines, and purchase agreements model semantic RAG memory for the autonomous agents. Document uploads and chunk previews run live in local state.
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3 p-3.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, terms, clauses..."
              className="w-full pl-8 pr-3 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#356DF3]"
            />
          </div>
          <span className="text-xs font-mono text-neutral-400 self-end sm:self-auto tabular-nums">
            {filteredDocs.length} Indexed Records
          </span>
        </div>

        {/* Categories Apple-style group */}
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

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className="p-5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                  {doc.fileType}
                </span>
                <span className="inline-flex items-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  Indexed
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-[#356DF3] transition-colors leading-snug">
                {doc.title}
              </h3>

              <p className="mt-2 text-xs text-neutral-500 leading-relaxed line-clamp-3">
                {doc.excerpt}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono tabular-nums">
                <span>{doc.vectorChunks} chunks</span>
                <span>{doc.size}</span>
                <span>{doc.lastUpdated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Simulation Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#15171F] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-neutral-200/80 dark:border-neutral-800/80">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#356DF3]" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Upload Knowledge Document
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 text-center hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                <FileText className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  Drag and drop documents here, or click to browse
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  PDF, DOCX, XLSX, JSON (Max 50MB)
                </p>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. 2026 Port of Rotterdam Terminal Agreement"
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#356DF3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  >
                    <option value="supplier">Supplier Info</option>
                    <option value="customer">Customer SLAs</option>
                    <option value="policy">Corporate Policies</option>
                    <option value="purchase_order">Purchase Orders</option>
                    <option value="operational">Operational SOPs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    File Type
                  </label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="JSON">JSON</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Executive Excerpt / Directives
                </label>
                <textarea
                  rows={2}
                  value={uploadExcerpt}
                  onChange={(e) => setUploadExcerpt(e.target.value)}
                  placeholder="Key directives or clauses contained in this document..."
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-2xs"
                >
                  Vectorize & Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
