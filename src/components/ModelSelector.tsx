import React from 'react';
import { HFModel, MentorCharacter, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { X, Check, Code2, Zap, HardDrive, DollarSign } from 'lucide-react';

interface ModelSelectorProps {
  activeModelId: string;
  mentor: MentorCharacter;
  userLang: Language;
  onSelectModel: (model: HFModel) => void;
  onClose: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  activeModelId,
  mentor,
  userLang,
  onSelectModel,
  onClose,
}) => {
  const t = TRANSLATIONS[userLang];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              {t.selectModel} — {mentor.company}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Selecciona el modelo Open-Source de Hugging Face que deseas optimizar en este reto.
            </p>
          </div>
          <button
            id="btn-close-model-selector"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Catalog List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {mentor.models.map((model) => {
            const isSelected = model.id === activeModelId;

            return (
              <div
                key={model.id}
                id={`card-model-${model.id}`}
                onClick={() => {
                  onSelectModel(model);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 hover:scale-[1.01] ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white font-mono">{model.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      {model.hfTag}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Activo
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {model.description[userLang] || model.description.es}
                </p>

                {/* Base Specs Grid */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="text-[9px] text-slate-400">Latencia Base</div>
                      <div className="font-bold text-slate-200">{model.baseMetrics.latencyMs} ms</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center space-x-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div className="text-[9px] text-slate-400">Tamaño Base</div>
                      <div className="font-bold text-slate-200">{model.baseMetrics.sizeMb} MB</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <div className="text-[9px] text-slate-400">Parámetros</div>
                      <div className="font-bold text-slate-200">{model.baseMetrics.paramsM}M</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="text-[9px] text-slate-400">Costo / 1k</div>
                      <div className="font-bold text-slate-200">${model.baseMetrics.costPer1k}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
