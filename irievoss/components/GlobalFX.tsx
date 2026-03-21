"use client";
import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    // Force hide real cursor on mount
    document.body.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[1000000] mix-blend-difference" 
      style={{ left: pos.x, top: pos.y }}
    >
      {/* High-fidelity Win98 Cursor */}
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0V22L6 16L11 26L15 24L10 14H18L0 0Z" fill="white" stroke="black" strokeWidth="2"/>
      </svg>
    </div>
  );
};

export const TwitchStatus = ({ isLive }: { isLive: boolean }) => (
  <div className="flex items-center gap-2 bg-[#c0c0c0] border-2 border-gray-600 px-2 py-0.5 text-[10px] font-bold text-black border-inset shadow-inner">
    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-600 animate-pulse' : 'bg-gray-500'}`} />
    <span className="uppercase">Twitch: {isLive ? 'Live' : 'Offline'}</span>
  </div>
);