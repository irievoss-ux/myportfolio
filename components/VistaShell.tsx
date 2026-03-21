"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import ControlPanel from '@/components/ControlPanel';
import FileExplorer from '@/components/FileExplorer';
import LoginScreen from '@/components/LoginScreen';
import MailWindow from '@/components/MailWindow';
import MediaPlayer from '@/components/MediaPlayer';
import Minesweeper from '@/components/Minesweeper';
import Netscape from '@/components/Netscape';
import Notepad from '@/components/Notepad';
import PhotoViewer from '@/components/PhotoViewer';
import RetroWindow from '@/components/RetroWindow';
import RightClickMenu from '@/components/RightClickMenu';
import ShutdownDialog from '@/components/ShutdownDialog';
import ShutdownScreen from '@/components/ShutdownScreen';
import StartMenu from '@/components/StartMenu';
import SystemProperties from '@/components/SystemProperties';
import TaskManager from '@/components/TaskManager';
import Terminal from '@/components/Terminal';
import UACPopup from '@/components/UACPopup';
import VistaSidebar from '@/components/VistaSidebar';
import VistaTaskbar from '@/components/VistaTaskbar';
import WEI from '@/components/WEI';
import Calculator from '@/components/Calculator';
import Paint from '@/components/Paint';
import RunDialog from '@/components/RunDialog';
import BootScreen from '@/components/BootScreen';
import StickyNotes from '@/components/StickyNotes';
import Solitaire from '@/components/Solitaire';
import PurblePlace from '@/components/PurblePlace';
import ChessTitans from '@/components/ChessTitans';
import VistaIcon from '@/components/VistaIconMap';
import { createVistaFileSystem, getNodeAtPath, type VistaAppNode, type VistaImageNode, type VistaNode, type VistaPath, type VistaVideoNode } from '@/lib/vista/filesystem';
import { useVistaProfile } from './providers/VistaProfileProvider';

interface WindowState {
  title: string;
  iconKey: string;
  isOpen: boolean;
  isMinimized: boolean;
  z: number;
  requiresUac?: boolean;
  currentFile?: VistaNode | null;
}

const windowBlueprints: Record<string, Omit<WindowState, 'isOpen' | 'isMinimized' | 'z' | 'currentFile'>> = {
  browser: { title: 'Internet Explorer', iconKey: 'ie' },
  computer: { title: 'Computer', iconKey: 'computer' },
  media: { title: 'Windows Media Player', iconKey: 'mediaplayer' },
  photo: { title: 'Windows Photo Gallery', iconKey: 'photo' },
  notepad: { title: 'Notepad', iconKey: 'notepad' },
  minesweeper: { title: 'Minesweeper', iconKey: 'minesweeper' },
  controlpanel: { title: 'Control Panel', iconKey: 'controlpanel', requiresUac: true },
  terminal: { title: 'Command Prompt', iconKey: 'terminal', requiresUac: true },
  taskmanager: { title: 'Task Manager', iconKey: 'taskmanager', requiresUac: true },
  mail: { title: 'Windows Mail', iconKey: 'mail' },
  system: { title: 'System', iconKey: 'system', requiresUac: true },
  wei: { title: 'Performance Information and Tools', iconKey: 'wei', requiresUac: true },
  calculator: { title: 'Calculator', iconKey: 'calculator' },
  paint: { title: 'Paint', iconKey: 'paint' },
  solitaire: { title: 'Solitaire', iconKey: 'solitaire' },
  purbleplace: { title: 'Purble Place', iconKey: 'purbleplace' },
  chesstitans: { title: 'Chess Titans', iconKey: 'chesstitans' },
};

