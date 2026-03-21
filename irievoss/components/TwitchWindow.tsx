"use client";

export default function TwitchWindow() {
  // IMPORTANT: Twitch requires you to list the domains where your stream is embedded.
  // When you publish to Vercel, change 'localhost' to 'irievoss.online'.
  const channel = "irievoss";
  const parentDomain = "localhost"; 

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden select-none">
      
      {/* --- WMP 11 TOP MENU BAR --- */}
      <div className="h-8 bg-gradient-to-b from-[#3a3a3a] via-[#222] to-[#111] flex items-center px-4 gap-6 text-[11px] font-semibold border-b border-white/10 shrink-0 shadow-md relative z-10">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)] group-hover:bg-blue-300 transition-colors" />
          <span className="text-blue-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">Now Playing</span>
        </div>
        <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Library</span>
        <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Rip</span>
        <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Burn</span>
        <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Sync</span>
      </div>

      {/* --- VIDEO CONTAINER --- */}
      <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#000] relative flex items-center justify-center p-1 overflow-hidden">
         {/* Glossy inner shadow overlay */}
         <div className="absolute inset-0 border-[3px] border-[#222] rounded-sm pointer-events-none z-10 shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />
         
         {/* Twitch Iframe */}
         <div className="w-full h-full bg-black relative z-0">
           <iframe
              src={`https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}`}
              className="w-full h-full border-none"
              allowFullScreen
           />
         </div>
      </div>

      {/* --- WMP 11 BOTTOM CONTROLS --- */}
      <div className="h-20 bg-gradient-to-b from-[#2a2a2a] via-[#111] to-[#000] border-t border-white/20 flex flex-col shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative z-10">
         
         {/* Seek Bar */}
         <div className="h-1.5 w-full bg-black border-b border-white/10 flex items-center">
            <div className="h-full bg-blue-500 w-[95%] shadow-[0_0_8px_rgba(59,130,246,0.8)] relative">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-4 bg-gradient-to-b from-gray-100 to-gray-400 border border-black rounded-sm shadow-md" />
            </div>
         </div>

         <div className="flex-1 flex items-center justify-between px-6">
             {/* Left: Info / Stop */}
             <div className="flex gap-4 items-center w-1/3">
               <div className="w-6 h-6 rounded-full bg-gradient-to-b from-gray-500 to-gray-800 border border-gray-400 flex items-center justify-center shadow-md cursor-pointer hover:brightness-110 active:shadow-inner">
                  <div className="w-2 h-2 bg-white rounded-sm" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-200 drop-shadow-md">Irie Voss Live</span>
                  <span className="text-[10px] text-gray-500">Twitch.tv</span>
               </div>
             </div>

             {/* Center: Play Controls (The Glowing Orb) */}
             <div className="flex items-center gap-3 w-1/3 justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-500 to-gray-800 border border-gray-400 flex items-center justify-center shadow-md cursor-pointer hover:brightness-110">
                   <span className="text-white text-[10px] mr-0.5">◁◁</span>
                </div>
                
                {/* Glowing Blue Play Button */}
                <div className="relative group cursor-pointer">
                   <div className="absolute inset-0 bg-blue-500 rounded-full blur-[8px] opacity-60 group-hover:opacity-100 group-hover:blur-[12px] transition-all duration-300" />
                   <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-300 via-blue-600 to-blue-900 border-[3px] border-white/20 flex items-center justify-center relative z-10 shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),0_5px_10px_rgba(0,0,0,0.5)] group-active:scale-95 transition-transform">
                      <span className="text-white text-xl ml-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">▶</span>
                   </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-500 to-gray-800 border border-gray-400 flex items-center justify-center shadow-md cursor-pointer hover:brightness-110">
                   <span className="text-white text-[10px] ml-0.5">▷▷</span>
                </div>
             </div>

             {/* Right: Volume & Fullscreen */}
             <div className="flex gap-4 items-center w-1/3 justify-end">
               <div className="flex items-center gap-2">
                 <span className="text-white text-xs drop-shadow-md">🔊</span>
                 <div className="w-16 h-1.5 bg-black rounded-full border border-gray-600 overflow-hidden shadow-inner">
                    <div className="w-3/4 h-full bg-gradient-to-r from-blue-600 to-blue-400" />
                 </div>
               </div>
               <div className="w-6 h-6 rounded bg-gradient-to-b from-gray-600 to-gray-800 border border-gray-500 flex items-center justify-center cursor-pointer hover:brightness-110 shadow-md">
                 <span className="text-white text-[10px]">⛶</span>
               </div>
             </div>
         </div>
      </div>
    </div>
  );
}