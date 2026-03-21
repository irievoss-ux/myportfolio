"use client";

import { useMemo, useState } from 'react';
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
import { createVistaFileSystem, getNodeAtPath, type VistaAppNode, type VistaImageNode, type VistaNode, type VistaPath, type VistaVideoNode } from '@/lib/vista/filesystem';
import { useVistaProfile } from './providers/VistaProfileProvider';

interface WindowState {
  title: string;
  icon: string;
  isOpen: boolean;
  z: number;
  requiresUac?: boolean;
  currentFile?: VistaNode | null;
}

const windowBlueprints: Record<string, Omit<WindowState, 'isOpen' | 'z' | 'currentFile'>> = {
  browser: { title: 'Internet Explorer', icon: '🌐' },
  computer: { title: 'Computer', icon: '🖥️' },
  media: { title: 'Windows Media Player', icon: '🎞️' },
  photo: { title: 'Windows Photo Gallery', icon: '🖼️' },
  notepad: { title: 'Notepad', icon: '📄' },
  minesweeper: { title: 'Games Explorer', icon: '🎮' },
  controlpanel: { title: 'Control Panel', icon: '⚙️', requiresUac: true },
  terminal: { title: 'Command Prompt', icon: '🖥️', requiresUac: true },
  taskmanager: { title: 'Task Manager', icon: '📊', requiresUac: true },
  mail: { title: 'Windows Mail', icon: '✉️' },
  system: { title: 'System', icon: '🧾', requiresUac: true },
  wei: { title: 'Performance Information and Tools', icon: '📈', requiresUac: true },
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
};

const desktopIcons = [
  { id: 'computer', label: 'Computer', icon: '🖥️', kind: 'window' as const },
  { id: 'browser', label: 'Network', icon: '🌐', kind: 'window' as const },
  { label: 'Games', icon: '🎮', kind: 'path' as const, path: ['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Games'] },
];

function createInitialWindows(): Record<string, WindowState> {
  return Object.fromEntries(
    Object.entries(windowBlueprints).map(([id, config], index) => [
      id,
      {
        ...config,
        isOpen: id === 'browser',
        z: index + 20,
        currentFile: null,
      },
    ]),
  );
}

