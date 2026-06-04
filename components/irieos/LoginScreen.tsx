"use client";

import { motion } from "framer-motion";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <main className="irie-screen irie-wallpaper-morning-cream flex items-center justify-center overflow-hidden">
      <div className="irie-sparkles" />
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-[min(92vw,390px)] rounded-[32px] border border-white/75 bg-white/45 p-6 text-center text-[#76527e] shadow-[0_30px_90px_rgba(178,121,191,0.25),0_0_80px_rgba(255,213,236,0.34),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-[linear-gradient(135deg,#ffd2ea,#dcd5ff,#c8f4ff)] text-5xl shadow-inner">
          ✿
        </div>
        <h1 className="mt-5 text-3xl font-black">Irie</h1>
        <p className="mt-1 text-sm font-semibold text-[#9b7aa1]">dreaming online</p>
        <p className="mt-3 rounded-2xl bg-white/45 px-3 py-2 text-xs font-black text-[#9f78a7]">IrieOS 0.4 Dream Build is ready.</p>
        <button
          type="button"
          onClick={onLogin}
          className="mt-7 w-full rounded-2xl bg-[linear-gradient(135deg,#f8a9d6,#c7b8ff)] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(202,132,198,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(202,132,198,0.42)] active:translate-y-0"
        >
          Enter IrieOS
        </button>
      </motion.section>
    </main>
  );
}
