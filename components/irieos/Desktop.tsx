"use client";

import { useMemo } from "react";
import { appRegistry } from "@/components/irieos/apps/registry";
import DesktopIcon from "@/components/irieos/DesktopIcon";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function Desktop() {
  const wallpaper = useOSStore((state) => state.wallpaper);
  const theme = useOSStore((state) => state.theme);
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const glitterMode = useOSStore((state) => state.glitterMode);
  const selectedIconId = useOSStore((state) => state.selectedIconId);
  const desktopIconSize = useOSStore((state) => state.desktopIconSize);
  const desktopSort = useOSStore((state) => state.desktopSort);
  const recentApps = useOSStore((state) => state.recentApps);
  const openApp = useOSStore((state) => state.openApp);
  const selectIcon = useOSStore((state) => state.selectIcon);
  const setStartMenuOpen = useOSStore((state) => state.setStartMenuOpen);
  const setDesktopIconSize = useOSStore((state) => state.setDesktopIconSize);
  const setDesktopSort = useOSStore((state) => state.setDesktopSort);
  const openMenu = useOSStore((state) => state.openMenu);
  const openDialog = useOSStore((state) => state.openDialog);
  const pinApp = useOSStore((state) => state.pinApp);
  const showToast = useOSStore((state) => state.showToast);
  const desktopApps = useMemo(() => {
    const apps = [...appRegistry];
    if (desktopSort === "name") return apps.sort((a, b) => a.title.localeCompare(b.title));
    if (desktopSort === "type") return apps.sort((a, b) => (a.category ?? "").localeCompare(b.category ?? "") || a.title.localeCompare(b.title));
    return apps.sort((a, b) => {
      const aIndex = recentApps.indexOf(a.id);
      const bIndex = recentApps.indexOf(b.id);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex) || a.title.localeCompare(b.title);
    });
  }, [desktopSort, recentApps]);

  return (
    <section
      className={`irie-screen irie-wallpaper-${wallpaper} irie-theme-${theme} ${glitterMode ? "irie-glitter-mode" : ""} ${reducedMotion ? "irie-motion-reduced" : ""} overflow-hidden`}
      onClick={() => {
        selectIcon(null);
        setStartMenuOpen(false);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setStartMenuOpen(false);
        openMenu({
          x: event.clientX,
          y: event.clientY,
          items: [
            {
              id: "view",
              label: "View",
              submenu: [
                { id: "large", label: "Large Icons", action: () => setDesktopIconSize("large") },
                { id: "medium", label: "Medium Icons", action: () => setDesktopIconSize("medium") },
                { id: "small", label: "Small Icons", action: () => setDesktopIconSize("small") },
              ],
            },
            {
              id: "sort",
              label: "Sort By",
              submenu: [
                { id: "sort-name", label: "Name", action: () => setDesktopSort("name") },
                { id: "sort-type", label: "Type", action: () => setDesktopSort("type") },
                { id: "sort-recent", label: "Recently Opened", action: () => setDesktopSort("recent") },
              ],
            },
            { id: "sep-1", separator: true },
            { id: "refresh", label: "Refresh", action: () => showToast("Desktop refreshed with extra sparkle.") },
            { id: "paste", label: "Paste", disabled: true },
            {
              id: "new",
              label: "New",
              submenu: [
                { id: "folder", label: "Folder", action: () => showToast("New folder placeholder made a tiny chime.") },
                { id: "note", label: "Note", action: () => openApp("notes") },
                { id: "sticker", label: "Sticker", action: () => showToast("Sticker tool is tucked away for later.") },
              ],
            },
            { id: "sep-2", separator: true },
            { id: "wallpaper", label: "Change Wallpaper", action: () => openApp("settings") },
            { id: "settings", label: "IrieOS Settings", action: () => openApp("settings") },
          ],
        });
      }}
    >
      <div className="irie-light-blob irie-light-blob-one" />
      <div className="irie-light-blob irie-light-blob-two" />
      <div className="irie-light-blob irie-light-blob-three" />
      <div className="irie-gradient-drift" />
      <div className="irie-mist irie-mist-one" />
      <div className="irie-mist irie-mist-two" />
      <div className="irie-shooting-star" />
      <div className="irie-sparkles" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_30%),linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.2)_100%)]" />

      <div className="absolute inset-0 z-10 pb-16">
        {desktopApps.map((app, index) => (
          <DesktopIcon
            key={app.id}
            app={app}
            index={index}
            size={desktopIconSize}
            isSelected={selectedIconId === app.id}
            onSelect={() => selectIcon(app.id)}
            onOpen={() => openApp(app.id)}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              selectIcon(app.id);
              openMenu({
                x: event.clientX,
                y: event.clientY,
                items: [
                  { id: "open", label: "Open", action: () => openApp(app.id) },
                  { id: "new-window", label: "Open in New Window", action: () => openApp(app.id) },
                  { id: "rename", label: "Rename", action: () => openDialog({ title: "Rename shortcut", message: "Renaming shortcuts is decorative for now.", inputLabel: "Shortcut name", inputValue: app.title, confirmLabel: "Save sparkle", onConfirm: () => showToast("Shortcut rename saved in spirit.") }) },
                  { id: "pin", label: "Pin to Taskbar", action: () => pinApp(app.id) },
                  { id: "sep-icon", separator: true },
                  { id: "info", label: "App Info", action: () => openDialog({ title: app.title, message: `${app.title} lives in the ${app.category ?? "Apps"} category. Icon accent: ${app.accent}.`, tone: "info" }) },
                  { id: "remove", label: "Remove Shortcut", action: () => showToast("Shortcut removal is decorative for now.") },
                ],
              });
            }}
          />
        ))}
      </div>
    </section>
  );
}