const windowDefaults: Record<string, { x: number; y: number; w: number; h: number }> = {
  browser: { x: 150, y: 50, w: 980, h: 680 },
  computer: { x: 92, y: 70, w: 900, h: 580 },
  media: { x: 260, y: 120, w: 760, h: 560 },
  photo: { x: 240, y: 100, w: 760, h: 560 },
  notepad: { x: 220, y: 140, w: 600, h: 440 },
  minesweeper: { x: 410, y: 140, w: 360, h: 470 },
  controlpanel: { x: 160, y: 92, w: 820, h: 600 },
  terminal: { x: 240, y: 150, w: 660, h: 420 },
  taskmanager: { x: 300, y: 120, w: 500, h: 460 },
  mail: { x: 220, y: 110, w: 720, h: 560 },
  system: { x: 210, y: 100, w: 760, h: 520 },
  wei: { x: 200, y: 100, w: 820, h: 560 },
  calculator: { x: 380, y: 160, w: 340, h: 480 },
  paint: { x: 120, y: 60, w: 880, h: 620 },
  solitaire: { x: 260, y: 100, w: 720, h: 560 },
  purbleplace: { x: 300, y: 120, w: 680, h: 580 },
  chesstitans: { x: 280, y: 110, w: 700, h: 620 },
};

const desktopIcons = [
  { id: 'computer', label: 'Computer', iconKey: 'computer', kind: 'window' as const },
  { id: 'browser', label: 'Internet Explorer', iconKey: 'ie', kind: 'window' as const },
  { label: 'Recycle Bin', iconKey: 'recyclebin', kind: 'static' as const },
  { id: 'notepad', label: 'Notepad', iconKey: 'notepad', kind: 'window' as const },
  { id: 'calculator', label: 'Calculator', iconKey: 'calculator', kind: 'window' as const },
  { id: 'paint', label: 'Paint', iconKey: 'paint', kind: 'window' as const },
  { id: 'controlpanel', label: 'Control Panel', iconKey: 'controlpanel', kind: 'window' as const },
  { id: 'mail', label: 'Windows Mail', iconKey: 'mail', kind: 'window' as const },
  { label: 'Games', iconKey: 'games', kind: 'path' as const, path: ['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Games'] },
  { label: 'Documents', iconKey: 'folder-documents', kind: 'path' as const, path: ['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Documents'] },
];

function createInitialWindows(): Record<string, WindowState> {
  return Object.fromEntries(
    Object.entries(windowBlueprints).map(([id, config], index) => [
      id,
      { ...config, isOpen: false, isMinimized: false, z: index + 20, currentFile: null },
    ]),
  );
}

