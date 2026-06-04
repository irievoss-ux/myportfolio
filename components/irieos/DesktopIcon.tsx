"use client";

import { motion } from "framer-motion";
import IrieIcon from "@/components/irieos/IrieIcon";
import type { AppDefinition } from "@/components/irieos/types";

interface DesktopIconProps {
  app: AppDefinition;
  index: number;
  size: "large" | "medium" | "small";
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function DesktopIcon({ app, index, size, isSelected, onSelect, onOpen, onContextMenu }: DesktopIconProps) {
  const row = index % 8;
  const col = Math.floor(index / 8);
  const spacingY = size === "large" ? 92 : size === "medium" ? 78 : 64;
  const spacingX = size === "large" ? 104 : size === "medium" ? 92 : 78;
  const iconBox = size === "large" ? "h-14 w-14 text-3xl" : size === "medium" ? "h-12 w-12 text-2xl" : "h-10 w-10 text-xl";
  const wrapper = size === "large" ? "w-[88px]" : size === "medium" ? "w-[78px]" : "w-[68px]";

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 * index }}
      style={{ left: 18 + col * spacingX, top: 22 + row * spacingY }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onContextMenu={onContextMenu}
      className={`group absolute flex ${wrapper} flex-col items-center gap-1.5 rounded-3xl px-2 py-2 text-center transition ${isSelected ? "bg-white/45 shadow-[0_12px_30px_rgba(169,112,185,0.16)]" : "hover:bg-white/28"}`}
    >
      <span
        className={`flex ${iconBox} items-center justify-center rounded-2xl border border-white/70 bg-white/45 shadow-[0_12px_26px_rgba(143,111,181,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-lg transition group-hover:-translate-y-0.5 group-hover:scale-105`}
        style={{ color: app.accent }}
      >
        <IrieIcon appId={app.id} fallback={app.icon} />
      </span>
      <span className="rounded-xl px-2 py-0.5 text-[11px] font-black leading-tight text-white drop-shadow-[0_2px_4px_rgba(123,82,136,0.75)]">
        {app.title}
      </span>
    </motion.button>
  );
}
