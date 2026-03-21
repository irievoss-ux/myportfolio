"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useVistaProfile } from './providers/VistaProfileProvider';
import VistaIcon from '@/components/VistaIconMap';
import { SearchIcon, UserIcon } from '@/components/VistaIcons';

interface StartMenuProps {
  isOpen: boolean;
  onToggleWindow: (id: string) => void;
  onOpenPath: (path: string[]) => void;
  onShowShutdown: () => void;
  onShowRun?: () => void;
}

// Pinned apps (top section, always visible)
const pinnedApps = [
  { id: 'browser', label: 'Internet', sub: 'Internet Explorer', iconKey: 'ie', isPrimary: true },
  { id: 'mail', label: 'E-mail', sub: 'Windows Mail', iconKey: 'mail', isPrimary: true },
];

// Recent/frequent programs (below separator)
const recentPrograms = [
  { id: 'notepad', label: 'Notepad', iconKey: 'notepad' },
  { id: 'calculator', label: 'Calculator', iconKey: 'calculator' },
  { id: 'paint', label: 'Paint', iconKey: 'paint' },
  { id: 'media', label: 'Windows Media Player', iconKey: 'mediaplayer' },
  { id: 'photo', label: 'Windows Photo Gallery', iconKey: 'photo' },
  { id: 'minesweeper', label: 'Minesweeper', iconKey: 'minesweeper' },
  { id: 'terminal', label: 'Command Prompt', iconKey: 'terminal' },
];

// All Programs folder structure
const allProgramsTree: { label: string; iconKey: string; id?: string; children?: { label: string; iconKey: string; id: string }[] }[] = [
  {
    label: 'Accessories', iconKey: 'folder-small', children: [
      { label: 'Calculator', iconKey: 'calculator', id: 'calculator' },
      { label: 'Command Prompt', iconKey: 'terminal', id: 'terminal' },
      { label: 'Notepad', iconKey: 'notepad', id: 'notepad' },
      { label: 'Paint', iconKey: 'paint', id: 'paint' },
      { label: 'Run', iconKey: 'run', id: '__run' },
    ]
  },
  {
    label: 'Games', iconKey: 'folder-small', children: [
      { label: 'Minesweeper', iconKey: 'minesweeper', id: 'minesweeper' },
    ]
  },
  {
    label: 'System Tools', iconKey: 'folder-small', children: [
      { label: 'Control Panel', iconKey: 'controlpanel', id: 'controlpanel' },
      { label: 'System Properties', iconKey: 'system', id: 'system' },
      { label: 'Task Manager', iconKey: 'taskmanager', id: 'taskmanager' },
      { label: 'Performance Tools', iconKey: 'wei', id: 'wei' },
    ]
  },
  { label: 'Internet Explorer', iconKey: 'ie', id: 'browser' },
  { label: 'Windows Mail', iconKey: 'mail', id: 'mail' },
  { label: 'Windows Media Player', iconKey: 'mediaplayer', id: 'media' },
  { label: 'Windows Photo Gallery', iconKey: 'photo', id: 'photo' },
];

