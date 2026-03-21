"use client";
import { motion, AnimatePresence } from 'framer-motion';

export default function StartMenu({ isOpen, userName, userImage, onToggleWindow, onOpenFolder, onShowShutdown }: any) {
  const leftApps = [
    { id: 'browser', label: 'Internet Explorer', icon: '🌐', sub: 'Browse the web' },
    { id: 'media', label: 'Windows Mail', icon: '✉️', sub: 'Read your email' },
    { id: 'minesweeper', label: 'Minesweeper', icon: '💣', sub: 'Classic game' },
    { id: 'paint', label: 'Paint', icon: '🎨', sub: 'Create and edit drawings' },
  ];

  const rightFolders = [
    { label: userName, bold: true, top: true, action: () => onOpenFolder('Irie Voss') },
    { label: 'Documents', action: () => onOpenFolder('Documents') },
    { label: 'Pictures', action: () => onOpenFolder('Pictures') },
    { label: 'Music', action: () => onOpenFolder('Music') },
    { label: 'Games', action: () => onToggleWindow('minesweeper') },
    { divider: true },
    { label: 'Computer', bold: true, action: () => onToggleWindow('computer') },
    { label: 'Network', action: () => onToggleWindow('browser') },
    { divider: true },
    { label: 'Control Panel', action: () => onToggleWindow('controlpanel') },
    { label: 'Default Programs' },
    { label: 'Help and Support' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-[40px] left-0 w-[400px] h-[480px] bg-gradient-to-b from-[#111111]/70 via-[#0a0a0a]/80 to-[#000000]/90 backdrop-blur-xl border-t border-r border-white/20 rounded-tr-lg z-[9999] shadow-2xl flex flex-col font-sans overflow-visible"
        >
          {/* FIXED USER AVATAR - Breaks out of the top right frame */}
          <div className="absolute -top-10 right-6 w-20 h-20 bg-white rounded-md border-2 border-gray-400 p-[3px] shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-[10000] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-blue-300 to-cyan-500 flex items-center justify-center text-5xl">
               {userImage}
            </div>
            {/* Glossy overlay for the pic */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          </div>

          <div className="flex-1 flex w-full mt-1 border-t border-white/10 overflow-hidden rounded-tr-lg">
            {/* Left Pane */}
            <div className="w-[58%] bg-white border-r border-gray-300 flex flex-col p-1 overflow-y-auto">
              {leftApps.map((item) => (
                <div key={item.id} onClick={() => onToggleWindow(item.id)} className="flex items-center p-2 rounded hover:bg-gradient-to-b hover:from-[#e4f0fa] hover:to-[#c4def6] border border-transparent hover:border-[#98c5ec] cursor-pointer group transition-all">
                  <span className="text-3xl w-10 text-center">{item.icon}</span>
                  <div className="flex flex-col ml-1">
                    <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                    <span className="text-[10px] text-gray-500 leading-tight">{item.sub}</span>
                  </div>
                </div>
              ))}
              <div className="mt-auto p-2 text-xs font-bold text-gray-600 hover:text-blue-700 cursor-pointer flex items-center gap-2">
                <span className="text-green-600 text-[10px]">▶</span> All Programs
              </div>
            </div>

            {/* Right Pane */}
            <div className="w-[42%] flex flex-col px-1 py-4 gap-0.5 mt-2 overflow-y-auto">
              {rightFolders.map((item: any, i: number) => {
                if (item.divider) return <div key={i} className="border-b border-white/10 mx-3 my-1" />;
                return (
                  <div key={i} onClick={item.action} className="flex items-center justify-between cursor-pointer hover:bg-white/10 px-3 py-1.5 rounded transition-colors group">
                    <span className={`text-white text-[11px] drop-shadow-md ${item.bold ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search Bar / Power Bar */}
          <div className="h-12 bg-black/40 border-t border-white/20 flex items-center px-4 justify-between shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="bg-white rounded-full flex items-center px-3 py-1 w-[220px] border border-gray-500 shadow-inner">
              <input type="text" placeholder="Start Search" className="bg-transparent text-[11px] outline-none text-gray-700 w-full italic" />
              <span className="text-blue-500 text-xs cursor-pointer">🔍</span>
            </div>
            
            <div className="flex gap-2 h-6 items-center">
              <button onClick={onShowShutdown} className="w-8 h-full bg-gradient-to-b from-orange-400 to-red-600 border border-black/60 rounded shadow-md flex items-center justify-center hover:brightness-110 active:scale-95 transition-all">
                <span className="text-white text-[10px]">🔒</span>
              </button>
              <button className="w-6 h-full bg-gradient-to-b from-blue-500 to-blue-800 border border-black/60 rounded shadow-md flex items-center justify-center hover:brightness-110 active:scale-95 transition-all">
                <span className="text-white text-[8px]">▶</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}