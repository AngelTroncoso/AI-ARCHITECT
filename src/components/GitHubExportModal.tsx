import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Terminal,
  X,
  GitCommit,
  GitPullRequest,
  Flame,
  Sparkles,
  Loader2,
  Code2,
  Share2,
  Check
} from 'lucide-react';
import { HFModel, Challenge, UserProgress, Language } from '../types';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: HFModel;
  challenge: Challenge;
  code: string;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
  model,
  challenge,
  code,
  progress,
  onUpdateProgress
}) => {
  const [githubUser, setGithubUser] = useState<string>(progress.githubUser || 'developer-ai');
  const [repoName, setRepoName] = useState<string>(progress.githubRepo || `ai-model-optimizer-${model?.id || 'gemini'}`);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncedSuccess, setSyncedSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Generated Markdown README.md
  const readmeContent = `# 🚀 AI Model Optimization Portfolio: ${model?.name || 'LLM Model'}

> **Desarrollador / Arquitecto de IA:** [@${githubUser}](https://github.com/${githubUser})  
> **Desafío Completado:** ${challenge?.title?.es || 'Optimización de Modelos de Lenguaje'}  
> **Nivel de Desarrollo:** Etapa Superada (Avance AGI) 🔥  

---

## 📊 Resumen de Rendimiento de Inferencia

| Métrica | Base (${model?.name}) | Optimizado por ${githubUser} | Mejora |
| :--- | :---: | :---: | :---: |
| **Latencia de Inferencia** | ${model?.baseMetrics?.latencyMs || 140} ms | **${Math.round((model?.baseMetrics?.latencyMs || 140) * 0.5)} ms** | **⚡ 2.0x Más Rápido** |
| **Consumo VRAM** | ${model?.baseMetrics?.memoryUsageMb || 850} MB | **${Math.round((model?.baseMetrics?.memoryUsageMb || 850) * 0.45)} MB** | **📉 55% Menos Memoria** |
| **Cuantización** | FP16 | **INT8 Dynamic + KV-Cache** | **Compresión 4x** |
| **Precisión Retenida** | ${model?.baseMetrics?.accuracy || 91}% | **${((model?.baseMetrics?.accuracy || 91) - 0.4).toFixed(1)}%** | **99.5% Mantenido** |

---

## 🛠️ Código del Kernel Optimizado (PyTorch)

\`\`\`python
${code || '# Código de optimización de tensores'}
\`\`\`

---

## 📜 Certificado de Avance Tecnológico
Certificamos que @${githubUser} ha completado exitosamente la optimización de algoritmos de redes neuronales profundas en el simulador AI Architect Challenge.

*Publicado desde AI Studio Build Cloud Run Container.*
`;

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setSyncLogs([]);
    setSyncedSuccess(false);

    const logs = [
      `$ git init`,
      `$ git remote add origin https://github.com/${githubUser}/${repoName}.git`,
      `$ git add README.md model_optimizer.py benchmarks.json ARCHITECTURE.md`,
      `$ git commit -m "feat(kernel): AGI Model Algorithm Optimization breakthrough by @${githubUser}"`,
      `$ git branch -M main`,
      `$ git push -u origin main`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setSyncLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setIsSyncing(false);
          setSyncedSuccess(true);
          onUpdateProgress((prev) => ({
            ...prev,
            githubUser,
            githubRepo: repoName,
            githubSyncedCount: (prev.githubSyncedCount || 0) + 1,
            stageBurnedLevel: Math.max(prev.stageBurnedLevel || 1, challenge.level + 1)
          }));
        }
      }, (index + 1) * 600);
    });
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    const element = document.createElement("a");
    const file = new Blob([readmeContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `README_${repoName}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0D14] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-[#0D1322] via-[#11182B] to-[#0D1322]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-md">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  SINCRONIZACIÓN Y PORTAFOLIO EN GITHUB
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Avance Personal
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Exporta tu código optimizado y benchmarks a tu repositorio de GitHub
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

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#080B12]">
            {/* User & Repo Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Usuario de GitHub:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">@</span>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value.trim())}
                    className="w-full pl-7 pr-4 py-2 bg-[#0D121F] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                    placeholder="tu-usuario-github"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Nombre del Repositorio:
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value.trim())}
                  className="w-full px-4 py-2 bg-[#0D121F] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="nombre-del-repo"
                />
              </div>
            </div>

            {/* Sync Action Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSimulateSync}
                disabled={isSyncing}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl font-mono text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCommit className="w-4 h-4" />}
                <span>{isSyncing ? 'Sincronizando con GitHub...' : 'Publicar Avance en GitHub'}</span>
              </button>

              <button
                onClick={handleCopyReadme}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-mono text-xs font-bold text-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar README.md'}</span>
              </button>

              <button
                onClick={handleDownloadZip}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-mono text-xs font-bold text-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Markdown</span>
              </button>
            </div>

            {/* Terminal Sync Execution Logs */}
            {syncLogs.length > 0 && (
              <div className="p-4 rounded-xl bg-black/80 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Terminal Sync Log
                  </span>
                  {syncedSuccess && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado Exitosamente
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-slate-300 text-[11px]">
                  {syncLogs.map((log, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="text-cyan-400">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Markdown Preview */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                📄 Previsualización del Documento de Repositorio (README.md):
              </span>
              <div className="p-4 rounded-xl bg-[#0D121F] border border-slate-800 max-h-60 overflow-y-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                {readmeContent}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-slate-800 bg-[#07090F] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Repositorios Sincronizados: {progress.githubSyncedCount || 0}</span>
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
