import React, { useState } from 'react';
import { Language } from '../types';
import {
  Cpu,
  Layers,
  X,
  Sliders,
  TrendingDown,
  BarChart2,
  Zap,
  Info,
} from 'lucide-react';

interface QuantizationVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLang?: Language;
}

export const QuantizationVisualizerModal: React.FC<QuantizationVisualizerModalProps> = ({
  isOpen,
  onClose,
  userLang = 'es',
}) => {
  const [precision, setPrecision] = useState<'fp32' | 'fp16' | 'int8' | 'int4'>('int8');

  if (!isOpen) return null;

  const getPrecisionDetails = () => {
    switch (precision) {
      case 'fp32':
        return {
          title: '32-bit Floating Point (Full Precision)',
          bits: 32,
          memoryMb: 14000,
          latencyMs: 120,
          accuracyLoss: '0.0%',
          description: '32 bits por peso (1 bit signo, 8 exponente, 23 mantisa). Máxima precisión, alto consumo VRAM.',
          exampleBits: '0 [10000001] 01000000000000000000000',
          color: 'border-blue-500 text-blue-400 bg-blue-950/30',
        };
      case 'fp16':
        return {
          title: '16-bit Half Precision (FP16 / BF16)',
          bits: 16,
          memoryMb: 7000,
          latencyMs: 65,
          accuracyLoss: '< 0.01%',
          description: '16 bits por peso. Estándar para entrenamiento acelerado por Tensor Cores.',
          exampleBits: '0 [10000] 0100000000',
          color: 'border-cyan-500 text-cyan-400 bg-cyan-950/30',
        };
      case 'int8':
        return {
          title: '8-bit Integer (INT8 Dynamic Quantization)',
          bits: 8,
          memoryMb: 3500,
          latencyMs: 35,
          accuracyLoss: '< 0.1%',
          description: 'Mapea números flotantes a un rango entero [-128, 127] con factor de escala (Scale & Zero-Point).',
          exampleBits: '01111111 (Scale: 0.0078)',
          color: 'border-amber-500 text-amber-400 bg-amber-950/30',
        };
      case 'int4':
        return {
          title: '4-bit Integer (GPTQ / AWQ Extreme Compression)',
          bits: 4,
          memoryMb: 1750,
          latencyMs: 18,
          accuracyLoss: '< 0.8%',
          description: 'Cuantización ultra agresiva (4 bits por peso). Permite ejecutar LLMs de 70B en GPUs de consumo.',
          exampleBits: '1011 (Valor: 11)',
          color: 'border-rose-500 text-rose-400 bg-rose-950/30',
        };
    }
  };

  const details = getPrecisionDetails();

  // Synthetic Matrix Representation (weights visualization)
  const syntheticWeights = [
    [0.852, -0.124, 0.991, 0.004],
    [-0.431, 0.612, -0.887, 0.215],
    [0.109, -0.765, 0.334, -0.052],
    [0.912, 0.045, -0.221, 0.678],
  ];

  const formatWeight = (val: number) => {
    if (precision === 'fp32') return val.toFixed(3);
    if (precision === 'fp16') return val.toFixed(2);
    if (precision === 'int8') return Math.round(val * 127);
    if (precision === 'int4') return Math.round((val + 1) * 7.5);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40">
              <Sliders className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                LABORATORIO DE CUANTIZACIÓN DE TENSORES
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono font-bold">
                  FP32 → INT8 / INT4
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualiza la compresión de precisión en la matriz de pesos y su impacto en VRAM y latencia.
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

        {/* Precision Selector Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['fp32', 'fp16', 'int8', 'int4'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPrecision(mode)}
              className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                precision === mode
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="uppercase text-[11px] mb-0.5">{mode}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {mode === 'fp32' ? '32 bits' : mode === 'fp16' ? '16 bits' : mode === 'int8' ? '8 bits' : '4 bits'}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Precision Detail Dashboard */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className={`p-4 rounded-xl border ${details.color}`}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {details.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">{details.description}</p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
              Estructura Binaria: <span className="text-white">{details.exampleBits}</span>
            </div>
          </div>

          {/* Metrics comparison grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                HUELLA DE VRAM (7B MODEL)
              </div>
              <div className="text-xl font-mono font-bold text-white mb-1">
                {(details.memoryMb / 1024).toFixed(1)} GB
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${(details.memoryMb / 14000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                LATENCIA DE GENERACIÓN
              </div>
              <div className="text-xl font-mono font-bold text-amber-300 mb-1">
                {details.latencyMs} ms / token
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${(details.latencyMs / 120) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                PÉRDIDA DE PRECISIÓN
              </div>
              <div className="text-xl font-mono font-bold text-emerald-400 mb-1">
                {details.accuracyLoss}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Prácticamente imperceptible en MMLU</div>
            </div>
          </div>

          {/* Matrix Weights Simulator */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <h5 className="text-xs font-bold text-slate-300 font-mono mb-3 uppercase flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              INSPECTOR DE MATRIZ DE PESOS NEURONALES (4x4 SAMPLE):
            </h5>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {syntheticWeights.map((row, rIdx) =>
                row.map((w, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="p-3 rounded bg-slate-900 border border-slate-800 text-center text-cyan-300 font-bold transition-all"
                  >
                    {formatWeight(w)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
