"use client";

import { useEffect, useState } from 'react';
import VistaCalendar from './VistaCalendar';
import VistaIcon from '@/components/VistaIconMap';
import { NetworkIcon, VolumeIcon, VolumeMuteIcon, BatteryIcon } from '@/components/VistaIcons';

interface WindowRecord {
  title: string;
  iconKey: string;
  isOpen: boolean;
  isMinimized?: boolean;
  z: number;
}

interface VistaTaskbarProps {
  windows: Record<string, WindowRecord>;
  activeWindowId: string | null;
  aeroColor: string;
  onToggleStart: () => void;
  onFocusWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onRestoreWindow: (id: string) => void;
  onShowDesktop: () => void;
}

export default function VistaTaskbar({ windows, activeWindowId, aeroColor, onToggleStart, onFocusWindow, onMinimizeWindow, onRestoreWindow, onShowDesktop }: VistaTaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(75);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const taskbarWindows = Object.entries(windows).filter(([, w]) => w.isOpen).sort((a, b) => a[1].z - b[1].z);

  const handleTaskbarClick = (id: string) => {
    const w = windows[id];
    if (!w) return;
    if (w.isMinimized) onRestoreWindow(id);
    else if (activeWindowId === id) onMinimizeWindow(id);
    else onFocusWindow(id);
  };

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });

  return (
    <>
      <nav onClick={(e) => e.stopPropagation()} className={`fixed inset-x-0 bottom-0 z-[120000] flex h-[46px] items-center justify-between border-t border-white/25 px-1 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl ${aeroColor === 'ruby' ? 'bg-[linear-gradient(180deg,rgba(114,25,42,0.9),rgba(34,7,14,0.92))]' : aeroColor === 'emerald' ? 'bg-[linear-gradient(180deg,rgba(18,93,84,0.9),rgba(5,28,25,0.94))]' : aeroColor === 'graphite' ? 'bg-[linear-gradient(180deg,rgba(62,72,85,0.9),rgba(16,20,26,0.96))]' : aeroColor === 'amber' ? 'bg-[linear-gradient(180deg,rgba(140,90,20,0.9),rgba(40,25,5,0.94))]' : aeroColor === 'violet' ? 'bg-[linear-gradient(180deg,rgba(85,40,130,0.9),rgba(25,10,40,0.94))]' : 'bg-[linear-gradient(180deg,rgba(40,95,160,0.9),rgba(9,25,47,0.96))]'}`}>
        <div className="flex h-full items-center gap-2">
          {/* Start Orb */}
          <button type="button" onClick={(e) => { e.stopPropagation(); onToggleStart(); }} className="vista-orb relative -mt-4 flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white/70 text-white shadow-[0_12px_22px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 active:scale-95">
            <div className="grid h-5 w-5 grid-cols-2 gap-[2px] opacity-95">
              <div className="rounded-tl-sm bg-[#f97316]" />
              <div className="rounded-tr-sm bg-[#4ade80]" />
              <div className="rounded-bl-sm bg-[#38bdf8]" />
              <div className="rounded-br-sm bg-[#facc15]" />
            </div>
          </button>

          {/* Quick Launch */}
          <div className="flex h-full items-center gap-1 border-r border-white/15 pr-2">
            <button type="button" onClick={() => handleTaskbarClick('browser')} className="flex h-7 w-7 items-center justify-center rounded opacity-80 hover:bg-white/15 hover:opacity-100" title="Internet Explorer">
              <VistaIcon name="ie" size={18} />
            </button>
            <button type="button" onClick={() => handleTaskbarClick('computer')} className="flex h-7 w-7 items-center justify-center rounded opacity-80 hover:bg-white/15 hover:opacity-100" title="Computer">
              <VistaIcon name="computer" size={18} />
            </button>
          </div>

          {/* Running windows */}
          <div className="flex h-full items-center gap-1 overflow-x-auto pr-2">
            {taskbarWindows.map(([id, w]) => (
              <button key={id} type="button" onClick={(e) => { e.stopPropagation(); handleTaskbarClick(id); }}
                className={`flex h-[34px] min-w-[138px] max-w-[170px] items-center gap-2 rounded-[7px] border px-3 text-left text-xs text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-all ${w.isMinimized ? 'border-white/10 bg-white/5 opacity-70' : activeWindowId === id ? 'border-white/40 bg-white/20' : 'border-white/15 bg-white/8 hover:bg-white/14'}`}>
                <VistaIcon name={w.iconKey} size={16} />
                <span className="truncate font-medium">{w.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-full items-center gap-1">
          {/* System Tray */}
          <div className="relative flex h-full items-center gap-3 rounded-l-[8px] border-l border-white/10 bg-black/15 px-3 text-white">
            <button type="button" className="opacity-70 hover:opacity-100 transition" title="Network: Connected">
              <NetworkIcon size={14} />
            </button>
            <div className="relative">
              <button type="button" onClick={() => setShowVolume(v => !v)} className="opacity-70 hover:opacity-100 transition" title={`Volume: ${volume}%`}>
                {volume === 0 ? <VolumeMuteIcon size={14} /> : <VolumeIcon size={14} />}
              </button>
              {showVolume && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 rounded-lg border border-white/25 bg-[rgba(20,30,50,0.95)] p-2 shadow-xl backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
                  <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="vista-volume-slider h-24 w-full" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
                  <div className="mt-1 text-center text-[9px] text-white/60">{volume}%</div>
                </div>
              )}
            </div>
            <button type="button" className="opacity-70" title="Battery: Plugged In">
              <BatteryIcon size={14} />
            </button>
          </div>

          {/* Clock */}
          <div className="relative flex h-full cursor-pointer items-center rounded-r-[8px] border-r border-white/10 bg-black/15 px-3 text-white hover:bg-black/25 transition" onClick={() => setShowCalendar(v => !v)}>
            <div className="text-right leading-tight">
              <div className="text-[11px] font-semibold">{timeStr}</div>
              <div className="text-[10px] text-white/60">{dateStr}</div>
            </div>
          </div>

          {/* Show Desktop */}
          <button type="button" onClick={onShowDesktop} className="flex h-full w-3 items-center justify-center border-l border-white/15 hover:bg-white/10 transition" title="Show Desktop">
            <div className="h-4 w-[3px] rounded-full bg-white/30" />
          </button>
        </div>
      </nav>

      {showCalendar && (
        <div className="fixed bottom-[50px] right-2 z-[130000]" onClick={(e) => e.stopPropagation()}>
          <div className="rounded-xl border border-white/25 bg-[rgba(15,25,45,0.95)] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <VistaCalendar />
            <button type="button" onClick={() => setShowCalendar(false)} className="mt-1 w-full rounded-b-lg px-3 py-1.5 text-center text-[10px] text-white/50 hover:bg-white/10 hover:text-white/80 transition">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
