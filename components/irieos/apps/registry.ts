"use client";

import type { AppDefinition } from "@/components/irieos/types";
import { appManifests } from "@/components/irieos/apps/manifest";
import {
  AboutApp,
  ContactApp,
  GalleryApp,
  FileExplorerApp,
  BrowserApp,
  GuestbookApp,
  MusicApp,
  NotesApp,
  ProjectsApp,
  RecycleBinApp,
  SettingsApp,
  TwitchApp,
} from "@/components/irieos/apps/BasicApps";

const appComponents: Record<AppDefinition["id"], AppDefinition["component"]> = {
  about: AboutApp,
  twitch: TwitchApp,
  projects: ProjectsApp,
  gallery: GalleryApp,
  contact: ContactApp,
  notes: NotesApp,
  files: FileExplorerApp,
  browser: BrowserApp,
  music: MusicApp,
  guestbook: GuestbookApp,
  settings: SettingsApp,
  recycle: RecycleBinApp,
};

export const appRegistry = appManifests.map((app) => ({
  ...app,
  component: appComponents[app.id],
})) satisfies AppDefinition[];

export const appsById = appRegistry.reduce(
  (accumulator, app) => {
    accumulator[app.id] = app;
    return accumulator;
  },
  {} as Record<AppDefinition["id"], AppDefinition>,
);
