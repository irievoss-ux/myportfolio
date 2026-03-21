"use client";

import { Rnd } from 'react-rnd';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VistaIcon from '@/components/VistaIconMap';

interface RetroWindowProps {
  id: string;
  title: string;
  iconKey?: string;
  children: ReactNode;
  isOpen: boolean;
  isMinimized?: boolean;
  isActive: boolean;
  zIndex: number;
  defaultX?: number;
  defaultY?: number;
  defaultW?: number;
  defaultH?: number;
  onClose: () => void;
  onFocus: () => void;
  onMinimize?: () => void;
}

export default function RetroWindow({
  id, title, iconKey = 'window', children, isOpen, isMinimized = false, isActive,
  zIndex, defaultX = 120, defaultY = 90, defaultW = 640, defaultH = 480,
  onClose, onFocus, onMinimize,
}: RetroWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const sync = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  if (!isOpen) return null;

  const tbHeight = 30;

  return (
    <AnimatePresence>
      {!isMinimized && (
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
          className={`flex flex-col overflow-hidden ${isMaximized ? 'rounded-none' : 'rounded-[8px]'}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`vista-window-shell flex h-full flex-col ${isActive
              ? 'border border-[rgba(100,160,220,0.7)] bg-[rgba(150,200,250,0.15)] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.3)]'
              : 'border border-[rgba(140,160,180,0.5)] bg-[rgba(170,190,210,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.2)] saturate-[0.7]'
            } backdrop-blur-2xl ${isMaximized ? 'rounded-none' : 'rounded-[8px]'}`}
          >
            {/* Title bar */}
            <div
              className={`aero-handle-${id} flex items-center justify-between px-2`}
              style={{ height: tbHeight }}
              onDoubleClick={() => setIsMaximized(v => !v)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <VistaIcon name={iconKey} size={16} />
                <span className={`text-[12px] truncate ${isActive ? 'text-black/85' : 'text-black/45'} drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]`}>{title}</span>
              </div>

              {/* Vista Aero window buttons */}
              <div className="flex items-center -mr-1">
                {/* Minimize */}
                <button type="button" onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
                  className="group relative flex h-[20px] w-[28px] items-center justify-center rounded-[3px] transition hover:bg-white/30 active:bg-white/15" title="Minimize">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect x="1" y="7" width="8" height="1.5" rx="0.5" fill={isActive ? 'rgba(30,50,70,0.7)' : 'rgba(80,100,120,0.4)'} />
                  </svg>
                </button>
                {/* Maximize/Restore */}
                <button type="button" onClick={() => setIsMaximized(v => !v)}
                  className="group relative flex h-[20px] w-[28px] items-center justify-center rounded-[3px] transition hover:bg-white/30 active:bg-white/15" title={isMaximized ? 'Restore Down' : 'Maximize'}>
                  {isMaximized ? (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <rect x="2.5" y="3" width="5.5" height="5" rx="0.5" fill="none" stroke={isActive ? 'rgba(30,50,70,0.6)' : 'rgba(80,100,120,0.35)'} strokeWidth="1.2" />
                      <rect x="1" y="1.5" width="5.5" height="5" rx="0.5" fill="none" stroke={isActive ? 'rgba(30,50,70,0.6)' : 'rgba(80,100,120,0.35)'} strokeWidth="1.2" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <rect x="1" y="1.5" width="8" height="7" rx="0.5" fill="none" stroke={isActive ? 'rgba(30,50,70,0.6)' : 'rgba(80,100,120,0.35)'} strokeWidth="1.2" />
                    </svg>
                  )}
                </button>
                {/* Close */}
                <button type="button" onClick={onClose}
                  className="group relative flex h-[20px] w-[28px] items-center justify-center rounded-[3px] transition hover:bg-[#e04343] active:bg-[#b82020]" title="Close">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      className="text-slate-600 group-hover:text-white" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Aero shimmer line */}
            <div className={`h-px ${isActive ? 'bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5)_30%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.5)_70%,transparent)]' : 'bg-white/15'}`} />

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-white">
              {children}
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
}
