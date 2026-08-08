import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  X,
  Sparkles,
  Trophy,
  Zap,
  Code2,
  Sliders,
  GitCommit,
  GitFork,
  BookOpen,
  Award,
  Cpu,
  Flame,
  CheckCircle2,
  Users,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface YouthGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAlgorithmRoom?: () => void;
  onOpenSkillTree?: () => void;
  onOpenGitHubExport?: () => void;
  onOpenRoadmapHub?: () => void;
}

export const YouthGuideModal: React.FC<YouthGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenAlgorithmRoom,
  onOpenSkillTree,
  onOpenGitHubExport,
  onOpenRoadmapHub
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0D14] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-[#0D1322] via-[#11182B] to-[#0D1322]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-300">
                <BookOpen className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  GUÍA EDUCATIVA Y DE ACTIVIDADES (15+ AÑOS)
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                    Aprende IA
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  ¿Cómo jugar, aprender, ganar puntos y qué hace cada botón de la plataforma?
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#080B12]">
            {/* Section 1: Actividades, Recursos y Premios (3 Cards) */}
            <div>
              <h4 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                1. Estructura Básica del Aprendizaje
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Actividades */}
                <div className="p-5 rounded-xl bg-[#0D121F] border border-cyan-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>🎯 Actividades</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-mono font-bold">•</span>
                      <span><strong>Resolver Misiones:</strong> Optimiza el código de los niveles para acelerar inferencias en GPUs.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-mono font-bold">•</span>
                      <span><strong>Analizar Algoritmos:</strong> Inspecciona el código PyTorch dentro de la sala de cada modelo.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-mono font-bold">•</span>
                      <span><strong>Aprender de la Comunidad:</strong> Copia y prueba soluciones de otros programadores.</span>
                    </li>
                  </ul>
                </div>

                {/* Recursos */}
                <div className="p-5 rounded-xl bg-[#0D121F] border border-purple-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-300 font-mono font-bold text-xs uppercase">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>🧰 Recursos Disponibles</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-mono font-bold">•</span>
                      <span><strong>Mentores de IA:</strong> Sam Altman, Yann LeCun, Andrej Karpathy te dan consejos en tiempo real.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-mono font-bold">•</span>
                      <span><strong>Modelos Reales:</strong> Llama, Mistral, Qwen y DeepSeek para experimentar con tensores.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-mono font-bold">•</span>
                      <span><strong>Editor PyTorch:</strong> Tu laboratorio de programación en Python.</span>
                    </li>
                  </ul>
                </div>

                {/* Premios y Puntos */}
                <div className="p-5 rounded-xl bg-[#0D121F] border border-amber-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-300 font-mono font-bold text-xs uppercase">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>🏆 Premios y Puntos</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-mono font-bold">•</span>
                      <span><strong>Puntos XP:</strong> Ganados al escribir código eficiente para desbloquear habilidades.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-mono font-bold">•</span>
                      <span><strong>Puntos VRAM:</strong> Bonificación por reducir la memoria que gasta la GPU.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-mono font-bold">•</span>
                      <span><strong>Insignias y Rango:</strong> Sube en la tabla de clasificación de la comunidad.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Explicación Sencilla de Botones */}
            <div>
              <h4 className="text-sm font-mono font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                2. ¿Para Qué Sirve Cada Botón de la Barra Superior? (Explicado Fácil)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                {/* 1. Room Algoritmo */}
                <div className="p-4 rounded-xl bg-[#0D121F] border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-mono font-bold text-purple-300">Room Algoritmo</span>
                    </div>
                    {onOpenAlgorithmRoom && (
                      <button
                        onClick={() => { onClose(); onOpenAlgorithmRoom(); }}
                        className="text-[10px] font-mono text-purple-300 hover:text-white underline cursor-pointer"
                      >
                        Probar Ahora ❯
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>¿Qué es?</strong> Es la sala interactiva de análisis. Te permite "abrir el modelo" por dentro, ver su código real de atención en PyTorch, calcular cuánta memoria RAM de tarjeta gráfica gasta y ver ejemplos de otros estudiantes.
                  </p>
                </div>

                {/* 2. Árbol de Habilidades */}
                <div className="p-4 rounded-xl bg-[#0D121F] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitFork className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-cyan-300">Árbol de Habilidades</span>
                    </div>
                    {onOpenSkillTree && (
                      <button
                        onClick={() => { onClose(); onOpenSkillTree(); }}
                        className="text-[10px] font-mono text-cyan-300 hover:text-white underline cursor-pointer"
                      >
                        Probar Ahora ❯
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>¿Qué es?</strong> Un mapa de talentos como el de un videojuego RPG. Aquí gastas los puntos XP que ganas resolviendo ejercicios para desbloquear superpoderes técnicos como <i>Cuantización INT8</i> o <i>FlashAttention</i>.
                  </p>
                </div>

                {/* 3. GitHub Sync */}
                <div className="p-4 rounded-xl bg-[#0D121F] border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitCommit className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono font-bold text-emerald-300">GitHub Sync (Portafolio)</span>
                    </div>
                    {onOpenGitHubExport && (
                      <button
                        onClick={() => { onClose(); onOpenGitHubExport(); }}
                        className="text-[10px] font-mono text-emerald-300 hover:text-white underline cursor-pointer"
                      >
                        Probar Ahora ❯
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>¿Qué es?</strong> Es la herramienta que te permite publicar tu trabajo. Guarda todo tu código optimizado y tus marcas de tiempo en tu cuenta de GitHub para mostrarle a tus profesores o amigos tu avance real como programador de IA.
                  </p>
                </div>

                {/* 4. Hoja de Ruta / Mejoras */}
                <div className="p-4 rounded-xl bg-[#0D121F] border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-amber-300">Mejoras y Hoja de Ruta</span>
                    </div>
                    {onOpenRoadmapHub && (
                      <button
                        onClick={() => { onClose(); onOpenRoadmapHub(); }}
                        className="text-[10px] font-mono text-amber-300 hover:text-white underline cursor-pointer"
                      >
                        Probar Ahora ❯
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>¿Qué es?</strong> Es una lista clara con las 21 misiones y etapas del camino. Te muestra exactamente en qué nivel vas y qué paso debes dar para seguir completando tu formación tecnológica.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-slate-800 bg-[#07090F] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Guía de Inicio Rápido AI Architect Challenge</span>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all cursor-pointer shadow-md"
            >
              ¡Entendido, a Programar!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
