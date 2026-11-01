import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Play, 
  Plus, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Save, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowRight,
  Database,
  FileSearch,
  Check,
  Terminal,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Workflow, WorkflowNode } from '../types';

export const WorkflowsPage: React.FC = () => {
  const { workflows, agents, addToast } = useApp();

  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(workflows[0]?.id || 'wf-supplier-delay');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simActiveIndex, setSimActiveIndex] = useState<number>(-1);
  const [simLog, setSimLog] = useState<string[]>([]);

  const currentWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0];
  const [nodes, setNodes] = useState<WorkflowNode[]>(currentWorkflow?.nodes || []);

  useEffect(() => {
    if (currentWorkflow) {
      setNodes(currentWorkflow.nodes);
      setSelectedNode(null);
      setIsSimulating(false);
      setSimActiveIndex(-1);
      setSimLog([]);
    }
  }, [activeWorkflowId, currentWorkflow]);

  // Run Simulation Step-by-Step
  const handleStartSimulation = async () => {
    if (isSimulating || nodes.length === 0) return;
    setIsSimulating(true);
    setSimLog([`Starting autonomous workflow simulation: ${currentWorkflow.name}`]);

    for (let i = 0; i < nodes.length; i++) {
      setSimActiveIndex(i);
      const curr = nodes[i];
      setSimLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executing Node ${i + 1}/${nodes.length}: "${curr.title}" (${curr.agent || 'System Gateway'})`
      ]);
      await new Promise((res) => setTimeout(res, 850));
    }

    setSimLog((prev) => [
      ...prev,
      `✓ Workflow execution cycle completed nominal. All operational checkpoints satisfied.`
    ]);
    setIsSimulating(false);
    addToast({
      title: 'Workflow Simulation Completed',
      message: `${currentWorkflow.name} verified successfully.`,
      type: 'success'
    });
  };

  const handleAddNode = () => {
    const newId = `n${nodes.length + 1}`;
    const newNode: WorkflowNode = {
      id: newId,
      type: 'action',
      title: 'Carrier Route Audit',
      subtitle: 'Audit electronic seal telemetry & GPS corridor',
      status: 'idle',
      agent: 'Procurement Agent',
      x: 80 + nodes.length * 200,
      y: 180
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
    addToast({
      title: 'Node Added',
      message: 'New operational step added to pipeline.',
      type: 'info'
    });
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
    addToast({
      title: 'Node Removed',
      message: `Node ${id} removed from graph.`,
      type: 'info'
    });
  };

  const handleSaveWorkflow = () => {
    addToast({
      title: 'Workflow Saved',
      message: `Changes to "${currentWorkflow.name}" committed to runtime engine.`,
      type: 'success'
    });
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger':
        return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
      case 'extraction':
        return <FileSearch className="w-3.5 h-3.5 text-blue-500" />;
      case 'retrieval':
        return <Database className="w-3.5 h-3.5 text-emerald-500" />;
      case 'investigation':
        return <Cpu className="w-3.5 h-3.5 text-[#356DF3]" />;
      case 'plan':
        return <GitFork className="w-3.5 h-3.5 text-indigo-500" />;
      case 'approval_gate':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />;
      case 'action':
        return <Play className="w-3.5 h-3.5 text-blue-600" />;
      case 'verify':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />;
      case 'completed':
        return <Check className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
            <GitFork className="w-3.5 h-3.5 text-[#356DF3]" />
            <span>Autonomous Orchestration Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Workflow Builder
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Design multi-agent operations, configure conditional checkpoints, and simulate live tool triggers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-colors shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
          <button
            onClick={handleSaveWorkflow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            <Save className="w-3 h-3 text-neutral-400" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#356DF3] shrink-0" />
          <span>
            <strong>Simulated Workflow Engine:</strong> Node flows and execution steps model enterprise logistics routing. The simulation runner executes a realistic, client-side progressive demonstration of autonomous agent handoffs.
          </span>
        </div>
      </div>

      {/* Workflow Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#14161E] border border-neutral-200/70 dark:border-neutral-800/70 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {workflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => setActiveWorkflowId(wf.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeWorkflowId === wf.id
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {wf.name}
            </button>
          ))}
        </div>

        {/* Zoom & Canvas Tools */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
          <div className="h-3.5 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />
          <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
              className="p-1 rounded text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-neutral-500 px-1.5 tabular-nums">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 140))}
              className="p-1 rounded text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 ml-0.5"
              title="Reset zoom"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-2xl bg-[#FAFAF8] dark:bg-[#0D0F14] border border-neutral-200/70 dark:border-neutral-800/70 overflow-hidden shadow-inner min-h-[460px]">
        {/* Apple-style dot grid */}
        <div 
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #777 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Viewport */}
        <div 
          className="p-8 sm:p-12 overflow-x-auto min-w-full flex items-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
        >
          <div className="flex items-center gap-6 py-8">
            {nodes.map((node, index) => {
              const isActiveSim = simActiveIndex === index;
              const isPastSim = simActiveIndex > index;
              const isSelected = selectedNode?.id === node.id;

              return (
                <React.Fragment key={node.id}>
                  {/* Step Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`relative w-56 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'ring-2 ring-[#356DF3] border-transparent bg-white dark:bg-[#15171F] shadow-sm'
                        : isActiveSim
                        ? 'ring-2 ring-emerald-500 border-transparent bg-white dark:bg-[#15171F] shadow-sm animate-pulse'
                        : isPastSim
                        ? 'border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#15171F]'
                        : 'border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-[#15171F] shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    {isActiveSim && (
                      <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-mono font-semibold uppercase shadow-2xs">
                        Executing
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="font-mono text-[10px] text-neutral-400 tabular-nums">
                        Step 0{index + 1}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                      {node.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
                      {node.subtitle}
                    </p>

                    {node.agent && (
                      <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <Cpu className="w-3 h-3 text-[#356DF3]" />
                        <span className="truncate">{node.agent}</span>
                      </div>
                    )}
                  </div>

                  {/* Flow Arrow */}
                  {index < nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center shrink-0 text-neutral-300 dark:text-neutral-700">
                      <div className={`w-8 h-0.5 transition-colors ${
                        isPastSim ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`} />
                      <ArrowRight className={`w-3.5 h-3.5 -ml-1 transition-colors ${
                        isPastSim ? 'text-emerald-500' : 'text-neutral-400 dark:text-neutral-600'
                      }`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 p-4 rounded-2xl bg-white/95 dark:bg-[#181B24]/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-xl z-20 space-y-3 animate-in slide-in-from-right-3 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Step Configuration
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Step Title</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const updated = { ...selectedNode, title: e.target.value };
                    setSelectedNode(updated);
                    setNodes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Directive / Subtitle</label>
                <textarea
                  rows={2}
                  value={selectedNode.subtitle}
                  onChange={(e) => {
                    const updated = { ...selectedNode, subtitle: e.target.value };
                    setSelectedNode(updated);
                    setNodes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Executing Agent</label>
                <select
                  value={selectedNode.agent || ''}
                  onChange={(e) => {
                    const updated = { ...selectedNode, agent: e.target.value };
                    setSelectedNode(updated);
                    setNodes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden text-xs"
                >
                  <option value="">System Gateway / Webhook</option>
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.name}>{ag.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-[11px] font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Step</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Console Log Stream */}
      {simLog.length > 0 && (
        <div className="p-4 rounded-2xl bg-neutral-900 text-neutral-100 font-mono text-xs border border-neutral-800 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pb-1.5 border-b border-neutral-800">
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5" />
              Workflow Execution Telemetry
            </span>
            <button
              onClick={() => setSimLog([])}
              className="text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1 pt-1 text-[11px]">
            {simLog.map((line, idx) => (
              <p key={idx} className="text-neutral-300 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
