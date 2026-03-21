"use client";
import { Rnd } from "react-rnd";
import { ReactNode, useState } from "react";

interface Props {
  id: string;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  defaultX?: number;
  defaultY?: number;
  defaultW?: number;
  defaultH?: number;
}

export default function RetroWindow({ 
  title, children, isOpen, onClose, onFocus, zIndex, 
  defaultX = 100, defaultY = 100, defaultW = 600, defaultH = 450 
}: Props) {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  return (
    <Rnd
      default={{ x: defaultX, y: defaultY, width: defaultW, height: defaultH }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="aero-handle"
      onDragStart={onFocus}
      onResizeStart={onFocus}
      size={isMaximized ? { width: "100vw", height: "calc(100vh - 40px)" } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      style={{ zIndex, display: 'flex' }}
      bounds="window"
      // THE THICK VISTA GLASS FRAME
      className={`flex flex-col rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/60 bg-white/20 backdrop-blur-md p-[6px] transition-all duration-200 ${isMaximized ? 'rounded-none p-0 border-none' : ''}`}
    >
      {/* TITLE BAR (Sits inside the glass frame) */}
      <div className="aero-handle h-7 flex justify-between items-center select-none shrink-0 w-full mb-1">
        <div className="flex items-center gap-2 pl-1">
          {/* Fake Window Icon */}
          <div className="w-4 h-4 rounded-sm bg-blue-500/50 shadow-sm" />
          <span className="text-black text-sm tracking-wide" style={{ textShadow: '0 0 5px white, 0 0 10px white' }}>
            {title}
          </span>
        </div>
        
        {/* VISTA WINDOW CONTROLS */}
        <div className="flex gap-[2px] h-5">
          <button 
            onClick={() => {}} 
            className="w-7 h-full rounded-sm border border-black/40 bg-gradient-to-b from-white/80 via-blue-100/80 to-blue-300/80 hover:brightness-125 flex items-center justify-center text-black shadow-sm"
          >
            <span className="text-xs mb-2">_</span>
          </button>
          <button 
            onClick={() => setIsMaximized(!isMaximized)} 
            className="w-7 h-full rounded-sm border border-black/40 bg-gradient-to-b from-white/80 via-blue-100/80 to-blue-300/80 hover:brightness-125 flex items-center justify-center text-black shadow-sm"
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button 
            onClick={onClose} 
            className="w-11 h-full rounded-sm border border-black/60 bg-gradient-to-b from-red-400 via-red-500 to-red-700 hover:from-red-300 hover:via-red-400 hover:to-red-600 flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
          >
            <span className="text-[10px] font-bold">✕</span>
          </button>
        </div>
      </div>

      {/* WINDOW CONTENT (Opaque white, solid border) */}
      <div className="flex-1 w-full overflow-hidden bg-white text-black border border-gray-600 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">
        {children}
      </div>
    </Rnd>
  );
}