import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  MapPin,
  Brain,
  Zap,
  Image as ImageIcon,
  Mic,
  MicOff,
  ExternalLink,
  X,
  Volume2,
  CheckCircle2,
  Loader2,
  Cpu,
  Layers,
  Terminal,
  ShieldAlert,
  Download
} from 'lucide-react';
import { MentorCharacter, Challenge, Language } from '../types';

interface GoogleAiHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: MentorCharacter;
  challenge: Challenge;
  code: string;
  userLang: Language;
}

export const GoogleAiHubModal: React.FC<GoogleAiHubModalProps> = ({
  isOpen,
  onClose,
  mentor,
  challenge,
  code,
  userLang
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps' | 'thinking' | 'fast' | 'avatar' | 'voice'>('search');

  // Search Grounding state
  const [searchQuery, setSearchQuery] = useState('Benchmark vLLM PagedAttention y LLaMA 3.1 FP8 quantization 2026');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{ text: string; sources: { title: string; uri: string }[] } | null>(null);

  // Maps Grounding state
  const [mapQuery, setMapQuery] = useState('xAI Colossus Memphis, OpenAI Stargate Texas, Google Council Bluffs Iowa');
  const [mapLoading, setMapLoading] = useState(false);
  const [mapResult, setMapResult] = useState<{ text: string; mapLinks: { title: string; uri: string }[] } | null>(null);

  // Thinking Mode state
  const [thinkLoading, setThinkLoading] = useState(false);
  const [thinkAnalysis, setThinkAnalysis] = useState<string | null>(null);

  // Fast Flash Lite state
  const [fastLoading, setFastLoading] = useState(false);
  const [fastHint, setFastHint] = useState<string | null>(null);

  // Avatar Image Gen state
  const [avatarPrompt, setAvatarPrompt] = useState(`Insignia cyberpunk 8-bit de ${mentor.name} como Arquitecto de AGI en Silicon Valley, estilo pixel art con luces neón.`);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. Search Grounding Handler
  const handleRunSearch = async () => {
    setSearchLoading(true);
    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, userLang })
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // 2. Maps Grounding Handler
  const handleRunMaps = async () => {
    setMapLoading(true);
    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mapQuery })
      });
      const data = await res.json();
      setMapResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMapLoading(false);
    }
  };

  // 3. Deep Thinking Handler
  const handleRunDeepThink = async () => {
    setThinkLoading(true);
    try {
      const res = await fetch('/api/deep-think-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, challenge, userLang })
      });
      const data = await res.json();
      setThinkAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setThinkLoading(false);
    }
  };

  // 4. Fast Hint Handler
  const handleRunFastHint = async () => {
    setFastLoading(true);
    try {
      const res = await fetch('/api/quick-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, progLang: 'python', userLang })
      });
      const data = await res.json();
      setFastHint(data.hint);
    } catch (err) {
      console.error(err);
    } finally {
      setFastLoading(false);
    }
  };

  // 5. Avatar Generation Handler
  const handleGenerateAvatar = async () => {
    setAvatarLoading(true);
    try {
      const res = await fetch('/api/generate-ai-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: avatarPrompt, mentorName: mentor.name })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setAvatarUrl(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarLoading(false);
    }
  };

  // 6. Voice Recording Handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setTranscriptionLoading(true);
          try {
            const res = await fetch('/api/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/wav' })
            });
            const data = await res.json();
            setTranscribedText(data.transcription);
          } catch (e) {
            console.error(e);
          } finally {
            setTranscriptionLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      alert('Error de permisos con el micrófono.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0D14] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-[#0E1320] via-[#121828] to-[#0E1320]">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  SUITE DE INTEGRACIÓN GOOGLE AI STUDIO
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Nivel Pro
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Modelos Gemini 3.6, Grounding, Live Voice, High Thinking & Lyria Audio
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

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-800 bg-[#07090F] px-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'search'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Grounding</span>
            </button>

            <button
              onClick={() => setActiveTab('maps')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'maps'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Maps Datacenters</span>
            </button>

            <button
              onClick={() => setActiveTab('thinking')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'thinking'
                  ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Thinking High Mode</span>
            </button>

            <button
              onClick={() => setActiveTab('fast')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'fast'
                  ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Flash Lite Fast</span>
            </button>

            <button
              onClick={() => setActiveTab('avatar')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'avatar'
                  ? 'border-pink-400 text-pink-300 bg-pink-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Badge & Insignia AI</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'voice'
                  ? 'border-blue-400 text-blue-300 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Transcripción Audio</span>
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#080B12]">
            {/* 1. SEARCH GROUNDING TAB */}
            {activeTab === 'search' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 font-mono">
                    <Search className="w-4 h-4" /> Google Search Grounding (gemini-3.6-flash)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Obtén información verificada en tiempo real de benchmarks de PyTorch, HuggingFace y hardware NVIDIA.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#0D121F] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                    placeholder="Escribe tu consulta de benchmarks..."
                  />
                  <button
                    onClick={handleRunSearch}
                    disabled={searchLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Buscar</span>
                  </button>
                </div>

                {searchResult && (
                  <div className="p-5 rounded-xl bg-[#0D121F] border border-cyan-500/20 space-y-4">
                    <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                      {searchResult.text}
                    </div>

                    {searchResult.sources.length > 0 && (
                      <div className="pt-3 border-t border-slate-800">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                          🔗 Fuentes Oficiales Verificadas:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {searchResult.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 hover:bg-cyan-900/50 transition-colors"
                            >
                              <span>{src.title}</span>
                              <ExternalLink className="w-3 h-3 text-cyan-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. MAPS GROUNDING TAB */}
            {activeTab === 'maps' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2 font-mono">
                    <MapPin className="w-4 h-4" /> Google Maps Grounding - Datacenters Globales de IA
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Visualiza y geolocaliza los clusters de supercomputadoras e infraestructura física de GPUs donde entrenan AGI.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mapQuery}
                    onChange={(e) => setMapQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#0D121F] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:border-emerald-400 focus:outline-none"
                    placeholder="Consulta clusters de supercomputación..."
                  />
                  <button
                    onClick={handleRunMaps}
                    disabled={mapLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {mapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    <span>Geolocalizar</span>
                  </button>
                </div>

                {mapResult && (
                  <div className="p-5 rounded-xl bg-[#0D121F] border border-emerald-500/20 space-y-4">
                    <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                      {mapResult.text}
                    </div>

                    {mapResult.mapLinks.length > 0 && (
                      <div className="pt-3 border-t border-slate-800">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                          🗺️ Ubicaciones en Google Maps:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {mapResult.mapLinks.map((map, i) => (
                            <a
                              key={i}
                              href={map.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                            >
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>{map.title}</span>
                              <ExternalLink className="w-3 h-3 text-emerald-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. THINKING HIGH MODE TAB */}
            {activeTab === 'thinking' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2 font-mono">
                    <Brain className="w-4 h-4" /> Razonamiento Matemático de Alto Nivel (gemini-3.1-pro-preview)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Ejecuta un diagnóstico profundo de matrices de atención, anchos de banda de memoria GPU (GB/s) y cuellos de botella con <span className="font-mono text-purple-400 font-bold">ThinkingLevel.HIGH</span>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">Código Actual en Editor a Analizar:</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
                      High Thinking Active
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 bg-black/50 p-3 rounded-lg overflow-x-auto max-h-36 border border-slate-800">
                    {code}
                  </pre>
                </div>

                <button
                  onClick={handleRunDeepThink}
                  disabled={thinkLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  {thinkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  <span>Ejecutar Análisis Razonado de Alto Nivel</span>
                </button>

                {thinkAnalysis && (
                  <div className="p-5 rounded-xl bg-[#0D121F] border border-purple-500/30 space-y-3">
                    <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-mono">
                      {thinkAnalysis}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. FAST FLASH LITE TAB */}
            {activeTab === 'fast' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 font-mono">
                    <Zap className="w-4 h-4" /> Copiloto Ultrarrápido (gemini-3.1-flash-lite)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Sugerencias instantáneas de compilación de baja latencia con latencia de respuesta mínima.
                  </p>
                </div>

                <button
                  onClick={handleRunFastHint}
                  disabled={fastLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {fastLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Obtener Tip Rápido en Milibloques de Segundo</span>
                </button>

                {fastHint && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-amber-200 font-bold leading-relaxed">
                      {fastHint}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 5. AVATAR BADGE IMAGE GEN TAB */}
            {activeTab === 'avatar' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30">
                  <h4 className="text-sm font-bold text-pink-300 flex items-center gap-2 font-mono">
                    <ImageIcon className="w-4 h-4" /> Generador de Insignias y Avatares AI (gemini-3.1-flash-lite-image)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Crea insignias coleccionables de tus mentores o certificado de logro en estilo pixel-art de 8 bits.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 font-bold">Prompt de Generación de Imagen:</label>
                  <input
                    type="text"
                    value={avatarPrompt}
                    onChange={(e) => setAvatarPrompt(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0D121F] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerateAvatar}
                  disabled={avatarLoading}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {avatarLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  <span>Generar Insignia de Mentor</span>
                </button>

                {avatarUrl && (
                  <div className="flex flex-col items-center justify-center p-6 bg-[#0D121F] border border-pink-500/30 rounded-xl space-y-3">
                    <img
                      src={avatarUrl}
                      alt="Mentor AI Badge"
                      className="w-48 h-48 rounded-2xl border-2 border-pink-400/50 shadow-xl shadow-pink-950/50 object-cover"
                    />
                    <a
                      href={avatarUrl}
                      download={`Insignia_${mentor.name.replace(/\s+/g, '_')}.png`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-mono font-bold text-slate-200 flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Guardar Imagen</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* 6. VOICE AUDIO TRANSCRIPTION TAB */}
            {activeTab === 'voice' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                  <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2 font-mono">
                    <Mic className="w-4 h-4" /> Transcripción e Interacción por Voz (gemini-3.6-flash)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Habla directamente con tu micrófono para realizar preguntas sobre tu código o desafío a los mentores.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-[#0D121F] border border-slate-800 rounded-xl space-y-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full text-white shadow-xl shadow-blue-950/50 transition-all transform hover:scale-105 cursor-pointer"
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="p-6 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-xl shadow-red-950/50 transition-all transform hover:scale-105 animate-pulse cursor-pointer"
                    >
                      <MicOff className="w-8 h-8" />
                    </button>
                  )}

                  <span className="text-xs font-mono font-bold text-slate-300">
                    {isRecording ? '🎙️ Grabando audio... Haz clic para finalizar.' : 'Presiona el micrófono para hablar.'}
                  </span>
                </div>

                {transcriptionLoading && (
                  <div className="flex items-center justify-center space-x-2 p-4 text-xs font-mono text-blue-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transcribiendo voz con Gemini AI...</span>
                  </div>
                )}

                {transcribedText && (
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                      🗣️ Texto Transcrito:
                    </span>
                    <p className="text-xs font-mono text-slate-100 bg-black/40 p-3 rounded-lg">
                      "{transcribedText}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-slate-800 bg-[#07090F] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Servidor Cloud Run en ejecucion con SDK Google GenAI</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
