"use client";
import { useState, useEffect } from 'react';
import { TwitchStatus } from './GlobalFX';

interface TaskbarProps {
  windows: any;
  onToggleStart: () => void;
  onFocusWindow: (id: string) => void;
  aeroColor: string;
}

export default function VistaTaskbar({ windows, onToggleStart, onFocusWindow, aeroColor }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(75);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav 
      className={`fixed bottom-0 w-full h-[40px] backdrop-blur-xl border-t border-white/20 flex justify-between items-center z-[10000] px-2 transition-colors duration-500 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] ${aeroColor === 'ruby' ? 'bg-red-950/80' : aeroColor === 'emerald' ? 'bg-emerald-950/80' : 'bg-black/80'}`}
    >
      {/* --- START ORB AREA --- */}
      <div className="flex items-center h-full relative">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleStart(); }} 
          className={`absolute -bottom-[2px] -left-1 w-[54px] h-[54px] rounded-full border-2 border-white/60 flex items-center justify-center transition-all z-50 shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),0_0_15px_rgba(0,0,0,0.5)] hover:brightness-125 active:scale-95 ${aeroColor === 'ruby' ? 'bg-red-600' : aeroColor === 'emerald' ? 'bg-emerald-600' : 'bg-[#1a7bc9]'}`}
        >
          <div className="grid grid-cols-2 gap-[2px] w-5 h-5 opacity-90 drop-shadow-md">
            <div className="bg-[#ff5722] rounded-tl-sm skew-y-3" />
            <div className="bg-[#4caf50] rounded-tr-sm -skew-y-3" />
            <div className="bg-[#03a9f4] rounded-bl-sm -skew-y-3" />
            <div className="bg-[#ffc107] rounded-br-sm skew-y-3" />
          </div>
        </button>
        
        {/* --- WINDOW TABS --- */}
        <div className="ml-16 flex gap-1 h-full py-1">
          {Object.entries(windows).map(([id, win]: any) => win.isOpen && (
            <button 
              key={id} 
              onClick={() => onFocusWindow(id)} 
              className="px-3 min-w-[120px] max-w-[160px] flex items-center gap-2 bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 border border-white/10 rounded-sm text-white text-xs backdrop-blur-sm shadow-inner truncate transition-all group"
            >
              <span className="text-[10px] group-hover:scale-110 transition-transform">{win.icon}</span>
              <span className="truncate font-medium">{win.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- COMMAND CENTER (SYSTEM TRAY) --- */}
      <div className="flex items-center h-full">
        
        <div className="flex gap-3 items-center px-4 h-full border-l border-white/10">
          <TwitchStatus isLive={true} />
          
          {/* Network Icon */}
          <div className="text-white opacity-80 hover:opacity-100 cursor-default text-[10px]" title="Connected to IrieNetwork">🌐</div>
          
          {/* Volume Control */}
          <div className="relative">
            <div 
              onClick={() => setVolumeOpen(!volumeOpen)}
              className="text-white opacity-80 hover:opacity-100 cursor-pointer text-xs"
            >
              🔊
            </div>
            {volumeOpen && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-10 h-32 bg-black/80 backdrop-blur-xl border border-white/20 rounded-t-md p-2 flex flex-col items-center gap-2 shadow-2xl">
                <input 
                  type="range" min="0" max="100" value={volume} 
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="appearance-none w-24 -rotate-90 bg-gray-700 h-1 rounded-full cursor-pointer mt-10 accent-blue-500" 
                />
                <span className="text-[10px] text-white font-bold">{volume}%</span>
              </div>
            )}
          </div>

          {/* Time & Date */}
          <div className="flex flex-col items-center justify-center min-w-[60px] cursor-default">
            <div className="text-[11px] font-bold text-white drop-shadow-sm">{time}</div>
            <div className="text-[9px] text-white/60 font-medium">21.03.2026</div>
          </div>
        </div>

        {/* SHOW DESKTOP BUTTON (The tiny vertical bar at the end) */}
        <div 
          className="w-2 h-full border-l border-white/20 bg-white/5 hover:bg-white/20 cursor-pointer transition-colors"
          title="Show Desktop"
          onClick={() => {}} 
        />
      </div>
    </nav>
  );
}