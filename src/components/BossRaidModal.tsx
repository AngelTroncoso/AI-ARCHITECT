import React, { useState } from 'react';
import { Language, UserProgress } from '../types';
import {
  Swords,
  ShieldAlert,
  Zap,
  Flame,
  X,
  Trophy,
  Sparkles,
  Cpu,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { playSoundEffect } from '../utils/gameAudio';
import confetti from 'canvas-confetti';

interface BossRaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onDefeatBossReward: (xp: number) => void;
}

export const BossRaidModal: React.FC<BossRaidModalProps> = ({
  isOpen,
  onClose,
  progress,
  onDefeatBossReward,
}) => {
  const [bossHp, setBossHp] = useState<number>(progress.bossHp !== undefined ? progress.bossHp : 100);
  const [logs, setLogs] = useState<string[]>([
    '🔥 [BOSS RAID INICIADO]: Goliath-AGI 100B ha tomado los servidores. Su latencia de inferencia es de 4,500ms.',
  ]);
  const [turn, setTurn] = useState<number>(1);
  const [isVictory, setIsVictory] = useState<boolean>(bossHp <= 0);

  if (!isOpen) return null;

  const handleAttack = (type: 'int8' | 'flash' | 'prune' | 'tensorrt') => {
    playSoundEffect('launch');
    let damage = 0;
    let attackLog = '';

    if (type === 'int8') {
      damage = 25;
      attackLog = '⚡ [ATAQUE INT8]: Redujiste el ancho de banda de memoria. ¡25% Daño de Latencia!';
    } else if (type === 'flash') {
      damage = 30;
      attackLog = '✨ [FLASHATTENTION-2]: Tiled Attention ejecutado en SRAM. ¡30% Daño de VRAM!';
    } else if (type === 'prune') {
      damage = 20;
      attackLog = '✂️ [PODA DE CABEZAS]: Eliminaste 12 cabezas redundantes. ¡20% Daño de Parámetros!';
    } else if (type === 'tensorrt') {
      damage = 45;
      attackLog = '🚀 [TENSORRT COMPILADOR]: Fusión total de operadores CUDA. ¡45% DAÑO CRÍTICO!';
    }

    const newHp = Math.max(0, bossHp - damage);
    setBossHp(newHp);
    setTurn(turn + 1);

    setLogs((prev) => [attackLog, ...prev]);

    if (newHp === 0 && !isVictory) {
      setIsVictory(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onDefeatBossReward(1000);
      setLogs((prev) => [
        '🏆 ¡VICTORIA TOTAL! Has derrotado a Goliath-AGI 100B. Recompensa: +1000 XP y Trofeo Cazador AGI.',
        ...prev,
      ]);
    }
  };

  const handleResetBoss = () => {
    setBossHp(100);
    setTurn(1);
    setIsVictory(false);
    setLogs(['🔄 Boss reiniciado. ¡Prepárate para otro combate!']);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/40">
              <Swords className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                BOSS RAID: LATENCIA INFINITA
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-mono font-bold">
                  GOLIATH-AGI 100B
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Lanza técnicas de optimización en tiempo real para reducir la HP de Latencia del Boss.
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

        {/* Boss Stage Graphic */}
        <div className="p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col items-center justify-center relative">
          <div className="relative mb-3">
            <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-rose-900 via-purple-950 to-slate-950 border-2 ${
              isVictory ? 'border-emerald-500 grayscale' : 'border-rose-500 animate-pulse'
            } shadow-2xl shadow-rose-950/80 flex items-center justify-center text-4xl`}>
              {isVictory ? '🤖💀' : '👿⚡'}
            </div>
          </div>

          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            GOLIATH-AGI (100B PARAMETROS)
            {isVictory && <span className="text-emerald-400 text-xs font-mono font-bold">[DERROTADO]</span>}
          </h4>

          {/* Boss HP Bar */}
          <div className="w-full max-w-md bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300 mb-1">
              <span>HP LATENCIA BOSS:</span>
              <span className={bossHp > 30 ? 'text-rose-400' : 'text-emerald-400'}>{bossHp}% / 100%</span>
            </div>
            <div className="w-full bg-slate-800 h-4 rounded-lg overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-md transition-all duration-500 ${
                  bossHp > 50 ? 'bg-gradient-to-r from-rose-600 to-red-500' : bossHp > 20 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${bossHp}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Attacks Controls */}
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <h5 className="text-xs font-bold text-slate-400 uppercase font-mono mb-2">
            SELECCIONA ATAQUE DE OPTIMIZACIÓN (TURNO {turn}):
          </h5>

          {!isVictory ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleAttack('int8')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300 mb-1">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Ataque INT8</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">-25% Latencia</span>
              </button>

              <button
                onClick={() => handleAttack('flash')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>FlashAttn-2</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">-30% VRAM</span>
              </button>

              <button
                onClick={() => handleAttack('prune')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300 mb-1">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Poda Cabezas</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">-20% Params</span>
              </button>

              <button
                onClick={() => handleAttack('tensorrt')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300 mb-1">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>TensorRT-LLM</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">-45% Crítico</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">¡BOSS ELIMINADO! Has ganado 1,000 XP.</span>
              </div>
              <button
                onClick={handleResetBoss}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> REINICIAR COMBATE
              </button>
            </div>
          )}
        </div>

        {/* Combat Console Logs */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-[11px] space-y-1.5">
          {logs.map((log, index) => (
            <div key={index} className="text-slate-300 border-l-2 border-slate-700 pl-2">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
