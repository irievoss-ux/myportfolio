"use client";

import { useEffect, useState } from 'react';
import VistaCalendar from './VistaCalendar';
import { useVistaProfile } from './providers/VistaProfileProvider';

export default function VistaSidebar() {
  const [time, setTime] = useState(new Date());
  const { userImage, userName } = useVistaProfile();

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="pointer-events-none fixed right-0 top-0 z-20 flex h-full w-[180px] flex-col items-center gap-6 border-l border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06)_20%,rgba(0,0,0,0.18)_100%)] px-4 pt-7 backdrop-blur-xl">
      <div className="vista-glass-panel pointer-events-auto w-full rounded-[24px] px-4 py-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <div className="text-center text-[11px] uppercase tracking-[0.3em] text-white/60">Sidebar Clock</div>
        <div className="mt-3 text-center text-[34px] font-extralight leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="mt-2 text-center text-[11px] text-white/70">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      </div>

      <div className="pointer-events-auto w-full">
        <VistaCalendar />
      </div>

      <div className="pointer-events-auto mt-auto flex w-full flex-col items-center gap-2 pb-7 text-center text-white">
        <div className="vista-avatar-panel flex h-24 w-24 items-center justify-center rounded-[22px] text-5xl shadow-[0_12px_35px_rgba(0,0,0,0.3)]">{userImage}</div>
        <div className="text-sm font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">{userName}</div>
        <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Ultimate Sidebar</div>
      </div>
    </aside>
  );
}
