import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Cpu,
  Trophy,
  Swords,
  GitFork,
  Sliders,
  X,
  CheckCircle2,
  Play,
  Layers,
  Activity,
  Palette,
  Terminal,
  Volume2,
  Radio,
  BarChart2,
  FileCode2,
} from 'lucide-react';
import { playSoundEffect } from '../utils/gameAudio';

interface RoadmapHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSkillTree: () => void;
  onOpenBossRaid: () => void;
  onOpenQuantization: () => void;
  onOpenModelArena: () => void;
  onOpenLoRA: () => void;
  onOpenAchievements: () => void;
}

export const RoadmapHubModal: React.FC<RoadmapHubModalProps> = ({
  isOpen,
  onClose,
  onOpenSkillTree,
  onOpenBossRaid,
  onOpenQuantization,
  onOpenModelArena,
  onOpenLoRA,
  onOpenAchievements,
}) => {
  const [activeTab, setActiveTab] = useState<'gamification' | 'llm' | 'ux'>('gamification');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-950 to-purple-950 border border-cyan-500/40">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                PLAN DE INTEGRACIÓN AGI (21 MEJORAS TOTALES)
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono font-bold">
                  GAMIFICACIÓN + LLM + UI/UX
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Plan maestro de integración por fases interactivas con acceso directo a cada sistema.
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

        {/* Tab Navigation */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-around font-mono text-xs">
          <button
            onClick={() => { playSoundEffect('hover'); setActiveTab('gamification'); }}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gamification' ? 'bg-amber-950 border border-amber-500 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>1. GAMIFICACIÓN (7/7)</span>
          </button>

          <button
            onClick={() => { playSoundEffect('hover'); setActiveTab('llm'); }}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'llm' ? 'bg-cyan-950 border border-cyan-500 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>2. LLMS & FINE-TUNING (7/7)</span>
          </button>

          <button
            onClick={() => { playSoundEffect('hover'); setActiveTab('ux'); }}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ux' ? 'bg-purple-950 border border-purple-500 text-purple-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>3. UI/UX & HUD (7/7)</span>
          </button>
        </div>

        {/* Tab Content Details */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'gamification' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-amber-400" /> 1. Árbol de Habilidades de Optimización
                  </h4>
                  <p className="text-[11px] text-slate-400">Desbloquea pasivas (INT8, FP8, FlashAttn-2) con XP para reducir latencia.</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenSkillTree(); }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  ABRIR ÁRBOL
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-rose-400" /> 2. Boss Raid: "Goliath AGI 100B"
                  </h4>
                  <p className="text-[11px] text-slate-400">Combate por turnos contra el Boss reduciendo su HP de latencia con código.</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenBossRaid(); }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  ENTRAR AL RAID
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" /> 3. Sistema de Logros y Trofeos Badges
                  </h4>
                  <p className="text-[11px] text-slate-400">Colecciona insignias exclusivas por récords de compresión neuronal.</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenAchievements(); }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  VER GALERÍA
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-cyan-400 font-bold">✔ 4. Tabla de Clasificación con Tiers (Bronce a Diamante AGI)</div>
                <div className="text-cyan-400 font-bold">✔ 5. Racha Diaria (Daily Streaks & XP Multiplier)</div>
                <div className="text-cyan-400 font-bold">✔ 6. Tarjeta de Perfil de Arquitecto AGI</div>
                <div className="text-cyan-400 font-bold">✔ 7. Recompensas por Misiones de Mentoría IA</div>
              </div>
            </div>
          )}

          {activeTab === 'llm' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400" /> 1. Laboratorio de Cuantización (FP32 → INT8 / INT4)
                  </h4>
                  <p className="text-[11px] text-slate-400">Inspector de tensores binarios y curvas de precisión en tiempo real.</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenQuantization(); }}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  ABRIR LAB
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-purple-400" /> 2. Arena de Benchmarking Multi-Modelo LLM
                  </h4>
                  <p className="text-[11px] text-slate-400">Duelos cara a cara entre Llama 3, Mistral, Gemma 2, DeepSeek y Qwen.</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenModelArena(); }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  ENTRAR ARENA
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-400" /> 3. Simulador LoRA Fine-Tuning Hyperparámetros
                  </h4>
                  <p className="text-[11px] text-slate-400">Controles para Rango (r), Alpha (α) y cálculo de loss y VRAM.</p>
                </div>
                <button
                  onClick={() => { onClose(); onOpenLoRA(); }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  SIMULAR LORA
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-emerald-400 font-bold">✔ 4. Asistente Multimodal (Voz, Imagen y Código)</div>
                <div className="text-emerald-400 font-bold">✔ 5. Compilador de Grafo Estático TensorRT-LLM</div>
                <div className="text-emerald-400 font-bold">✔ 6. FlashAttention-2 SRAM Memory Heatmap</div>
                <div className="text-emerald-400 font-bold">✔ 7. Generador de Evaluación de Benchmarks PyTorch</div>
              </div>
            </div>
          )}

          {activeTab === 'ux' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-purple-400" /> 1. Sistema de 3 Pistas de Música Sintetizada 8-Bit
                  </h4>
                  <p className="text-[11px] text-slate-400">Música asincrónicay motivacional de videojuegos por escala de intensidad.</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">✔ ACTIVO EN HEADER</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" /> 2. Monitor HUD de VRAM, Temperatura y Carga GPU
                  </h4>
                  <p className="text-[11px] text-slate-400">Métricas de acelerador de hardware en tiempo real.</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">✔ INTEGRADO EN HUD</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-purple-400 font-bold">✔ 3. Agente Conversacional Multimodal en Drawer Flotante</div>
                <div className="text-purple-400 font-bold">✔ 4. Selector de Arte Gráfico (Comic, Pixel Art, 3D Render)</div>
                <div className="text-purple-400 font-bold">✔ 5. Portada de Juego de Videojuego Inicial con Guía</div>
                <div className="text-purple-400 font-bold">✔ 6. Editor PyTorch con Resaltado de Sintaxis y Feedback</div>
                <div className="text-purple-400 font-bold">✔ 7. Interfaz Adaptativa Cyberpunk AGI con Efectos de Audio</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
