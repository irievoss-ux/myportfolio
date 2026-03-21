"use client";

interface PhotoViewerProps {
  file: { name: string; type: string; size: string } | null;
}

export default function PhotoViewer({ file }: PhotoViewerProps) {
  if (!file) return <div className="bg-[#f0f0f0] h-full flex items-center justify-center text-gray-500">No file selected.</div>;

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] font-sans select-none">
      
      {/* VISTA PHOTO GALLERY TOOLBAR */}
      <div className="h-10 bg-gradient-to-b from-[#F2F7FA] to-[#C9DFEE] border-b border-[#A2C6E0] flex items-center px-4 gap-4 text-xs text-gray-700 shadow-sm shrink-0">
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-800"><span className="text-blue-600 text-lg">🔍</span> Fix</div>
        <div className="w-px h-5 bg-[#A2C6E0]"></div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-800"><span className="text-blue-600 text-lg">🖨️</span> Print <span className="text-[8px]">▼</span></div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-800"><span className="text-blue-600 text-lg">✉️</span> E-mail</div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-800"><span className="text-blue-600 text-lg">💿</span> Burn <span className="text-[8px]">▼</span></div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-800"><span className="text-blue-600 text-lg">📂</span> Make a movie</div>
      </div>

      {/* THE IMAGE / PLACEHOLDER AREA */}
      <div className="flex-1 bg-[#eef3f6] flex items-center justify-center p-8 overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
        
        {/* The Placeholder Box (Swap this for <img /> or <video /> later) */}
        <div className="w-full max-w-md aspect-video bg-gradient-to-br from-gray-300 to-gray-400 border-[4px] border-white shadow-lg flex flex-col items-center justify-center group relative overflow-hidden">
           {file.type === 'image' && <span className="text-6xl opacity-40 drop-shadow-md">🖼️</span>}
           {file.type === 'video' && <span className="text-6xl opacity-40 drop-shadow-md">🎬</span>}
           
           <span className="mt-4 font-bold text-gray-700 bg-white/50 px-3 py-1 rounded backdrop-blur-sm">
             {file.name}
           </span>
           <span className="text-xs text-gray-600 mt-1">[{file.size}]</span>
        </div>
      </div>

      {/* VISTA GLOSSY CONTROL BAR (Bottom) */}
      <div className="h-14 bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#000] border-t border-white/20 flex items-center justify-between px-6 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative z-10">
        
        {/* Zoom Slider */}
        <div className="flex items-center gap-2 w-1/3">
          <span className="text-white text-xs">🔍-</span>
          <div className="w-24 h-1 bg-black rounded-full border border-gray-600 overflow-hidden shadow-inner flex items-center">
             <div className="w-3 h-3 bg-gradient-to-b from-gray-100 to-gray-400 rounded-full border border-black shadow-md ml-4" />
          </div>
          <span className="text-white text-xs">🔍+</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 w-1/3">
          <button className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border border-gray-500 flex items-center justify-center shadow-md hover:brightness-110">
             <span className="text-white text-[10px] mr-0.5">◁</span>
          </button>
          
          {/* Big Play Slideshow Button */}
          <button className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 border-2 border-white/20 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5),inset_0_2px_5px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform group">
             <span className="text-white text-lg ml-1 drop-shadow-md">▶</span>
          </button>

          <button className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border border-gray-500 flex items-center justify-center shadow-md hover:brightness-110">
             <span className="text-white text-[10px] ml-0.5">▷</span>
          </button>
        </div>

        {/* Delete / Rotate */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <span className="text-gray-300 hover:text-white cursor-pointer text-lg" title="Rotate left">↺</span>
          <span className="text-gray-300 hover:text-white cursor-pointer text-lg" title="Rotate right">↻</span>
          <span className="text-red-400 hover:text-red-300 cursor-pointer text-lg ml-2" title="Delete">🗑️</span>
        </div>
      </div>
    </div>
  );
}