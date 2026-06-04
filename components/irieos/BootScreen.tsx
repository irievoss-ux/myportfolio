"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onFinish: () => void;
}

export default function BootScreen({ onFinish }: BootScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 3400);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  const logs = ["loading dreams...", "feeding desktop cat...", "polishing windows...", "sprinkling tiny stars..."];

  return (
    <main className="irie-screen irie-wallpaper-cotton-candy flex items-center justify-center overflow-hidden">
      <div className="irie-sparkles" />
      <motion.section
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.03 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, 6, -4, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-28 w-28 items-center justify-center rounded-[34px] border border-white/70 bg-white/45 text-6xl shadow-[0_24px_70px_rgba(196,132,202,0.28),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"
        >
          ✿
        </motion.div>
        <h1 className="mt-8 text-4xl font-black tracking-[0.02em] text-[#7d548a] drop-shadow-[0_2px_0_rgba(255,255,255,0.85)]">
          IrieOS
        </h1>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.28em] text-[#a67daf]">booting IrieOS...</p>
        <div className="mt-5 w-72 rounded-3xl border border-white/60 bg-white/42 p-3 text-left text-xs font-black text-[#8f6a98] shadow-inner backdrop-blur-xl">
          {logs.map((log, index) => (
            <motion.div key={log} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.45 }}>
              {">"} {log}
            </motion.div>
          ))}
        </div>
        <div className="mt-8 h-3 w-64 overflow-hidden rounded-full border border-white/65 bg-white/40 shadow-inner">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,#ffd4ee,#d9d2ff,#bcefff)]"
          />
        </div>
      </motion.section>
    </main>
  );
}
