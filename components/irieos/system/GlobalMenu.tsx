"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import type { MenuItem } from "@/components/irieos/types";

function MenuList({ items, depth = 0 }: { items: MenuItem[]; depth?: number }) {
  const closeMenu = useOSStore((state) => state.closeMenu);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

  return (
    <div className={`min-w-52 rounded-2xl border border-white/70 bg-white/76 p-1 text-sm font-bold text-[#765080] shadow-[0_18px_52px_rgba(126,91,141,0.2)] backdrop-blur-2xl ${depth ? "absolute left-[calc(100%-4px)] top-0" : ""}`}>
      {items.map((item) => {
        if (item.separator) return <div key={item.id} className="mx-2 my-1 h-px bg-[#ead3ee]" />;

        return (
          <div key={item.id} className="relative" onMouseEnter={() => setOpenSubmenuId(item.id)}>
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled || item.submenu) return;
                item.action?.();
                closeMenu();
              }}
              className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left transition ${item.disabled ? "cursor-not-allowed text-[#bda9c2] opacity-60" : "hover:bg-[#fff0fb]"}`}
            >
              <span>{item.label}</span>
              {item.submenu && <span className="text-[#d79bd3]">›</span>}
            </button>
            {item.submenu && openSubmenuId === item.id && <MenuList items={item.submenu} depth={depth + 1} />}
          </div>
        );
      })}
    </div>
  );
}

export default function GlobalMenu() {
  const menu = useOSStore((state) => state.menu);
  const closeMenu = useOSStore((state) => state.closeMenu);
  const [viewport, setViewport] = useState({ width: 1024, height: 768 });

  useEffect(() => {
    const sync = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  if (!menu) return null;

  return (
    <div className="fixed inset-0 z-[255000]" onClick={closeMenu} onContextMenu={(event) => event.preventDefault()}>
      <div
        className="absolute"
        style={{ left: Math.min(menu.x, viewport.width - 230), top: Math.min(menu.y, viewport.height - 260) }}
        onClick={(event) => event.stopPropagation()}
      >
        <MenuList items={menu.items} />
      </div>
    </div>
  );
}
