import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Flame, Zap, Database } from 'lucide-react';

export const GpuMonitorHud: React.FC = () => {
  const [vramPct, setVramPct] = useState(42);
  const [gpuLoad, setGpuLoad] = useState(68);
  const [tempC, setTempC] = useState(58);

  useEffect(() => {
    const interval = setInterval(() => {
      setVramPct((prev) => Math.min(98, Math.max(20, prev + (Math.random() * 6 - 3))));
      setGpuLoad((prev) => Math.min(100, Math.max(30, prev + (Math.random() * 10 - 5))));
      setTempC((prev) => Math.min(82, Math.max(45, prev + (Math.random() * 2 - 1))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border-y border-cyan-500/30 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-300">
      <div className="flex items-center space-x-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">HARDWARE:</span>
          <span className="text-cyan-300 font-bold">NVIDIA H100 SXM5 (80GB)</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">VRAM:</span>
          <span className="text-purple-300 font-bold">{vramPct.toFixed(0)}% ({(vramPct * 0.8).toFixed(1)}GB)</span>
          <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: `${vramPct}%` }}></div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">GPU LOAD:</span>
          <span className="text-emerald-300 font-bold">{gpuLoad.toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">TEMP:</span>
          <span className={tempC > 75 ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>{tempC.toFixed(0)}°C</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center space-x-2 text-[10px] text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>CUDA CORES OPERACIONALES</span>
      </div>
    </div>
  );
};
