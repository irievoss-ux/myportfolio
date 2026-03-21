"use client";

import { useMemo, useState } from 'react';

interface NetscapeProps {
  onOpenWindow: (id: string) => void;
  onOpenPath: (path: string[]) => void;
}

type BrowserPageId = 'home' | 'portfolio' | 'broadcast' | 'contact' | 'files';

interface BrowserPage {
  id: BrowserPageId;
  title: string;
  url: string;
  description: string;
}

const browserPages: BrowserPage[] = [
  { id: 'home', title: 'IrieOS Home', url: 'http://irievista/start', description: 'Welcome hub for the portfolio OS.' },
  { id: 'portfolio', title: 'Portfolio', url: 'http://irievista/portfolio', description: 'Selected work, strengths, and project snapshots.' },
  { id: 'broadcast', title: 'Broadcasting', url: 'http://irievista/broadcast', description: 'Streaming, hosting, and community work.' },
  { id: 'contact', title: 'Contact', url: 'http://irievista/contact', description: 'Quick ways to reach out.' },
  { id: 'files', title: 'Files', url: 'http://irievista/files', description: 'Shortcuts into the shell file system.' },
];

interface BrowserTab {
  id: number;
  pageId: BrowserPageId;
  history: BrowserPageId[];
  historyIndex: number;
}

const createTab = (pageId: BrowserPageId, id: number): BrowserTab => ({
  id,
  pageId,
  history: [pageId],
  historyIndex: 0,
});

