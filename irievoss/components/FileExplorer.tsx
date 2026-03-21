"use client";
import { useState } from 'react';

// Using 'any' in the signature to solve the IntrinsicAttributes error
export default function FileExplorer({ path, setPath, onOpenFile, onToggleWindow }: any) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // --- THE DEEP VISTA FILE SYSTEM ---
  const fileSystem: Record<string, any> = {
    "Computer": [
      { name: "OSDisk (C:)", type: "drive", icon: "💽", percent: "65%", total: "120 GB", free: "42 GB" },
      { name: "TFT_Clips (D:)", type: "drive", icon: "💿", percent: "92%", total: "500 GB", free: "1.2 GB", red: true },
    ],
    "OSDisk (C:)": [
      { name: "Program Files", type: "folder", icon: "📁" },
      { name: "Users", type: "folder", icon: "📁" },
      { name: "Windows", type: "folder", icon: "📁" },
    ],
    "Windows": [
      { name: "System32", type: "folder", icon: "📁" },
      { name: "Media", type: "folder", icon: "📁" },
      { name: "explorer.exe", type: "app", id: "computer", icon: "🖥️", size: "2.4 MB" },
      { name: "win.ini", type: "text", icon: "📄", size: "1 KB", content: "[boot loader]\ntimeout=30\ndefault=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS" },
    ],
    "System32": [
      { name: "cmd.exe", type: "app", id: "terminal", icon: "💻", size: "400 KB" },
      { name: "kernel32.dll", type: "sys", icon: "⚙️", size: "1.2 MB" },
      { name: "user32.dll", type: "sys", icon: "⚙️", size: "800 KB" },
    ],
    "Program Files": [
      { name: "Internet Explorer", type: "folder", icon: "📁" },
      { name: "Windows Media Player", type: "folder", icon: "📁" },
    ],
    "Internet Explorer": [
      { name: "iexplore.exe", type: "app", id: "browser", icon: "🌐", size: "1.8 MB" },
    ],
    "Users": [
      { name: "Irie Voss", type: "folder", icon: "👤" },
      { name: "Public", type: "folder", icon: "📁" },
    ],
    "Irie Voss": [
      { name: "Documents", type: "folder", icon: "📁" },
      { name: "Music", type: "folder", icon: "📁" },
      { name: "Pictures", type: "folder", icon: "📁" },
      { name: "Games", type: "folder", icon: "📁" },
    ],
    "Documents": [
      { name: "About_Me.txt", type: "text", icon: "📄", size: "12 KB", content: "Irie Voss\nGamer, Creator, Enthusiast.\nCurrently simulating 2006." },
      { name: "Secrets.txt", type: "text", icon: "📄", size: "1 KB", content: "The password to the D: drive is MORTDOG." },
    ],
    "Games": [
      { name: "Minesweeper.exe", type: "app", id: "minesweeper", icon: "💣", size: "45 KB" },
    ],
    "TFT_Clips (D:)": [
      { name: "Insane_Karma_3.mp4", type: "video", icon: "🎬", size: "45 MB", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { name: "Final_Fight.mp4", type: "video", icon: "🎬", size: "120 MB", url: "https://www.w3schools.com/html/movie.mp4" },
    ]
  };

  const currentFolder = path[path.length - 1];
  const items = fileSystem[currentFolder] || [];

  const jumpTo = (folderPath: string[]) => {
    setPath(folderPath);
    setSelectedItem(null);
  };

  const enterFolder = (folder: string) => {
    setPath([...path, folder]);
    setSelectedItem(null);
  };

  const goBack = () => { if (path.length > 1) setPath(path.slice(0, -1)); };

  return (
    <div className="flex flex-col h-full bg-white font-sans text-sm select-none" onClick={() => setSelectedItem(null)}>
      {/* ADDRESS BAR */}
      <div className="bg-[#EBF3F9] px-2 py-1.5 flex items-center gap-2 border-b border-[#A2C6E0] shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); goBack(); }} 
          disabled={path.length === 1} 
          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${path.length > 1 ? 'bg-gradient-to-b from-blue-400 to-blue-700 border-blue-900 text-white shadow-md' : 'bg-gray-200 text-gray-400 border-gray-300'}`}
        >
          ◁
        </button>
        
        <div className="flex-1 flex items-center bg-white border border-[#8DA9C2] h-6 rounded px-1 overflow-hidden shadow-inner">
          {path.map((step: string, i: number) => (
            <div key={i} className="flex items-center">
              {i > 0 && <span className="text-[10px] text-gray-400 mx-0.5">▶</span>}
              <span 
                onClick={(e) => { e.stopPropagation(); jumpTo(path.slice(0, i + 1)); }} 
                className="text-xs hover:bg-blue-100 hover:text-blue-800 cursor-pointer px-1 rounded truncate max-w-[120px]"
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-40 bg-[#F1F8FF] border-r border-[#A2C6E0] p-2 text-xs flex flex-col gap-1 shrink-0">
          <div className="font-bold text-blue-800 mb-2 border-b border-blue-100 pb-1">Favorite Links</div>
          {[
            { name: "Documents", icon: "📁", p: ["Computer", "Users", "Irie Voss", "Documents"] },
            { name: "Pictures", icon: "🖼️", p: ["Computer", "Users", "Irie Voss", "Pictures"] },
            { name: "Games", icon: "🎮", p: ["Computer", "Users", "Irie Voss", "Games"] }
          ].map(f => (
            <div key={f.name} onClick={(e) => { e.stopPropagation(); jumpTo(f.p); }} className={`flex items-center gap-2 p-1 cursor-pointer rounded hover:bg-blue-100 ${currentFolder === f.name ? 'bg-blue-200' : ''}`}>
              <span>{f.icon}</span> {f.name}
            </div>
          ))}
        </div>

        {/* MAIN VIEW */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          <div className="flex flex-wrap gap-4 content-start">
            {items.map((item: any, i: number) => (
              <div 
                key={i} 
                onDoubleClick={() => {
                  if (item.type === 'folder' || item.type === 'drive') enterFolder(item.name);
                  else if (item.type === 'app') onToggleWindow(item.id);
                  else onOpenFile(item);
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                className={`flex flex-col items-center gap-1 w-24 text-center cursor-pointer p-1 rounded border ${selectedItem?.name === item.name ? 'bg-blue-100 border-blue-300 shadow-sm' : 'border-transparent'}`}
              >
                {item.type === 'drive' ? (
                  <div className="flex flex-col items-center w-full">
                    <span className="text-4xl drop-shadow-sm">{item.icon}</span>
                    <div className="w-16 h-2 bg-gray-200 border border-gray-400 mt-1 rounded-sm overflow-hidden">
                      <div className={`h-full ${item.red ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: item.percent}} />
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center text-2xl shadow-sm rounded group-hover:bg-blue-50">
                    {item.icon}
                  </div>
                )}
                <span className="text-[10px] truncate w-full px-1">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER DETAILS PANE */}
      <div className="h-14 bg-gradient-to-b from-[#4BA1CC] to-[#2B618F] border-t border-white/20 flex items-center px-4 gap-4 shrink-0 text-white shadow-lg">
         <span className="text-3xl drop-shadow-md">{selectedItem?.icon || '🖥️'}</span>
         <div className="flex flex-col">
            <span className="font-bold text-sm drop-shadow-sm">{selectedItem?.name || currentFolder}</span>
            <span className="text-[10px] opacity-70 uppercase tracking-tighter">{selectedItem?.size || 'System Folder'}</span>
         </div>
      </div>
    </div>
  );
}