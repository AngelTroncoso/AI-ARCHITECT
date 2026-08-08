import React, { useState } from 'react';
import { ModelMetrics, EvaluationResult, Challenge, Language, HFModel } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Zap,
  HardDrive,
  Cpu,
  DollarSign,
  Target,
  BarChart3,
  Layers,
  Terminal,
  UploadCloud,
  Sparkles
} from 'lucide-react';

interface SandboxOutputProps {
  baseMetrics: ModelMetrics;
  evalResult: EvaluationResult | null;
  challenge: Challenge;
  activeModel: HFModel;
  userLang: Language;
  onPublishToHF: () => void;
}

export const SandboxOutput: React.FC<SandboxOutputProps> = ({
  baseMetrics,
  evalResult,
  challenge,
  activeModel,
  userLang,
  onPublishToHF,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'visualizer' | 'logs'>('metrics');
  const [isPublished, setIsPublished] = useState(false);
  const t = TRANSLATIONS[userLang];

  const currentMetrics = evalResult?.updatedMetrics || baseMetrics;

  // Percentage calculations
  const latencyPct = Math.min(100, Math.round((currentMetrics.latencyMs / baseMetrics.latencyMs) * 100));
  const sizePct = Math.min(100, Math.round((currentMetrics.sizeMb / baseMetrics.sizeMb) * 100));
  const accuracyPct = Math.min(100, Math.round(currentMetrics.accuracy));
  const costPct = Math.min(100, Math.round((currentMetrics.costPer1k / baseMetrics.costPer1k) * 100));

  const handlePublish = () => {
    setIsPublished(true);
    onPublishToHF();
    setTimeout(() => setIsPublished(false), 4000);
  };

  // Helper function to check if target metric is satisfied
  const checkTargetPass = (key: keyof typeof challenge.targetMetrics) => {
    if (!evalResult) return false;
    const target = challenge.targetMetrics[key];
    if (target === undefined) return true;

    switch (key) {
      case 'maxLatencyMs':
        return currentMetrics.latencyMs <= target;
      case 'maxSizeMb':
        return currentMetrics.sizeMb <= target;
      case 'maxParamsM':
        return currentMetrics.paramsM <= target;
      case 'maxCostPer1k':
        return currentMetrics.costPer1k <= target;
      case 'minAccuracy':
        return currentMetrics.accuracy >= target;
      default:
        return true;
    }
  };

  return (
    <div id="sandbox-output-container" className="flex flex-col h-full bg-[#0D0F14] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Bar Tabs */}
      <div className="bg-[#0A0B0E] border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase">
            Sandbox Real-Time Metrics
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold uppercase tracking-wider hidden sm:inline-block">
            ACTIVE INFERENCE
          </span>

          {/* View Switcher Tabs */}
          <div className="flex items-center space-x-1 bg-[#161921] p-0.5 rounded-lg border border-white/10">
            <button
              id="tab-sandbox-metrics"
              onClick={() => setActiveTab('metrics')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Métricas</span>
            </button>

            <button
              id="tab-sandbox-visualizer"
              onClick={() => setActiveTab('visualizer')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'visualizer'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Red & Pesos</span>
            </button>

            <button
              id="tab-sandbox-logs"
              onClick={() => setActiveTab('logs')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Consola</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between">
        {activeTab === 'metrics' && (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Status Banner */}
            {evalResult ? (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  evalResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {evalResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider">
                      {evalResult.success
                        ? '¡RETO COMPLETADO CON ÉXITO!'
                        : 'OPTIMIZACIÓN INCOMPLETA'}
                    </h4>
                    <p className="text-[11px] opacity-90">{evalResult.feedback}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-black">{evalResult.score}/100</div>
                  <div className="text-[10px] font-mono text-emerald-400">+{evalResult.xpEarned} XP</div>
                </div>
              </div>
            ) : null}

            {/* 2x2 Metric Cards Grid (Immersive UI Theme) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Latency Card */}
              <div className="bg-[#161921] border border-white/5 p-3.5 rounded-xl shadow-lg">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Latency (ms)</span>
                  <Zap className="w-3 h-3 text-amber-400" />
                </p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-black text-white">{currentMetrics.latencyMs}ms</span>
                  <span className={`text-xs font-bold ${currentMetrics.latencyMs < baseMetrics.latencyMs ? 'text-green-400' : 'text-slate-400'}`}>
                    {currentMetrics.latencyMs < baseMetrics.latencyMs
                      ? `-${Math.round(((baseMetrics.latencyMs - currentMetrics.latencyMs) / baseMetrics.latencyMs) * 100)}% ▼`
                      : '0%'}
                  </span>
                </div>
                <div className="metric-bar overflow-hidden">
                  <div className="metric-progress bg-green-500" style={{ width: `${Math.min(100, Math.max(10, latencyPct))}%` }}></div>
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] text-slate-500 font-mono">
                  <span>ORIG: {baseMetrics.latencyMs}ms</span>
                  <span>GOAL: {challenge.targetMetrics.maxLatencyMs ? `< ${challenge.targetMetrics.maxLatencyMs}ms` : 'N/A'}</span>
                </div>
              </div>

              {/* Size Card */}
              <div className="bg-[#161921] border border-white/5 p-3.5 rounded-xl shadow-lg">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Model Size (MB)</span>
                  <HardDrive className="w-3 h-3 text-cyan-400" />
                </p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-black text-white">{currentMetrics.sizeMb}MB</span>
                  <span className={`text-xs font-bold ${currentMetrics.sizeMb < baseMetrics.sizeMb ? 'text-green-400' : 'text-slate-400'}`}>
                    {currentMetrics.sizeMb < baseMetrics.sizeMb
                      ? `-${Math.round(((baseMetrics.sizeMb - currentMetrics.sizeMb) / baseMetrics.sizeMb) * 100)}% ▼`
                      : '0%'}
                  </span>
                </div>
                <div className="metric-bar overflow-hidden">
                  <div className="metric-progress bg-blue-500" style={{ width: `${Math.min(100, Math.max(10, sizePct))}%` }}></div>
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] text-slate-500 font-mono">
                  <span>ORIG: {baseMetrics.sizeMb}MB</span>
                  <span>GOAL: {challenge.targetMetrics.maxSizeMb ? `< ${challenge.targetMetrics.maxSizeMb}MB` : 'N/A'}</span>
                </div>
              </div>

              {/* Accuracy Card */}
              <div className="bg-[#161921] border border-white/5 p-3.5 rounded-xl shadow-lg">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Accuracy (%)</span>
                  <Target className="w-3 h-3 text-cyan-400" />
                </p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-black text-white">{currentMetrics.accuracy}%</span>
                  <span className="text-xs font-bold text-cyan-400">
                    {currentMetrics.accuracy >= baseMetrics.accuracy ? '✓ 100%' : `${currentMetrics.accuracy}%`}
                  </span>
                </div>
                <div className="metric-bar overflow-hidden">
                  <div className="metric-progress bg-cyan-500" style={{ width: `${Math.min(100, accuracyPct)}%` }}></div>
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] text-slate-500 font-mono">
                  <span>ORIG: {baseMetrics.accuracy}%</span>
                  <span>GOAL: {challenge.targetMetrics.minAccuracy ? `≥ ${challenge.targetMetrics.minAccuracy}%` : 'N/A'}</span>
                </div>
              </div>

              {/* Cost Card */}
              <div className="bg-[#161921] border border-white/5 p-3.5 rounded-xl shadow-lg">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Inference Cost ($/1K)</span>
                  <DollarSign className="w-3 h-3 text-purple-400" />
                </p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-black text-white">${currentMetrics.costPer1k}</span>
                  <span className={`text-xs font-bold ${currentMetrics.costPer1k < baseMetrics.costPer1k ? 'text-green-400' : 'text-slate-400'}`}>
                    {currentMetrics.costPer1k < baseMetrics.costPer1k
                      ? `-${Math.round(((baseMetrics.costPer1k - currentMetrics.costPer1k) / baseMetrics.costPer1k) * 100)}% ▼`
                      : '0%'}
                  </span>
                </div>
                <div className="metric-bar overflow-hidden">
                  <div className="metric-progress bg-purple-500" style={{ width: `${Math.min(100, Math.max(10, costPct))}%` }}></div>
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] text-slate-500 font-mono">
                  <span>ORIG: ${baseMetrics.costPer1k}</span>
                  <span>GOAL: {challenge.targetMetrics.maxCostPer1k ? `< $${challenge.targetMetrics.maxCostPer1k}` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Visual Sandbox Graph Container (Immersive UI Theme) */}
            <div className="flex-1 min-h-[160px] bg-[#090A0D] border border-white/5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4 shadow-inner">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(#00E0FF 0.75px, transparent 0.75px)',
                  backgroundSize: '12px 12px',
                }}
              />

              <div className="relative w-full flex flex-col items-center justify-center">
                <div className="absolute -top-3 -right-2 bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded font-bold border border-cyan-500/30 shadow-md">
                  GPU: A100 Load 42%
                </div>

                <svg width="280" height="90" viewBox="0 0 300 100" className="drop-shadow-2xl">
                  <path
                    d="M10 80 Q 50 10, 90 70 T 170 40 T 290 20"
                    fill="none"
                    stroke="#00E0FF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                  <circle cx="290" cy="20" r="5" fill="#00E0FF" className="animate-ping" />
                  <circle cx="290" cy="20" r="4" fill="#00E0FF" />
                  <path d="M10 85 L 290 85" stroke="white" strokeDasharray="4" strokeWidth="1" opacity="0.15" />
                </svg>

                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                  Weight Distribution Dynamics
                </p>
              </div>
            </div>

            {/* Hugging Face Publish CTA */}
            {evalResult?.success && (
              <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    ¡Modelo listo para la comunidad Open-Source!
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Publica <span className="font-mono text-cyan-300">{activeModel.name}-architect-optimized</span> en Hugging Face Simulator.
                  </p>
                </div>
                <button
                  id="btn-publish-hf"
                  onClick={handlePublish}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs rounded-lg shadow-md flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{t.publishToHF}</span>
                </button>
              </div>
            )}

            {isPublished && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-xs rounded-xl text-center font-bold animate-bounce">
                {t.publishedSuccess}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WEIGHT & ATTENTION VISUALIZER */}
        {activeTab === 'visualizer' && (
          <div className="space-y-4">
            <div className="bg-[#161921] border border-white/5 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Matriz de Atención & Pesos Cuantizados
              </h4>
              <p className="text-xs text-slate-400">
                Visualización interactiva de cabezas de atención (Multi-Head Attention) y tensores podados.
              </p>

              {/* Grid of Attention Heads */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {Array.from({ length: 12 }).map((_, idx) => {
                  const isPruned = evalResult?.weightDelta?.prunedPercentage ? idx % 3 === 0 : false;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isPruned
                          ? 'bg-rose-950/30 border-rose-800/50 text-rose-400 opacity-50 line-through'
                          : 'bg-indigo-950/40 border-indigo-700/50 text-indigo-300'
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 font-mono">Head {idx + 1}</div>
                      <div className="text-xs font-bold mt-1">
                        {isPruned ? 'PRUNED' : `${evalResult?.weightDelta?.quantizationBits || 32}-BIT`}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats delta pill */}
              <div className="grid grid-cols-2 gap-2 pt-3 text-xs border-t border-white/5">
                <div className="bg-[#0A0B0E] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Aceleración Inferencia</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    {evalResult?.weightDelta?.speedupFactor || 1.0}x Speedup
                  </span>
                </div>
                <div className="bg-[#0A0B0E] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Cabezas Podadas</span>
                  <span className="text-purple-400 font-bold font-mono text-sm">
                    {evalResult?.weightDelta?.prunedPercentage || 0}% Pruning
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXECUTION LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-[#0A0B0E] border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 h-full min-h-[300px]">
            <div className="text-slate-500 text-[11px] pb-2 border-b border-white/5 flex items-center justify-between">
              <span>=== AI Architect Compiler Tensor Benchmark Logs ===</span>
              <span className="text-emerald-400">[ONLINE]</span>
            </div>

            {evalResult?.executionLogs && evalResult.executionLogs.length > 0 ? (
              evalResult.executionLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed hover:bg-[#161921] px-1 rounded">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))
            ) : (
              <div className="text-slate-600 italic pt-4">
                No hay logs registrados. Presiona "RUN BENCHMARK" para compilar.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