export default function Netscape({ onOpenWindow, onOpenPath }: NetscapeProps) {
  const [tabs, setTabs] = useState<BrowserTab[]>([createTab('home', 1)]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [homepage, setHomepage] = useState<BrowserPageId>('home');
  const [textScale, setTextScale] = useState(100);
  const [status, setStatus] = useState('Ready');
  const [nextTabId, setNextTabId] = useState(2);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const activePage = browserPages.find((page) => page.id === activeTab.pageId) ?? browserPages[0];

  const filteredPages = useMemo(() => {
    if (!search.trim()) return browserPages;
    return browserPages.filter((page) => page.title.toLowerCase().includes(search.toLowerCase()) || page.description.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const mutateActiveTab = (callback: (tab: BrowserTab) => BrowserTab) => {
    setTabs((current) => current.map((tab) => (tab.id === activeTabId ? callback(tab) : tab)));
  };

  const navigateTo = (pageId: BrowserPageId) => {
    setStatus('Loading...');
    mutateActiveTab((tab) => {
      const nextHistory = [...tab.history.slice(0, tab.historyIndex + 1), pageId];
      return {
        ...tab,
        pageId,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
    window.setTimeout(() => setStatus(`Done • ${pageId}`), 250);
  };

  const goHistory = (direction: -1 | 1) => {
    mutateActiveTab((tab) => {
      const nextIndex = tab.historyIndex + direction;
      if (nextIndex < 0 || nextIndex >= tab.history.length) return tab;
      return {
        ...tab,
        historyIndex: nextIndex,
        pageId: tab.history[nextIndex],
      };
    });
  };

  const openNewTab = (pageId: BrowserPageId = homepage) => {
    const freshTab = createTab(pageId, nextTabId);
    setTabs((current) => [...current, freshTab]);
    setActiveTabId(nextTabId);
    setNextTabId((value) => value + 1);
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) {
      setTabs([createTab(homepage, nextTabId)]);
      setActiveTabId(nextTabId);
      setNextTabId((value) => value + 1);
      return;
    }

    const remaining = tabs.filter((tab) => tab.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const launchSearch = () => {
    const direct = browserPages.find((page) => page.title.toLowerCase().includes(search.toLowerCase()));
    if (direct) {
      navigateTo(direct.id);
      return;
    }
    setStatus(`No exact match for “${search}”`);
  };

  const buttonClass = 'rounded-md border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-2 py-1 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:brightness-105';

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white font-sans text-sm text-slate-800">
      <div className="border-b border-[#a2c6e0] bg-[linear-gradient(180deg,#f4fbff_0%,#d9ebf7_100%)] px-2 pt-2 shadow-sm">
        <div className="mb-2 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const page = browserPages.find((entry) => entry.id === tab.pageId) ?? browserPages[0];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 rounded-t-[8px] border border-b-0 px-3 py-1 text-[11px] ${activeTabId === tab.id ? 'bg-white border-[#a2c6e0]' : 'bg-white/70 border-transparent hover:bg-white/90'}`}
              >
                <span>🌍</span>
                <span>{page.title}</span>
                <span onClick={(event) => { event.stopPropagation(); closeTab(tab.id); }} className="rounded px-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</span>
              </button>
            );
          })}
          <button type="button" onClick={() => openNewTab()} className={`${buttonClass} ml-1`}>＋ New Tab</button>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <div className="flex gap-1">
            <button type="button" onClick={() => goHistory(-1)} className={`${buttonClass} w-8`}>◀</button>
            <button type="button" onClick={() => goHistory(1)} className={`${buttonClass} w-8`}>▶</button>
            <button type="button" onClick={() => navigateTo(activePage.id)} className={`${buttonClass} w-8`}>↻</button>
            <button type="button" onClick={() => navigateTo(homepage)} className={`${buttonClass}`}>Home</button>
          </div>

          <div className="flex h-8 flex-1 items-center rounded-[8px] border border-[#8da9c2] bg-white px-3 shadow-inner">
            <span className="mr-2 text-xs text-green-700">🔒</span>
            <input
              value={activePage.url}
              readOnly
              className="flex-1 bg-transparent text-xs font-medium outline-none"
            />
          </div>

          <div className="flex h-8 w-56 items-center rounded-[8px] border border-[#8da9c2] bg-white px-2 shadow-inner">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && launchSearch()}
              placeholder="Search portfolio pages"
              className="flex-1 bg-transparent text-xs outline-none"
            />
            <button type="button" onClick={launchSearch} className="text-sm text-blue-600">🔍</button>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2 text-[11px] text-[#1e5e93]">
          {browserPages.map((page) => (
            <button key={page.id} type="button" onClick={() => navigateTo(page.id)} className="rounded px-2 py-1 hover:bg-white/80 hover:text-blue-800">
              {page.title}
            </button>
          ))}
          <button type="button" onClick={() => setSettingsOpen((value) => !value)} className="ml-auto rounded px-2 py-1 hover:bg-white/80">⚙ Internet Options</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="w-52 shrink-0 border-r border-[#d6e5f5] bg-[#f5f9fd] p-4 text-[12px]">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Favorites Center</div>
          <div className="space-y-1">
            {filteredPages.map((page) => (
              <button key={page.id} type="button" onClick={() => navigateTo(page.id)} className="block w-full rounded px-2 py-1 text-left hover:bg-blue-50">
                <div className="font-semibold text-[#205f93]">{page.title}</div>
                <div className="text-[10px] text-slate-500">{page.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-[#d6e5f5] pt-4">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Quick Tasks</div>
            <button type="button" onClick={() => onOpenWindow('mail')} className="mb-1 block w-full rounded px-2 py-1 text-left hover:bg-blue-50">Open Windows Mail</button>
            <button type="button" onClick={() => onOpenWindow('media')} className="mb-1 block w-full rounded px-2 py-1 text-left hover:bg-blue-50">Launch Media Player</button>
            <button type="button" onClick={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Documents'])} className="mb-1 block w-full rounded px-2 py-1 text-left hover:bg-blue-50">Open Documents</button>
            <button type="button" onClick={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Pictures'])} className="block w-full rounded px-2 py-1 text-left hover:bg-blue-50">Browse Pictures</button>
          </div>
        </aside>

        <div className="relative min-w-0 flex-1 overflow-y-auto bg-white" style={{ fontSize: `${textScale}%` }}>
          {activePage.id === 'home' && <HomePage onOpenWindow={onOpenWindow} onOpenPath={onOpenPath} onNavigate={navigateTo} />}
          {activePage.id === 'portfolio' && <PortfolioPage />}
          {activePage.id === 'broadcast' && <BroadcastPage onOpenWindow={onOpenWindow} />}
          {activePage.id === 'contact' && <ContactPage onOpenWindow={onOpenWindow} />}
          {activePage.id === 'files' && <FilesPage onOpenPath={onOpenPath} onOpenWindow={onOpenWindow} />}
        </div>

        {settingsOpen && (
          <aside className="w-64 shrink-0 border-l border-[#d6e5f5] bg-[linear-gradient(180deg,#fefefe_0%,#edf5fb_100%)] p-4 text-[12px]">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Internet Options</div>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-600">Homepage</span>
                <select value={homepage} onChange={(event) => setHomepage(event.target.value as BrowserPageId)} className="w-full rounded border border-slate-300 px-2 py-1">
                  {browserPages.map((page) => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-slate-600">Text Size</span>
                <input type="range" min="85" max="120" step="5" value={textScale} onChange={(event) => setTextScale(Number(event.target.value))} className="w-full" />
                <div className="mt-1 text-[10px] text-slate-500">{textScale}%</div>
              </label>

              <button type="button" onClick={() => openNewTab(homepage)} className={`${buttonClass} w-full`}>Open homepage in new tab</button>
              <button type="button" onClick={() => setSettingsOpen(false)} className={`${buttonClass} w-full`}>Close settings</button>
            </div>
          </aside>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#a2c6e0] bg-[#ebf3f9] px-3 py-1 text-[10px] text-slate-500">
        <div>{status}</div>
        <div className="flex items-center gap-4">
          <span>🌐 Internet</span>
          <span>Protected Mode: On</span>
          <span>{textScale}%</span>
        </div>
      </div>
    </div>
  );
}

function Surface({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto my-6 max-w-4xl rounded-[18px] border border-[#d9e6f2] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)] p-6 shadow-[0_12px_30px_rgba(35,74,114,0.08)]">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{eyebrow}</div>
      <h1 className="mt-2 text-3xl font-light text-[#164f83]">{title}</h1>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function HomePage({ onOpenWindow, onOpenPath, onNavigate }: NetscapeProps & { onNavigate: (pageId: BrowserPageId) => void }) {
  return (
    <Surface title="Welcome to IrieOS" eyebrow="Vista Portfolio Hub">
      <p className="max-w-3xl text-slate-600">
        This browser now behaves like a guided portal into the portfolio: launch apps, open folders, and explore projects without leaving the shell.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Tile title="Projects" desc="See selected work and strengths." actionLabel="Open Portfolio" onAction={() => onNavigate('portfolio')} />
        <Tile title="Contact" desc="Open Windows Mail and send a note." actionLabel="Open Mail" onAction={() => onOpenWindow('mail')} />
        <Tile title="Media" desc="Preview local clips in WMP11." actionLabel="Launch Player" onAction={() => onOpenWindow('media')} />
        <Tile title="Files" desc="Jump to Documents inside Explorer." actionLabel="Open Documents" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Documents'])} />
      </div>
    </Surface>
  );
}

function PortfolioPage() {
  return (
    <Surface title="Selected Work" eyebrow="Portfolio">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Broadcast Direction', 'Live production pacing, desk hosting, and audience energy orchestration.'],
          ['Interface Systems', 'Designing polished front-end experiences with strong visual identity and reliability.'],
          ['Community Strategy', 'Building spaces that reward participation, clarity, and momentum.'],
          ['Creative Packaging', 'Turning streams, events, and projects into memorable artifacts.'],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-[14px] border border-[#d9e6f2] bg-white p-4">
            <div className="text-lg font-semibold text-[#164f83]">{title}</div>
            <p className="mt-2 text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function BroadcastPage({ onOpenWindow }: { onOpenWindow: (id: string) => void }) {
  return (
    <Surface title="Broadcast & Presence" eyebrow="Live Work">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[14px] border border-[#d9e6f2] bg-white p-4 text-slate-600">
          Irie brings a host-first, audience-aware approach to streams and events: energy when it matters, restraint when clarity matters more, and a constant eye on pacing.
        </div>
        <div className="rounded-[14px] border border-[#d9e6f2] bg-white p-4">
          <div className="text-sm font-semibold text-[#164f83]">Want the full contact flow?</div>
          <button type="button" onClick={() => onOpenWindow('mail')} className="mt-4 rounded-md border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-3 py-2 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            Open Windows Mail
          </button>
        </div>
      </div>
    </Surface>
  );
}

function ContactPage({ onOpenWindow }: { onOpenWindow: (id: string) => void }) {
  return (
    <Surface title="Contact Irie" eyebrow="Reach Out">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[14px] border border-[#d9e6f2] bg-white p-4 text-slate-600">
          Best path: open Windows Mail inside the shell and send a direct note. Replies route back through the configured contact inbox.
        </div>
        <div className="rounded-[14px] border border-[#d9e6f2] bg-white p-4">
          <div className="text-sm font-semibold text-[#164f83]">Quick action</div>
          <button type="button" onClick={() => onOpenWindow('mail')} className="mt-4 rounded-md border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-3 py-2 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            Compose Mail
          </button>
        </div>
      </div>
    </Surface>
  );
}

function FilesPage({ onOpenPath, onOpenWindow }: NetscapeProps) {
  return (
    <Surface title="Shell Shortcuts" eyebrow="File System">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Tile title="Documents" desc="Profile notes, contact info, and easter eggs." actionLabel="Open" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Documents'])} />
        <Tile title="Pictures" desc="Local image files for the Photo Gallery." actionLabel="Browse" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Users', 'Irie', 'Pictures'])} />
        <Tile title="System32" desc="Launch protected tools like cmd.exe and Task Manager." actionLabel="Open" onAction={() => onOpenPath(['Computer', 'OSDisk (C:)', 'Windows', 'System32'])} />
        <Tile title="Media Player" desc="Open WMP11 directly." actionLabel="Launch" onAction={() => onOpenWindow('media')} />
        <Tile title="System" desc="View hardware and OS identity." actionLabel="Open" onAction={() => onOpenWindow('system')} />
        <Tile title="Performance" desc="Run the Vista experience assessment." actionLabel="Assess" onAction={() => onOpenWindow('wei')} />
      </div>
    </Surface>
  );
}

function Tile({ title, desc, actionLabel, onAction }: { title: string; desc: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="rounded-[14px] border border-[#d9e6f2] bg-white p-4 shadow-[0_6px_14px_rgba(35,74,114,0.05)]">
      <div className="text-base font-semibold text-[#164f83]">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
      <button type="button" onClick={onAction} className="mt-4 rounded-md border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-3 py-2 text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        {actionLabel}
      </button>
    </div>
  );
}
