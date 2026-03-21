"use client";

import { useEffect, useState } from 'react';
import { useVistaProfile } from './providers/VistaProfileProvider';
import { UserIcon } from '@/components/VistaIcons';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { userName } = useVistaProfile();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      const audio = new Audio('/startup.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-[500000] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#2f81d8_0%,_#0d2d63_38%,_#031226_78%,_#01070f_100%)] font-sans text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15),transparent_35%,rgba(0,0,0,0.55))]" />
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.15),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(0,178,255,0.18),transparent_35%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-w-[380px] flex-col items-center rounded-[28px] border border-white/30 bg-white/10 px-12 py-10 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-md login-card-glow">
        <div className="mb-5 flex h-34 w-34 items-center justify-center rounded-[24px] border border-white/80 bg-gradient-to-b from-[#dff4ff] to-[#82b8ef] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="vista-avatar-panel flex h-full w-full items-center justify-center rounded-[18px]">
            <UserIcon size={80} />
          </div>
        </div>

        <h1 className="text-[34px] font-light tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{userName}</h1>
        <p className="mt-2 text-sm text-white/75">Windows Vista Ultimate</p>

        <div className="mt-8 flex w-[280px] flex-col items-center gap-4">
          <input
            type="password"
            placeholder="Password"
            autoFocus
            onKeyDown={(event) => event.key === 'Enter' && onLogin()}
            className="w-full rounded-md border border-[#9ab6d8] bg-[linear-gradient(180deg,#ffffff_0%,#edf3f9_100%)] px-4 py-2 text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] outline-none focus:border-[#3f8cf4]"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="vista-orb flex h-13 w-13 items-center justify-center rounded-full border border-white/80 text-lg text-white shadow-[0_8px_18px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-95"
            >
              ▶
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="text-[11px] text-white/40 hover:text-white/70 transition"
          >
            {showHint ? 'Hint: Any password works' : 'Password hint?'}
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 text-sm italic tracking-[0.25em] text-white/40">Press Enter to log in</div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.7; }
        }
        .login-card-glow {
          animation: loginGlow 3s ease-in-out infinite alternate;
        }
        @keyframes loginGlow {
          from { box-shadow: 0 24px 90px rgba(0,0,0,0.55), 0 0 40px rgba(40,130,230,0.1); }
          to { box-shadow: 0 24px 90px rgba(0,0,0,0.55), 0 0 60px rgba(40,130,230,0.25); }
        }
      `}</style>
    </div>
  );
}
