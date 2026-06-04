"use client";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  status: string;
  role: string;
  tools: string[];
  description: string;
  tags: string[];
  image: string;
  links: { label: string; href?: string }[];
  details: string;
}

export const projectData: PortfolioProject[] = [
  {
    id: "irieos",
    title: "IrieOS Portfolio",
    category: "Web",
    status: "In progress",
    role: "Designer and developer",
    tools: ["Next.js", "React", "TypeScript", "Tailwind", "Zustand"],
    description: "A fake operating system portfolio with draggable windows, magical settings, tiny system tools, and cozy app content.",
    tags: ["OS shell", "portfolio", "interactive"],
    image: "dream desktop",
    links: [{ label: "case study placeholder" }, { label: "live link placeholder" }],
    details:
      "IrieOS turns a portfolio into an explorable desktop. The project focuses on mood, interaction, and making everyday UI feel personal without losing clarity.",
  },
  {
    id: "overlay-pack",
    title: "Twitch Overlay Pack",
    category: "Stream",
    status: "Concept",
    role: "Visual direction",
    tools: ["Figma", "OBS-ready layout planning", "Motion notes"],
    description: "A pastel overlay system for starting soon, be right back, chat frames, alerts, and cozy panels.",
    tags: ["stream graphics", "branding", "OBS"],
    image: "sparkle overlay",
    links: [{ label: "preview placeholder" }],
    details:
      "Designed as a flexible stream identity kit with gentle gradients, readable panels, and little magical accents that do not crowd the content.",
  },
  {
    id: "chibi-assets",
    title: "Chibi Asset Collection",
    category: "Art",
    status: "Collecting",
    role: "Asset curator",
    tools: ["Illustration notes", "PNG export planning", "Sticker sheet system"],
    description: "A future set of chibi-style icons, stickers, and stream mascots for panels, scenes, and profile moments.",
    tags: ["chibi", "stickers", "assets"],
    image: "chibi sticker sheet",
    links: [{ label: "asset board placeholder" }],
    details:
      "This collection will hold small expressive elements that can make stream and portfolio surfaces feel recognizably Irie.",
  },
  {
    id: "dreamy-gallery",
    title: "Dreamy Gallery",
    category: "Gallery",
    status: "Planning",
    role: "Curator and builder",
    tools: ["React", "local data", "image grid UX"],
    description: "A gallery space for chibi pieces, edits, stream graphics, screenshots, and visual experiments.",
    tags: ["gallery", "creative archive", "visuals"],
    image: "soft gallery grid",
    links: [{ label: "gallery route placeholder" }],
    details:
      "The gallery is designed to become a scrapbook-style archive with categories, captions, tags, and gentle preview interactions.",
  },
  {
    id: "schedule-widget",
    title: "Stream Schedule Widget",
    category: "Tool",
    status: "Prototype idea",
    role: "UX designer",
    tools: ["React", "calendar logic", "stream content model"],
    description: "A cute schedule panel for upcoming streams, recurring events, and soft offline messaging.",
    tags: ["schedule", "widget", "creator tool"],
    image: "tiny calendar",
    links: [{ label: "widget placeholder" }],
    details:
      "A future mini-app for showing upcoming stream plans in a way that feels friendly, low-pressure, and easy to maintain.",
  },
];
