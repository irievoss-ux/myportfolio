"use client";

import { AnimatePresence } from "framer-motion";
import OSWindow from "@/components/irieos/window/OSWindow";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function WindowManager() {
  const windows = useOSStore((state) => state.windows);
  const orderedWindows = Object.values(windows).sort((a, b) => a.zIndex - b.zIndex);

  return (
    <AnimatePresence>
      {orderedWindows.map((windowState) => (
        <OSWindow key={windowState.appId} windowState={windowState} />
      ))}
    </AnimatePresence>
  );
}
