"use client";

import { useMemo, useState } from "react";
import { appRegistry, appsById } from "@/components/irieos/apps/registry";
import IrieIcon from "@/components/irieos/IrieIcon";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import type { AppDefinition, AppId } from "@/components/irieos/types";

function AppButton({ app, onOpen }: { app: AppDefinition; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group rounded-2xl border border-white/45 bg-white/45 p-3 text-center transition hover:-translate-y-0.5 hover:bg-white/78 active:translate-y-0">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white/65 text-2xl shadow-inner transition group-hover:scale-105" style={{ color: app.accent }}>
        <IrieIcon appId={app.id} fallback={app.icon} />
      </span>
      <span className="mt-2 block truncate text-[11px] font-black text-[#785083]">{app.title}</span>
    </button>
  );
}

export default function StartMenu() {
  const [query, setQuery] = useState("");
  const [powerOpen, setPowerOpen] = useState(false);
  const isOpen = useOSStore((state) => state.isStartMenuOpen);
  const pinnedApps = useOSStore((state) => state.pinnedApps);
  const recentApps = useOSStore((state) => state.recentApps);
  const openApp = useOSStore((state) => state.openApp);
  const sleep = useOSStore((state) => state.sleep);
  const restart = useOSStore((state) => state.restart);
  const logOut = useOSStore((state) => state.logOut);
  const openMenu = useOSStore((state) => state.openMenu);
  const openDialog = useOSStore((state) => state.openDialog);
  const glitterMode = useOSStore((state) => state.glitterMode);
  const setGlitterMode = useOSStore((state) => state.setGlitterMode);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? appRegistry.filter((app) => `${app.title} ${app.category ?? ""}`.toLowerCase().includes(q))
      : appRegistry;
  }, [query]);

  if (!isOpen) return null;

  const groupedApps = filteredApps.reduce<Record<string, AppDefinition[]>>((groups, app) => {
    const category = app.category ?? "Apps";
    groups[category] = [...(groups[category] ?? []), app];
    return groups;
  }, {});

  return (
    <aside className="fixed bottom-[76px] left-4 z-[170000] w-[min(92vw,470px)] overflow-hidden rounded-[30px] border border-white/75 bg-white/62 shadow-[0_-22px_70px_rgba(130,92,150,0.22),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl" onClick={(event) => event.stopPropagation()}>
      <header className="flex items-center gap-3 border-b border-white/65 bg-[linear-gradient(135deg,rgba(255,220,242,0.8),rgba(221,220,255,0.72))] p-4">
        <button
          type="button"
          onClick={(event) =>
            openMenu({
              x: event.clientX,
              y: event.clientY,
              items: [
                { id: "profile", label: "Open Profile", action: () => openApp("about") },
                { id: "about-os", label: "About IrieOS", action: () => openDialog({ title: "About IrieOS", message: "IrieOS is a dreamy fake operating system portfolio shell. Phase 3 adds menus, dialogs, files, and tiny system rituals.", tone: "info" }) },
                { id: "lock", label: "Lock from profile", action: () => useOSStore.getState().lock() },
              ],
            })
          }
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 text-3xl shadow-inner transition hover:-translate-y-0.5"
        >
          ✿
        </button>
        <div>
          <h2 className="text-lg font-black text-[#795083]">Irie</h2>
          <p className="text-xs font-bold text-[#9f78a7]">dreaming online</p>
        </div>
      </header>
      <div className="p-4">
        <input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (value.trim().toLowerCase() === "glitter") {
              setGlitterMode(!glitterMode);
              setQuery("");
            }
          }}
          aria-label="Search apps"
          placeholder="Search dreams..."
          className="w-full rounded-2xl border border-[#ecd0ee] bg-white/72 px-4 py-3 text-sm font-semibold text-[#74547d] outline-none placeholder:text-[#b996bd] focus:border-[#d59ed8]"
        />
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_150px]">
          <div className="max-h-[340px] overflow-auto pr-1">
            {pinnedApps.length > 0 && !query && (
              <section className="mb-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#aa82b3]">Pinned</p>
                <div className="grid grid-cols-4 gap-2">
                  {pinnedApps.map((id) => appsById[id]).filter(Boolean).map((app) => (
                    <AppButton key={app.id} app={app} onOpen={() => openApp(app.id)} />
                  ))}
                </div>
              </section>
            )}
            {Object.entries(groupedApps).map(([category, apps]) => (
              <section key={category} className="mb-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#aa82b3]">{category}</p>
                <div className="grid grid-cols-4 gap-2">
                  {apps.map((app) => (
                    <AppButton key={app.id} app={app} onOpen={() => openApp(app.id)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="hidden md:block">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#aa82b3]">Recent</p>
            {(recentApps.length ? recentApps : (["about", "projects", "notes"] satisfies AppId[])).map((id) => {
              const app = appsById[id];
              if (!app) return null;
              return (
                <button key={id} type="button" onClick={() => openApp(id)} className="mb-2 flex w-full items-center gap-2 rounded-2xl bg-white/45 px-3 py-2 text-left text-xs font-black text-[#785083] transition hover:bg-white/78">
                  <span style={{ color: app.accent }}><IrieIcon appId={app.id} fallback={app.icon} /></span>
                  <span className="truncate">{app.title}</span>
                </button>
              );
            })}
          </aside>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-white/65 pt-4">
          <button type="button" onClick={() => openApp("settings")} className="rounded-2xl bg-[#ecf0ff] px-3 py-3 text-xs font-black text-[#6874a8] transition hover:-translate-y-0.5">
            Settings
          </button>
          <button type="button" onClick={() => openApp("notes")} className="rounded-2xl bg-[#fff5ce] px-3 py-3 text-xs font-black text-[#9b7b2a] transition hover:-translate-y-0.5">
            Notes
          </button>
          <button type="button" onClick={() => setPowerOpen((value) => !value)} className="rounded-2xl bg-[#ffe0ed] px-3 py-3 text-xs font-black text-[#9b5372] transition hover:-translate-y-0.5">
            Power
          </button>
          {powerOpen && (
            <div className="absolute bottom-16 right-0 w-40 rounded-2xl border border-white/70 bg-white/78 p-1 text-xs font-black text-[#80598a] shadow-xl backdrop-blur-xl">
              <button type="button" onClick={sleep} className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[#fff0fb]">Sleep</button>
              <button type="button" onClick={restart} className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[#fff0fb]">Restart IrieOS</button>
              <button type="button" onClick={logOut} className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[#fff0fb]">Log Out</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
