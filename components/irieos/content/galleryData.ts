"use client";

export interface GalleryItem {
  id: string;
  title: string;
  category: "Chibi" | "Edits" | "Stream Graphics" | "Screenshots" | "Experiments";
  caption: string;
  image: string;
  tags: string[];
}

export const galleryData: GalleryItem[] = [
  { id: "chibi-helper", title: "Chibi helper concept", category: "Chibi", caption: "A tiny assistant mascot for soft system tips.", image: "round chibi helper", tags: ["mascot", "assistant"] },
  { id: "cat-sticker", title: "Desk cat sticker", category: "Chibi", caption: "Cat mode, but make it sticker-sheet ready.", image: "cat sticker", tags: ["cat", "sticker"] },
  { id: "cotton-edit", title: "Cotton candy edit", category: "Edits", caption: "Pink-blue polish for a dreamy profile moment.", image: "pastel edit", tags: ["pink", "blue"] },
  { id: "moon-panel", title: "Moon Milk panel", category: "Stream Graphics", caption: "Soft panel direction for offline and about sections.", image: "cream stream panel", tags: ["panel", "offline"] },
  { id: "irieos-shot", title: "IrieOS desktop shot", category: "Screenshots", caption: "A snapshot of the desktop with windows tucked in.", image: "desktop screenshot", tags: ["IrieOS", "desktop"] },
  { id: "glitter-trail", title: "Glitter trail test", category: "Experiments", caption: "Cursor sparkle experiments that stay readable.", image: "sparkle motion", tags: ["motion", "cursor"] },
  { id: "schedule-card", title: "Schedule card", category: "Stream Graphics", caption: "Upcoming stream card with soft status styling.", image: "schedule card", tags: ["schedule", "stream"] },
  { id: "lilac-window", title: "Starry Lilac window", category: "Screenshots", caption: "Theme polish study with soft glass and lilac glow.", image: "lilac window", tags: ["theme", "window"] },
];
