"use client";
import { useState, useEffect } from 'react';
import VistaCalendar from './VistaCalendar';

export default function VistaSidebar({ userImage }: any) { // Added prop here
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="fixed top-0 right-0 w-[160px] h-full bg-black/10 backdrop-blur-md border-l border-white/20 z-0 flex flex-col items-center pt-8 gap-6 overflow-y-auto">
      
      {/* CLOCK */}
      <div className="w-32 h-32 rounded-full bg-white/10 border border-white/30 flex flex-col items-center justify-center shadow-lg group">
        <div className="text-white text-2xl font-light drop-shadow-md group-hover:scale-110 transition-transform">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">
          {time.toLocaleDateString([], { weekday: 'short', day: 'numeric' })}
        </div>
      </div>

      <VistaCalendar />

      {/* USER GADGET - Uses your live userImage */}
      <div className="mt-auto pb-10 flex flex-col items-center gap-2">
         <span className="text-6xl drop-shadow-lg hover:scale-110 transition-transform cursor-pointer">
           {userImage}
         </span>
         <span className="text-[9px] text-white/30 font-bold tracking-tighter uppercase">Vista Ultimate</span>
      </div>
    </aside>
  );
}