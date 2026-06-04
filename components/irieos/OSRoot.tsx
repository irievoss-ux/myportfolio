"use client";

import { AnimatePresence, motion } from "framer-motion";
import BootScreen from "@/components/irieos/BootScreen";
import Desktop from "@/components/irieos/Desktop";
import LoginScreen from "@/components/irieos/LoginScreen";
import SleepOverlay from "@/components/irieos/SleepOverlay";
import StartMenu from "@/components/irieos/StartMenu";
import AssistantWidget from "@/components/irieos/personality/AssistantWidget";
import CursorEffects from "@/components/irieos/personality/CursorEffects";
import DesktopPet from "@/components/irieos/personality/DesktopPet";
import Screensaver from "@/components/irieos/personality/Screensaver";
import SoundController from "@/components/irieos/personality/SoundController";
import GlobalMenu from "@/components/irieos/system/GlobalMenu";
import GlobalShortcuts from "@/components/irieos/system/GlobalShortcuts";
import LockScreen from "@/components/irieos/system/LockScreen";
import SystemDialog from "@/components/irieos/system/SystemDialog";
import Taskbar from "@/components/irieos/Taskbar";
import ToastShelf from "@/components/irieos/ToastShelf";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import WindowManager from "@/components/irieos/window/WindowManager";

export default function OSRoot() {
  const phase = useOSStore((state) => state.phase);
  const isLocked = useOSStore((state) => state.isLocked);
  const theme = useOSStore((state) => state.theme);
  const glitterMode = useOSStore((state) => state.glitterMode);
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const finishBoot = useOSStore((state) => state.finishBoot);
  const login = useOSStore((state) => state.login);
  const wake = useOSStore((state) => state.wake);

  return (
    <AnimatePresence mode="wait">
      {phase === "boot" && (
        <motion.div key="boot" className="fixed inset-0">
          <BootScreen onFinish={finishBoot} />
        </motion.div>
      )}
      {phase === "login" && (
        <motion.div key="login" className="fixed inset-0">
          <LoginScreen onLogin={login} />
        </motion.div>
      )}
      {phase === "sleep" && (
        <motion.div key="sleep" className="fixed inset-0">
          <SleepOverlay onWake={wake} />
        </motion.div>
      )}
      {phase === "desktop" && (
        <motion.main key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 irie-theme-${theme} ${glitterMode ? "irie-glitter-mode" : ""} ${reducedMotion ? "irie-motion-reduced" : ""}`}>
          <Desktop />
          <WindowManager />
          <StartMenu />
          <Taskbar />
          <DesktopPet />
          <AssistantWidget />
          <ToastShelf />
          <GlobalMenu />
          <SystemDialog />
          <GlobalShortcuts />
          <CursorEffects />
          <SoundController />
          <Screensaver />
          {isLocked && <LockScreen />}
        </motion.main>
      )}
    </AnimatePresence>
  );
}
