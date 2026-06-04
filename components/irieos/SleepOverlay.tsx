"use client";

import { motion } from "framer-motion";

interface SleepOverlayProps {
  onWake: () => void;
}

export default function SleepOverlay({ onWake }: SleepOverlayProps) {
  return (
    <main className="irie-screen irie-wallpaper-starberry flex items-center justify-center overflow-hidden">
      <div className="irie-sparkles" />
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 rounded-[32px] border border-white/70 bg-white/45 p-8 text-center text-[#78517f] shadow-[0_26px_70px_rgba(161,105,184,0.24)] backdrop-blur-2xl"
      >
        <div className="text-6xl">☾</div>
        <h1 className="mt-4 text-3xl font-black">sleep mode</h1>
        <p className="mt-2 text-sm font-semibold text-[#9d76a6]">IrieOS is tucked in and glowing softly.</p>
        <button
          type="button"
          onClick={onWake}
          className="mt-6 rounded-2xl bg-white/70 px-6 py-3 text-sm font-black text-[#81538c] shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
        >
          Wake IrieOS
        </button>
      </motion.section>
    </main>
  );
}
