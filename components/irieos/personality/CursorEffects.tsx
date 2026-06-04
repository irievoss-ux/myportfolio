"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/components/irieos/store/useOSStore";

interface Spark {
  id: number;
  x: number;
  y: number;
}

export default function CursorEffects() {
  const glitterMode = useOSStore((state) => state.glitterMode);
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const playSound = useOSStore((state) => state.playSound);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [ripples, setRipples] = useState<Spark[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    let lastSpark = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (!glitterMode || Date.now() - lastSpark < 55) return;
      lastSpark = Date.now();
      const spark = { id: Date.now() + Math.random(), x: event.clientX, y: event.clientY };
      setSparks((current) => [...current.slice(-14), spark]);
      window.setTimeout(() => setSparks((current) => current.filter((item) => item.id !== spark.id)), 700);
    };
    const onPointerDown = (event: PointerEvent) => {
      playSound("click");
      const ripple = { id: Date.now() + Math.random(), x: event.clientX, y: event.clientY };
      setRipples((current) => [...current.slice(-5), ripple]);
      window.setTimeout(() => setRipples((current) => current.filter((item) => item.id !== ripple.id)), 620);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [glitterMode, playSound, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[270000]">
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            initial={{ opacity: 0.9, scale: 0.4, x: spark.x, y: spark.y }}
            animate={{ opacity: 0, scale: 1.4, x: spark.x + 10, y: spark.y - 18 }}
            exit={{ opacity: 0 }}
            className="absolute text-sm text-[#fff7b8] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          >
            ✦
          </motion.span>
        ))}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ opacity: 0.5, scale: 0.2, x: ripple.x - 14, y: ripple.y - 14 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            className="absolute h-7 w-7 rounded-full border border-white/80 bg-[#ffd9ef]/30"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
