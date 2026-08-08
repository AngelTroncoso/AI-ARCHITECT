import React from 'react';
import { UserProgress, Language, MentorCharacter, HFModel } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { Award, Flame, Globe, Trophy, Zap, Code2, Sparkles, Video, UserCheck, Volume2, VolumeX, Radio, Music, GitFork, Swords, Sliders } from 'lucide-react';
import { getLeaderAvatarUrl } from '../utils/avatars';
import { LeaderAvatar } from './LeaderAvatar';
import { gameAudioEngine, BgmTrackId } from '../utils/gameAudio';

interface HeaderProps {
  progress: UserProgress;
  activeMentor: MentorCharacter;
  activeModel: HFModel;
  onOpenCharacterSelector: () => void;
  onOpenModelSelector: () => void;
  onOpenLeaderboard: () => void;
  onOpenVideoInsight: () => void;
  onOpenIntroStory: () => void;
  onOpenSkillTree?: () => void;
  onOpenBossRaid?: () => void;
  onOpenRoadmapHub?: () => void;
  onOpenGoogleAiHub?: () => void;
  onOpenModelAlgorithmRoom?: () => void;
  onOpenGitHubExport?: () => void;
  onOpenYouthGuide?: () => void;
  onSelectLanguage: (lang: Language) => void;
  onSelectLevel: (levelId: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeMentor,
  activeModel,
  onOpenCharacterSelector,
  onOpenModelSelector,
  onOpenLeaderboard,
  onOpenVideoInsight,
  onOpenIntroStory,
  onOpenSkillTree,
  onOpenBossRaid,
  onOpenRoadmapHub,
  onOpenGoogleAiHub,
  onOpenModelAlgorithmRoom,
  onOpenGitHubExport,
  onOpenYouthGuide,
  onSelectLanguage,
  onSelectLevel,
}) => {
  const [bgmMuted, setBgmMuted] = React.useState(gameAudioEngine.isMuted());
  const [activeBgmTrack, setActiveBgmTrack] = React.useState<BgmTrackId>(gameAudioEngine.getCurrentTrack() === 'off' ? 'model' : gameAudioEngine.getCurrentTrack());

  const handleToggleBgm = () => {
    const isMuted = gameAudioEngine.toggleMute();
    setBgmMuted(isMuted);
    if (!isMuted && gameAudioEngine.getCurrentTrack() === 'off') {
      gameAudioEngine.setTrack('model');
      setActiveBgmTrack('model');
    }
  };

  const handleCycleTrack = () => {
    if (bgmMuted) {
      gameAudioEngine.toggleMute();
      setBgmMuted(false);
    }
    const nextTrack: BgmTrackId = activeBgmTrack === 'story' ? 'character' : activeBgmTrack === 'character' ? 'model' : 'story';
    gameAudioEngine.setTrack(nextTrack);
    setActiveBgmTrack(nextTrack);
  };
  const t = TRANSLATIONS[progress.activeLanguage];

  return (
    <header id="main-header" className="bg-[#0D0F14] border-b border-white/10 text-white sticky top-0 z-30 shadow-2xl">
      {/* Top Bar Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">
                AI ARCHITECT <span className="text-cyan-400">CHALLENGE</span>
              </h1>
              <button
                onClick={onOpenIntroStory}
                className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase transition-all cursor-pointer"
                title="Ver Historia & Portada Misión"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Portada</span>
              </button>

              {onOpenYouthGuide && (
                <button
                  onClick={onOpenYouthGuide}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase transition-all cursor-pointer shadow-sm"
                  title="Guía Educativa de Actividades, Recursos, Puntos y Botones para Estudiantes (15+ años)"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Guía (15+ Años)</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
              {t.subtitle} {progress.username ? `• Arquitecto: ${progress.username}` : ''}
            </p>
          </div>
        </div>

        {/* Gamification Dashboard Cards */}
        <div className="flex items-center space-x-2 md:space-x-4 bg-[#0A0B0E] px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
          {/* XP Score */}
          <div className="flex items-center space-x-2 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{t.xpScore}</div>
              <div className="neon-text text-sm font-bold leading-none">
                {progress.xp.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center space-x-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
            <Award className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{t.level}</div>
              <div className="text-white font-bold text-sm leading-none">
                Lvl {progress.currentChallengeId}
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{t.streak}</div>
              <div className="text-orange-400 font-bold text-sm leading-none">
                🔥 {progress.streakDays}d
              </div>
            </div>
          </div>

          {/* Rank */}
          <button
            id="btn-open-leaderboard"
            onClick={onOpenLeaderboard}
            className="flex items-center space-x-2 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer group"
          >
            <Trophy className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{t.rank}</div>
              <div className="text-white font-bold text-sm leading-none">
                Top {progress.globalRank}% Global
              </div>
            </div>
          </button>
        </div>

        {/* Controls & Switchers */}
        <div className="flex items-center space-x-2">
          {/* Active Mentor Button */}
          <button
            id="btn-select-mentor"
            onClick={onOpenCharacterSelector}
            className="flex items-center space-x-2 bg-[#161921] hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 transition-all text-xs font-semibold cursor-pointer"
            title="Cambiar Mentor IA"
          >
            <LeaderAvatar
              leaderId={activeMentor.id}
              name={activeMentor.name}
              style="comic"
              companyColor={activeMentor.color}
              size="sm"
            />
            <span className="hidden md:inline">{activeMentor.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
              {activeMentor.company}
            </span>
          </button>

          {/* Active Model Button */}
          <button
            id="btn-select-model"
            onClick={onOpenModelSelector}
            className="flex items-center space-x-1.5 bg-[#161921] hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 transition-all text-xs font-semibold cursor-pointer"
            title="Cambiar Modelo Open-Source"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-cyan-300">{activeModel.name}</span>
          </button>

          {/* Model Algorithm Room Button */}
          {onOpenModelAlgorithmRoom && (
            <button
              onClick={onOpenModelAlgorithmRoom}
              className="flex items-center space-x-1 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-500/40 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
              title="Abrir Room de Análisis del Algoritmo del Modelo"
            >
              <Sliders className="w-4 h-4 text-purple-300 animate-pulse" />
              <span className="hidden lg:inline">Room Algoritmo</span>
            </button>
          )}

          {/* GitHub Sync & Portfolio Export Button */}
          {onOpenGitHubExport && (
            <button
              onClick={onOpenGitHubExport}
              className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              title="Publicar Avance en GitHub"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">GitHub Sync</span>
            </button>
          )}

          {/* Skill Tree Button */}
          {onOpenSkillTree && (
            <button
              onClick={onOpenSkillTree}
              className="flex items-center space-x-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              title="Árbol de Habilidades AGI"
            >
              <GitFork className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Skill Tree</span>
            </button>
          )}

          {/* Boss Raid Button */}
          {onOpenBossRaid && (
            <button
              onClick={onOpenBossRaid}
              className="flex items-center space-x-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              title="Boss Raid vs Goliath 100B"
            >
              <Swords className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="hidden xl:inline">Boss Raid</span>
            </button>
          )}

          {/* Roadmap 21 Mejoras Hub Button */}
          {onOpenRoadmapHub && (
            <button
              onClick={onOpenRoadmapHub}
              className="flex items-center space-x-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
              title="Plan Maestro de 21 Mejoras"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span className="hidden lg:inline">21 Mejoras</span>
            </button>
          )}

          {/* BGM Video Game / Silicon Valley Rap Music Control */}
          <div className="flex items-center space-x-1 bg-[#12151E] p-1 rounded-lg border border-cyan-500/30">
            <button
              onClick={() => {
                const current = gameAudioEngine.getStyle();
                const nextStyle = current === 'silicon_valley' ? 'chiptune' : 'silicon_valley';
                gameAudioEngine.setStyle(nextStyle);
                if (bgmMuted) {
                  gameAudioEngine.toggleMute();
                  setBgmMuted(false);
                }
              }}
              className="px-2 py-1 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/50 hover:to-amber-500/40 border border-amber-500/40 rounded text-[10px] font-mono font-bold text-amber-300 transition-colors cursor-pointer"
              title="Cambiar Estilo de Música: Silicon Valley Rap Beat vs 8-Bit Chiptune"
            >
              <span>{gameAudioEngine.getStyle() === 'silicon_valley' ? '🔥 Rap SV' : '👾 8-Bit'}</span>
            </button>
            <button
              onClick={handleCycleTrack}
              className="flex items-center space-x-1.5 px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded text-[10px] font-mono font-bold text-cyan-300 transition-colors cursor-pointer"
              title="Cambiar Pista de Música (1: Preludio | 2: Mentores | 3: AGI Challenge)"
            >
              <Music className={`w-3.5 h-3.5 ${!bgmMuted ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="hidden xl:inline">
                {activeBgmTrack === 'story' && 'Pista I'}
                {activeBgmTrack === 'character' && 'Pista II'}
                {activeBgmTrack === 'model' && 'Pista III'}
              </span>
            </button>
            <button
              onClick={handleToggleBgm}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={bgmMuted ? 'Activar Música' : 'Silenciar Música'}
            >
              {!bgmMuted ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>


          {/* Video Lesson Button */}
          <button
            id="btn-mentor-video"
            onClick={onOpenVideoInsight}
            className="p-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-md shadow-purple-900/40 cursor-pointer"
            title={t.videoInsight}
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center space-x-1 bg-[#0A0B0E] p-1 rounded-lg border border-white/10">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {(['es', 'en', 'zh'] as Language[]).map((lang) => (
              <button
                key={lang}
                id={`btn-lang-${lang}`}
                onClick={() => onSelectLanguage(lang)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  progress.activeLanguage === lang
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Level Selector Ribbon */}
      <div className="bg-[#0A0B0E] border-t border-white/10 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] shrink-0">
            PROGRESO DEL RETO:
          </span>
          <div className="flex items-center space-x-2 shrink-0">
            {[1, 2, 3, 4].map((lvl) => {
              const isUnlocked = lvl <= progress.unlockedLevel;
              const isActive = lvl === progress.currentChallengeId;
              const isCompleted = progress.completedChallenges.includes(lvl);

              return (
                <button
                  key={lvl}
                  id={`btn-level-${lvl}`}
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold ring-1 ring-cyan-300'
                      : isCompleted
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60'
                      : isUnlocked
                      ? 'bg-[#161921] text-slate-300 hover:bg-slate-800 border border-white/10'
                      : 'bg-[#0D0F14]/50 text-slate-600 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <span>
                    Nivel {lvl} {'⭐'.repeat(lvl)}
                  </span>
                  {isCompleted && <span className="text-emerald-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
