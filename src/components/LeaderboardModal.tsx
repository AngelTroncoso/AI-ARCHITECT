import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { Trophy, X, Medal, Globe, Search, RefreshCw, Send } from 'lucide-react';

interface LeaderboardModalProps {
  userLang: Language;
  onClose: () => void;
  userScore: number;
  currentModelName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  userLang,
  onClose,
  userScore,
  currentModelName,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const t = TRANSLATIONS[userLang];

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setEntries(data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          countryFlag: '🌎',
          modelName: currentModelName,
          optimizationNote: 'INT8 Quantization + FlashAttention',
          score: userScore,
        }),
      });
      const data = await res.json();
      if (data.leaderboard) {
        setEntries(data.leaderboard);
        setHasSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  const filtered = entries.filter(
    (e) =>
      e.username.toLowerCase().includes(filter.toLowerCase()) ||
      e.modelName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              {t.leaderboardTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Los mejores desarrolladores y arquitectos de IA clasificando sus optimizaciones a nivel mundial.
            </p>
          </div>
          <button
            id="btn-close-leaderboard"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Submit Score */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              id="input-filter-leaderboard"
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar desarrollador o modelo..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            id="btn-refresh-leaderboard"
            onClick={fetchLeaderboard}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            title="Actualizar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Submit Form Banner */}
        {!hasSubmitted && (
          <form onSubmit={handleSubmitScore} className="p-3 bg-cyan-950/40 border-b border-cyan-800/60 flex items-center justify-between gap-3 text-xs">
            <span className="text-cyan-200 font-medium">
              Publicar tu puntuación actual (<strong className="text-amber-400">{userScore} XP</strong>):
            </span>
            <div className="flex items-center space-x-2">
              <input
                id="input-leaderboard-username"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Tu Nombre / Handle"
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                id="btn-submit-leaderboard"
                type="submit"
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Enviar</span>
              </button>
            </div>
          </form>
        )}

        {/* Leaderboard Table */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Cargando clasificación global...</div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="p-3 text-center">Rango</th>
                    <th className="p-3">Desarrollador</th>
                    <th className="p-3">Modelo</th>
                    <th className="p-3">Optimizaciones</th>
                    <th className="p-3 text-right">Puntuación XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filtered.map((item) => (
                    <tr key={item.rank} className="hover:bg-slate-800/30">
                      <td className="p-3 text-center font-bold">
                        {item.rank === 1 && <span className="text-amber-400 text-sm">🥇 #1</span>}
                        {item.rank === 2 && <span className="text-slate-300 text-sm">🥈 #2</span>}
                        {item.rank === 3 && <span className="text-amber-600 text-sm">🥉 #3</span>}
                        {item.rank > 3 && <span className="text-slate-500">#{item.rank}</span>}
                      </td>
                      <td className="p-3 font-sans font-semibold text-white flex items-center space-x-2">
                        <span>{item.countryFlag}</span>
                        <span>{item.username}</span>
                      </td>
                      <td className="p-3 text-cyan-300 font-bold">{item.modelName}</td>
                      <td className="p-3 text-slate-400 text-[11px] font-sans">{item.optimizationNote}</td>
                      <td className="p-3 text-right font-extrabold text-amber-400">{item.score} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