export default function VistaShell() {
  const { accountFolder, userName } = useVistaProfile();
  const fileSystem = useMemo(() => createVistaFileSystem(accountFolder), [accountFolder]);
  const [isLocked, setIsLocked] = useState(true);
  const [isOff, setIsOff] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [wallpaper, setWallpaper] = useState('aurora');
  const [aeroColor, setAeroColor] = useState('teal');
  const [explorerPath, setExplorerPath] = useState<VistaPath>(['Computer']);
  const [windows, setWindows] = useState<Record<string, WindowState>>(() => createInitialWindows());
  const [activeWindowId, setActiveWindowId] = useState<string | null>('browser');
  const [nextZ, setNextZ] = useState(200);
  const [uac, setUac] = useState<{ active: boolean; windowId: string | null }>({ active: false, windowId: null });
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });

  const backgrounds: Record<string, string> = {
    aurora: 'radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 32%), linear-gradient(135deg, #083d65 0%, #116c9b 30%, #2e8dc1 58%, #59b0ca 74%, #86d58a 100%)',
    meadow: 'radial-gradient(circle at top, rgba(255,255,255,0.2), transparent 28%), linear-gradient(180deg, #7ac4ff 0%, #3f8fea 40%, #8fd36f 40%, #4d8c3e 100%)',
    twilight: 'radial-gradient(circle at top, rgba(255,255,255,0.14), transparent 30%), linear-gradient(135deg, #1d274c 0%, #344277 32%, #8c4f7b 70%, #1b1020 100%)',
  };

  const determineNextActive = (states: Record<string, WindowState>) => {
    const openWindows = Object.entries(states).filter(([, state]) => state.isOpen).sort((a, b) => b[1].z - a[1].z);
    return openWindows[0]?.[0] ?? null;
  };

  const focusWindow = (windowId: string) => {
    setWindows((current) => ({
      ...current,
      [windowId]: { ...current[windowId], z: nextZ },
    }));
    setActiveWindowId(windowId);
    setNextZ((value) => value + 1);
  };

  const openPathInExplorer = (path: VistaPath) => {
    setExplorerPath(path);
    openWindow('computer');
  };

  const openWindow = (windowId: string, options?: { currentFile?: VistaNode | null; bypassUac?: boolean }) => {
    const windowConfig = windows[windowId];
    if (!windowConfig) return;

    if (windowConfig.requiresUac && !windowConfig.isOpen && !options?.bypassUac) {
      setUac({ active: true, windowId });
      setStartOpen(false);
      return;
    }

    setWindows((current) => ({
      ...current,
      [windowId]: {
        ...current[windowId],
        isOpen: true,
        z: nextZ,
        currentFile: options?.currentFile ?? current[windowId].currentFile ?? null,
      },
    }));
    setActiveWindowId(windowId);
    setNextZ((value) => value + 1);
    setStartOpen(false);
  };

  const closeWindow = (windowId: string) => {
    setWindows((current) => {
      const nextState = {
        ...current,
        [windowId]: { ...current[windowId], isOpen: false },
      };
      setActiveWindowId(determineNextActive(nextState));
      return nextState;
    });
  };

  const handleOpenNode = (node: VistaNode) => {
    if (node.type === 'video') {
      openWindow('media', { currentFile: node });
      return;
    }

    if (node.type === 'image') {
      openWindow('photo', { currentFile: node });
      return;
    }

    if (node.type === 'text' || node.type === 'system') {
      openWindow('notepad', { currentFile: node });
      return;
    }

    if (node.type === 'app') {
      const appNode = node as VistaAppNode;
      if (appNode.launchPath) {
        openPathInExplorer(appNode.launchPath);
        return;
      }
      openWindow(appNode.windowId);
    }
  };

  const confirmUac = () => {
    if (!uac.windowId) return;
    const windowId = uac.windowId;
    setUac({ active: false, windowId: null });
    openWindow(windowId, { bypassUac: true });
  };

  const hintsNode = getNodeAtPath(fileSystem, ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Documents', 'HINTS.txt']);

  if (isOff) return <ShutdownScreen />;
  if (isLocked) return <LoginScreen onLogin={() => setIsLocked(false)} />;

  return (
    <main
      className="fixed inset-0 overflow-hidden select-none font-sans"
      style={{ background: backgrounds[wallpaper] }}
      onContextMenu={(event) => {
        event.preventDefault();
        if (uac.active) return;
        setContextMenu({ isOpen: true, x: event.clientX, y: event.clientY });
      }}
      onClick={() => {
        setContextMenu((current) => ({ ...current, isOpen: false }));
        setStartOpen(false);
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_40%,rgba(0,0,0,0.12))]" />
      <div className={`pointer-events-none absolute inset-0 transition duration-700 ${aeroColor === 'ruby' ? 'bg-red-500/12' : aeroColor === 'emerald' ? 'bg-emerald-400/12' : aeroColor === 'graphite' ? 'bg-slate-600/18' : 'bg-cyan-300/10'}`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_100%)]" />

      <VistaSidebar />

      <div className="relative z-10 flex h-full w-full items-start p-7 pb-20 pr-[210px]">
        <div className="grid gap-6">
          {desktopIcons.map((shortcut) => (
            <button
              key={shortcut.label}
              type="button"
              onDoubleClick={() => shortcut.kind === 'window' ? openWindow(shortcut.id) : openPathInExplorer(shortcut.path as VistaPath)}
              onClick={(event) => event.stopPropagation()}
              className="group flex w-22 flex-col items-center gap-2 rounded-[14px] px-2 py-1 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-white/15 bg-white/10 text-5xl shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-sm transition group-hover:scale-105">
                {shortcut.icon}
              </div>
              <span className="rounded px-1 text-[12px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{shortcut.label}</span>
            </button>
          ))}
        </div>
      </div>

      <RetroWindow id="computer" icon={windows.computer.icon} title={windows.computer.title} isOpen={windows.computer.isOpen} isActive={activeWindowId === 'computer'} zIndex={windows.computer.z} defaultX={windowDefaults.computer.x} defaultY={windowDefaults.computer.y} defaultW={windowDefaults.computer.w} defaultH={windowDefaults.computer.h} onClose={() => closeWindow('computer')} onFocus={() => focusWindow('computer')}>
        <FileExplorer path={explorerPath} setPath={setExplorerPath} onOpenNode={handleOpenNode} />
      </RetroWindow>

      <RetroWindow id="browser" icon={windows.browser.icon} title={windows.browser.title} isOpen={windows.browser.isOpen} isActive={activeWindowId === 'browser'} zIndex={windows.browser.z} defaultX={windowDefaults.browser.x} defaultY={windowDefaults.browser.y} defaultW={windowDefaults.browser.w} defaultH={windowDefaults.browser.h} onClose={() => closeWindow('browser')} onFocus={() => focusWindow('browser')}>
        <Netscape onOpenWindow={openWindow} onOpenPath={openPathInExplorer} />
      </RetroWindow>

      <RetroWindow id="media" icon={windows.media.icon} title={windows.media.currentFile?.name ? `${windows.media.currentFile.name} - Windows Media Player` : windows.media.title} isOpen={windows.media.isOpen} isActive={activeWindowId === 'media'} zIndex={windows.media.z} defaultX={windowDefaults.media.x} defaultY={windowDefaults.media.y} defaultW={windowDefaults.media.w} defaultH={windowDefaults.media.h} onClose={() => closeWindow('media')} onFocus={() => focusWindow('media')}>
        <MediaPlayer file={(windows.media.currentFile as VistaVideoNode | null) ?? null} />
      </RetroWindow>

      <RetroWindow id="photo" icon={windows.photo.icon} title={windows.photo.currentFile?.name ? `${windows.photo.currentFile.name} - Photo Gallery` : windows.photo.title} isOpen={windows.photo.isOpen} isActive={activeWindowId === 'photo'} zIndex={windows.photo.z} defaultX={windowDefaults.photo.x} defaultY={windowDefaults.photo.y} defaultW={windowDefaults.photo.w} defaultH={windowDefaults.photo.h} onClose={() => closeWindow('photo')} onFocus={() => focusWindow('photo')}>
        <PhotoViewer file={(windows.photo.currentFile as VistaImageNode | null) ?? null} />
      </RetroWindow>

      <RetroWindow id="notepad" icon={windows.notepad.icon} title={windows.notepad.currentFile?.name ? `${windows.notepad.currentFile.name} - Notepad` : windows.notepad.title} isOpen={windows.notepad.isOpen} isActive={activeWindowId === 'notepad'} zIndex={windows.notepad.z} defaultX={windowDefaults.notepad.x} defaultY={windowDefaults.notepad.y} defaultW={windowDefaults.notepad.w} defaultH={windowDefaults.notepad.h} onClose={() => closeWindow('notepad')} onFocus={() => focusWindow('notepad')}>
        <Notepad file={windows.notepad.currentFile ?? hintsNode} />
      </RetroWindow>

      <RetroWindow id="minesweeper" icon={windows.minesweeper.icon} title={windows.minesweeper.title} isOpen={windows.minesweeper.isOpen} isActive={activeWindowId === 'minesweeper'} zIndex={windows.minesweeper.z} defaultX={windowDefaults.minesweeper.x} defaultY={windowDefaults.minesweeper.y} defaultW={windowDefaults.minesweeper.w} defaultH={windowDefaults.minesweeper.h} onClose={() => closeWindow('minesweeper')} onFocus={() => focusWindow('minesweeper')}>
        <Minesweeper />
      </RetroWindow>

      <RetroWindow id="controlpanel" icon={windows.controlpanel.icon} title={windows.controlpanel.title} isOpen={windows.controlpanel.isOpen} isActive={activeWindowId === 'controlpanel'} zIndex={windows.controlpanel.z} defaultX={windowDefaults.controlpanel.x} defaultY={windowDefaults.controlpanel.y} defaultW={windowDefaults.controlpanel.w} defaultH={windowDefaults.controlpanel.h} onClose={() => closeWindow('controlpanel')} onFocus={() => focusWindow('controlpanel')}>
        <ControlPanel aeroColor={aeroColor} setAeroColor={setAeroColor} wallpaper={wallpaper} setWallpaper={setWallpaper} onOpenWindow={openWindow} onOpenPath={openPathInExplorer} />
      </RetroWindow>

      <RetroWindow id="terminal" icon={windows.terminal.icon} title={windows.terminal.title} isOpen={windows.terminal.isOpen} isActive={activeWindowId === 'terminal'} zIndex={windows.terminal.z} defaultX={windowDefaults.terminal.x} defaultY={windowDefaults.terminal.y} defaultW={windowDefaults.terminal.w} defaultH={windowDefaults.terminal.h} onClose={() => closeWindow('terminal')} onFocus={() => focusWindow('terminal')}>
        <Terminal onClose={() => closeWindow('terminal')} />
      </RetroWindow>

      <RetroWindow id="taskmanager" icon={windows.taskmanager.icon} title={windows.taskmanager.title} isOpen={windows.taskmanager.isOpen} isActive={activeWindowId === 'taskmanager'} zIndex={windows.taskmanager.z} defaultX={windowDefaults.taskmanager.x} defaultY={windowDefaults.taskmanager.y} defaultW={windowDefaults.taskmanager.w} defaultH={windowDefaults.taskmanager.h} onClose={() => closeWindow('taskmanager')} onFocus={() => focusWindow('taskmanager')}>
        <TaskManager windows={windows} onEndTask={(id: string) => closeWindow(id)} />
      </RetroWindow>

      <RetroWindow id="mail" icon={windows.mail.icon} title={windows.mail.title} isOpen={windows.mail.isOpen} isActive={activeWindowId === 'mail'} zIndex={windows.mail.z} defaultX={windowDefaults.mail.x} defaultY={windowDefaults.mail.y} defaultW={windowDefaults.mail.w} defaultH={windowDefaults.mail.h} onClose={() => closeWindow('mail')} onFocus={() => focusWindow('mail')}>
        <MailWindow />
      </RetroWindow>

      <RetroWindow id="system" icon={windows.system.icon} title={windows.system.title} isOpen={windows.system.isOpen} isActive={activeWindowId === 'system'} zIndex={windows.system.z} defaultX={windowDefaults.system.x} defaultY={windowDefaults.system.y} defaultW={windowDefaults.system.w} defaultH={windowDefaults.system.h} onClose={() => closeWindow('system')} onFocus={() => focusWindow('system')}>
        <SystemProperties userName={userName} onOpenWindow={openWindow} />
      </RetroWindow>

      <RetroWindow id="wei" icon={windows.wei.icon} title={windows.wei.title} isOpen={windows.wei.isOpen} isActive={activeWindowId === 'wei'} zIndex={windows.wei.z} defaultX={windowDefaults.wei.x} defaultY={windowDefaults.wei.y} defaultW={windowDefaults.wei.w} defaultH={windowDefaults.wei.h} onClose={() => closeWindow('wei')} onFocus={() => focusWindow('wei')}>
        <WEI />
      </RetroWindow>

      {uac.active && uac.windowId && (
        <>
          <div className="fixed inset-0 z-[200000] bg-black/45 backdrop-brightness-50" />
          <UACPopup appName={windowBlueprints[uac.windowId].title} description={`${windowBlueprints[uac.windowId].title} is flagged as a protected system tool and needs approval.`} onContinue={confirmUac} onCancel={() => setUac({ active: false, windowId: null })} />
        </>
      )}

      {showShutdown && <ShutdownDialog onCancel={() => setShowShutdown(false)} onShutDown={() => setIsOff(true)} />}

      <StartMenu isOpen={startOpen} onToggleWindow={openWindow} onOpenPath={openPathInExplorer} onShowShutdown={() => { setShowShutdown(true); setStartOpen(false); }} />

      <VistaTaskbar windows={windows} activeWindowId={activeWindowId} aeroColor={aeroColor} onToggleStart={() => setStartOpen((current) => !current)} onFocusWindow={focusWindow} />

      <RightClickMenu isOpen={contextMenu.isOpen} x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu((current) => ({ ...current, isOpen: false }))} onPersonalize={() => openWindow('controlpanel')} onTaskManager={() => openWindow('taskmanager')} />
    </main>
  );
}
