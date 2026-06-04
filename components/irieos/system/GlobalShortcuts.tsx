"use client";

import { useEffect } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function GlobalShortcuts() {
  const closeMenu = useOSStore((state) => state.closeMenu);
  const closeDialog = useOSStore((state) => state.closeDialog);
  const toggleStartMenu = useOSStore((state) => state.toggleStartMenu);
  const openDialog = useOSStore((state) => state.openDialog);
  const selectedIconId = useOSStore((state) => state.selectedIconId);
  const cycleWindows = useOSStore((state) => state.cycleWindows);
  const showToast = useOSStore((state) => state.showToast);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        closeDialog();
      }
      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();
        toggleStartMenu();
      }
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "delete") {
        event.preventDefault();
        openDialog({
          title: "Security options",
          message: "IrieOS can lock, sleep, or keep sparkling. Use the taskbar power menu for the real controls.",
          tone: "info",
        });
      }
      if (event.altKey && event.key === "Tab") {
        event.preventDefault();
        cycleWindows();
      }
      if (event.key === "Delete" && selectedIconId) {
        openDialog({
          title: "Remove shortcut?",
          message: "This would only remove the desktop shortcut in a future phase. The app is safe and tucked in.",
          tone: "confirm",
          confirmLabel: "Pretend remove",
          onConfirm: () => showToast("Shortcut removal is decorative for now."),
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDialog, closeMenu, cycleWindows, openDialog, selectedIconId, showToast, toggleStartMenu]);

  return null;
}
