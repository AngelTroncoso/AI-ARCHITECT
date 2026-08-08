import React, { useState, useRef } from 'react';
import { MentorCharacter, Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import {
  MessageSquare,
  Send,
  Volume2,
  X,
  Sparkles,
  User,
  Bot,
  VolumeX,
  Image as ImageIcon,
  Code2,
  Mic,
  MicOff,
  Zap,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { LeaderAvatar } from './LeaderAvatar';

interface MentorWidgetProps {
  mentor: MentorCharacter;
  userLang: Language;
  mentorReaction: 'happy' | 'thinking' | 'celebrating' | 'alert';
  chatHistory: ChatMessage[];
  onSendMessage: (
    text: string,
    options?: { imageAttachment?: string; codeAttachment?: string }
  ) => void;
  onPlayTTS: (text: string, voiceName: string) => void;
  isPlayingAudio: boolean;
  currentCode?: string;
}

export const MentorWidget: React.FC<MentorWidgetProps> = ({
  mentor,
  userLang,
  mentorReaction,
  chatHistory,
  onSendMessage,
  onPlayTTS,
  isPlayingAudio,
  currentCode = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [attachCode, setAttachCode] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = TRANSLATIONS[userLang];

  // Handle Voice Recording via Web Speech API
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Por favor escribe tu mensaje.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = userLang === 'es' ? 'es-ES' : userLang === 'zh' ? 'zh-CN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageAttachment(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !imageAttachment && !attachCode) return;

    onSendMessage(inputText || 'Analizar archivo/código adjunto.', {
      imageAttachment: imageAttachment || undefined,
      codeAttachment: attachCode ? currentCode : undefined,
    });

    setInputText('');
    setImageAttachment(null);
    setAttachCode(false);
  };

  const handleQuickPrompt = (promptText: string, includeCode = false) => {
    onSendMessage(promptText, {
      codeAttachment: includeCode ? currentCode : undefined,
    });
  };

  const getReactionBadge = () => {
    switch (mentorReaction) {
      case 'happy':
        return { text: '😊 Optimista', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'celebrating':
        return { text: '🎉 ¡Impresionado!', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'thinking':
        return { text: '🤔 Analizando', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'alert':
        return { text: '⚠️ Precaución', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
  };

  const reaction = getReactionBadge();

  return (
    <>
      {/* Floating Mentor Card */}
      <div id="mentor-floating-card" className="fixed bottom-4 right-4 z-40 flex items-end space-x-3">
        {!isOpen && (
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center space-x-3 max-w-sm animate-in slide-in-from-bottom-5">
            <div className="relative shrink-0">
              <LeaderAvatar
                leaderId={mentor.id}
                name={mentor.name}
                style="comic"
                companyColor={mentor.color}
                size="md"
              />
              <span className={`absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${reaction.color} z-10`}>
                {reaction.text.split(' ')[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">{mentor.name}</h4>
                <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Multimodal
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {mentor.customAdvice[userLang] || mentor.customAdvice.es}
              </p>
            </div>

            <button
              id="btn-toggle-mentor-chat"
              onClick={() => setIsOpen(true)}
              className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
              title="Abrir Agente Conversacional Multimodal"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Expanded Multimodal Chat Drawer */}
      {isOpen && (
        <div id="mentor-chat-drawer" className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Drawer Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <LeaderAvatar
                leaderId={mentor.id}
                name={mentor.name}
                style="comic"
                companyColor={mentor.color}
                size="sm"
              />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {mentor.name}
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                    AGENTE MULTIMODAL
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">{mentor.role} @ {mentor.company}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                id="btn-read-tts"
                onClick={() => onPlayTTS(chatHistory[chatHistory.length - 1]?.text || mentor.greeting[userLang], mentor.voiceName)}
                className={`p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer ${
                  isPlayingAudio ? 'bg-cyan-500 text-slate-950 animate-pulse' : 'bg-slate-800'
                }`}
                title={t.speakFeedback}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                id="btn-close-mentor-chat"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Guided Prompt Pills */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-[10px] shrink-0">
            <button
              onClick={() => handleQuickPrompt('Explicame el desafío de LA BÚSQUEDA DE LA AGI y por qué la latencia es crítica en 2026.')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-medium whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>¿Qué es la Búsqueda AGI?</span>
            </button>
            <button
              onClick={() => handleQuickPrompt('¿Cómo puedo mejorar mi código actual para superar los benchmarks de este nivel?', true)}
              className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-800/80 text-purple-300 font-medium whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer"
            >
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Orientar mi Código</span>
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/50 text-xs">
            {/* Initial Greeting Message */}
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl rounded-tl-none text-slate-200 leading-relaxed max-w-[85%]">
                {mentor.greeting[userLang] || mentor.greeting.es}
              </div>
            </div>

            {/* Conversation Messages */}
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-950 border border-indigo-800 text-indigo-400'
                      : 'bg-cyan-950 border border-cyan-800 text-cyan-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-2.5 rounded-xl text-xs leading-relaxed max-w-[85%] space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Image Attachment inside Message */}
                  {msg.imageAttachment && (
                    <div className="rounded-lg overflow-hidden border border-white/20 max-h-40">
                      <img
                        src={msg.imageAttachment}
                        alt="Adjunto usuario"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Code Snippet Attachment inside Message */}
                  {msg.codeAttachment && (
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] font-mono text-cyan-300 max-h-28 overflow-y-auto">
                      <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">Código Editor Adjunto:</div>
                      <pre className="whitespace-pre-wrap">{msg.codeAttachment.slice(0, 300)}...</pre>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Multimodal Preview Bar */}
          {(imageAttachment || attachCode) && (
            <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2 overflow-hidden">
                {imageAttachment && (
                  <div className="relative w-8 h-8 rounded border border-cyan-500 overflow-hidden shrink-0">
                    <img src={imageAttachment} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageAttachment(null)}
                      className="absolute top-0 right-0 bg-rose-600 text-white rounded-bl p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
                {attachCode && (
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300 font-mono text-[10px] flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-purple-400" />
                    Código Editor Adjunto
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setImageAttachment(null);
                  setAttachCode(false);
                }}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            </div>
          )}

          {/* Chat Form Input with Multimodal Controls */}
          <form onSubmit={handleSend} className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Upload Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                imageAttachment ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title="Adjuntar Captura / Imagen / Diagrama"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Attach Code Toggle Button */}
            <button
              type="button"
              onClick={() => setAttachCode(!attachCode)}
              className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                attachCode ? 'bg-purple-500/20 text-purple-300 border border-purple-500' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title="Adjuntar Código Actual del Editor"
            >
              <Code2 className="w-4 h-4" />
            </button>

            {/* Mic Record Button */}
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title={isRecording ? 'Detener Grabación' : 'Grabar Voz'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              id="input-mentor-chat"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isRecording ? 'Escuchando voz...' : t.askQuestion}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <button
              id="btn-send-mentor-chat"
              type="submit"
              className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold transition-all cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