export default function VistaShell() {
  const { accountFolder, userName } = useVistaProfile();
  const fileSystem = useMemo(() => createVistaFileSystem(accountFolder), [accountFolder]);
  const [phase, setPhase] = useState<'boot' | 'login' | 'desktop'>('boot');
  const [isOff, setIsOff] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [showRun, setShowRun] = useState(false);
  const [wallpaper, setWallpaper] = useState('aurora');
  const [aeroColor, setAeroColor] = useState('teal');
  const [explorerPath, setExplorerPath] = useState<VistaPath>(['Computer']);
  const [windows, setWindows] = useState<Record<string, WindowState>>(() => createInitialWindows());
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZ, setNextZ] = useState(200);
  const [uac, setUac] = useState<{ active: boolean; windowId: string | null }>({ active: false, windowId: null });
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  const [desktopViewMode, setDesktopViewMode] = useState<'large' | 'medium' | 'small'>('large');

  // Keyboard shortcuts
  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (phase !== 'desktop') return;
    // Win key → toggle Start Menu
    if (e.key === 'Meta') { e.preventDefault(); setStartOpen(v => !v); return; }
    // Ctrl+Shift+Esc → Task Manager
    if (e.ctrlKey && e.shiftKey && e.key === 'Escape') { e.preventDefault(); openWindow('taskmanager', { bypassUac: true }); return; }
    // Win+E → Computer (Explorer)
    if (e.metaKey && e.key === 'e') { e.preventDefault(); openWindow('computer'); return; }
    // Win+R → Run
    if (e.metaKey && e.key === 'r') { e.preventDefault(); setShowRun(true); return; }
    // Escape → close Start Menu
    if (e.key === 'Escape') { setStartOpen(false); setContextMenu(c => ({ ...c, isOpen: false })); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [handleKeyboard]);

  const backgrounds: Record<string, string> = {
    aurora: 'radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 32%), linear-gradient(135deg, #083d65 0%, #116c9b 30%, #2e8dc1 58%, #59b0ca 74%, #86d58a 100%)',
    meadow: 'radial-gradient(circle at top, rgba(255,255,255,0.2), transparent 28%), linear-gradient(180deg, #7ac4ff 0%, #3f8fea 40%, #8fd36f 40%, #4d8c3e 100%)',
    twilight: 'radial-gradient(circle at top, rgba(255,255,255,0.14), transparent 30%), linear-gradient(135deg, #1d274c 0%, #344277 32%, #8c4f7b 70%, #1b1020 100%)',
    midnight: 'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 25%), linear-gradient(180deg, #0a0e1a 0%, #151c32 40%, #0f172a 100%)',
    sunset: 'radial-gradient(circle at 30% 20%, rgba(255,200,100,0.2), transparent 30%), linear-gradient(135deg, #1a0a2e 0%, #4a1942 30%, #c45e3e 65%, #f4a261 100%)',
  };

  const determineNextActive = (states: Record<string, WindowState>) => {
    const openWindows = Object.entries(states).filter(([, s]) => s.isOpen && !s.isMinimized).sort((a, b) => b[1].z - a[1].z);
    return openWindows[0]?.[0] ?? null;
  };

  const focusWindow = (windowId: string) => {
    setWindows((c) => ({ ...c, [windowId]: { ...c[windowId], z: nextZ, isMinimized: false } }));
    setActiveWindowId(windowId);
    setNextZ((v) => v + 1);
  };

  const minimizeWindow = (windowId: string) => {
    setWindows((c) => {
      const next = { ...c, [windowId]: { ...c[windowId], isMinimized: true } };
      setActiveWindowId(determineNextActive(next));
      return next;
    });
  };

  const restoreWindow = (windowId: string) => {
    setWindows((c) => ({ ...c, [windowId]: { ...c[windowId], isMinimized: false, z: nextZ } }));
    setActiveWindowId(windowId);
    setNextZ((v) => v + 1);
  };

  const showDesktop = () => {
    const anyVisible = Object.values(windows).some((w) => w.isOpen && !w.isMinimized);
    if (anyVisible) {
      setWindows((c) => {
        const n = { ...c };
        for (const k of Object.keys(n)) { if (n[k].isOpen) n[k] = { ...n[k], isMinimized: true }; }
        return n;
      });
      setActiveWindowId(null);
    } else {
      setWindows((c) => {
        const n = { ...c };
        for (const k of Object.keys(n)) { if (n[k].isOpen) n[k] = { ...n[k], isMinimized: false }; }
        return n;
      });
      setActiveWindowId(determineNextActive(windows));
    }
  };

  const openPathInExplorer = (path: VistaPath) => { setExplorerPath(path); openWindow('computer'); };

  const openWindow = (windowId: string, options?: { currentFile?: VistaNode | null; bypassUac?: boolean }) => {
    const wc = windows[windowId];
    if (!wc) return;
    if (wc.requiresUac && !wc.isOpen && !options?.bypassUac) {
      setUac({ active: true, windowId }); setStartOpen(false); return;
    }
    setWindows((c) => ({
      ...c,
      [windowId]: { ...c[windowId], isOpen: true, isMinimized: false, z: nextZ, currentFile: options?.currentFile ?? c[windowId].currentFile ?? null },
    }));
    setActiveWindowId(windowId);
    setNextZ((v) => v + 1);
    setStartOpen(false);
  };

  const closeWindow = (windowId: string) => {
    setWindows((c) => {
      const next = { ...c, [windowId]: { ...c[windowId], isOpen: false, isMinimized: false } };
      setActiveWindowId(determineNextActive(next));
      return next;
    });
  };

  const handleOpenNode = (node: VistaNode) => {
    if (node.type === 'video') { openWindow('media', { currentFile: node }); return; }
    if (node.type === 'image') { openWindow('photo', { currentFile: node }); return; }
    if (node.type === 'text' || node.type === 'system') { openWindow('notepad', { currentFile: node }); return; }
    if (node.type === 'app') {
      const an = node as VistaAppNode;
      if (an.launchPath) { openPathInExplorer(an.launchPath); return; }
      openWindow(an.windowId);
    }
  };

  const confirmUac = () => {
    if (!uac.windowId) return;
    const wid = uac.windowId;
    setUac({ active: false, windowId: null });
    openWindow(wid, { bypassUac: true });
  };

  const handleRunCommand = (cmd: string) => {
    const map: Record<string, string> = {
      calc: 'calculator', calculator: 'calculator', notepad: 'notepad', cmd: 'terminal',
      mspaint: 'paint', paint: 'paint', explorer: 'computer', iexplore: 'browser',
      ie: 'browser', mail: 'mail', control: 'controlpanel', taskmgr: 'taskmanager',
      minesweeper: 'minesweeper', winsat: 'wei', systeminfo: 'system',
      solitaire: 'solitaire', sol: 'solitaire', purbleplace: 'purbleplace',
      chesstitans: 'chesstitans', chess: 'chesstitans',
    };
    const wid = map[cmd.toLowerCase()];
    if (wid) openWindow(wid);
  };

  const hintsNode = getNodeAtPath(fileSystem, ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Documents', 'HINTS.txt']);

  if (isOff) return <ShutdownScreen />;
  if (phase === 'boot') return <BootScreen onFinish={() => setPhase('login')} />;
  if (phase === 'login') return <LoginScreen onLogin={() => setPhase('desktop')} />;

  const iconSize = desktopViewMode === 'large' ? 44 : desktopViewMode === 'medium' ? 32 : 24;
  const iconBoxClass = desktopViewMode === 'large' ? 'h-16 w-16 rounded-[16px]' : desktopViewMode === 'medium' ? 'h-12 w-12 rounded-[12px]' : 'h-9 w-9 rounded-[8px]';
  const iconLabelClass = desktopViewMode === 'large' ? 'text-[12px]' : desktopViewMode === 'medium' ? 'text-[11px]' : 'text-[10px]';
  const iconWrapClass = desktopViewMode === 'large' ? 'w-22' : desktopViewMode === 'medium' ? 'w-18' : 'w-14';

  const renderWin = (id: string, children: React.ReactNode) => {
    const w = windows[id]; const d = windowDefaults[id];
    return (
      <RetroWindow key={id} id={id} iconKey={w.iconKey} title={w.title} isOpen={w.isOpen} isMinimized={w.isMinimized}
        isActive={activeWindowId === id} zIndex={w.z} defaultX={d.x} defaultY={d.y} defaultW={d.w} defaultH={d.h}
        onClose={() => closeWindow(id)} onFocus={() => focusWindow(id)} onMinimize={() => minimizeWindow(id)}>
        {children}
      </RetroWindow>
    );
  };

  return (
    <main className="fixed inset-0 overflow-hidden select-none font-sans vista-cursor-default"
      style={{ background: backgrounds[wallpaper] }}
      onContextMenu={(e) => { e.preventDefault(); if (uac.active) return; setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY }); }}
      onClick={() => { setContextMenu((c) => ({ ...c, isOpen: false })); setStartOpen(false); }}>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_40%,rgba(0,0,0,0.12))]" />
      <div className={`pointer-events-none absolute inset-0 transition duration-700 ${aeroColor === 'ruby' ? 'bg-red-500/12' : aeroColor === 'emerald' ? 'bg-emerald-400/12' : aeroColor === 'graphite' ? 'bg-slate-600/18' : aeroColor === 'amber' ? 'bg-amber-500/12' : aeroColor === 'violet' ? 'bg-violet-500/12' : 'bg-cyan-300/10'}`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_100%)]" />

      <VistaSidebar />
      <StickyNotes />

      {/* Desktop Icons Grid */}
      <div className="relative z-10 flex h-full w-full items-start p-5 pb-20 pr-[200px]">
        <div className="grid auto-rows-max grid-cols-1 gap-4" style={{ gridAutoFlow: 'column', gridTemplateRows: `repeat(auto-fill, minmax(${desktopViewMode === 'large' ? '100px' : '70px'}, 1fr))`, maxHeight: 'calc(100vh - 120px)' }}>
          {desktopIcons.map((s) => (
            <button key={s.label} type="button"
              onDoubleClick={() => { if (s.kind === 'window' && s.id) openWindow(s.id); else if (s.kind === 'path' && s.path) openPathInExplorer(s.path as VistaPath); }}
              onClick={(e) => e.stopPropagation()}
              className={`group flex ${iconWrapClass} flex-col items-center gap-1.5 rounded-[14px] px-2 py-1 text-center hover:bg-white/10`}>
              <div className={`flex ${iconBoxClass} items-center justify-center border border-white/15 bg-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-sm transition group-hover:scale-105`}>
                <VistaIcon name={s.iconKey} size={iconSize} />
              </div>
              <span className={`rounded px-1 ${iconLabelClass} font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* All windows */}
      {renderWin('computer', <FileExplorer path={explorerPath} setPath={setExplorerPath} onOpenNode={handleOpenNode} />)}
      {renderWin('browser', <Netscape onOpenWindow={openWindow} onOpenPath={openPathInExplorer} />)}
      {renderWin('media', <MediaPlayer file={(windows.media.currentFile as VistaVideoNode | null) ?? null} />)}
      {renderWin('photo', <PhotoViewer file={(windows.photo.currentFile as VistaImageNode | null) ?? null} />)}
      {renderWin('notepad', <Notepad file={windows.notepad.currentFile ?? hintsNode} />)}
      {renderWin('minesweeper', <Minesweeper />)}
      {renderWin('solitaire', <Solitaire />)}
      {renderWin('purbleplace', <PurblePlace />)}
      {renderWin('chesstitans', <ChessTitans />)}
      {renderWin('controlpanel', <ControlPanel aeroColor={aeroColor} setAeroColor={setAeroColor} wallpaper={wallpaper} setWallpaper={setWallpaper} onOpenWindow={openWindow} onOpenPath={openPathInExplorer} />)}
      {renderWin('terminal', <Terminal onClose={() => closeWindow('terminal')} />)}
      {renderWin('taskmanager', <TaskManager windows={windows} onEndTask={(id: string) => closeWindow(id)} />)}
      {renderWin('mail', <MailWindow />)}
      {renderWin('system', <SystemProperties userName={userName} onOpenWindow={openWindow} />)}
      {renderWin('wei', <WEI />)}
      {renderWin('calculator', <Calculator />)}
      {renderWin('paint', <Paint />)}

      {uac.active && uac.windowId && (
        <>
          <div className="fixed inset-0 z-[200000] bg-black/45 backdrop-brightness-50" />
          <UACPopup appName={windowBlueprints[uac.windowId].title} description={`${windowBlueprints[uac.windowId].title} is flagged as a protected system tool and needs approval.`} onContinue={confirmUac} onCancel={() => setUac({ active: false, windowId: null })} />
        </>
      )}

      {showShutdown && <ShutdownDialog onCancel={() => setShowShutdown(false)} onShutDown={() => setIsOff(true)} />}
      {showRun && <RunDialog onClose={() => setShowRun(false)} onRun={handleRunCommand} />}

      <StartMenu isOpen={startOpen} onToggleWindow={openWindow} onOpenPath={openPathInExplorer} onShowShutdown={() => { setShowShutdown(true); setStartOpen(false); }} onShowRun={() => { setShowRun(true); setStartOpen(false); }} />
      <VistaTaskbar windows={windows} activeWindowId={activeWindowId} aeroColor={aeroColor} onToggleStart={() => setStartOpen((c) => !c)} onFocusWindow={focusWindow} onMinimizeWindow={minimizeWindow} onRestoreWindow={restoreWindow} onShowDesktop={showDesktop} />
      <RightClickMenu isOpen={contextMenu.isOpen} x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu((c) => ({ ...c, isOpen: false }))} onPersonalize={() => openWindow('controlpanel')} onTaskManager={() => openWindow('taskmanager')} desktopViewMode={desktopViewMode} setDesktopViewMode={setDesktopViewMode} />
    </main>
  );
}
