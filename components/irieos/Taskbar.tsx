"use client";

import { useEffect, useMemo, useState } from "react";
import { appsById } from "@/components/irieos/apps/registry";
import IrieIcon from "@/components/irieos/IrieIcon";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import NotificationCenter from "@/components/irieos/system/NotificationCenter";

export default function Taskbar() {
  const [now, setNow] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [trayPopup, setTrayPopup] = useState<"clock" | "wifi" | "battery" | "mood" | "notifications" | null>(null);
  const windows = useOSStore((state) => state.windows);
  const activeAppId = useOSStore((state) => state.activeAppId);
  const pinnedApps = useOSStore((state) => state.pinnedApps);
  const toggleStartMenu = useOSStore((state) => state.toggleStartMenu);
  const setStartMenuOpen = useOSStore((state) => state.setStartMenuOpen);
  const openApp = useOSStore((state) => state.openApp);
  const restoreApp = useOSStore((state) => state.restoreApp);
  const focusApp = useOSStore((state) => state.focusApp);
  const minimizeApp = useOSStore((state) => state.minimizeApp);
  const closeApp = useOSStore((state) => state.closeApp);
  const toggleMaximizeApp = useOSStore((state) => state.toggleMaximizeApp);
  const showDesktop = useOSStore((state) => state.showDesktop);
  const lock = useOSStore((state) => state.lock);
  const sleep = useOSStore((state) => state.sleep);
  const openMenu = useOSStore((state) => state.openMenu);
  const openDialog = useOSStore((state) => state.openDialog);
  const showToast = useOSStore((state) => state.showToast);
  const toggleAssistant = useOSStore((state) => state.toggleAssistant);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const openWindows = useMemo(
    () => Object.values(windows).filter((windowState) => windowState.isOpen).sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  );
  const pinnedOnly = pinnedApps.filter((appId) => !windows[appId]?.isOpen);
  const clock = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const monthLabel = calendarDate.toLocaleDateString([], { month: "long", year: "numeric" });
  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
  const calendarCells = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return (
    <>
      {trayPopup && (
        <div className="fixed bottom-[76px] right-4 z-[170000] w-[min(92vw,330px)] rounded-[28px] border border-white/75 bg-white/68 p-4 text-[#74517c] shadow-[0_-18px_56px_rgba(126,91,141,0.2)] backdrop-blur-2xl" onClick={(event) => event.stopPropagation()}>
          {trayPopup === "clock" && (
            <section>
              <div className="flex items-center justify-between gap-2">
                <button type="button" onClick={() => setCalendarDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))} className="rounded-xl bg-white/58 px-2 py-1 text-xs font-black hover:bg-white">
                  prev
                </button>
                <h2 className="text-lg font-black text-[#7c5488]">{monthLabel}</h2>
                <button type="button" onClick={() => setCalendarDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))} className="rounded-xl bg-white/58 px-2 py-1 text-xs font-black hover:bg-white">
                  next
                </button>
              </div>
              <div className="mt-2 text-center text-sm font-black">{clock}</div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-black text-[#a482ad]">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
                {calendarCells.map((day, index) => {
                  const isToday = day === now.getDate() && calendarDate.getMonth() === now.getMonth() && calendarDate.getFullYear() === now.getFullYear();
                  return (
                    <span key={`${day ?? "blank"}-${index}`} className={`rounded-xl py-1.5 ${isToday ? "bg-[#ffe0f3] text-[#7f548a]" : "bg-white/42"}`}>
                      {day ?? ""}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                {["Stream planning", "Edit gallery", "Cat nap"].map((event) => (
                  <div key={event} className="rounded-2xl bg-white/58 px-3 py-2 text-sm font-black">
                    {event}
                  </div>
                ))}
              </div>
            </section>
          )}
          {trayPopup === "wifi" && (
            <section>
              <h2 className="text-lg font-black text-[#7c5488]">Networks</h2>
              {[
                ["IrieNet", "connected", "full"],
                ["MoonMilk-5G", "available", "soft"],
                ["Starberry Guest", "available", "tiny"],
              ].map(([name, status, strength]) => (
                <button key={name} type="button" onClick={() => showToast(`${name} is decorative for now.`)} className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white/58 px-3 py-2 text-left text-sm font-black transition hover:bg-white">
                  <span>
                    {name}
                    <span className="block text-[10px] font-bold text-[#a17bab]">{status}</span>
                  </span>
                  <span className="text-xs text-[#8a6798]">{strength}</span>
                </button>
              ))}
            </section>
          )}
          {trayPopup === "battery" && (
            <section>
              <h2 className="text-lg font-black text-[#7c5488]">Battery</h2>
              <div className="mt-3 rounded-3xl bg-[#ecfff8] p-4 text-center">
                <p className="text-4xl font-black text-[#4e8a74]">99%</p>
                <p className="text-sm font-bold text-[#6d8d80]">plugged into cozy mode</p>
              </div>
              <button type="button" onClick={() => showToast("Battery saver is a pretend switch for now.")} className="mt-3 w-full rounded-2xl bg-white/58 px-3 py-2 text-sm font-black transition hover:bg-white">
                Battery saver placeholder
              </button>
            </section>
          )}
          {trayPopup === "mood" && (
            <section>
              <h2 className="text-lg font-black text-[#7c5488]">Mood</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["cozy", "focused", "sparkly", "sleepy"].map((mood) => (
                  <button key={mood} type="button" onClick={() => showToast(`Mood set to ${mood} in spirit.`)} className="rounded-2xl bg-white/58 px-3 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:bg-white">
                    {mood}
                  </button>
                ))}
              </div>
            </section>
          )}
          {trayPopup === "notifications" && <NotificationCenter onClose={() => setTrayPopup(null)} />}
          {trayPopup !== "notifications" && (
            <button type="button" onClick={() => setTrayPopup(null)} className="mt-4 w-full rounded-2xl bg-[#fff0fb] px-3 py-2 text-xs font-black text-[#80598a] transition hover:bg-white">
              close
            </button>
          )}
        </div>
      )}

      <nav
        className="fixed inset-x-3 bottom-3 z-[160000] flex h-14 items-center justify-between gap-3 rounded-[26px] border border-white/70 bg-white/48 px-3 shadow-[0_-18px_60px_rgba(128,92,148,0.22),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => {
          event.preventDefault();
          openMenu({
            x: event.clientX,
            y: event.clientY,
            items: [
              { id: "settings", label: "Taskbar Settings", action: () => openApp("settings") },
              { id: "desktop", label: "Show Desktop", action: showDesktop },
              { id: "start", label: "Open Start Menu", action: () => setStartMenuOpen(true) },
              { id: "sep", separator: true },
              { id: "lock", label: "Lock IrieOS", action: lock },
              { id: "sleep", label: "Sleep Mode", action: sleep },
            ],
          });
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button type="button" onClick={toggleStartMenu} className="flex h-11 shrink-0 items-center gap-2 rounded-[20px] bg-[linear-gradient(135deg,#ffd2ea,#d9d6ff)] px-4 text-sm font-black text-[#775182] shadow-[0_12px_24px_rgba(190,128,199,0.24)] transition hover:-translate-y-0.5">
            <span className="text-xl">✿</span>
            Irie
          </button>
          {pinnedOnly.map((appId) => {
            const app = appsById[appId];
            return (
              <button key={appId} type="button" onClick={() => openApp(appId)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/45 bg-white/35 text-lg transition hover:-translate-y-0.5 hover:bg-white/60" style={{ color: app.accent }} title={app.title}>
                <IrieIcon appId={app.id} fallback={app.icon} />
              </button>
            );
          })}
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {openWindows.map((windowState) => {
              const app = appsById[windowState.appId];
              const isActive = activeAppId === windowState.appId && !windowState.isMinimized;

              return (
                <button
                  key={windowState.appId}
                  type="button"
                  onClick={() => {
                    if (windowState.isMinimized) restoreApp(windowState.appId);
                    else if (isActive) minimizeApp(windowState.appId);
                    else focusApp(windowState.appId);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    openMenu({
                      x: event.clientX,
                      y: event.clientY,
                      items: [
                        { id: "restore", label: "Restore", action: () => restoreApp(windowState.appId) },
                        { id: "minimize", label: "Minimize", action: () => minimizeApp(windowState.appId) },
                        { id: "maximize", label: "Maximize", action: () => toggleMaximizeApp(windowState.appId) },
                        { id: "close", label: "Close", action: () => closeApp(windowState.appId) },
                        { id: "sep-app", separator: true },
                        { id: "info", label: "App Info", action: () => openDialog({ title: app.title, message: `${app.title} is open in IrieOS. Category: ${app.category ?? "Apps"}.`, tone: "info" }) },
                      ],
                    });
                  }}
                  className={`flex h-10 min-w-[118px] max-w-[180px] items-center gap-2 rounded-2xl border px-3 text-left text-xs font-black transition ${isActive ? "border-white/80 bg-white/75 text-[#755080] shadow-inner" : "border-white/45 bg-white/35 text-[#86648e] hover:bg-white/60"} ${windowState.isMinimized ? "opacity-70" : ""}`}
                >
                  <span style={{ color: app.accent }}><IrieIcon appId={app.id} fallback={app.icon} /></span>
                  <span className="truncate">{app.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-[20px] bg-white/38 px-3 py-2 text-xs font-black text-[#74517c]">
          <button type="button" onClick={() => setTrayPopup(trayPopup === "wifi" ? null : "wifi")} className="rounded-xl px-1 hover:bg-white/55">Wi-Fi</button>
          <button type="button" onClick={() => setTrayPopup(trayPopup === "battery" ? null : "battery")} className="rounded-xl px-1 hover:bg-white/55">99%</button>
          <button type="button" onClick={() => setTrayPopup(trayPopup === "mood" ? null : "mood")} className="hidden rounded-xl px-1 hover:bg-white/55 sm:inline">mood: cozy</button>
          <button type="button" onClick={() => setTrayPopup(trayPopup === "notifications" ? null : "notifications")} className="rounded-xl px-1 hover:bg-white/55">alerts</button>
          <button type="button" onClick={toggleAssistant} className="rounded-xl px-1 hover:bg-white/55">helper</button>
          <button type="button" onClick={() => setTrayPopup(trayPopup === "clock" ? null : "clock")} className="rounded-xl px-1 hover:bg-white/55">{clock}</button>
          <button type="button" onClick={showDesktop} className="rounded-xl px-1 hover:bg-white/55" title="Show Desktop">◌</button>
        </div>
      </nav>
    </>
  );
}
