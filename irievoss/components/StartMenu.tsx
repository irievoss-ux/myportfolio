"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useVistaProfile } from './providers/VistaProfileProvider';

interface StartMenuProps {
  isOpen: boolean;
  onToggleWindow: (id: string) => void;
  onOpenPath: (path: string[]) => void;
  onShowShutdown: () => void;
}

export default function StartMenu({ isOpen, onToggleWindow, onOpenPath, onShowShutdown }: StartMenuProps) {
  const { userImage, userName, accountFolder } = useVistaProfile();

  const leftApps = [
    { id: 'browser', label: 'Internet Explorer', icon: '🌐', sub: 'Portfolio browser' },
    { id: 'mail', label: 'Windows Mail', icon: '✉️', sub: 'Contact Irie directly' },
    { id: 'media', label: 'Windows Media Player', icon: '🎞️', sub: 'Play local media' },
    { id: 'system', label: 'System', icon: '🧾', sub: 'View OS details' },
    { id: 'terminal', label: 'Command Prompt', icon: '🖥️', sub: 'Elevated shell tools' },
    { id: 'minesweeper', label: 'Minesweeper', icon: '💣', sub: 'Classic game break' },
  ];

  const rightPane = [
    { label: userName, action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder]) },
    { label: 'Documents', action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Documents']) },
    { label: 'Pictures', action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Pictures']) },
    { label: 'Videos', action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Videos']) },
    { label: 'Games', action: () => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Games']) },
    { divider: true },
    { label: 'Computer', action: () => onToggleWindow('computer') },
    { label: 'Network', action: () => onToggleWindow('browser') },
    { label: 'Control Panel', action: () => onToggleWindow('controlpanel') },
    { label: 'Performance', action: () => onToggleWindow('wei') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-[46px] left-0 z-[140000] flex h-[560px] w-[460px] flex-col overflow-hidden rounded-tr-[18px] border-r border-t border-white/30 bg-[linear-gradient(180deg,rgba(34,54,85,0.9)_0%,rgba(7,11,18,0.96)_100%)] shadow-[0_26px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <div className="relative flex-1 overflow-hidden border-t border-white/10">
            <div className="absolute right-6 top-5 flex h-24 w-24 items-center justify-center rounded-[18px] border border-white/75 bg-[linear-gradient(180deg,#f9fdff_0%,#bfd9f6_100%)] text-5xl shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
              {userImage}
            </div>

            <div className="flex h-full">
              <div className="flex w-[58%] flex-col bg-[linear-gradient(180deg,#ffffff_0%,#eef5fc_100%)] p-2 pr-3 pt-4">
                {leftApps.map((app) => (
                  <button key={app.id} type="button" onClick={() => onToggleWindow(app.id)} className="flex items-center gap-3 rounded-[10px] border border-transparent px-3 py-2 text-left hover:border-[#8ab7e5] hover:bg-[linear-gradient(180deg,#eef8ff_0%,#d4e9fb_100%)]">
                    <span className="text-3xl">{app.icon}</span>
                    <span>
                      <span className="block text-xs font-semibold text-slate-800">{app.label}</span>
                      <span className="block text-[10px] text-slate-500">{app.sub}</span>
                    </span>
                  </button>
                ))}
                <div className="mt-auto rounded-[10px] border border-[#d7e6f4] bg-white/80 p-3 text-[11px] text-slate-600 shadow-inner">
                  Tip: Explore Documents, Pictures, and System32 to see the full portfolio shell.
                </div>
              </div>

              <div className="flex w-[42%] flex-col gap-1 px-3 pb-4 pt-24 text-white">
                {rightPane.map((item, index) => {
                  if ('divider' in item) {
                    return <div key={`divider-${index}`} className="mx-2 my-1 border-b border-white/12" />;
                  }

                  return (
                    <button key={item.label} type="button" onClick={item.action} className="rounded-[8px] px-3 py-2 text-left text-[11px] font-medium hover:bg-white/10">
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex h-14 items-center justify-between border-t border-white/10 bg-black/20 px-4">
            <div className="rounded-full border border-white/20 bg-white px-3 py-1 text-xs text-slate-500 shadow-[inset_0_1px_1px_rgba(0,0,0,0.12)]">
              Start Search
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onShowShutdown} className="rounded-full border border-black/50 bg-[linear-gradient(180deg,#ffbe63_0%,#c94916_100%)] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
                Power
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
