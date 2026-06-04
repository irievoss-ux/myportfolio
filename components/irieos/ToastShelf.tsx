"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function ToastShelf() {
  const toasts = useOSStore((state) => state.toasts);
  const dismissToast = useOSStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[260000] flex w-[min(92vw,320px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            onClick={() => dismissToast(toast.id)}
            className="pointer-events-auto rounded-2xl border border-white/70 bg-white/68 px-4 py-3 text-left text-sm font-bold text-[#765080] shadow-[0_18px_42px_rgba(126,91,141,0.18)] backdrop-blur-xl"
          >
            {toast.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
