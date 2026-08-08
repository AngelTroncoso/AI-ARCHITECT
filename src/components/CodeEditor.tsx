import React from 'react';
import Editor from '@monaco-editor/react';
import { ProgrammingLanguage, Challenge, Language } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { Play, RotateCcw, Copy, Check, Code2, Terminal, Lightbulb } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  progLang: ProgrammingLanguage;
  onChangeProgLang: (lang: ProgrammingLanguage) => void;
  challenge: Challenge;
  userLang: Language;
  onRunBenchmark: () => void;
  isEvaluating: boolean;
  onResetCode: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChangeCode,
  progLang,
  onChangeProgLang,
  challenge,
  userLang,
  onRunBenchmark,
  isEvaluating,
  onResetCode,
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = TRANSLATIONS[userLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMonacoLang = (lang: ProgrammingLanguage) => {
    switch (lang) {
      case 'python':
        return 'python';
      case 'javascript':
        return 'javascript';
      case 'cpp':
        return 'cpp';
      default:
        return 'python';
    }
  };

  return (
    <div id="code-editor-container" className="flex flex-col h-full bg-[#111318] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Editor Bar */}
      <div className="h-10 bg-[#1A1D24] px-4 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">
            optimization_kernel.{progLang === 'python' ? 'py' : progLang === 'javascript' ? 'js' : 'cpp'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 font-bold uppercase">
            EDITABLE
          </span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center space-x-1 bg-[#0A0B0E] p-0.5 rounded-lg border border-white/10">
          {(
            [
              { id: 'python', label: 'Python' },
              { id: 'javascript', label: 'JS' },
              { id: 'cpp', label: 'C++' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              id={`tab-proglang-${item.id}`}
              onClick={() => onChangeProgLang(item.id)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                progLang === item.id
                  ? 'bg-cyan-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-white bg-[#161921] hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title={t.copyCode}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-reset-code"
            onClick={onResetCode}
            className="p-1 text-slate-400 hover:text-rose-300 bg-[#161921] hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title={t.resetCode}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Challenge Spec Banner */}
      <div className="bg-[#0D0F14]/80 border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-medium">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            {challenge.badgeIcon} {challenge.title[userLang] || challenge.title.es}
          </span>
        </div>
        <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
          Recompensa: +{challenge.xpReward} XP
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[300px] relative code-font bg-[#111318]">
        <Editor
          height="100%"
          language={getMonacoLang(progLang)}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
            lineNumbersMinChars: 3,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>

      {/* Hint & Instructions Footer */}
      <div className="bg-[#0D0F14] border-t border-white/10 p-3 text-xs space-y-2">
        <div className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px]">
            {challenge.hint[userLang] || challenge.hint.es}
          </p>
        </div>

        {/* Big Execution Action Button */}
        <button
          id="btn-run-benchmark"
          disabled={isEvaluating}
          onClick={onRunBenchmark}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
            isEvaluating
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/30 hover:scale-[1.005] active:scale-[0.995]'
          }`}
        >
          {isEvaluating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-cyan-400 rounded-full animate-spin" />
              <span>{t.evaluating}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white animate-pulse" />
              <span>RUN BENCHMARK (F5)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
