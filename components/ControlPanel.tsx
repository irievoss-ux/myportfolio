"use client";

import { useState } from 'react';
import { useVistaProfile } from './providers/VistaProfileProvider';
import VistaIcon from '@/components/VistaIconMap';
import { UserIcon } from '@/components/VistaIcons';

interface ControlPanelProps {
  aeroColor: string;
  setAeroColor: (color: string) => void;
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  onOpenWindow: (id: string) => void;
  onOpenPath: (path: string[]) => void;
}

type ControlPanelView = 'home' | 'profile' | 'appearance' | 'system' | 'network';

const avatarColorChoices = [
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500' },
  { id: 'green', label: 'Green', bg: 'bg-green-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
  { id: 'red', label: 'Red', bg: 'bg-red-500' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-500' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-500' },
  { id: 'pink', label: 'Pink', bg: 'bg-pink-500' },
  { id: 'slate', label: 'Slate', bg: 'bg-slate-500' },
];

const aeroChoices = ['teal', 'ruby', 'emerald', 'graphite', 'amber', 'violet'];
const wallpaperChoices = ['aurora', 'meadow', 'twilight', 'midnight', 'sunset'];

const aeroColors: Record<string, string> = {
  teal: 'bg-[#1a7a8a]',
  ruby: 'bg-[#8a1a2a]',
  emerald: 'bg-[#1a6a3a]',
  graphite: 'bg-[#4a5a6a]',
  amber: 'bg-[#8a6a1a]',
  violet: 'bg-[#5a1a8a]',
};

export default function ControlPanel({ aeroColor, setAeroColor, wallpaper, setWallpaper, onOpenWindow, onOpenPath }: ControlPanelProps) {
  const { userName, setUserName } = useVistaProfile();
  const [view, setView] = useState<ControlPanelView>('home');

  return (
    <div className="flex h-full flex-col bg-white text-sm text-slate-800">
      <div className="border-b border-[#aec6dc] bg-[linear-gradient(180deg,#eff6fc_0%,#dfeaf6_100%)] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="text-[26px] font-light text-[#134d82]">
          {view === 'home' && 'Control Panel Home'}
          {view === 'profile' && 'User Accounts'}
          {view === 'appearance' && 'Appearance and Personalization'}
          {view === 'system' && 'System and Maintenance'}
          {view === 'network' && 'Network and Internet'}
        </div>
        <div className="mt-1 text-[11px] text-slate-500">Control Panel &gt; {view === 'home' ? 'Home' : view}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 border-r border-[#c2d4e3] bg-[linear-gradient(180deg,#f6fbff_0%,#edf5fb_100%)] p-4 text-[11px] text-[#1d5c90]">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tasks</div>
          <button type="button" onClick={() => setView('home')} className="mb-2 block hover:underline">Control Panel Home</button>
          <button type="button" onClick={() => setView('profile')} className="mb-2 block hover:underline">Change account picture</button>
          <button type="button" onClick={() => setView('appearance')} className="mb-2 block hover:underline">Tune Aero appearance</button>
          <button type="button" onClick={() => setView('system')} className="mb-2 block hover:underline">Open system tools</button>
          <button type="button" onClick={() => setView('network')} className="block hover:underline">Browser and contact options</button>
        </aside>

        <div className="flex-1 overflow-y-auto p-7">
          {view === 'home' && (
            <div className="grid gap-8">
              <button type="button" onClick={() => setView('system')} className="text-left">
                <CategoryCard title="System and Maintenance" description="Open System Properties, Windows Experience Index, and admin tools." iconKey="system" />
              </button>
              <button type="button" onClick={() => setView('profile')} className="text-left">
                <CategoryCard title="User Accounts" description="Change your display name and picture across the shell." iconKey="user" />
              </button>
              <button type="button" onClick={() => setView('appearance')} className="text-left">
                <CategoryCard title="Appearance and Personalization" description="Retune glass color and wallpaper ambiance." iconKey="paint" />
              </button>
              <button type="button" onClick={() => setView('network')} className="text-left">
                <CategoryCard title="Network and Internet" description="Launch Internet Explorer and Windows Mail shortcuts." iconKey="ie" />
              </button>
            </div>
          )}

          {view === 'profile' && (
            <div className="max-w-xl space-y-6">
              <div className="flex items-center gap-4 rounded-[14px] border border-[#d3dfeb] bg-[linear-gradient(180deg,#fafdff_0%,#edf5fb_100%)] p-5">
                <div className="vista-avatar-panel flex h-20 w-20 items-center justify-center rounded-[18px]">
                  <UserIcon size={52} />
                </div>
                <div>
                  <div className="text-xl font-semibold">{userName}</div>
                  <div className="text-xs text-slate-500">Administrator</div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Display Name</label>
                <input value={userName} onChange={(event) => setUserName(event.target.value)} className="w-full rounded-[6px] border border-slate-300 px-3 py-2 outline-none focus:border-[#4d95ea]" />
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Account Color</div>
                <div className="flex flex-wrap gap-3">
                  {avatarColorChoices.map((color) => (
                    <button key={color.id} type="button" className={`flex h-12 w-12 items-center justify-center rounded-[10px] border ${color.bg} border-slate-200 hover:ring-2 hover:ring-blue-400`}>
                      <div className="h-6 w-6 rounded-full bg-white/30" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'appearance' && (
            <div className="max-w-2xl space-y-8">
              <section>
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Window Color</div>
                <div className="flex gap-3">
                  {aeroChoices.map((choice) => (
                    <button key={choice} type="button" onClick={() => setAeroColor(choice)}
                      className={`flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-xs font-semibold capitalize ${aeroColor === choice ? 'border-[#2a80dd] bg-[#dff0ff] text-[#1676d2]' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'}`}>
                      <div className={`h-4 w-4 rounded-full ${aeroColors[choice] || 'bg-teal-500'}`} />
                      {choice}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Desktop Background</div>
                <div className="flex gap-3">
                  {wallpaperChoices.map((choice) => (
                    <button key={choice} type="button" onClick={() => setWallpaper(choice)}
                      className={`rounded-[10px] border px-4 py-3 text-sm capitalize ${wallpaper === choice ? 'border-[#2a80dd] bg-[#e7f3ff] text-[#1676d2] font-semibold' : 'border-slate-200 bg-slate-50'}`}>
                      {choice}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {view === 'system' && (
            <div className="grid max-w-3xl gap-4 md:grid-cols-2">
              <ActionCard title="System Properties" description="Inspect the OS identity, hardware summary, and computer name." buttonLabel="Open System" onAction={() => onOpenWindow('system')} />
              <ActionCard title="Performance Information and Tools" description="Run the Vista performance assessment and review the base score." buttonLabel="Open Assessment" onAction={() => onOpenWindow('wei')} />
              <ActionCard title="Task Manager" description="Review currently running windows and end a task if needed." buttonLabel="Open Task Manager" onAction={() => onOpenWindow('taskmanager')} />
              <ActionCard title="System32" description="Browse protected executables and shell files inside Explorer." buttonLabel="Browse Files" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Windows', 'System32'])} />
            </div>
          )}

          {view === 'network' && (
            <div className="grid max-w-3xl gap-4 md:grid-cols-2">
              <ActionCard title="Internet Explorer" description="Open the portfolio browser with tabs, settings, and shortcuts." buttonLabel="Launch Browser" onAction={() => onOpenWindow('browser')} />
              <ActionCard title="Windows Mail" description="Compose a message through the embedded mail client." buttonLabel="Open Mail" onAction={() => onOpenWindow('mail')} />
              <ActionCard title="Documents" description="Jump to the documents library inside File Explorer." buttonLabel="Open Documents" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Documents'])} />
              <ActionCard title="Pictures" description="Browse local artwork and shell mockups in the Photo Gallery." buttonLabel="Open Pictures" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Pictures'])} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ title, description, iconKey }: { title: string; description: string; iconKey: string }) {
  return (
    <div className="flex gap-4 rounded-[14px] border border-transparent p-3 transition hover:border-[#c8ddf1] hover:bg-[#f7fbff]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#e8eef4_100%)]">
        <VistaIcon name={iconKey} size={32} />
      </div>
      <div>
        <div className="font-semibold text-[#1b5e93]">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, buttonLabel, onAction }: { title: string; description: string; buttonLabel: string; onAction: () => void }) {
  return (
    <div className="rounded-[14px] border border-[#d3dfeb] bg-white p-5 shadow-[0_8px_18px_rgba(20,70,120,0.06)]">
      <div className="text-base font-semibold text-[#164f83]">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <button type="button" onClick={onAction} className="mt-4 rounded-md border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-3 py-2 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        {buttonLabel}
      </button>
    </div>
  );
}
