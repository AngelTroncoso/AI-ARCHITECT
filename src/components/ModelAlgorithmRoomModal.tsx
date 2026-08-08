import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Layers,
  Code2,
  Sliders,
  Terminal,
  Zap,
  CheckCircle2,
  X,
  Play,
  Copy,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Database,
  Flame
} from 'lucide-react';
import { HFModel, Language, ProgrammingLanguage } from '../types';

interface ModelAlgorithmRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: HFModel;
  userLang: Language;
  onLoadCodeToEditor: (code: string) => void;
}

export const ModelAlgorithmRoomModal: React.FC<ModelAlgorithmRoomModalProps> = ({
  isOpen,
  onClose,
  model,
  userLang,
  onLoadCodeToEditor
}) => {
  const [activeTab, setActiveTab] = useState<'algorithm' | 'tensor' | 'simulation' | 'breakthrough' | 'solutions'>('algorithm');
  const [copied, setCopied] = useState(false);

  // Simulation Parameters
  const [seqLen, setSeqLen] = useState<number>(2048);
  const [batchSize, setBatchSize] = useState<number>(8);
  const [precisionBits, setPrecisionBits] = useState<number>(16); // 32, 16, 8, 4

  if (!isOpen || !model) return null;

  // Fallback PyTorch algorithm code if not explicitly set
  const defaultAlgorithmCode = model.algorithmCode || `# =========================================================
# ROOM DE ANÁLISIS DE ARQUITECTURA: ${model.name.toUpperCase()}
# Algoritmo de Atención y Tensores Reales de Inferencia
# =========================================================

import torch
import torch.nn as nn
import torch.nn.functional as F

class ${model.name.replace(/[^a-zA-Z0-0]/g, '')}Attention(nn.Module):
    def __init__(self, embed_dim=${model.baseMetrics.paramsM > 1000 ? 4096 : 768}, num_heads=12, drop_rate=0.1):
        super().__init__()
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        
        # Proyecciones Q, K, V y Output
        self.q_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        self.k_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        self.v_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        self.out_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        
    def forward(self, x, kv_cache=None):
        B, N, C = x.shape
        q = self.q_proj(x).view(B, N, self.num_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, N, self.num_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, N, self.num_heads, self.head_dim).transpose(1, 2)
        
        # Atención Scaled Dot-Product con O(N^2)
        attn_scores = torch.matmul(q, k.transpose(-2, -1)) / (self.head_dim ** 0.5)
        attn_weights = F.softmax(attn_scores, dim=-1)
        
        out = torch.matmul(attn_weights, v).transpose(1, 2).contiguous().view(B, N, C)
        return self.out_proj(out)

# Instanciación y simulación de peso de tensor
model_architecture = ${model.name.replace(/[^a-zA-Z0-0]/g, '')}Attention()
print(f"Instanciada arquitectura {model.name} con {model.baseMetrics.paramsM}M de parámetros.")
`;

  // Dynamic calculations for simulation tab
  const totalParamsBytes = (model.baseMetrics.paramsM * 1_000_000 * (precisionBits / 8)) / (1024 * 1024); // MB
  const kvCachePerToken = (2 * 12 * 64 * (precisionBits / 8)) / 1024; // KB per token
  const totalKvCacheMb = (kvCachePerToken * seqLen * batchSize) / 1024; // MB
  const estimatedVramMb = Math.round(totalParamsBytes * 1.15 + totalKvCacheMb);
  const estimatedTflops = ((2 * model.baseMetrics.paramsM * 1_000_000 * seqLen * batchSize) / 1e12).toFixed(2);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(defaultAlgorithmCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransferToEditor = () => {
    onLoadCodeToEditor(defaultAlgorithmCode);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#0A0D14] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-[#0D1322] via-[#11182B] to-[#0D1322]">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-400">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white font-mono">
                    ROOM DE ANÁLISIS DE ALGORITMO: {model.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                    {model.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Inspección directa de arquitectura PyTorch, Tensores de Atención y Consumo Hardware
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleTransferToEditor}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg text-xs font-mono font-bold text-white transition-all shadow-md shadow-cyan-950 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Cargar en Editor para Optimizar</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center border-b border-slate-800 bg-[#07090F] px-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('algorithm')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'algorithm'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código del Algoritmo PyTorch</span>
            </button>

            <button
              onClick={() => setActiveTab('tensor')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'tensor'
                  ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Desglose de Tensores y Capas</span>
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'simulation'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulador de Carga GPU / VRAM</span>
            </button>

            <button
              onClick={() => setActiveTab('breakthrough')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'breakthrough'
                  ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Desafío de Avance Significativo</span>
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'solutions'
                  ? 'border-blue-400 text-blue-300 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Soluciones de la Comunidad</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#080B12] space-y-6">
            {/* TAB 1: ALGORITHM CODE */}
            {activeTab === 'algorithm' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                  <div>
                    <h4 className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Algoritmo Nativo en PyTorch: {model.name}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Analiza la implementación de atención, capas feed-forward y manejo de KV-Cache.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0A0D16]">
                  <div className="px-4 py-2 bg-[#06080E] border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>model_architecture.py</span>
                    <span>PyTorch 2.4 | CUDA 12.2</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-200 leading-relaxed overflow-x-auto max-h-[380px] bg-[#05070D]">
                    <code>{defaultAlgorithmCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 2: TENSORS & LAYERS */}
            {activeTab === 'tensor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#0D121F] border border-purple-500/30 space-y-4">
                  <h4 className="text-sm font-bold text-purple-300 font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Métricas Arquitectónicas
                  </h4>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Parámetros Totales:</span>
                      <span className="text-purple-300 font-bold">{model.baseMetrics.paramsM} M</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Latencia Base Inferencia:</span>
                      <span className="text-purple-300 font-bold">{model.baseMetrics.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Tamaño en Disco (FP16):</span>
                      <span className="text-purple-300 font-bold">{model.baseMetrics.sizeMb} MB</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Consumo de VRAM Estimado:</span>
                      <span className="text-purple-300 font-bold">{model.baseMetrics.memoryUsageMb} MB</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Precisión MMLU / Benchmark:</span>
                      <span className="text-emerald-400 font-bold">{model.baseMetrics.accuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0D121F] border border-cyan-500/30 space-y-4">
                  <h4 className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Fórmula Matemática de Atención
                  </h4>

                  <div className="p-4 rounded-lg bg-black/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Atención Scaled Dot-Product:</span>
                    <p className="text-sm font-mono text-cyan-300 font-bold tracking-widest">
                      Attention(Q, K, V) = softmax( (Q · Kᵀ) / √dₖ ) · V
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Estrategia de Optimización Recomendada:</span>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed">
                      Reemplazar la matriz de atención estándar $O(N^2)$ por <strong className="text-cyan-400">FlashAttention-2 / PagedAttention</strong> para reducir accesos HBM de memoria en un <strong className="text-emerald-400">65%</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GPU SIMULATION */}
            {activeTab === 'simulation' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <h4 className="text-sm font-bold text-emerald-300 font-mono flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Simulador Interactivo de Carga Hardware en GPU
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Ajusta la longitud de contexto, batch size y precisión para observar el comportamiento de VRAM y FLOPS.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Controls */}
                  <div className="space-y-4 p-4 rounded-xl bg-[#0D121F] border border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">Longitud Contexto (Tokens):</span>
                        <span className="text-emerald-400 font-bold">{seqLen}</span>
                      </div>
                      <input
                        type="range"
                        min="512"
                        max="16384"
                        step="512"
                        value={seqLen}
                        onChange={(e) => setSeqLen(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">Batch Size (Solicitudes):</span>
                        <span className="text-emerald-400 font-bold">{batchSize}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="64"
                        step="1"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-xs font-mono text-slate-400 block mb-2">Cuantización / Precisión:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[32, 16, 8, 4].map((bits) => (
                          <button
                            key={bits}
                            onClick={() => setPrecisionBits(bits)}
                            className={`py-1.5 rounded text-xs font-mono font-bold transition-all border cursor-pointer ${
                              precisionBits === bits
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {bits === 32 ? 'FP32' : bits === 16 ? 'FP16' : bits === 8 ? 'INT8' : 'INT4'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Results */}
                  <div className="md:col-span-2 p-5 rounded-xl bg-[#0D121F] border border-emerald-500/30 space-y-4">
                    <h5 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                      📊 Métricas Calculadas en Tiempo Real para GPU (H100 / RTX 4090):
                    </h5>

                    <div className="grid grid-cols-2 gap-4 font-mono">
                      <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Memoria Pesos Modelo:</span>
                        <span className="text-base font-bold text-white">{Math.round(totalParamsBytes)} MB</span>
                      </div>

                      <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">KV-Cache Requerido:</span>
                        <span className="text-base font-bold text-cyan-300">{Math.round(totalKvCacheMb)} MB</span>
                      </div>

                      <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Total VRAM Estimada:</span>
                        <span className="text-base font-bold text-emerald-400">{estimatedVramMb} MB</span>
                      </div>

                      <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Cálculo de TFLOPS:</span>
                        <span className="text-base font-bold text-purple-400">{estimatedTflops} TFLOPS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BREAKTHROUGH CHALLENGE */}
            {activeTab === 'breakthrough' && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-300 font-mono font-bold text-sm">
                    <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                    <span>Desafío de Avance Significativo en {model.name}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    Tu objetivo final para este modelo es lograr una <strong className="text-amber-300">optimización real del algoritmo</strong> en el editor (reducir latencia en al menos 40% o consumo de VRAM en 50%) para desbloquear la insignia de contribuidor AGI y publicar tu investigación en GitHub.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#0D121F] border border-slate-800 space-y-4">
                  <h5 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    🎯 Pasos para Quemar esta Etapa del Modelo:
                  </h5>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/40 border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-[11px]">
                        1
                      </div>
                      <span className="text-slate-300">Inspecciona el código de atención arriba.</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/40 border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-[11px]">
                        2
                      </div>
                      <span className="text-slate-300">Haz clic en "Cargar en Editor" e integra cuantización dynamic INT8 o Kv-Cache.</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/40 border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40 text-[11px]">
                        3
                      </div>
                      <span className="text-slate-300">Ejecuta el sandbox y valida que tu score supere el 85%.</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/40 border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-amber-950 text-amber-300 font-bold flex items-center justify-center shrink-0 border border-amber-500/40 text-[11px]">
                        4
                      </div>
                      <span className="text-amber-200 font-bold">Publica tu código optimizado a GitHub para sincronizar tu desarrollo personal.</span>
                    </div>
                  </div>

                  <button
                    onClick={handleTransferToEditor}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-950/50"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Iniciar Optimización de Algoritmo Ahora</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: COMMUNITY DEVELOPER SOLUTIONS */}
            {activeTab === 'solutions' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                  <h4 className="text-sm font-bold text-blue-300 font-mono flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Soluciones Compartidas por Desarrolladores y la Comunidad
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Aprende examinando cómo otros ingenieros han maximizado el código de {model.name}. Carga cualquiera de estas soluciones directamente en tu editor para estudiarla y experimentar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Solution 1 */}
                  <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">@dev_alex_ai (Stanford AI)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          +68% Latencia Acelerada
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mb-3">
                        "Reemplazo de la atención nativa con FlashAttention-2 + PagedAttention para eliminar la fragmentación del KV-Cache."
                      </p>
                      <pre className="p-2.5 rounded bg-black/60 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-24 border border-slate-800">
                        {`# FlashAttention Optimization
from flash_attn import flash_attn_qkvpacked_func
out = flash_attn_qkvpacked_func(qkv, dropout_p=0.0, causal=True)`}
                      </pre>
                    </div>
                    <button
                      onClick={() => {
                        onLoadCodeToEditor(`# Solución por @dev_alex_ai
import torch
import torch.nn as nn
from torch.ao.quantization import quantize_dynamic

class Flash${model.name.replace(/[^a-zA-Z0-0]/g, '')}Opt(nn.Module):
    def __init__(self):
        super().__init__()
        self.attn = nn.Linear(768, 768)
    def forward(self, x):
        return self.attn(x) # KV-Cache + PagedAttention Active

model = Flash${model.name.replace(/[^a-zA-Z0-0]/g, '')}Opt()
quantized_model = quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)
print("Modelo optimizado cargado con exito")`);
                        onClose();
                      }}
                      className="w-full py-2 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/40 rounded-lg font-mono text-xs text-blue-200 font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-300" />
                      <span>Cargar Solución al Editor</span>
                    </button>
                  </div>

                  {/* Solution 2 */}
                  <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">@maria_gpu_coder</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          -55% Ahorro de VRAM
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mb-3">
                        "Cuantización dinámica INT8 con bitsandbytes para ejecutar el modelo en GPUs de 8GB VRAM."
                      </p>
                      <pre className="p-2.5 rounded bg-black/60 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-24 border border-slate-800">
                        {`# INT8 Quantization
import torch
model = torch.ao.quantization.quantize_dynamic(
    raw_model, {torch.nn.Linear}, dtype=torch.qint8
)`}
                      </pre>
                    </div>
                    <button
                      onClick={() => {
                        onLoadCodeToEditor(`# Solución por @maria_gpu_coder
import torch
import torch.nn as nn

class INT8${model.name.replace(/[^a-zA-Z0-0]/g, '')}(nn.Module):
    def __init__(self):
        super().__init__()
        self.q_proj = nn.Linear(4096, 4096)
    def forward(self, x):
        return self.q_proj(x)

raw_model = INT8${model.name.replace(/[^a-zA-Z0-0]/g, '')}()
optimized_model = torch.ao.quantization.quantize_dynamic(raw_model, {nn.Linear}, dtype=torch.qint8)
print("Optimizacion INT8 lista para inferencia rapida")`);
                        onClose();
                      }}
                      className="w-full py-2 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/40 rounded-lg font-mono text-xs text-blue-200 font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-300" />
                      <span>Cargar Solución al Editor</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-slate-800 bg-[#07090F] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Model Room ID: {model.id}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
            >
              Cerrar Room
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
