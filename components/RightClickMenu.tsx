"use client";

interface RightClickMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onPersonalize: () => void;
  onTaskManager: () => void;
  desktopViewMode: 'large' | 'medium' | 'small';
  setDesktopViewMode: (mode: 'large' | 'medium' | 'small') => void;
}

function MenuIcon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-slate-400">
      <path d={d} />
    </svg>
  );
}

export default function RightClickMenu({ isOpen, x, y, onClose, onPersonalize, onTaskManager, desktopViewMode, setDesktopViewMode }: RightClickMenuProps) {
  if (!isOpen) return null;

  const runAndClose = (action: () => void) => {
    action();
    onClose();
  };

  const menuWidth = 230;
  const menuHeight = 340;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      className="fixed z-[10000] overflow-hidden rounded-[6px] border border-[#a8b8c8]/80 bg-[linear-gradient(180deg,#f8fbff_0%,#edf3fa_100%)] font-sans text-xs shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl"
      style={{ top: adjustedY, left: adjustedX, width: menuWidth }}
      onClick={(event) => event.stopPropagation()}
    >
      {/* View submenu */}
      <div className="border-b border-[#d8e2ec] py-1">
        <div className="px-8 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">View</div>
        <button type="button" onClick={() => runAndClose(() => setDesktopViewMode('large'))} className={`flex w-full items-center gap-3 px-8 py-1.5 text-left hover:bg-[#d6e8fc] ${desktopViewMode === 'large' ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
          <span className="w-4 text-center">{desktopViewMode === 'large' ? '●' : ''}</span>Large Icons
        </button>
        <button type="button" onClick={() => runAndClose(() => setDesktopViewMode('medium'))} className={`flex w-full items-center gap-3 px-8 py-1.5 text-left hover:bg-[#d6e8fc] ${desktopViewMode === 'medium' ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
          <span className="w-4 text-center">{desktopViewMode === 'medium' ? '●' : ''}</span>Medium Icons
        </button>
        <button type="button" onClick={() => runAndClose(() => setDesktopViewMode('small'))} className={`flex w-full items-center gap-3 px-8 py-1.5 text-left hover:bg-[#d6e8fc] ${desktopViewMode === 'small' ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
          <span className="w-4 text-center">{desktopViewMode === 'small' ? '●' : ''}</span>Small Icons
        </button>
      </div>

      {/* Sort */}
      <div className="border-b border-[#d8e2ec] py-1">
        <button type="button" className="flex w-full items-center gap-3 px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M3 5h10M3 8h7M3 11h4" />Sort By
        </button>
      </div>

      {/* Actions */}
      <div className="border-b border-[#d8e2ec] py-1">
        <button type="button" onClick={() => runAndClose(() => window.location.reload())} className="flex w-full items-center gap-3 px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M2 8 A6 6 0 1 1 8 14 M2 4L2 8L6 8" />Refresh
        </button>
        <button type="button" className="flex w-full items-center gap-3 px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M4 2h8v12H4zM6 5h4M6 8h4M6 11h2" />Paste
        </button>
        <button type="button" className="flex w-full items-center gap-3 px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M4 4h8v8H4zM7 1v3M2 7h3" />Paste Shortcut
        </button>
      </div>

      {/* New submenu */}
      <div className="border-b border-[#d8e2ec] py-1">
        <button type="button" className="flex w-full items-center justify-between px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <span className="flex items-center gap-3"><MenuIcon d="M8 3v10M3 8h10" />New</span>
          <span className="text-slate-400">▶</span>
        </button>
      </div>

      {/* System */}
      <div className="border-b border-[#d8e2ec] py-1">
        <button type="button" onClick={() => runAndClose(onTaskManager)} className="flex w-full items-center gap-3 px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M3 14V6h3V4h4v2h3v8zM6 8v4M10 8v4" />Task Manager
        </button>
      </div>

      {/* Personalize */}
      <div className="py-1">
        <button type="button" onClick={() => runAndClose(onPersonalize)} className="flex w-full items-center gap-3 px-8 py-1.5 text-left font-semibold text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M12 2L14 4 6 12 2 14 4 10z" />Personalize
        </button>
        <button type="button" className="flex w-full items-center gap-3 px-8 py-1.5 text-left text-slate-700 hover:bg-[#d6e8fc]">
          <MenuIcon d="M8 2a6 6 0 100 12 6 6 0 000-12zM8 6v3M8 11v0.5" />Properties
        </button>
      </div>
    </div>
  );
}
