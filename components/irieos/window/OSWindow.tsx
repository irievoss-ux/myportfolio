"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { appsById } from "@/components/irieos/apps/registry";
import IrieIcon from "@/components/irieos/IrieIcon";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import type { OSWindowState } from "@/components/irieos/types";

interface OSWindowProps {
  windowState: OSWindowState;
}

export default function OSWindow({ windowState }: OSWindowProps) {
  const app = appsById[windowState.appId];
  const closeApp = useOSStore((state) => state.closeApp);
  const minimizeApp = useOSStore((state) => state.minimizeApp);
  const focusApp = useOSStore((state) => state.focusApp);
  const toggleMaximizeApp = useOSStore((state) => state.toggleMaximizeApp);
  const updateWindowGeometry = useOSStore((state) => state.updateWindowGeometry);
  const activeAppId = useOSStore((state) => state.activeAppId);
  const openMenu = useOSStore((state) => state.openMenu);
  const openDialog = useOSStore((state) => state.openDialog);
  const showToast = useOSStore((state) => state.showToast);
  const isActive = activeAppId === windowState.appId;
  const AppComponent = app.component;
  const taskbarHeight = 68;
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  useEffect(() => {
    const sync = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  const isMobile = viewport.width < 720;
  const openTitleMenu = (x: number, y: number) => {
    openMenu({
      x,
      y,
      items: [
        { id: "restore", label: "Restore", action: () => windowState.isMaximized && toggleMaximizeApp(windowState.appId) },
        { id: "move", label: "Move", action: () => showToast("Move by dragging the title bar, soft and simple.") },
        { id: "size", label: "Size", action: () => showToast("Resize from the window edges when not maximized.") },
        { id: "minimize", label: "Minimize", action: () => minimizeApp(windowState.appId) },
        { id: "maximize", label: "Maximize", action: () => !windowState.isMaximized && toggleMaximizeApp(windowState.appId) },
        { id: "close", label: "Close", action: () => closeApp(windowState.appId) },
        { id: "sep-title", separator: true },
        { id: "info", label: "App Info", action: () => openDialog({ title: app.title, message: `${app.title} is a ${app.category ?? "general"} IrieOS app.`, tone: "info" }) },
      ],
    });
  };

  if (!windowState.isOpen || windowState.isMinimized) return null;

  return (
    <Rnd
      size={
        windowState.isMaximized || isMobile
          ? { width: "calc(100vw - 24px)", height: `calc(100vh - ${taskbarHeight + 24}px)` }
          : { width: windowState.width, height: windowState.height }
      }
      position={windowState.isMaximized || isMobile ? { x: 12, y: 12 } : { x: windowState.x, y: windowState.y }}
      minWidth={340}
      minHeight={260}
      bounds="window"
      dragHandleClassName={`irie-window-handle-${windowState.appId}`}
      disableDragging={windowState.isMaximized || isMobile}
      enableResizing={!windowState.isMaximized && !isMobile}
      onMouseDown={() => focusApp(windowState.appId)}
      onDragStart={() => focusApp(windowState.appId)}
      onDragStop={(_, data) => updateWindowGeometry(windowState.appId, { x: data.x, y: data.y, width: windowState.width, height: windowState.height })}
      onResizeStart={() => focusApp(windowState.appId)}
      onResizeStop={(_, __, ref, ___, position) =>
        updateWindowGeometry(windowState.appId, {
          x: position.x,
          y: position.y,
          width: Number.parseInt(ref.style.width, 10),
          height: Number.parseInt(ref.style.height, 10),
        })
      }
      style={{ zIndex: windowState.zIndex }}
      className="overflow-hidden rounded-[24px]"
    >
      <motion.article
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`flex h-full flex-col overflow-hidden rounded-[24px] border backdrop-blur-2xl ${isActive ? "border-white/80 bg-white/42 shadow-[0_28px_80px_rgba(129,91,148,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]" : "border-white/50 bg-white/30 shadow-[0_18px_48px_rgba(129,91,148,0.16)] saturate-[0.82]"}`}
      >
        <header
          className={`irie-window-handle-${windowState.appId} flex h-12 items-center justify-between border-b border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.38))] px-3`}
          onDoubleClick={() => toggleMaximizeApp(windowState.appId)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openTitleMenu(event.clientX, event.clientY);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openTitleMenu(event.clientX, event.clientY);
            }}
            className="flex min-w-0 items-center gap-2 rounded-2xl px-1 py-1 text-left transition hover:bg-white/35"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/65 text-lg shadow-inner" style={{ color: app.accent }}>
              <IrieIcon appId={app.id} fallback={app.icon} />
            </span>
            <span className="truncate text-sm font-black text-[#705078] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{app.title}</span>
            {isActive && <span className="text-[#d9a6d5]">✦</span>}
          </button>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title="Minimize"
              onClick={(event) => {
                event.stopPropagation();
                minimizeApp(windowState.appId);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff7cc] text-[#9d7a22] transition hover:-translate-y-0.5 hover:bg-[#fff1aa]"
            >
              -
            </button>
            <button
              type="button"
              title={windowState.isMaximized ? "Restore" : "Maximize"}
              onClick={(event) => {
                event.stopPropagation();
                toggleMaximizeApp(windowState.appId);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#daf3ff] text-[#4f7890] transition hover:-translate-y-0.5 hover:bg-[#c7ecff]"
            >
              {windowState.isMaximized ? "❐" : "□"}
            </button>
            <button
              type="button"
              title="Close"
              onClick={(event) => {
                event.stopPropagation();
                closeApp(windowState.appId);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffd5e9] text-[#a74773] transition hover:-translate-y-0.5 hover:bg-[#ffc2df]"
            >
              ×
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">
          <AppComponent />
        </div>
      </motion.article>
    </Rnd>
  );
}
