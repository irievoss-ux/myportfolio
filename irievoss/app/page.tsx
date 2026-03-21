"use client";
import { useState, useEffect } from 'react';
import RetroWindow from '@/components/RetroWindow';
import StartMenu from '@/components/StartMenu';
import Netscape from '@/components/Netscape';
import MailWindow from '@/components/MailWindow';
import FileExplorer from '@/components/FileExplorer';
import PhotoViewer from '@/components/PhotoViewer';
import RightClickMenu from '@/components/RightClickMenu';
import LoginScreen from '@/components/LoginScreen';
import Notepad from '@/components/Notepad';
import VistaSidebar from '@/components/VistaSidebar';
import Personalize from '@/components/Personalize';
import SystemProperties from '@/components/SystemProperties';
import TaskManager from '@/components/TaskManager';
import VistaTaskbar from '@/components/VistaTaskbar';
import UACPopup from '@/components/UACPopup';
import WEI from '@/components/WEI';
import Minesweeper from '@/components/Minesweeper';
import ShutdownDialog from '@/components/ShutdownDialog';
import ShutdownScreen from '@/components/ShutdownScreen';
import ControlPanel from '@/components/ControlPanel';
import Terminal from '@/components/Terminal';
import MediaPlayer from '@/components/MediaPlayer';
import { HINTS_DATA } from '@/components/Hints';