export default function StartMenu({ isOpen, onToggleWindow, onOpenPath, onShowShutdown, onShowRun }: StartMenuProps) {
  const { userName, accountFolder } = useVistaProfile();
  const [search, setSearch] = useState('');
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  // Search across all apps
  const allFlat = useMemo(() => {
    const flat: { label: string; iconKey: string; id: string }[] = [];
    for (const item of allProgramsTree) {
      if (item.children) {
        for (const child of item.children) flat.push(child);
      } else if (item.id) {
        flat.push({ label: item.label, iconKey: item.iconKey, id: item.id });
      }
    }
    return flat;
  }, []);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allFlat.filter(a => a.label.toLowerCase().includes(q));
  }, [search, allFlat]);

  const handleAppClick = (id: string) => {
    if (id === '__run') { onShowRun?.(); return; }
    onToggleWindow(id);
  };

  // Right pane items — matches real Vista
  const rightPane: { label: string; iconKey: string; bold?: boolean; action: () => void }[] = [
    { label: userName, iconKey: 'user', bold: true, action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder]) },
    { label: 'Documents', iconKey: 'folder-documents', bold: true, action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Documents']) },
    { label: 'Pictures', iconKey: 'folder-pictures', bold: true, action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Pictures']) },
    { label: 'Music', iconKey: 'folder-small', bold: true, action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Music']) },
    { label: 'Games', iconKey: 'games', action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Games']) },
    { label: 'Search', iconKey: 'search', action: () => {} },
    { label: 'Recent Items', iconKey: 'folder-small', action: () => {} },
  ];

  const rightPaneLower: { label: string; iconKey: string; bold?: boolean; action: () => void }[] = [
    { label: 'Computer', iconKey: 'computer', bold: true, action: () => onToggleWindow('computer') },
    { label: 'Network', iconKey: 'ie', action: () => onToggleWindow('browser') },
    { label: 'Connect To', iconKey: 'network', action: () => {} },
    { label: 'Control Panel', iconKey: 'controlpanel', bold: true, action: () => onToggleWindow('controlpanel') },
    { label: 'Default Programs', iconKey: 'system', action: () => {} },
    { label: 'Help and Support', iconKey: 'system', action: () => {} },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: 14, scaleY: 0.97 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: 14, scaleY: 0.97 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{ transformOrigin: 'bottom left' }}
          className="fixed bottom-[46px] left-0 z-[140000] flex w-[420px] flex-col overflow-hidden rounded-t-[10px] border border-[rgba(120,160,200,0.65)] shadow-[0_-4px_30px_rgba(0,0,0,0.45),0_0_80px_rgba(0,120,200,0.12)] backdrop-blur-2xl"
        >
          {/* User banner */}
          <div className="relative flex items-center gap-3 bg-[linear-gradient(180deg,rgba(80,130,190,0.92)_0%,rgba(35,75,130,0.95)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
            <div className="flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-[6px] border-2 border-white/80 bg-[linear-gradient(180deg,#e8f2ff_0%,#b0cff0_100%)] shadow-[0_3px_12px_rgba(0,0,0,0.3)]">
              <UserIcon size={42} />
            </div>
            <div className="font-semibold text-white text-[15px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{userName}</div>
          </div>

          {/* Main body — two columns */}
          <div className="flex min-h-0" style={{ height: '418px' }}>
            {/* LEFT: white background, programs */}
            <div className="flex w-[56%] flex-col bg-white">
              {searchResults ? (
                /* Search results */
                <div className="flex-1 overflow-y-auto py-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Programs ({searchResults.length})</div>
                  {searchResults.map(a => (
                    <button key={a.id} type="button" onClick={() => handleAppClick(a.id)}
                      className="flex w-full items-center gap-3 px-3 py-[5px] text-left hover:bg-[#3399ff] hover:text-white text-slate-800 transition-colors">
                      <VistaIcon name={a.iconKey} size={20} />
                      <span className="text-[12px]">{a.label}</span>
                    </button>
                  ))}
                  {searchResults.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">No results found</div>}
                </div>
              ) : showAllPrograms ? (
                /* All Programs tree */
                <div className="flex-1 overflow-y-auto py-1">
                  {allProgramsTree.map(item => (
                    <div key={item.label}>
                      {item.children ? (
                        <>
                          <button type="button" onClick={() => setExpandedFolder(expandedFolder === item.label ? null : item.label)}
                            className="flex w-full items-center gap-3 px-3 py-[5px] text-left hover:bg-[#3399ff] hover:text-white text-slate-800 transition-colors">
                            <VistaIcon name={item.iconKey} size={20} />
                            <span className="flex-1 text-[12px] font-medium">{item.label}</span>
                            <span className="text-[10px] text-slate-400">{expandedFolder === item.label ? '▼' : '▶'}</span>
                          </button>
                          {expandedFolder === item.label && (
                            <div className="pl-5">
                              {item.children.map(child => (
                                <button key={child.id} type="button" onClick={() => handleAppClick(child.id)}
                                  className="flex w-full items-center gap-3 px-3 py-[4px] text-left hover:bg-[#3399ff] hover:text-white text-slate-700 transition-colors">
                                  <VistaIcon name={child.iconKey} size={18} />
                                  <span className="text-[12px]">{child.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <button type="button" onClick={() => item.id && handleAppClick(item.id)}
                          className="flex w-full items-center gap-3 px-3 py-[5px] text-left hover:bg-[#3399ff] hover:text-white text-slate-800 transition-colors">
                          <VistaIcon name={item.iconKey} size={20} />
                          <span className="text-[12px]">{item.label}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Default: pinned + recent */
                <div className="flex-1 overflow-y-auto py-1">
                  {/* Pinned Internet/Email */}
                  {pinnedApps.map(app => (
                    <button key={app.id} type="button" onClick={() => handleAppClick(app.id)}
                      className="flex w-full items-center gap-3 px-3 py-[6px] text-left hover:bg-[#3399ff] hover:text-white text-slate-800 group transition-colors">
                      <VistaIcon name={app.iconKey} size={28} />
                      <div>
                        <div className="text-[12px] font-bold">{app.label}</div>
                        <div className="text-[11px] text-slate-500 group-hover:text-white/80">{app.sub}</div>
                      </div>
                    </button>
                  ))}

                  {/* Separator */}
                  <div className="mx-3 my-1 border-b border-slate-200" />

                  {/* Recent programs */}
                  {recentPrograms.map(app => (
                    <button key={app.id} type="button" onClick={() => handleAppClick(app.id)}
                      className="flex w-full items-center gap-3 px-3 py-[5px] text-left hover:bg-[#3399ff] hover:text-white text-slate-800 transition-colors">
                      <VistaIcon name={app.iconKey} size={20} />
                      <span className="text-[12px]">{app.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* All Programs button */}
              <div className="border-t border-slate-200 py-1">
                <button type="button" onClick={() => { setShowAllPrograms(v => !v); setExpandedFolder(null); }}
                  className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-[#3399ff] hover:text-white text-slate-700 text-[12px] font-medium transition-colors">
                  {showAllPrograms ? (
                    <><span>◀</span><span>Back</span></>
                  ) : (
                    <><span>All Programs</span><span>▶</span></>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: dark blue-grey background, folders & system links */}
            <div className="flex w-[44%] flex-col bg-[linear-gradient(180deg,rgba(190,210,230,0.98)_0%,rgba(165,190,215,0.98)_100%)] border-l border-[rgba(200,215,230,0.8)]">
              <div className="flex-1 overflow-y-auto py-2">
                {rightPane.map(item => (
                  <button key={item.label} type="button" onClick={item.action}
                    className="flex w-full items-center gap-2.5 px-3 py-[5px] text-left hover:bg-[#3399ff] hover:text-white text-[#1f3d5c] transition-colors">
                    <VistaIcon name={item.iconKey} size={20} />
                    <span className={`text-[12px] ${item.bold ? 'font-bold' : ''}`}>{item.label}</span>
                  </button>
                ))}

                <div className="mx-3 my-1 border-b border-[rgba(120,145,170,0.35)]" />

                {rightPaneLower.map(item => (
                  <button key={item.label} type="button" onClick={item.action}
                    className="flex w-full items-center gap-2.5 px-3 py-[5px] text-left hover:bg-[#3399ff] hover:text-white text-[#1f3d5c] transition-colors">
                    <VistaIcon name={item.iconKey} size={20} />
                    <span className={`text-[12px] ${item.bold ? 'font-bold' : ''}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer — search bar + power buttons */}
          <div className="flex items-center gap-2 bg-[linear-gradient(180deg,rgba(190,210,230,0.95)_0%,rgba(170,195,220,0.98)_100%)] border-t border-[rgba(200,215,230,0.6)] px-3 py-2">
            {/* Search */}
            <div className="relative flex-1">
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Start Search"
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded-[4px] border border-[#7b9bbc] bg-white py-1.5 pl-3 pr-8 text-[12px] text-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] outline-none focus:border-[#3f8cf4] placeholder:text-slate-400" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <SearchIcon size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Power buttons row — lock, arrows, shutdown */}
            <div className="flex items-center gap-0.5">
              {/* Lock */}
              <button type="button" className="flex h-[28px] w-[28px] items-center justify-center rounded-[3px] border border-[#8ba8c4] bg-[linear-gradient(180deg,#f0f4f8_0%,#d4dfe8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:brightness-105" title="Lock">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#4a6a8a" strokeWidth="1.5">
                  <rect x="3" y="7" width="10" height="7" rx="1" /><path d="M5 7V5a3 3 0 016 0v2" />
                </svg>
              </button>
              {/* Arrow / more options */}
              <button type="button" onClick={onShowShutdown}
                className="flex h-[28px] items-center gap-1 rounded-[3px] border border-[#a95a2a] bg-[linear-gradient(180deg,#f8c576_0%,#d4842a_100%)] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110" title="Shut Down">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 2v5" /><path d="M4.5 4A5.5 5.5 0 108 2" />
                </svg>
                <span className="text-[10px] text-white/90 font-semibold drop-shadow-sm">▶</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
