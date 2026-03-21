"use client";

import { Rnd } from 'react-rnd';
import { useEffect, useState, type ReactNode } from 'react';

interface RetroWindowProps {
  id: string;
  title: string;
  icon?: string;
  children: ReactNode;
  isOpen: boolean;
  isActive: boolean;
  zIndex: number;
  defaultX?: number;
  defaultY?: number;
  defaultW?: number;
  defaultH?: number;
  onClose: () => void;
  onFocus: () => void;
}

export default function RetroWindow({
  id,
  title,
  icon = '🪟',
  children,
  isOpen,
  isActive,
  zIndex,
  defaultX = 120,
  defaultY = 90,
  defaultW = 640,
  defaultH = 480,
  onClose,
  onFocus,
}: RetroWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const syncViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  if (!isOpen) return null;

  return (
    <Rnd
      size={isMaximized ? { width: viewport.width, height: viewport.height - 46 } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      default={{ x: defaultX, y: defaultY, width: defaultW, height: defaultH }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      bounds="window"
      dragHandleClassName={`aero-handle-${id}`}
      onMouseDown={onFocus}
      onDragStart={onFocus}
      onResizeStart={onFocus}
      style={{ zIndex }}
      className={`flex flex-col overflow-hidden ${isMaximized ? 'rounded-none' : 'rounded-[12px]'}`}
    >
      <div className={`vista-window-shell flex h-full flex-col border border-white/55 bg-white/18 shadow-[0_22px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl ${isActive ? 'ring-1 ring-white/40' : 'opacity-92 saturate-90'} ${isMaximized ? 'rounded-none border-x-0 border-t-0' : 'rounded-[12px]'}`}>
        <div className={`aero-handle-${id} flex h-9 items-center justify-between border-b border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.08))] px-2.5 text-slate-900`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{icon}</span>
            <span className="text-sm font-medium tracking-wide text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">{title}</span>
          </div>

          <div className="flex items-center gap-[3px]">
            <button type="button" onClick={onFocus} className="vista-window-button w-8 text-[11px]">—</button>
            <button type="button" onClick={() => setIsMaximized((value) => !value)} className="vista-window-button w-8 text-[11px]">{isMaximized ? '❐' : '□'}</button>
            <button type="button" onClick={onClose} className="vista-window-button-close w-11 text-[11px]">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-b-[10px] border border-black/35 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {children}
        </div>
      </div>
    </Rnd>
  );
}
