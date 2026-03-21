"use client";

interface RightClickMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onPersonalize: () => void;
  onTaskManager: () => void;
}

export default function RightClickMenu({ isOpen, x, y, onClose, onPersonalize, onTaskManager }: RightClickMenuProps) {
  if (!isOpen) return null;

  const runAndClose = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed z-[10000] w-56 border border-[#a0a0a0] bg-[#f2f2f2] py-0.5 font-sans text-xs shadow-xl" style={{ top: y, left: x }} onClick={(event) => event.stopPropagation()}>
      <div className="absolute bottom-0 left-0 top-0 w-7 border-r border-white/80 bg-gray-200" />
      <div className="relative z-10">
        <button type="button" className="block w-full px-8 py-1 text-left hover:bg-blue-100">View</button>
        <button type="button" className="block w-full px-8 py-1 text-left hover:bg-blue-100">Sort By</button>
        <button type="button" onClick={() => runAndClose(() => window.location.reload())} className="block w-full px-8 py-1 text-left hover:bg-blue-100">Refresh</button>
        <div className="mx-1 my-1 h-px bg-gray-300" />
        <button type="button" onClick={() => runAndClose(onTaskManager)} className="block w-full px-8 py-1 text-left hover:bg-blue-100">Task Manager</button>
        <div className="mx-1 my-1 h-px bg-gray-300" />
        <button type="button" onClick={() => runAndClose(onPersonalize)} className="block w-full px-8 py-1 text-left hover:bg-blue-100">Personalize</button>
      </div>
    </div>
  );
}
