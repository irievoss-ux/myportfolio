"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appManifests } from "@/components/irieos/apps/manifest";
import type {
  AppId,
  GlobalMenuState,
  OSPhase,
  OSWindowState,
  SystemDialogState,
  SoundEvent,
  ThemeId,
  ToastMessage,
  WallpaperId,
  WindowGeometry,
} from "@/components/irieos/types";

const appDefaults = Object.fromEntries(
  appManifests.map((app, index) => [
    app.id,
    {
      appId: app.id,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 50 + index,
      ...app.defaultWindow,
    },
  ]),
) as Record<AppId, OSWindowState>;

interface OSStore {
  phase: OSPhase;
  hasCompletedLogin: boolean;
  selectedIconId: AppId | null;
  activeAppId: AppId | null;
  windows: Record<AppId, OSWindowState>;
  nextZIndex: number;
  isStartMenuOpen: boolean;
  wallpaper: WallpaperId;
  theme: ThemeId;
  reducedMotion: boolean;
  uiSounds: boolean;
  focusMode: boolean;
  glitterMode: boolean;
  catNapping: boolean;
  assistantOpen: boolean;
  screensaverTimeout: number;
  soundEvent: { id: number; type: SoundEvent } | null;
  isLocked: boolean;
  desktopIconSize: "large" | "medium" | "small";
  desktopSort: "name" | "type" | "recent";
  recentApps: AppId[];
  pinnedApps: AppId[];
  toasts: ToastMessage[];
  notificationHistory: ToastMessage[];
  menu: GlobalMenuState | null;
  dialog: SystemDialogState | null;
  finishBoot: () => void;
  login: () => void;
  shutdown: () => void;
  sleep: () => void;
  logOut: () => void;
  restart: () => void;
  wake: () => void;
  lock: () => void;
  unlock: () => void;
  openApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  minimizeApp: (appId: AppId) => void;
  restoreApp: (appId: AppId) => void;
  focusApp: (appId: AppId) => void;
  toggleMaximizeApp: (appId: AppId) => void;
  updateWindowGeometry: (appId: AppId, geometry: WindowGeometry) => void;
  selectIcon: (appId: AppId | null) => void;
  toggleStartMenu: () => void;
  setStartMenuOpen: (isOpen: boolean) => void;
  setWallpaper: (wallpaper: WallpaperId) => void;
  cycleWallpaper: () => void;
  setTheme: (theme: ThemeId) => void;
  setReducedMotion: (enabled: boolean) => void;
  setUISounds: (enabled: boolean) => void;
  setFocusMode: (enabled: boolean) => void;
  setGlitterMode: (enabled: boolean) => void;
  setCatNapping: (enabled: boolean) => void;
  toggleAssistant: () => void;
  setAssistantOpen: (open: boolean) => void;
  setScreensaverTimeout: (seconds: number) => void;
  playSound: (type: SoundEvent) => void;
  setDesktopIconSize: (size: OSStore["desktopIconSize"]) => void;
  setDesktopSort: (sort: OSStore["desktopSort"]) => void;
  showDesktop: () => void;
  cycleWindows: () => void;
  pinApp: (appId: AppId) => void;
  unpinApp: (appId: AppId) => void;
  showToast: (text: string) => void;
  dismissToast: (id: number) => void;
  clearNotifications: () => void;
  openMenu: (menu: GlobalMenuState) => void;
  closeMenu: () => void;
  openDialog: (dialog: SystemDialogState) => void;
  closeDialog: () => void;
}

