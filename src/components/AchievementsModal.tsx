import React from 'react';
import { ACHIEVEMENTS_LIST } from '../data/skillsAndAchievements';
import { Language, UserProgress } from '../types';
import {
  Trophy,
  Zap,
  Swords,
  GitFork,
  Bot,
  Sliders,
  CheckCircle2,
  Lock,
  X,
  Award,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  if (!isOpen) return null;

  const userLang = progress.activeLanguage || 'es';
  const unlocked = progress.unlockedAchievements || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Swords': return <Swords className="w-6 h-6 text-rose-400" />;
      case 'GitFork': return <GitFork className="w-6 h-6 text-cyan-400" />;
      case 'Bot': return <Bot className="w-6 h-6 text-purple-400" />;
      case 'Sliders': return <Sliders className="w-6 h-6 text-emerald-400" />;
      default: return <Trophy className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/40">
              <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                GALERÍA DE LOGROS Y TROFEOS AGI
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300 font-mono font-bold">
                  BADGES & RECOMPENSAS
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Completa misiones de gamificación, optimización de LLMs y UX para desbloquear trofeos.
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

        {/* List of achievements */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id) || progress.badges.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start space-x-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className={`p-3 rounded-xl border shrink-0 ${
                  isUnlocked ? 'bg-amber-950 border-amber-500/60' : 'bg-slate-900 border-slate-800'
                }`}>
                  {getIcon(ach.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {ach.title[userLang] || ach.title.es}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> COMPLETADO
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        +{ach.xpReward} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {ach.description[userLang] || ach.description.es}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
