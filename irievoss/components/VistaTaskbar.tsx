"use client";

import { useEffect, useState } from 'react';

interface WindowRecord {
  title: string;
  icon: string;
  isOpen: boolean;
  z: number;
}

interface VistaTaskbarProps {
  windows: Record<string, WindowRecord>;
  activeWindowId: string | null;
  aeroColor: string;
  onToggleStart: () => void;
  onFocusWindow: (id: string) => void;
}

export default function VistaTaskbar({ windows, activeWindowId, aeroColor, onToggleStart, onFocusWindow }: VistaTaskbarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const taskbarWindows = Object.entries(windows)
    .filter(([, windowState]) => windowState.isOpen)
    .sort((a, b) => a[1].z - b[1].z);

  return (
    <nav onClick={(event) => event.stopPropagation()} className={`fixed inset-x-0 bottom-0 z-[120000] flex h-[46px] items-center justify-between border-t border-white/25 px-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl ${aeroColor === 'ruby' ? 'bg-[linear-gradient(180deg,rgba(114,25,42,0.9),rgba(34,7,14,0.92))]' : aeroColor === 'emerald' ? 'bg-[linear-gradient(180deg,rgba(18,93,84,0.9),rgba(5,28,25,0.94))]' : aeroColor === 'graphite' ? 'bg-[linear-gradient(180deg,rgba(62,72,85,0.9),rgba(16,20,26,0.96))]' : 'bg-[linear-gradient(180deg,rgba(40,95,160,0.9),rgba(9,25,47,0.96))]'}`}>
      <div className="flex h-full items-center gap-3">
        <button type="button" onClick={(event) => { event.stopPropagation(); onToggleStart(); }} className="vista-orb relative -mt-4 flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white/70 text-white shadow-[0_12px_22px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 active:scale-95">
          <div className="grid h-5 w-5 grid-cols-2 gap-[2px] opacity-95">
            <div className="rounded-tl-sm bg-[#f97316]" />
            <div className="rounded-tr-sm bg-[#4ade80]" />
            <div className="rounded-bl-sm bg-[#38bdf8]" />
            <div className="rounded-br-sm bg-[#facc15]" />
          </div>
        </button>

        <div className="flex h-full items-center gap-1 overflow-x-auto pr-2">
          {taskbarWindows.map(([id, windowState]) => (
            <button
              key={id}
              type="button"
              onClick={(event) => { event.stopPropagation(); onFocusWindow(id); }}
              className={`flex h-[34px] min-w-[138px] max-w-[170px] items-center gap-2 rounded-[7px] border px-3 text-left text-xs text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-all ${activeWindowId === id ? 'border-white/40 bg-white/20' : 'border-white/15 bg-white/8 hover:bg-white/14'}`}
            >
              <span className="text-sm">{windowState.icon}</span>
              <span className="truncate font-medium">{windowState.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-full items-center gap-4 rounded-[8px] border border-white/10 bg-black/15 px-4 text-white">
        <span className="text-xs opacity-80">🌐</span>
        <span className="text-xs opacity-80">🔊</span>
        <div className="text-right leading-tight">
          <div className="text-[11px] font-semibold">{time}</div>
          <div className="text-[10px] text-white/60">21 Mar 2006</div>
        </div>
      </div>
    </nav>
  );
}