function topVisibleWindow(windows: Record<AppId, OSWindowState>) {
  return Object.values(windows)
    .filter((window) => window.isOpen && !window.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.appId ?? null;
}

export const useOSStore = create<OSStore>()(
  persist(
    (set, get) => ({
      phase: "boot",
      hasCompletedLogin: false,
      selectedIconId: null,
      activeAppId: null,
      windows: appDefaults,
      nextZIndex: 200,
      isStartMenuOpen: false,
      wallpaper: "cotton-candy",
      theme: "cotton-candy",
      reducedMotion: false,
      uiSounds: false,
      focusMode: false,
      glitterMode: false,
      catNapping: false,
      assistantOpen: false,
      screensaverTimeout: 90,
      soundEvent: null,
      isLocked: false,
      desktopIconSize: "large",
      desktopSort: "name",
      recentApps: [],
      pinnedApps: ["about", "projects", "notes", "settings"],
      toasts: [],
      notificationHistory: [],
      menu: null,
      dialog: null,
      finishBoot: () => set((state) => ({ phase: state.hasCompletedLogin ? "desktop" : "login" })),
      login: () => set({ phase: "desktop", hasCompletedLogin: true, isStartMenuOpen: false, isLocked: false }),
      shutdown: () => set({ phase: "sleep", hasCompletedLogin: false, isStartMenuOpen: false, activeAppId: null }),
      sleep: () => set({ phase: "sleep", isStartMenuOpen: false, menu: null, dialog: null }),
      logOut: () => set({ phase: "login", hasCompletedLogin: false, isStartMenuOpen: false, isLocked: false, menu: null, dialog: null }),
      restart: () => set({ phase: "boot", hasCompletedLogin: true, isStartMenuOpen: false, menu: null, dialog: null }),
      wake: () => set((state) => ({ phase: state.hasCompletedLogin ? "desktop" : "boot", isStartMenuOpen: false })),
      lock: () => set({ isLocked: true, isStartMenuOpen: false, menu: null, dialog: null }),
      unlock: () => set({ isLocked: false }),
      openApp: (appId) => {
        const { nextZIndex, windows } = get();
        const current = windows[appId] ?? appDefaults[appId];
        set({
          windows: {
            ...windows,
            [appId]: {
              ...current,
              isOpen: true,
              isMinimized: false,
              zIndex: nextZIndex,
            },
          },
          nextZIndex: nextZIndex + 1,
          activeAppId: appId,
          selectedIconId: appId,
          isStartMenuOpen: false,
          recentApps: [appId, ...get().recentApps.filter((id) => id !== appId)].slice(0, 6),
          menu: null,
        });
        get().showToast(`${appManifests.find((app) => app.id === appId)?.title ?? "App"} opened.`);
        get().playSound("open");
      },
      closeApp: (appId) =>
        set((state) => {
          const windows = {
            ...state.windows,
            [appId]: { ...state.windows[appId], isOpen: false, isMinimized: false, isMaximized: false },
          };
          window.setTimeout(() => get().playSound("close"), 0);
          return { windows, activeAppId: topVisibleWindow(windows) };
        }),
      minimizeApp: (appId) =>
        set((state) => {
          const windows = {
            ...state.windows,
            [appId]: { ...state.windows[appId], isMinimized: true },
          };
          window.setTimeout(() => get().showToast("Window tucked away."), 0);
          return { windows, activeAppId: topVisibleWindow(windows) };
        }),
      restoreApp: (appId) => {
        const { nextZIndex, windows } = get();
        set({
          windows: {
            ...windows,
            [appId]: { ...windows[appId], isMinimized: false, zIndex: nextZIndex },
          },
          activeAppId: appId,
          nextZIndex: nextZIndex + 1,
          isStartMenuOpen: false,
        });
      },
      focusApp: (appId) => {
        const { nextZIndex, windows } = get();
        if (!windows[appId]?.isOpen) return;
        set({
          windows: {
            ...windows,
            [appId]: { ...windows[appId], isMinimized: false, zIndex: nextZIndex },
          },
          activeAppId: appId,
          nextZIndex: nextZIndex + 1,
        });
      },
      toggleMaximizeApp: (appId) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [appId]: { ...state.windows[appId], isMaximized: !state.windows[appId].isMaximized },
          },
        })),
      updateWindowGeometry: (appId, geometry) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [appId]: { ...state.windows[appId], ...geometry },
          },
        })),
      selectIcon: (appId) => set({ selectedIconId: appId }),
      toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
      setStartMenuOpen: (isOpen) => set({ isStartMenuOpen: isOpen }),
      setWallpaper: (wallpaper) => {
        set({ wallpaper });
        get().showToast("Wallpaper changed.");
      },
      cycleWallpaper: () =>
        set((state) => {
          const wallpapers: WallpaperId[] = ["cotton-candy", "moon-milk", "starry-lilac"];
          return { wallpaper: wallpapers[(wallpapers.indexOf(state.wallpaper) + 1) % wallpapers.length] };
        }),
      setTheme: (theme) => {
        set({ theme });
        get().showToast("Settings saved to stardust.");
      },
      setReducedMotion: (enabled) => {
        set({ reducedMotion: enabled });
        get().showToast(enabled ? "Reduced motion enabled." : "Reduced motion disabled.");
      },
      setUISounds: (enabled) => {
        set({ uiSounds: enabled });
        get().showToast(enabled ? "UI sounds toggled on for later." : "UI sounds toggled off.");
      },
      setFocusMode: (enabled) => {
        set({ focusMode: enabled });
        get().showToast(enabled ? "Focus Mode is glowing quietly." : "Focus Mode relaxed.");
      },
      setGlitterMode: (enabled) => {
        set({ glitterMode: enabled });
        get().showToast(enabled ? "IrieOS sprinkled some glitter." : "Glitter Mode settled.");
      },
      setCatNapping: (enabled) => {
        set({ catNapping: enabled });
        get().showToast(enabled ? "Cat mode activated: nap edition." : "Desktop cat is awake again.");
      },
      toggleAssistant: () => set((state) => ({ assistantOpen: !state.assistantOpen })),
      setAssistantOpen: (open) => set({ assistantOpen: open }),
      setScreensaverTimeout: (seconds) => {
        set({ screensaverTimeout: seconds });
        get().showToast("Dream timer tucked into settings.");
      },
      playSound: (type) => {
        if (!get().uiSounds) return;
        set({ soundEvent: { id: Date.now(), type } });
      },
      setDesktopIconSize: (size) => {
        set({ desktopIconSize: size });
        get().showToast(`${size[0].toUpperCase()}${size.slice(1)} icons selected.`);
      },
      setDesktopSort: (sort) => {
        set({ desktopSort: sort });
        get().showToast(`Desktop sorted by ${sort === "recent" ? "recently opened" : sort}.`);
      },
      showDesktop: () =>
        set((state) => {
          const openWindows = Object.values(state.windows).filter((window) => window.isOpen);
          const anyVisible = openWindows.some((window) => !window.isMinimized);
          const windows = { ...state.windows };
          for (const window of openWindows) {
            windows[window.appId] = { ...windows[window.appId], isMinimized: anyVisible };
          }
          return { windows, activeAppId: anyVisible ? null : topVisibleWindow(windows), isStartMenuOpen: false, menu: null };
        }),
      cycleWindows: () =>
        set((state) => {
          const openWindows = Object.values(state.windows)
            .filter((window) => window.isOpen)
            .sort((a, b) => b.zIndex - a.zIndex);
          if (openWindows.length < 2) return {};
          const currentIndex = openWindows.findIndex((window) => window.appId === state.activeAppId);
          const nextWindow = openWindows[(currentIndex + 1) % openWindows.length] ?? openWindows[0];
          return {
            windows: {
              ...state.windows,
              [nextWindow.appId]: { ...state.windows[nextWindow.appId], isMinimized: false, zIndex: state.nextZIndex },
            },
            activeAppId: nextWindow.appId,
            nextZIndex: state.nextZIndex + 1,
          };
        }),
      pinApp: (appId) => {
        set((state) => ({ pinnedApps: state.pinnedApps.includes(appId) ? state.pinnedApps : [...state.pinnedApps, appId] }));
        get().showToast("Pinned to taskbar in spirit.");
      },
      unpinApp: (appId) => set((state) => ({ pinnedApps: state.pinnedApps.filter((id) => id !== appId) })),
      showToast: (text) => {
        const id = Date.now();
        const toast = { id, text };
        set((state) => ({
          toasts: [...state.toasts, toast],
          notificationHistory: [toast, ...state.notificationHistory].slice(0, 24),
        }));
        get().playSound("notification");
        window.setTimeout(() => get().dismissToast(id), 2400);
      },
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
      clearNotifications: () => set({ notificationHistory: [] }),
      openMenu: (menu) => set({ menu }),
      closeMenu: () => set({ menu: null }),
      openDialog: (dialog) => set({ dialog }),
      closeDialog: () => set({ dialog: null }),
    }),
    {
      name: "irieos-state-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hasCompletedLogin: state.hasCompletedLogin,
        windows: state.windows,
        nextZIndex: state.nextZIndex,
        wallpaper: state.wallpaper,
        theme: state.theme,
        reducedMotion: state.reducedMotion,
        uiSounds: state.uiSounds,
        focusMode: state.focusMode,
        glitterMode: state.glitterMode,
        catNapping: state.catNapping,
        assistantOpen: state.assistantOpen,
        screensaverTimeout: state.screensaverTimeout,
        desktopIconSize: state.desktopIconSize,
        desktopSort: state.desktopSort,
        recentApps: state.recentApps,
        pinnedApps: state.pinnedApps,
        notificationHistory: state.notificationHistory,
      }),
    },
  ),
);
