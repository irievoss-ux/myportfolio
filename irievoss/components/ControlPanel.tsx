"use client";

import { useState } from 'react';
import { useVistaProfile } from './providers/VistaProfileProvider';

interface ControlPanelProps {
  aeroColor: string;
  setAeroColor: (color: string) => void;
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

const avatarChoices = ['🌸', '🔥', '🎮', '🐱', '🌌', '💎', '⚡', '🦋'];
const aeroChoices = ['teal', 'ruby', 'emerald', 'graphite'];
const wallpaperChoices = ['aurora', 'meadow', 'twilight'];

export default function ControlPanel({ aeroColor, setAeroColor, wallpaper, setWallpaper }: ControlPanelProps) {
  const { userImage, userName, setUserImage, setUserName } = useVistaProfile();
  const [view, setView] = useState<'home' | 'profile' | 'appearance'>('home');

  return (
    <div className="flex h-full flex-col bg-white text-sm text-slate-800">
      <div className="border-b border-[#aec6dc] bg-[linear-gradient(180deg,#eff6fc_0%,#dfeaf6_100%)] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="text-[26px] font-light text-[#134d82]">{view === 'home' ? 'Control Panel Home' : view === 'profile' ? 'User Accounts' : 'Appearance and Personalization'}</div>
        <div className="mt-1 text-[11px] text-slate-500">Control Panel &gt; {view === 'home' ? 'Home' : view === 'profile' ? 'User Accounts' : 'Personalization'}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 shrink-0 border-r border-[#c2d4e3] bg-[linear-gradient(180deg,#f6fbff_0%,#edf5fb_100%)] p-4 text-[11px] text-[#1d5c90]">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tasks</div>
          <button type="button" onClick={() => setView('home')} className="mb-2 block hover:underline">Control Panel Home</button>
          <button type="button" onClick={() => setView('profile')} className="mb-2 block hover:underline">Change account picture</button>
          <button type="button" onClick={() => setView('appearance')} className="block hover:underline">Tune Aero appearance</button>
        </aside>

        <div className="flex-1 overflow-y-auto p-7">
          {view === 'home' && (
            <div className="grid gap-8">
              <CategoryCard title="System and Maintenance" description="Review computer details and administrative tools." icon="🛡️" />
              <button type="button" onClick={() => setView('profile')} className="text-left">
                <CategoryCard title="User Accounts" description="Change your display name and picture across the shell." icon="👤" />
              </button>
              <button type="button" onClick={() => setView('appearance')} className="text-left">
                <CategoryCard title="Appearance and Personalization" description="Retune glass color and wallpaper ambiance." icon="🎨" />
              </button>
            </div>
          )}

          {view === 'profile' && (
            <div className="max-w-xl space-y-6">
              <div className="flex items-center gap-4 rounded-[14px] border border-[#d3dfeb] bg-[linear-gradient(180deg,#fafdff_0%,#edf5fb_100%)] p-5">
                <div className="vista-avatar-panel flex h-20 w-20 items-center justify-center rounded-[18px] text-4xl">{userImage}</div>
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
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Account Picture</div>
                <div className="flex flex-wrap gap-3">
                  {avatarChoices.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setUserImage(avatar)}
                      className={`flex h-12 w-12 items-center justify-center rounded-[10px] border text-2xl ${userImage === avatar ? 'border-[#2a80dd] bg-[#dff0ff]' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'appearance' && (
            <div className="max-w-2xl space-y-8">
              <section>
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Window Color</div>
                <div className="flex gap-3">
                  {aeroChoices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setAeroColor(choice)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${aeroColor === choice ? 'bg-[#1676d2] text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Wallpaper</div>
                <div className="flex gap-3">
                  {wallpaperChoices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setWallpaper(choice)}
                      className={`rounded-[10px] border px-4 py-3 text-sm capitalize ${wallpaper === choice ? 'border-[#2a80dd] bg-[#e7f3ff]' : 'border-slate-200 bg-slate-50'}`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex gap-4 rounded-[14px] border border-transparent p-3 transition hover:border-[#c8ddf1] hover:bg-[#f7fbff]">
      <div className="text-4xl">{icon}</div>
      <div>
        <div className="font-semibold text-[#1b5e93]">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </div>
  );
}
