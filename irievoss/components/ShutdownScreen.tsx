"use client";
import { useState, useEffect } from 'react';

export default function ShutdownScreen() {
  const [phase, setPhase] = useState<'closing' | 'black'>('closing');

  useEffect(() => {
    // Play shutdown sound if you have one
    const audio = new Audio('/shutdown.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});

    const timer = setTimeout(() => setPhase('black'), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (phase === 'black') {
    return (
      <div className="fixed inset-0 bg-black z-[500000] flex flex-col items-center justify-center cursor-default">
         <button 
           onClick={() => window.location.reload()}
           className="text-gray-900 hover:text-gray-600 transition-colors text-[10px] uppercase tracking-widest"
         >
           [ Press Power to Restart ]
         </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500000] bg-black flex flex-col items-center justify-center font-sans animate-in fade-in duration-1000">
      {/* Dimmed Aurora Background */}
      <div className="absolute inset-0 opacity-20"
           style={{ background: 'linear-gradient(135deg, #021a2b 0%, #06313d 35%, #0d3d30 70%, #2b3b21 100%)' }} />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Vista Loading Spinner */}
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        
        <h1 className="text-white text-3xl font-light drop-shadow-md tracking-wide">
          Shutting down...
        </h1>
      </div>
    </div>
  );
}