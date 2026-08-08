import React, { useState } from 'react';
import { Language } from '../types';
import {
  Swords,
  X,
  Zap,
  Cpu,
  BarChart2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ModelArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLang?: Language;
}

interface ArenaModel {
  id: string;
  name: string;
  org: string;
  params: string;
  throughput: number; // tok/s
  vram: number; // GB
  mmlu: number; // score
  latency: number; // ms
}

const ARENA_MODELS: ArenaModel[] = [
  { id: 'llama3', name: 'Llama-3.1-8B-Instruct', org: 'Meta AI', params: '8.0B', throughput: 85, vram: 5.8, mmlu: 68.4, latency: 22 },
  { id: 'mistral', name: 'Mistral-7B-v0.3', org: 'Mistral AI', params: '7.3B', throughput: 92, vram: 4.9, mmlu: 64.2, latency: 19 },
  { id: 'gemma', name: 'Gemma-2-9B-It', org: 'Google DeepMind', params: '9.2B', throughput: 78, vram: 6.4, mmlu: 71.3, latency: 25 },
  { id: 'deepseek', name: 'DeepSeek-R1-Distill-Qwen-7B', org: 'DeepSeek AI', params: '7.0B', throughput: 95, vram: 4.8, mmlu: 72.8, latency: 17 },
  { id: 'qwen', name: 'Qwen-2.5-Coder-7B', org: 'Alibaba Cloud', params: '7.6B', throughput: 88, vram: 5.2, mmlu: 70.1, latency: 20 },
];

export const ModelArenaModal: React.FC<ModelArenaModalProps> = ({
  isOpen,
  onClose,
  userLang = 'es',
}) => {
  const [selectedModel1, setSelectedModel1] = useState<string>('llama3');
  const [selectedModel2, setSelectedModel2] = useState<string>('deepseek');

  if (!isOpen) return null;

  const m1 = ARENA_MODELS.find((m) => m.id === selectedModel1) || ARENA_MODELS[0];
  const m2 = ARENA_MODELS.find((m) => m.id === selectedModel2) || ARENA_MODELS[3];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/40">
              <Swords className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ARENA DE COMBATE BENCHMARK DE MODELOS LLM
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300 font-mono font-bold">
                  HUGGING FACE ARENA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Compara en tiempo real el rendimiento, velocidad y consumo VRAM entre modelos abiertos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Selection Duels */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model 1 Selector */}
            <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">MODELO A:</span>
              <select
                value={selectedModel1}
                onChange={(e) => setSelectedModel1(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
              >
                {ARENA_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.org})</option>
                ))}
              </select>

              <div className="p-3 bg-slate-900/80 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Parámetros:</span><span className="text-white font-bold">{m1.params}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Throughput:</span><span className="text-emerald-400 font-bold">{m1.throughput} tokens/s</span></div>
                <div className="flex justify-between"><span className="text-slate-400">VRAM Necesaria:</span><span className="text-cyan-400 font-bold">{m1.vram} GB</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Latencia TTFT:</span><span className="text-amber-400 font-bold">{m1.latency} ms</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Accuracy MMLU:</span><span className="text-purple-400 font-bold">{m1.mmlu}%</span></div>
              </div>
            </div>

            {/* Model 2 Selector */}
            <div className="p-4 bg-slate-950 border border-purple-500/40 rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">MODELO B:</span>
              <select
                value={selectedModel2}
                onChange={(e) => setSelectedModel2(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-purple-500"
              >
                {ARENA_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.org})</option>
                ))}
              </select>

              <div className="p-3 bg-slate-900/80 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Parámetros:</span><span className="text-white font-bold">{m2.params}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Throughput:</span><span className="text-emerald-400 font-bold">{m2.throughput} tokens/s</span></div>
                <div className="flex justify-between"><span className="text-slate-400">VRAM Necesaria:</span><span className="text-cyan-400 font-bold">{m2.vram} GB</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Latencia TTFT:</span><span className="text-amber-400 font-bold">{m2.latency} ms</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Accuracy MMLU:</span><span className="text-purple-400 font-bold">{m2.mmlu}%</span></div>
              </div>
            </div>
          </div>

          {/* Comparative Verdict Banner */}
          <div className="p-4 bg-gradient-to-r from-cyan-950 via-slate-950 to-purple-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-slate-300 font-bold block">
                  VERDICTO DE EFICIENCIA AGI:
                </span>
                <span className="text-cyan-300">
                  {m1.throughput > m2.throughput ? `${m1.name} es ${((m1.throughput / m2.throughput - 1) * 100).toFixed(0)}% más rápido en generación.` : `${m2.name} es ${((m2.throughput / m1.throughput - 1) * 100).toFixed(0)}% más rápido en generación.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
