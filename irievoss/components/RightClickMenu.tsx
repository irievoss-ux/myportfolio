"use client";

export default function RightClickMenu({ isOpen, x, y, onClose, onPersonalize, onTaskManager }: any) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-[10000] w-56 bg-[#f2f2f2] border border-[#a0a0a0] shadow-xl font-sans text-xs py-0.5"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute left-0 top-0 bottom-0 w-7 bg-gray-200 border-r border-white/80 z-0" />
      <div className="relative z-10">
        <div className="px-8 py-1 hover:bg-blue-100 cursor-default">View</div>
        <div className="px-8 py-1 hover:bg-blue-100 cursor-default">Sort By</div>
        <div className="px-8 py-1 hover:bg-blue-100 cursor-default" onClick={() => window.location.reload()}>Refresh</div>
        <div className="h-px bg-gray-300 my-1 mx-1" />
        <div className="px-8 py-1 hover:bg-blue-100 cursor-default" onClick={onTaskManager}>Task Manager</div>
        <div className="h-px bg-gray-300 my-1 mx-1" />
        <div className="px-8 py-1 hover:bg-blue-100 cursor-default" onClick={onPersonalize}>Personalize</div>
      </div>
    </div>
  );
}