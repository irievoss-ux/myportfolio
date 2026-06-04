"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function Screensaver() {
  const timeout = useOSStore((state) => state.screensaverTimeout);
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (timeout <= 0) return;
    let timer = window.setTimeout(() => setActive(true), timeout * 1000);
    const reset = () => {
      setActive(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setActive(true), timeout * 1000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [timeout]);

  if (!active) return null;

  return (
    <div className={`fixed inset-0 z-[252000] flex items-center justify-center overflow-hidden irie-screensaver ${reducedMotion ? "irie-motion-reduced" : ""}`}>
      <div className="irie-sparkles" />
      <div className="text-center text-[#765080]">
        <div className="text-6xl">✦</div>
        <h1 className="mt-4 text-4xl font-black">IrieOS is dreaming...</h1>
        <p className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-[#9f78a7]">move or click to wake the stars</p>
      </div>
    </div>
  );
}
