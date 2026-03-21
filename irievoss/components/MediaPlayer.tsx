"use client";
import { useState } from 'react';

export default function MediaPlayer({ file }: any) {
  const [playing, setPlaying] = useState(false);

  // If no file is passed, show the "Library" state
  if (!file) {
    return (
      <div className="flex flex-col h-full bg-[#00050a] text-white font-sans overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center border-b border-white/5 bg-gradient-to-b from-blue-900/20 to-black">
          <div className="w-32 h-32 bg-blue-600/20 rounded-full border border-blue-500/50 flex items-center justify-center animate-pulse">
            <span className="text-6xl">🎵</span>
          </div>
          <p className="mt-4 text-gray-400 text-sm italic">Select a clip from the D: Drive to play</p>
        </div>
        <MediaControls playing={playing} setPlaying={setPlaying} title="Windows Media Player" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden">
      {/* VIDEO AREA */}
      <div className="flex-1 relative group bg-black flex items-center justify-center">
        <video 
          src={file.url || ""} 
          className="w-full h-full object-contain"
          autoPlay
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
             <button onClick={() => setPlaying(true)} className="text-6xl opacity-70 hover:opacity-100 transition-opacity">▶</button>
          </div>
        )}
      </div>

      {/* CONTROLS AREA */}
      <MediaControls playing={playing} setPlaying={setPlaying} title={file.name} />
    </div>
  );
}

function MediaControls({ playing, setPlaying, title }: any) {
  return (
    <div className="h-20 bg-gradient-to-b from-[#1a1c1e] to-[#0a0a0a] border-t border-white/10 p-2 flex flex-col gap-1">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_cyan]" />
      </div>

      <div className="flex justify-between items-center px-4 mt-1">
        <div className="flex flex-col">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Now Playing</span>
          <span className="text-xs font-medium truncate max-w-[150px]">{title}</span>
        </div>

        {/* Glossy Circular Controls */}
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition-colors">⏮</button>
          <button 
            onClick={() => setPlaying(!playing)}
            className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 border border-blue-900 flex items-center justify-center text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">⏭</button>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500">Volume</span>
              <span className="text-xs">🔊 75%</span>
           </div>
        </div>
      </div>
    </div>
  );
}