export default function IrieOS() {
  // --- CORE SYSTEM STATE ---
  const [isLocked, setIsLocked] = useState(true);
  const [isOff, setIsOff] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [uac, setUac] = useState<{ active: boolean; targetApp: string | null }>({ active: false, targetApp: null });
  
  // --- USER & THEME STATE ---
  const [userName, setUserName] = useState("Irie Voss");
  const [userImage, setUserImage] = useState("🌸");
  const [wallpaper, setWallpaper] = useState('aurora');
  const [aeroColor, setAeroColor] = useState('teal');

  // --- NAVIGATION & WINDOWS ---
  const [explorerPath, setExplorerPath] = useState<string[]>(['Computer']);
  const [windows, setWindows] = useState<any>({
    browser: { isOpen: true, z: 10, title: "Internet Explorer", icon: "🌐" },
    computer: { isOpen: false, z: 11, title: "Computer", icon: "💻" },
    media: { isOpen: false, z: 12, title: "Windows Media Player", icon: "🎬", currentFile: null },
    photo: { isOpen: false, z: 13, title: "Photo Gallery", icon: "🖼️", currentFile: null },
    notepad: { isOpen: false, z: 14, title: "Notepad", icon: "📄", currentFile: null },
    minesweeper: { isOpen: false, z: 15, title: "Minesweeper", icon: "💣" },
    controlpanel: { isOpen: false, z: 16, title: "Control Panel", icon: "⚙️" },
    terminal: { isOpen: false, z: 17, title: "Command Prompt", icon: "💻" },
    taskmanager: { isOpen: false, z: 18, title: "Task Manager", icon: "📊" },
    system: { isOpen: false, z: 19, title: "System", icon: "⚙️" },
    wei: { isOpen: false, z: 20, title: "Performance Tools", icon: "📈" },
    mail: { isOpen: false, z: 21, title: "Windows Mail", icon: "✉️" },
  });
  
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });

  // --- ACTIONS ---
  const handleOpenFile = (file: any) => {
    const maxZ = Math.max(...Object.values(windows).map((w: any) => w.z), 10);
    let targetApp = 'notepad';
    if (file.type === 'image') targetApp = 'photo';
    if (file.type === 'video') targetApp = 'media';
    
    setWindows((prev: any) => ({
      ...prev,
      [targetApp]: { ...prev[targetApp], isOpen: true, z: maxZ + 1, currentFile: file }
    }));
  };

  const openFolder = (folderName: string) => {
    setExplorerPath(['Computer', folderName]);
    const maxZ = Math.max(...Object.values(windows).map((w: any) => w.z), 10);
    setWindows((prev: any) => ({ ...prev, computer: { isOpen: true, z: maxZ + 1 } }));
    setStartOpen(false);
  };

  const toggleWindow = (id: string) => {
    const systemApps = ['system', 'taskmanager', 'personalize', 'wei', 'controlpanel', 'terminal'];
    if (systemApps.includes(id) && !windows[id].isOpen) {
      setUac({ active: true, targetApp: id });
      setStartOpen(false);
      return;
    }
    const maxZ = Math.max(...Object.values(windows).map((w: any) => w.z), 10);
    setWindows((prev: any) => ({ ...prev, [id]: { ...prev[id], isOpen: !prev[id]?.isOpen, z: maxZ + 1 } }));
    setStartOpen(false);
  };

  const focusWindow = (id: string) => {
    const maxZ = Math.max(...Object.values(windows).map((w: any) => w.z), 10);
    setWindows((prev: any) => ({ ...prev, [id]: { ...prev[id], z: maxZ + 1 } }));
  };

  const confirmUAC = () => {
    if (uac.targetApp) {
      const id = uac.targetApp;
      const maxZ = Math.max(...Object.values(windows).map((w: any) => w.z), 10);
      setWindows((prev: any) => ({ ...prev, [id]: { ...prev[id], isOpen: true, z: maxZ + 1 } }));
    }
    setUac({ active: false, targetApp: null });
  };

  const backgrounds: Record<string, string> = {
    aurora: 'linear-gradient(135deg, #093c60 0%, #157b97 35%, #3cba92 70%, #b8e28a 100%)',
    grass: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 40%, #80D670 40%, #80D670 100%)',
    floral: 'linear-gradient(to bottom, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    dark: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  };

  if (isOff) return <ShutdownScreen />;
  if (isLocked) return <LoginScreen userName={userName} userImage={userImage} onLogin={() => setIsLocked(false)} />;

  return (
    <main 
      className="fixed inset-0 overflow-hidden select-none"
      onContextMenu={(e) => { e.preventDefault(); setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY }); }}
      onClick={() => { setContextMenu({ ...contextMenu, isOpen: false }); setStartOpen(false); }}
      style={{ fontFamily: '"Segoe UI", sans-serif', background: backgrounds[wallpaper] }}
    >
      <VistaSidebar userImage={userImage} />
      
      {/* AERO GLASS TINT */}
      <div className={`absolute inset-0 opacity-30 pointer-events-none transition-colors duration-700 ${aeroColor === 'ruby' ? 'bg-red-500' : aeroColor === 'emerald' ? 'bg-emerald-500' : aeroColor === 'graphite' ? 'bg-black' : 'bg-transparent'}`} />

      {/* DESKTOP ICONS */}
      <div className="relative p-6 flex flex-col gap-6 w-min z-0">
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => toggleWindow('computer')}>
          <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">💻</span>
          <span className="text-white text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-medium">Computer</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => toggleWindow('browser')}>
          <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">🌐</span>
          <span className="text-white text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-medium">Network</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => handleOpenFile(HINTS_DATA)}>
          <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">📄</span>
          <span className="text-white text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-medium">HINTS</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer mt-4">
          <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">🗑️</span>
          <span className="text-white text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-medium">Recycle Bin</span>
        </div>
      </div>

      {/* RENDER ENGINE */}
      <RetroWindow id="computer" title="Computer" isOpen={windows.computer.isOpen} zIndex={windows.computer.z} defaultW={750} defaultH={500} defaultX={100} defaultY={80} onClose={() => toggleWindow('computer')} onFocus={() => focusWindow('computer')}>
        <FileExplorer path={explorerPath} setPath={setExplorerPath} onOpenFile={handleOpenFile} onToggleWindow={toggleWindow} />
      </RetroWindow>

      <RetroWindow id="browser" title="Internet Explorer" isOpen={windows.browser.isOpen} zIndex={windows.browser.z} defaultW={900} defaultH={650} defaultX={150} defaultY={50} onClose={() => toggleWindow('browser')} onFocus={() => focusWindow('browser')}>
        <Netscape />
      </RetroWindow>

      <RetroWindow id="media" title="Windows Media Player" isOpen={windows.media.isOpen} zIndex={windows.media.z} defaultW={600} defaultH={500} defaultX={250} defaultY={100} onClose={() => toggleWindow('media')} onFocus={() => focusWindow('media')}>
        <MediaPlayer file={windows.media.currentFile} />
      </RetroWindow>

      <RetroWindow id="notepad" title={windows.notepad.currentFile ? `${windows.notepad.currentFile.name} - Notepad` : "Notepad"} isOpen={windows.notepad.isOpen} zIndex={windows.notepad.z} defaultW={500} defaultH={400} defaultX={250} defaultY={150} onClose={() => toggleWindow('notepad')} onFocus={() => focusWindow('notepad')}>
        <Notepad file={windows.notepad.currentFile} />
      </RetroWindow>

      <RetroWindow id="minesweeper" title="Minesweeper" isOpen={windows.minesweeper.isOpen} zIndex={windows.minesweeper.z} defaultW={320} defaultH={450} defaultX={400} defaultY={150} onClose={() => toggleWindow('minesweeper')} onFocus={() => focusWindow('minesweeper')}>
        <Minesweeper />
      </RetroWindow>

      <RetroWindow id="controlpanel" title="Control Panel" isOpen={windows.controlpanel.isOpen} zIndex={windows.controlpanel.z} defaultW={700} defaultH={550} defaultX={150} defaultY={100} onClose={() => toggleWindow('controlpanel')} onFocus={() => focusWindow('controlpanel')}>
        <ControlPanel userName={userName} setUserName={setUserName} userImage={userImage} setUserImage={setUserImage} />
      </RetroWindow>

      <RetroWindow id="taskmanager" title="Task Manager" isOpen={windows.taskmanager.isOpen} zIndex={windows.taskmanager.z} defaultW={450} defaultH={450} defaultX={300} defaultY={100} onClose={() => toggleWindow('taskmanager')} onFocus={() => focusWindow('taskmanager')}>
        <TaskManager windows={windows} onEndTask={(id: string) => setWindows((prev: any) => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))} />
      </RetroWindow>

      <RetroWindow id="terminal" title="Command Prompt" isOpen={windows.terminal.isOpen} zIndex={windows.terminal.z} defaultW={600} defaultH={400} defaultX={200} defaultY={150} onClose={() => toggleWindow('terminal')} onFocus={() => focusWindow('terminal')}>
        <Terminal userName={userName} onClose={() => toggleWindow('terminal')} />
      </RetroWindow>

      {/* OVERLAYS */}
      <VistaTaskbar windows={windows} onToggleStart={() => setStartOpen(!startOpen)} onFocusWindow={focusWindow} aeroColor={aeroColor} />
      
      {showShutdown && <ShutdownDialog onCancel={() => setShowShutdown(false)} onShutDown={() => setIsOff(true)} />}
      
      {uac.active && <UACPopup appName={windows[uac.targetApp!].title} onContinue={confirmUAC} onCancel={() => setUac({ active: false, targetApp: null })} />}
      
      <StartMenu isOpen={startOpen} userName={userName} userImage={userImage} onToggleWindow={toggleWindow} onOpenFolder={openFolder} onShowShutdown={() => { setShowShutdown(true); setStartOpen(false); }} />
      
      <RightClickMenu isOpen={contextMenu.isOpen} x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu({...contextMenu, isOpen: false})} onPersonalize={() => toggleWindow('personalize')} onTaskManager={() => toggleWindow('taskmanager')} />
    </main>
  );
}