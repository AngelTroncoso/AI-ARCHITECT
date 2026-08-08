import React, { useState } from 'react';
import { Language } from '../types';
import {
  Sliders,
  X,
  Database,
  Layers,
  Cpu,
  Zap,
  Activity,
} from 'lucide-react';

interface LoRAPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLang?: Language;
}

export const LoRAPlaygroundModal: React.FC<LoRAPlaygroundModalProps> = ({
  isOpen,
  onClose,
  userLang = 'es',
}) => {
  const [rank, setRank] = useState<number>(8);
  const [alpha, setAlpha] = useState<number>(16);
  const [targetModules, setTargetModules] = useState<string>('q_proj, v_proj');
  const [learningRate, setLearningRate] = useState<number>(0.0002);

  if (!isOpen) return null;

  // Real-time calculated LoRA metrics
  const trainableParamsM = (rank * 4096 * 2) / 1000000;
  const trainablePct = ((trainableParamsM / 7000) * 100).toFixed(3);
  const extraVramMb = Math.round(trainableParamsM * 12);
  const estimatedLoss = (0.42 + (1 / rank) * 0.15).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40">
              <Sliders className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                SIMULADOR DE HYPERPARÁMETROS LORA FINE-TUNING
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold">
                  LOW-RANK ADAPTATION
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ajusta la dimensión del rango (r) y el factor alpha para fine-tuning eficiente en memoria.
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

        {/* Hyperparameter Controls */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rank Slider */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-white">
                <span>RANGO LORA (r):</span>
                <span className="text-emerald-400">{rank}</span>
              </div>
              <input
                type="range"
                min="2"
                max="64"
                step="2"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block font-mono">
                Define la dimensión de descomposición de matrices A x B.
              </span>
            </div>

            {/* Alpha Slider */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-white">
                <span>LORA ALPHA (α):</span>
                <span className="text-emerald-400">{alpha}</span>
              </div>
              <input
                type="range"
                min="8"
                max="128"
                step="8"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block font-mono">
                Factor de escalado constante (α / r).
              </span>
            </div>
          </div>

          {/* Real-time Calculation Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl">
              <span className="text-slate-400 block mb-1">PARÁMETROS ENTRENABLES:</span>
              <span className="text-xl font-bold text-emerald-400">{trainableParamsM.toFixed(2)}M</span>
              <span className="text-[10px] text-slate-500 block mt-1">({trainablePct}% del modelo total)</span>
            </div>

            <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl">
              <span className="text-slate-400 block mb-1">MEMORIA VRAM ADICIONAL:</span>
              <span className="text-xl font-bold text-cyan-400">+{extraVramMb} MB</span>
              <span className="text-[10px] text-slate-500 block mt-1">Gradients & Optimizer States</span>
            </div>

            <div className="p-4 bg-slate-950 border border-purple-500/30 rounded-xl">
              <span className="text-slate-400 block mb-1">PÉRDIDA ESTIMADA (TRAIN LOSS):</span>
              <span className="text-xl font-bold text-purple-400">{estimatedLoss}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Convergencia en 300 steps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
