"use client";
import { useState } from 'react';

export default function Netscape() {
  const [url, setUrl] = useState("https://www.metatft.com/player/na/irievoss-uwu");
  const [isRealMode, setIsRealMode] = useState(true); // Default to trying the real site
  const [loading, setLoading] = useState(false);

  const handleNavigate = (newUrl: string) => {
    setLoading(true);
    setUrl(newUrl);
    // If it's a known social/stat site, we might want to toggle RealMode automatically
    setIsRealMode(true); 
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans text-sm select-none overflow-hidden">
      {/* IE7 TOOLBAR */}
      <div className="bg-[#EBF3F9] border-b border-[#A2C6E0] p-1 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-0.5">
            <button className="w-8 h-8 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 border border-blue-900 text-white flex items-center justify-center shadow-sm">◁</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 border border-gray-400 text-gray-400 flex items-center justify-center">▷</button>
          </div>
          
          <div className="flex-1 flex items-center bg-white border border-[#8DA9C2] h-7 rounded px-2 shadow-inner">
             <span className="text-[10px] text-green-600 mr-2">🔒</span>
             <input 
               type="text" 
               value={url} 
               onChange={(e) => setUrl(e.target.value)}
               className="flex-1 outline-none text-xs text-gray-700 font-medium bg-transparent" 
             />
             {/* COMPATIBILITY BUTTON: Toggles between Simulation and Real iFrame */}
             <button 
               onClick={() => setIsRealMode(!isRealMode)}
               title="Compatibility View (Toggle Real/Simulated)"
               className={`mx-2 text-xs ${isRealMode ? 'text-blue-600' : 'text-gray-400'}`}
             >
               🧊
             </button>
             <button onClick={() => handleNavigate(url)} className="text-green-600 font-bold hover:scale-110">↻</button>
          </div>

          <div className="w-48 flex items-center bg-white border border-[#8DA9C2] h-7 rounded px-2 shadow-inner">
            <input type="text" placeholder="Live Search" className="flex-1 text-[11px] italic outline-none" />
            <span className="text-blue-500 text-xs">🔍</span>
          </div>
        </div>

        <div className="flex gap-0.5 pl-2 mt-2">
          <div className="px-4 py-1.5 bg-white border-t border-l border-r border-[#A2C6E0] rounded-t-md text-[11px] font-medium flex items-center gap-2">
            <span className="text-blue-500">🌍</span> {isRealMode ? "Live Web" : "Irie Voss | Official"}
          </div>
        </div>
      </div>

      {/* FAVORITES BAR */}
      <div className="bg-[#F5F9FD] border-b border-[#D6E5F5] px-4 py-1 flex gap-4 shrink-0">
        <button onClick={() => handleNavigate("https://www.metatft.com/player/na/irievoss-uwu")} className="flex items-center gap-1.5 text-[10px] text-blue-800 hover:underline">
          <span>📊</span> MetaTFT Stats
        </button>
        <button onClick={() => window.open(url, '_blank')} className="flex items-center gap-1.5 text-[10px] text-orange-700 font-bold hover:underline ml-auto">
          ↗ Open in New Tab
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 bg-white relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-2">
             <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {isRealMode ? (
          /* REAL IFRAME */
          <div className="w-full h-full flex flex-col">
            <iframe 
              src={url} 
              className="w-full h-full border-none"
              title="Browser Content"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
            {/* Disclaimer if it fails to load */}
            <div className="absolute bottom-4 right-4 bg-black/80 text-white text-[9px] p-2 rounded pointer-events-none opacity-50">
              Note: If screen is blank, the site has blocked embedding.
            </div>
          </div>
        ) : (
          /* YOUR SIMULATED FALLBACK (In case the real site blocks us) */
          <div className="max-w-4xl mx-auto my-4 bg-white shadow-lg min-h-full border border-gray-200 p-10 font-sans">
             <h1 className="text-4xl font-black italic text-blue-900 mb-4 uppercase">Simulated Portal</h1>
             <p className="text-gray-600">You are currently in Compatibility Mode. Click the blue 🧊 icon in the address bar to try loading the live site.</p>
          </div>
        )}
      </div>

      {/* STATUS BAR */}
      <div className="bg-[#EBF3F9] border-t border-[#A2C6E0] px-3 py-1 flex justify-between items-center text-[10px] text-gray-500">
        <div>Done</div>
        <div className="flex gap-4">
          <div>🌐 Internet | Protected Mode: On</div>
          <div className="font-bold">🔍 100%</div>
        </div>
      </div>
    </div>
  );
}