import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  User,
  Building2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  Bot,
  Flame,
  CheckCircle2,
  X,
  Play,
  Volume2,
  VolumeX,
  Radio,
  BarChart2,
  Terminal,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MentorCharacter, Language } from '../types';
import { CHARACTERS } from '../data/characters';
import { getLeaderAvatarUrl, AvatarStyle } from '../utils/avatars';
import { gameAudioEngine, playSoundEffect } from '../utils/gameAudio';
import { LeaderAvatar } from './LeaderAvatar';

interface IntroGameCoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMentorId: string;
  selectedModelId: string;
  userLang: Language;
  username: string;
  onConfirmSetup: (mentorId: string, modelId: string, username: string) => void;
}

export const IntroGameCover: React.FC<IntroGameCoverProps> = ({
  isOpen,
  onClose,
  selectedMentorId,
  selectedModelId,
  userLang,
  username: initialUsername,
  onConfirmSetup,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'story' | 'character' | 'model'>('story');
  const [tempUsername, setTempUsername] = useState<string>(initialUsername || 'Arquitecto Alfa');
  const [tempMentorId, setTempMentorId] = useState<string>(selectedMentorId || CHARACTERS[0].id);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(!gameAudioEngine.isMuted());
  const [artMode, setArtMode] = useState<AvatarStyle>('comic');

  // Sync background music track according to game cover step
  useEffect(() => {
    if (!isOpen) return;

    if (!soundEnabled) {
      gameAudioEngine.setTrack('off');
      return;
    }

    if (step === 'story') {
      gameAudioEngine.setTrack('story');
    } else if (step === 'character') {
      gameAudioEngine.setTrack('character');
    } else if (step === 'model') {
      gameAudioEngine.setTrack('model');
    }
  }, [step, isOpen, soundEnabled]);

  const currentMentor = CHARACTERS.find((c) => c.id === tempMentorId) || CHARACTERS[0];
  const [tempModelId, setTempModelId] = useState<string>(
    selectedModelId || currentMentor.models[0]?.id || CHARACTERS[0].models[0].id
  );

  const handleMentorSelect = (mentor: MentorCharacter) => {
    if (soundEnabled) playSoundEffect('click');
    setTempMentorId(mentor.id);
    if (mentor.models.length > 0) {
      setTempModelId(mentor.models[0].id);
    }
  };

  const handleStartMission = () => {
    if (soundEnabled) playSoundEffect('launch');
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    onConfirmSetup(tempMentorId, tempModelId, tempUsername);
    onClose();
  };

  // Translations
  const texts = {
    es: {
      badge: 'PROYECTO AGI 2026 • CAPÍTULO I',
      mainTitle: 'LA BÚSQUEDA DE LA "AGI"',
      subTitle: '6 Titanes de la Inteligencia Artificial te reclutan para romper la barrera de la latencia y desbloquear la AGI.',
      storyHeading: 'LA PROCLAMA DEL CONSEJO SUPREMO',
      storyText1: 'En el año 2026, los supermodelos de IA han alcanzado un razonamiento asombroso, pero su costo energético y latencia en tiempo real han detenido el avance hacia la AGI (Inteligencia Artificial General).',
      storyText2: 'Los líderes de OpenAI, NVIDIA, Google DeepMind, Meta, Microsoft y xAI han formado la "Alianza por la Eficiencia". Necesitan un Arquitecto de IA capaz de compilar, cuantizar e invocar kernels de aceleración en Hugging Face.',
      callsignLabel: 'NOMBRE DE TU ARQUITECTO / CALLSIGN:',
      step1Btn: 'SELECCIONAR COMPAÑÍA & MENTOR →',
      step2Heading: 'ELIGE TU COMPAÑÍA & MENTOR DE IA',
      step2Sub: 'Cada líder te otorgará modelos de Hugging Face y conocimientos técnicos exclusivos:',
      step3Heading: 'SELECCIONA EL MODELO HUGGING FACE BASE',
      step3Sub: 'Elige la arquitectura neuronal que someterás a compresión y benchmark:',
      launchBtn: '¡INICIAR DESAFÍO Y CONQUISTAR LA AGI!',
      backBtn: '← VOLVER',
      continueBtn: 'SIGUIENTE PASO →',
      mentorPerks: 'Ventaja Táctica:',
    },
    en: {
      badge: 'PROJECT AGI 2026 • CHAPTER I',
      mainTitle: 'THE QUEST FOR "AGI"',
      subTitle: '6 Artificial Intelligence Titans recruit you to break the latency barrier and unlock AGI.',
      storyHeading: 'THE SUPREME COUNCIL PROCLAMATION',
      storyText1: 'In 2026, AI supermodels achieved astonishing reasoning, but energy cost and inference latency have stalled the march towards AGI (Artificial General Intelligence).',
      storyText2: 'The heads of OpenAI, NVIDIA, Google DeepMind, Meta, Microsoft, and xAI formed the "Efficiency Alliance". They need an AI Architect to compile, quantize, and accelerate open Hugging Face models.',
      callsignLabel: 'YOUR ARCHITECT CALLSIGN / USERNAME:',
      step1Btn: 'CHOOSE COMPANY & MENTOR →',
      step2Heading: 'SELECT YOUR AI COMPANY & MENTOR',
      step2Sub: 'Each leader grants specialized Hugging Face models and expert optimization buffs:',
      step3Heading: 'SELECT HUGGING FACE BASE MODEL',
      step3Sub: 'Choose the neural network architecture you will compress and benchmark:',
      launchBtn: 'LAUNCH MISSION & CONQUER AGI!',
      backBtn: '← BACK',
      continueBtn: 'NEXT STEP →',
      mentorPerks: 'Tactical Perk:',
    },
    zh: {
      badge: 'AGI项目 2026 • 第一章',
      mainTitle: '探索"A"的峰会',
      subTitle: '6大AI巨头联合招募你，打破推理延迟瓶颈，解锁通用人工智能！',
      storyHeading: '最高委员会的联合宣言',
      storyText1: '2026年，AI超级模型展现出惊人推理能力，但高昂的算力成本与延迟阻碍了向"A"（AGI）的跨越。',
      storyText2: 'OpenAI、NVIDIA、Google DeepMind、Meta、Microsoft与xAI共同成立"效率联盟"。他们需要一位能够量化、剪枝与加速开源Hugging Face模型的架构师。',
      callsignLabel: '输入你的架构师代号：',
      step1Btn: '选择AI公司与导师 →',
      step2Heading: '选择你的AI公司与导师',
      step2Sub: '每位导师都将提供专属Hugging Face模型与优化增益：',
      step3Heading: '选择要优化的Hugging Face基础模型',
      step3Sub: '选择你将进行压测与量化的神经网络架构：',
      launchBtn: '启动任务，征服"A"！',
      backBtn: '← 返回',
      continueBtn: '下一步 →',
      mentorPerks: '战术增益：',
    }
  };

  const t = texts[userLang] || texts.es;

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#030407] overflow-y-auto flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 font-sans text-white">
      {/* Background Animated Cyber Mesh & Particle Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#00E0FF 1.5px, transparent 1.5px), radial-gradient(#a855f7 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            backgroundPosition: '0 0, 14px 14px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-500/25 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-10 w-[700px] h-[400px] bg-indigo-600/25 blur-[180px] rounded-full" />
      </div>

      {/* Top Video Game Bar */}
      <header className="relative z-10 w-full bg-[#0A0C12]/95 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between shadow-2xl backdrop-blur-xl shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-cyan-500/40 ring-2 ring-cyan-300/50 animate-pulse">
            A
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase block">
              {t.badge}
            </span>
            <h1 className="text-lg font-black tracking-wider text-white leading-none flex items-center gap-2">
              <span>AI ARCHITECT:</span>
              <span className="text-cyan-400">AGI QUEST</span>
            </h1>
          </div>
        </div>

        {/* Center Progress Steps */}
        <div className="hidden md:flex items-center space-x-2 bg-[#12151E] px-4 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-bold">
          <button
            onClick={() => setStep('story')}
            className={`px-3 py-1 rounded-lg transition-all ${step === 'story' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            I. PORTADA & HISTORIA
          </button>
          <span className="text-slate-600">►</span>
          <button
            onClick={() => setStep('character')}
            className={`px-3 py-1 rounded-lg transition-all ${step === 'character' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            II. MENTOR & COMPAÑÍA
          </button>
          <span className="text-slate-600">►</span>
          <button
            onClick={() => setStep('model')}
            className={`px-3 py-1 rounded-lg transition-all ${step === 'model' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            III. MODELO BASE HF
          </button>
        </div>

        {/* Art Mode, Audio Toggle & Close */}
        <div className="flex items-center space-x-3">
          {/* Art style switcher */}
          <div className="hidden sm:flex items-center space-x-1 bg-[#12151E] p-1 rounded-xl border border-cyan-500/30 text-xs font-mono">
            <button
              onClick={() => setArtMode('comic')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                artMode === 'comic' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              💥 Comic
            </button>
            <button
              onClick={() => setArtMode('pixel')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                artMode === 'pixel' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              👾 Pixel
            </button>
            <button
              onClick={() => setArtMode('anime')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                artMode === 'anime' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎨 Manga
            </button>
            <button
              onClick={() => setArtMode('photo')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                artMode === 'photo' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              📷 Foto
            </button>
          </div>

          {/* Soundtrack Indicator & Mute Toggle */}
          <div className="flex items-center space-x-2 bg-[#12151E] px-2.5 py-1 rounded-xl border border-cyan-500/30">
            <Radio className={`w-3.5 h-3.5 ${soundEnabled ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase leading-none">
                {step === 'story' && '🎵 PISTA 1: PRELUDIO (PORTADA)'}
                {step === 'character' && '🎵 PISTA 2: RECLUTAMIENTO (MENTOR)'}
                {step === 'model' && '🎵 PISTA 3: DESAFÍO AGI (MODELO)'}
              </span>
              <span className="text-[8px] text-slate-400 font-mono">BGM SINTETIZADO GAME 8-BIT</span>
            </div>
            {soundEnabled && (
              <div className="flex items-end space-x-0.5 h-3 px-1">
                <span className="w-0.5 h-3 bg-cyan-400 animate-pulse"></span>
                <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75"></span>
                <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-150"></span>
              </div>
            )}
            <button
              onClick={() => {
                const isMuted = gameAudioEngine.toggleMute();
                setSoundEnabled(!isMuted);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              title={soundEnabled ? 'Silenciar Música' : 'Activar Música de Videojuego'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#12151E] hover:bg-slate-800 border border-white/10 text-xs text-slate-300 font-bold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 inline mr-1" />
            OMITIR
          </button>
        </div>
      </header>

      {/* Main Full-Screen Content Area */}
      <main className="relative z-10 max-w-6xl w-full mx-auto p-4 sm:p-8 flex-1 flex flex-col justify-center">
        {/* STEP 1: CINEMATIC STORYTELLING PROLOGUE */}
        {step === 'story' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Massive Hero Game Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-gradient-to-br from-[#0B0E17] via-[#0F1424] to-[#0B0E17] p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden lg:block">
                <Cpu className="w-96 h-96 text-cyan-400" />
              </div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-500/10 border border-cyan-500/40 rounded-full text-cyan-400 text-xs font-mono font-bold tracking-widest">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>MODO HISTORIA • AÑO 2026</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                  {t.mainTitle}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  {t.subTitle}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-cyan-300">
                    ⚡ Latencia Meta: &lt; 50ms
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-purple-300">
                    🧠 Compresión INT8 / FP8
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-emerald-300">
                    🔥 FlashAttention-2
                  </span>
                </div>
              </div>
            </div>

            {/* AGI Council Leaders Showcase */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>CONSEJO SUPREMO DE LÍDERES IA (2026)</span>
                </h3>
                <div className="flex gap-1.5 text-[10px] font-mono">
                  <span className="text-slate-400 self-center hidden sm:inline">Estilo:</span>
                  {(['comic', 'pixel', 'anime', 'photo'] as AvatarStyle[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setArtMode(mode)}
                      className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
                        artMode === mode ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {CHARACTERS.slice(0, 6).map((c) => {
                  const avatarSrc = getLeaderAvatarUrl(c.id, artMode, c.avatar);
                  return (
                    <div
                      key={c.id}
                      className="bg-[#12151E] border border-white/10 hover:border-cyan-500/50 p-2.5 rounded-xl flex flex-col items-center text-center transition-all hover:scale-[1.03] group shadow-lg"
                    >
                      <div className="relative mb-2">
                        <LeaderAvatar
                          leaderId={c.id}
                          name={c.name}
                          style={artMode}
                          companyColor={c.color}
                          size="lg"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-cyan-950 border border-cyan-500 text-[8px] font-bold text-cyan-400 rounded z-10">
                          {c.company.split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white truncate w-full">{c.name}</span>
                      <span className="text-[9px] text-slate-400 truncate w-full">{c.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Narrative Box & Player Callsign Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-[#0E111A] border border-white/10 rounded-2xl p-5 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans shadow-xl">
                <h4 className="font-bold text-cyan-400 font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>{t.storyHeading}</span>
                </h4>
                <p>{t.storyText1}</p>
                <p className="font-semibold text-white">{t.storyText2}</p>
              </div>

              {/* Callsign Input */}
              <div className="bg-[#12151E] border border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{t.callsignLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="Ej: Architect Neo"
                    className="w-full bg-[#07080B] border border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {['Arquitecto Alfa', 'Tensor Knight', 'Quantum Dev'].map((title) => (
                      <button
                        key={title}
                        onClick={() => setTempUsername(title)}
                        className="px-2 py-0.5 bg-white/5 hover:bg-cyan-500/20 text-[10px] text-slate-400 hover:text-cyan-300 rounded border border-white/10 transition-colors cursor-pointer"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (soundEnabled) playSoundEffect('click');
                    setStep('character');
                  }}
                  className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <span>{t.step1Btn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTER & COMPANY SELECTION */}
        {step === 'character' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t.step2Heading}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">{t.step2Sub}</p>
              </div>

              {/* Art Style Toggle */}
              <div className="flex items-center space-x-1 bg-[#12151E] p-1 rounded-xl border border-white/10 shrink-0 text-xs font-mono">
                <button
                  onClick={() => {
                    if (soundEnabled) playSoundEffect('click');
                    setArtMode('comic');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    artMode === 'comic' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💥 Comic
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) playSoundEffect('click');
                    setArtMode('pixel');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    artMode === 'pixel' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👾 Pixel
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) playSoundEffect('click');
                    setArtMode('anime');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    artMode === 'anime' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎨 Manga
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) playSoundEffect('click');
                    setArtMode('photo');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    artMode === 'photo' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📷 Foto
                </button>
              </div>
            </div>

            {/* Character Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHARACTERS.map((char) => {
                const isSelected = char.id === tempMentorId;
                const avatarSrc = getLeaderAvatarUrl(char.id, artMode, char.avatar);
                return (
                  <div
                    key={char.id}
                    onMouseEnter={() => soundEnabled && playSoundEffect('hover')}
                    onClick={() => handleMentorSelect(char)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#151926] border-cyan-400 ring-2 ring-cyan-400/40 shadow-2xl scale-[1.02]'
                        : 'bg-[#0E111A] border-white/10 hover:border-cyan-500/40 hover:bg-[#12151E]'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1 shadow-md z-10">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SELECCIONADO</span>
                      </div>
                    )}

                    <div>
                      {/* Character Header */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="relative shrink-0">
                          <LeaderAvatar
                            leaderId={char.id}
                            name={char.name}
                            style={artMode}
                            companyColor={char.color}
                            size="lg"
                            showBadge
                          />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-white">{char.name}</h3>
                          <p className="text-xs text-slate-400 font-medium">{char.role}</p>
                          <span className="mt-1 inline-block text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                            🏢 {char.company}
                          </span>
                        </div>
                      </div>

                      {/* Quote */}
                      <p className="text-xs text-slate-300 italic mb-4 line-clamp-2 bg-[#07080B]/50 p-2.5 rounded-xl border border-white/5">
                        "{char.greeting[userLang] || char.greeting.es}"
                      </p>
                    </div>

                    {/* Tactical Perk & Models Count */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="text-[11px] text-cyan-300 font-mono font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{t.mentorPerks}</span>
                        <span className="text-white font-normal truncate">{char.customAdvice[userLang] || char.customAdvice.es}</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>Modelos Hugging Face:</span>
                        <span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                          {char.models.length} Arquitecturas
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setStep('story')}
                className="px-5 py-2.5 bg-[#12151E] hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                {t.backBtn}
              </button>

              <button
                onClick={() => {
                  if (soundEnabled) playSoundEffect('click');
                  setStep('model');
                }}
                className="px-7 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MODEL SELECTION & GAME LAUNCH */}
        {step === 'model' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t.step3Heading} ({currentMentor.company})
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">{t.step3Sub}</p>
            </div>

            {/* Models Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentMentor.models.map((m) => {
                const isSelected = m.id === tempModelId;
                return (
                  <div
                    key={m.id}
                    onMouseEnter={() => soundEnabled && playSoundEffect('hover')}
                    onClick={() => {
                      if (soundEnabled) playSoundEffect('click');
                      setTempModelId(m.id);
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#151926] border-cyan-400 ring-2 ring-cyan-400/40 shadow-2xl scale-[1.01]'
                        : 'bg-[#0E111A] border-white/10 hover:border-cyan-500/30 hover:bg-[#12151E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-base text-white">{m.name}</h3>
                      <span className="text-[10px] font-mono px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg font-bold uppercase">
                        {m.type}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-cyan-400 mb-3 flex items-center gap-1.5">
                      <span>🤗 HuggingFace:</span>
                      <span className="font-bold underline">{m.hfTag}</span>
                    </div>

                    <p className="text-xs text-slate-300 mb-4">
                      {m.description[userLang] || m.description.es}
                    </p>

                    {/* Metrics Matrix */}
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-[#07080B] p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Latencia Base</span>
                        <span className="text-white font-bold">{m.baseMetrics.latencyMs} ms</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Tamaño VRAM</span>
                        <span className="text-white font-bold">{m.baseMetrics.sizeMb} MB</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Precisión</span>
                        <span className="text-emerald-400 font-bold">{m.baseMetrics.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Player Ticket Summary */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-[#0B0E17] to-purple-950/40 border border-cyan-500/40 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center space-x-4">
                <LeaderAvatar
                  leaderId={currentMentor.id}
                  name={currentMentor.name}
                  style={artMode}
                  companyColor={currentMentor.color}
                  size="lg"
                  showBadge
                />
                <div>
                  <div className="text-xs text-slate-400 font-mono">ARQUITECTO REGISTRADO:</div>
                  <div className="text-base font-black text-cyan-400">{tempUsername}</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">
                    Mentor: {currentMentor.name} ({currentMentor.company})
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Modelo Asignado:</span>
                <span className="text-sm font-extrabold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10 inline-block mt-1">
                  {tempModelId.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Final Action Launch CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setStep('character')}
                className="px-5 py-2.5 bg-[#12151E] hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                {t.backBtn}
              </button>

              <button
                onClick={handleStartMission}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-cyan-500/40 flex items-center space-x-3 transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
              >
                <Play className="w-5 h-5 fill-current text-white animate-pulse" />
                <span>{t.launchBtn}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Game Version */}
      <footer className="relative z-10 w-full bg-[#0B0D12] border-t border-white/5 px-6 py-2.5 text-center text-[10px] font-mono text-slate-500 flex justify-between items-center shrink-0">
        <span>AI ARCHITECT CHALLENGE • AGENTIC ENGINE V2.6</span>
        <span>HUGGING FACE OPEN-SOURCE AI BENCHMARK</span>
      </footer>
    </div>
  );
};
