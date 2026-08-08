import React, { useState } from 'react';
import { MentorCharacter, Language } from '../types';
import { CHARACTERS } from '../data/characters';
import { TRANSLATIONS } from '../data/i18n';
import { X, Check, Volume2, Sparkles, Building2 } from 'lucide-react';
import { getLeaderAvatarUrl, AvatarStyle } from '../utils/avatars';
import { LeaderAvatar } from './LeaderAvatar';

interface CharacterSelectorProps {
  activeCharacterId: string;
  userLang: Language;
  onSelectCharacter: (character: MentorCharacter) => void;
  onClose: () => void;
  onPlayGreetingVoice: (character: MentorCharacter) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  activeCharacterId,
  userLang,
  onSelectCharacter,
  onClose,
  onPlayGreetingVoice,
}) => {
  const t = TRANSLATIONS[userLang];
  const [artStyle, setArtStyle] = useState<AvatarStyle>('comic');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              {t.selectMentor}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Elige al líder tecnológico que guiará tus optimizaciones y te dará feedback en tiempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Style Selector */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setArtStyle('comic')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  artStyle === 'comic' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                💥 Comic
              </button>
              <button
                onClick={() => setArtStyle('pixel')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  artStyle === 'pixel' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                👾 Pixel
              </button>
              <button
                onClick={() => setArtStyle('anime')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  artStyle === 'anime' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎨 Manga
              </button>
              <button
                onClick={() => setArtStyle('photo')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  artStyle === 'photo' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                📷 Foto
              </button>
            </div>

            <button
              id="btn-close-character-selector"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHARACTERS.map((char) => {
            const isSelected = char.id === activeCharacterId;
            const avatarUrl = getLeaderAvatarUrl(char.id, artStyle, char.avatar);

            return (
              <div
                key={char.id}
                id={`card-character-${char.id}`}
                onClick={() => {
                  onSelectCharacter(char);
                  onClose();
                }}
                className={`group relative bg-slate-950/80 border rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/50 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative">
                      <LeaderAvatar
                        leaderId={char.id}
                        name={char.name}
                        style={artStyle}
                        companyColor={char.color}
                        size="lg"
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 rounded-full p-0.5 shadow-md z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md text-white border border-white/10"
                        style={{ backgroundColor: char.color }}
                      >
                        <Building2 className="w-3 h-3" />
                        {char.company}
                      </span>
                      <div className="text-[11px] text-slate-400 font-medium mt-1">
                        {char.role}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {char.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {char.bio[userLang] || char.bio.es}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-mono font-medium">
                    {char.models.length} Modelos HF
                  </span>

                  <button
                    id={`btn-voice-preview-${char.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayGreetingVoice(char);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                    title="Escuchar Voz"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
