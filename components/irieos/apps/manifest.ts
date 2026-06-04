"use client";

import type { AppCategory, AppId, WindowGeometry } from "@/components/irieos/types";

export interface AppManifest {
  id: AppId;
  title: string;
  icon: string;
  accent: string;
  defaultWindow: WindowGeometry;
  category?: AppCategory;
}

export const appManifests = [
  {
    id: "about",
    title: "About Me",
    icon: "✿",
    accent: "#f4a7d5",
    defaultWindow: { x: 132, y: 72, width: 720, height: 480 },
    category: "Profile",
  },
  {
    id: "twitch",
    title: "Twitch",
    icon: "◐",
    accent: "#c7a5ff",
    defaultWindow: { x: 220, y: 92, width: 680, height: 430 },
    category: "Creator",
  },
  {
    id: "projects",
    title: "Projects",
    icon: "✧",
    accent: "#9fdaf6",
    defaultWindow: { x: 180, y: 110, width: 760, height: 500 },
    category: "Portfolio",
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: "▧",
    accent: "#ffd3a7",
    defaultWindow: { x: 250, y: 88, width: 700, height: 520 },
    category: "Studio",
  },
  {
    id: "contact",
    title: "Contact",
    icon: "♡",
    accent: "#f9b5cc",
    defaultWindow: { x: 300, y: 108, width: 660, height: 500 },
    category: "Profile",
  },
  {
    id: "notes",
    title: "Notes",
    icon: "✎",
    accent: "#f6d675",
    defaultWindow: { x: 390, y: 130, width: 520, height: 420 },
    category: "Studio",
  },
  {
    id: "files",
    title: "File Explorer",
    icon: "▣",
    accent: "#9bcdf3",
    defaultWindow: { x: 130, y: 82, width: 780, height: 520 },
    category: "System",
  },
  {
    id: "browser",
    title: "Irie Browser",
    icon: "⌁",
    accent: "#9edce7",
    defaultWindow: { x: 170, y: 96, width: 780, height: 520 },
    category: "System",
  },
  {
    id: "music",
    title: "Music Box",
    icon: "♪",
    accent: "#e8b9f2",
    defaultWindow: { x: 260, y: 116, width: 620, height: 450 },
    category: "Studio",
  },
  {
    id: "guestbook",
    title: "Guestbook",
    icon: "✦",
    accent: "#f7c58f",
    defaultWindow: { x: 250, y: 126, width: 640, height: 470 },
    category: "Profile",
  },
  {
    id: "settings",
    title: "Settings",
    icon: "⚙",
    accent: "#b8c6ff",
    defaultWindow: { x: 160, y: 82, width: 720, height: 480 },
    category: "System",
  },
  {
    id: "recycle",
    title: "Recycle Bin",
    icon: "♻",
    accent: "#b9ebcf",
    defaultWindow: { x: 340, y: 140, width: 500, height: 360 },
    category: "System",
  },
] satisfies AppManifest[];
