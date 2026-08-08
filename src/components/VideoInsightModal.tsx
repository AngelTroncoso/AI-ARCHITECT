import React from 'react';
import { Challenge, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { X, Video, Play, Sparkles, BookOpen } from 'lucide-react';

interface VideoInsightModalProps {
  challenge: Challenge;
  userLang: Language;
  onClose: () => void;
}

export const VideoInsightModal: React.FC<VideoInsightModalProps> = ({
  challenge,
  userLang,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const t = TRANSLATIONS[userLang];
  const lesson = challenge.videoLesson;

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              Lección Magistral del Mentor: {lesson.mentorName}
            </h3>
          </div>
          <button
            id="btn-close-video-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Container / Simulated Interactive Visualizer */}
        <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden group">
          {!isPlaying ? (
            <div className="text-center p-6 space-y-3 z-10">
              <div className="w-16 h-16 rounded-full bg-purple-600/80 hover:bg-purple-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-900/50 cursor-pointer transition-transform group-hover:scale-110" onClick={() => setIsPlaying(true)}>
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <h4 className="text-base font-bold text-white max-w-md mx-auto">
                {lesson.title[userLang] || lesson.title.es}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Presiona reproducir para iniciar la simulación interactiva sobre optimización de tensores.
              </p>
            </div>
          ) : (
            <div className="w-full h-full p-6 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex flex-col justify-between animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> SIMULACIÓN DIDÁCTICA EN VIVO
                </span>
                <span>01:45 / 03:00</span>
              </div>

              {/* Animated Tensor Graphic */}
              <div className="my-auto flex justify-center space-x-4">
                {[40, 75, 20, 95, 60, 30, 85].map((h, i) => (
                  <div key={i} className="w-6 bg-slate-800 rounded-t-md relative overflow-hidden h-28 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-md transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-slate-300 font-medium">
                "Los bloques de atención pueden intercalarse usando paralelización en SRAM GPU."
              </div>
            </div>
          )}
        </div>

        {/* Lesson Summary Footer */}
        <div className="p-5 bg-slate-900 space-y-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Resumen Teórico
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lesson.summary[userLang] || lesson.summary.es}
          </p>
        </div>
      </div>
    </div>
  );
};
