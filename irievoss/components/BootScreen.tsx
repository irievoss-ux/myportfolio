"use client";

import { useEffect, useState } from 'react';

interface BootScreenProps {
  onFinish: () => void;
}

export default function BootScreen({ onFinish }: BootScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timeout = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[500000] flex flex-col items-center justify-center bg-black font-sans">
      {/* Subtle dark gradient background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, #0a1628 0%, #020408 100%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Windows Vista Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center">
            <div className="grid h-12 w-12 grid-cols-2 gap-[3px] opacity-90">
              <div className="rounded-tl-[4px] bg-gradient-to-br from-[#ff8c39] to-[#ff6a00]" />
              <div className="rounded-tr-[4px] bg-gradient-to-br from-[#7cd651] to-[#4ade20]" />
              <div className="rounded-bl-[4px] bg-gradient-to-br from-[#51b3f6] to-[#2196f3]" />
              <div className="rounded-br-[4px] bg-gradient-to-br from-[#fdd835] to-[#fbc02d]" />
            </div>
          </div>
          <div className="text-[32px] font-extralight tracking-[0.2em] text-white/90">
            Windows Vista
          </div>
          <div className="text-[11px] uppercase tracking-[0.4em] text-white/30">Ultimate</div>
        </div>

        {/* Loading bar */}
        <div className="h-[6px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-transparent via-[#6ab8ff] to-transparent transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading dots animation */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-[#6ab8ff]"
              style={{
                animation: 'bootPulse 1.4s infinite',
                animationDelay: `${i * 0.15}s`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-8 text-[10px] tracking-[0.2em] text-white/20">
        © Microsoft Corporation
      </div>

      <style>{`
        @keyframes bootPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
