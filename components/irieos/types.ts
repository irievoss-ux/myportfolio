"use client";

import type { ComponentType } from "react";

export type AppId =
  | "about"
  | "twitch"
  | "projects"
  | "gallery"
  | "contact"
  | "notes"
  | "files"
  | "browser"
  | "music"
  | "guestbook"
  | "settings"
  | "recycle";

export type OSPhase = "boot" | "login" | "desktop" | "sleep";

export type ThemeId = "cotton-candy" | "moon-milk" | "starry-lilac";

export type WallpaperId = "cotton-candy" | "moon-milk" | "starry-lilac";

export type AppCategory = "Profile" | "Creator" | "Portfolio" | "Studio" | "System";

export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OSWindowState extends WindowGeometry {
  appId: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  accent: string;
  defaultWindow: WindowGeometry;
  component: ComponentType;
  category?: AppCategory;
}

export interface ToastMessage {
  id: number;
  text: string;
}

export interface MenuItem {
  id: string;
  label?: string;
  disabled?: boolean;
  separator?: boolean;
  action?: () => void;
  submenu?: MenuItem[];
}

export interface GlobalMenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

export interface SystemDialogState {
  title: string;
  message: string;
  tone?: "info" | "warning" | "confirm";
  inputLabel?: string;
  inputValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: (value?: string) => void;
}

export type SoundEvent = "click" | "open" | "close" | "notification" | "error";
