"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function LockScreen() {
  const [now, setNow] = useState(new Date());
  const unlock = useOSStore((state) => state.unlock);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[253000] flex items-center justify-center bg-[linear-gradient(135deg,rgba(255,213,236,0.78),rgba(221,215,255,0.74),rgba(201,243,255,0.74))] p-5 backdrop-blur-xl">
      <section className="w-[min(92vw,420px)] rounded-[34px] border border-white/75 bg-white/52 p-8 text-center text-[#765080] shadow-[0_28px_82px_rgba(126,91,141,0.22)]">
        <p className="text-6xl font-black">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
        <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[#9f78a7]">
          {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-[26px] bg-white/62 text-4xl shadow-inner">✿</div>
        <h1 className="mt-4 text-2xl font-black">IrieOS locked</h1>
        <button type="button" onClick={unlock} className="mt-6 rounded-2xl bg-[#ffd9ef] px-6 py-3 text-sm font-black text-[#894f79] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffc9e8]">
          Unlock
        </button>
      </section>
    </div>
  );
}
