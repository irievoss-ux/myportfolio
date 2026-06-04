"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useOSStore } from "@/components/irieos/store/useOSStore";

const petMessages = [
  "pspsps... opening dreams",
  "I found a warm pixel.",
  "Try the secret file.",
  "Glitter? Glitter.",
  "Tiny paws, big uptime.",
];

export default function DesktopPet() {
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const catNapping = useOSStore((state) => state.catNapping);
  const setCatNapping = useOSStore((state) => state.setCatNapping);
  const showToast = useOSStore((state) => state.showToast);
  const [clicks, setClicks] = useState(0);
  const [message, setMessage] = useState("mrrp");

  const petCat = () => {
    const nextClicks = clicks + 1;
    setClicks(nextClicks);
    setMessage(petMessages[nextClicks % petMessages.length]);
    if (nextClicks === 5) showToast("Cat mode activated. The desktop is purring.");
    if (nextClicks % 7 === 0) setCatNapping(!catNapping);
  };

  return (
    <motion.button
      type="button"
      onClick={petCat}
      className="fixed bottom-24 left-1/2 z-[90000] flex -translate-x-1/2 flex-col items-center gap-1 rounded-3xl px-3 py-2 text-[#765080] transition hover:bg-white/20"
      animate={reducedMotion ? undefined : catNapping ? { y: [0, 2, 0] } : { x: [-160, 160, -160], y: [0, -8, 0] }}
      transition={reducedMotion ? undefined : { duration: catNapping ? 3 : 26, repeat: Infinity, ease: "easeInOut" }}
      title="Desktop cat"
    >
      <span className="rounded-2xl border border-white/70 bg-white/64 px-3 py-1 text-xs font-black shadow-lg backdrop-blur-xl">
        {catNapping ? "zzz..." : message}
      </span>
      <span className={`irie-desktop-cat ${catNapping ? "irie-desktop-cat-nap" : ""}`}>
        <span className="ear left" />
        <span className="ear right" />
        <span className="face">
          <span className="eye left" />
          <span className="eye right" />
          <span className="mouth" />
        </span>
        <span className="tail" />
      </span>
    </motion.button>
  );
}
