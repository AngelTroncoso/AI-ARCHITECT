import React from 'react';
import { SKILL_TREE_NODES } from '../data/skillsAndAchievements';
import { Language, UserProgress } from '../types';
import {
  GitFork,
  Cpu,
  Zap,
  Sparkles,
  Database,
  Scissors,
  Terminal,
  X,
  CheckCircle2,
  Lock,
  Award,
} from 'lucide-react';
import { playSoundEffect } from '../utils/gameAudio';

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUnlockSkill: (skillId: string, cost: number) => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUnlockSkill,
}) => {
  if (!isOpen) return null;

  const userLang = progress.activeLanguage || 'es';
  const unlocked = progress.unlockedSkills || [];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Scissors': return <Scissors className="w-5 h-5 text-rose-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-blue-400" />;
      default: return <GitFork className="w-5 h-5 text-cyan-400" />;
    }
  };

  const calculateTotalBuffs = () => {
    let lat = 0;
    let mem = 0;
    unlocked.forEach((id) => {
      const node = SKILL_TREE_NODES.find((n) => n.id === id);
      if (node) {
        lat += node.buffLatencyPct;
        mem += node.buffMemoryPct;
      }
    });
    return { lat, mem };
  };

  const totalBuffs = calculateTotalBuffs();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40">
              <GitFork className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ÁRBOL DE HABILIDADES AGI
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono font-bold">
                  SKILL TREE TECH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Invierte XP para desbloquear pasivas de optimización y compresión neuronal.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300">{progress.xp} XP Disponibles</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Total Active Buffs Banner */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">BONUS PASIVOS ACTIVOS:</span>
            <span className="text-emerald-400 font-bold">
              ⚡ -{totalBuffs.lat}% LATENCIA GLOBAL
            </span>
            <span className="text-cyan-400 font-bold">
              💾 -{totalBuffs.mem}% HUELLA VRAM
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            {unlocked.length}/{SKILL_TREE_NODES.length} Nodos Dominados
          </span>
        </div>

        {/* Skill Nodes Matrix */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_TREE_NODES.map((node) => {
            const isUnlocked = unlocked.includes(node.id);
            const canAfford = progress.xp >= node.xpCost;
            const prereqsMet = node.prerequisites.every((p) => unlocked.includes(p));
            const isAvailable = !isUnlocked && prereqsMet && canAfford;

            return (
              <div
                key={node.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all relative ${
                  isUnlocked
                    ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                    : prereqsMet
                    ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg border ${
                        isUnlocked ? 'bg-cyan-900/40 border-cyan-500' : 'bg-slate-800 border-slate-700'
                      }`}>
                        {getIconComponent(node.icon)}
                      </div>
                      <span className="text-xs font-mono font-bold uppercase text-slate-400">
                        {node.category}
                      </span>
                    </div>

                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> DOMINADO
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800 font-mono font-bold">
                        {node.xpCost} XP
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {node.name[userLang] || node.name.es}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {node.description[userLang] || node.description.es}
                  </p>

                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-cyan-300 mb-3">
                    ✨ Perk: {node.perk[userLang] || node.perk.es}
                  </div>
                </div>

                {/* Unlock Action Button */}
                {!isUnlocked && (
                  <div>
                    {!prereqsMet ? (
                      <div className="text-[11px] text-rose-400 font-mono flex items-center gap-1 mt-1">
                        <Lock className="w-3 h-3" /> Requiere nodo previo
                      </div>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          playSoundEffect('click');
                          onUnlockSkill(node.id, node.xpCost);
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span>DESBLOQUEAR NODO ({node.xpCost} XP)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
