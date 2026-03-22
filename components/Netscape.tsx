"use client";

import { useState, useRef, useCallback } from 'react';

interface NetscapeProps {
  onOpenWindow: (id: string) => void;
  onOpenPath: (path: string[]) => void;
}

interface FavoriteLink {
  label: string;
  url: string;
}

const FAVORITES: FavoriteLink[] = [
  { label: 'TFT', url: 'https://www.metatft.com/player/na/irievoss-uwu' },
  { label: 'WIKI', url: 'https://www.wikipedia.org/' },
  { label: 'TOURNEYS', url: 'https://www.hitnmis.gg/' },
];

const DEFAULT_HOME = 'https://www.metatft.com/player/na/irievoss-uwu';

interface BrowserTab {
  id: number;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  loadError: boolean;
}

function createTab(url: string, id: number): BrowserTab {
  return {
    id,
    url,
    title: urlToTitle(url),
    history: [url],
    historyIndex: 0,
    loadError: false,
  };
}

function urlToTitle(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function ensureProtocol(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return DEFAULT_HOME;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // If it looks like a domain (contains a dot), add https
  if (trimmed.includes('.')) return `https://${trimmed}`;
  // Otherwise treat as a search
  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(trimmed)}`;
}

export default function Netscape({ }: NetscapeProps) {
  const [tabs, setTabs] = useState<BrowserTab[]>([createTab(DEFAULT_HOME, 1)]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);
  const [addressBarValue, setAddressBarValue] = useState(DEFAULT_HOME);
  const [status, setStatus] = useState('Ready');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const updateActiveTab = useCallback((updater: (tab: BrowserTab) => BrowserTab) => {
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? updater(t) : t)));
  }, [activeTabId]);

  const navigateTo = useCallback((url: string) => {
    const fullUrl = ensureProtocol(url);
    setStatus('Loading...');
    setAddressBarValue(fullUrl);
    updateActiveTab((tab) => {
      const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), fullUrl];
      return {
        ...tab,
        url: fullUrl,
        title: urlToTitle(fullUrl),
        history: newHistory,
        historyIndex: newHistory.length - 1,
        loadError: false,
      };
    });
    setTimeout(() => setStatus('Done'), 800);
  }, [updateActiveTab]);

  const goBack = () => {
    if (activeTab.historyIndex <= 0) return;
    updateActiveTab((tab) => {
      const newIndex = tab.historyIndex - 1;
      const url = tab.history[newIndex];
      setAddressBarValue(url);
      setStatus('Loading...');
      setTimeout(() => setStatus('Done'), 400);
      return { ...tab, historyIndex: newIndex, url, title: urlToTitle(url), loadError: false };
    });
  };

  const goForward = () => {
    if (activeTab.historyIndex >= activeTab.history.length - 1) return;
    updateActiveTab((tab) => {
      const newIndex = tab.historyIndex + 1;
      const url = tab.history[newIndex];
      setAddressBarValue(url);
      setStatus('Loading...');
      setTimeout(() => setStatus('Done'), 400);
      return { ...tab, historyIndex: newIndex, url, title: urlToTitle(url), loadError: false };
    });
  };

  const refresh = () => {
    setStatus('Refreshing...');
    updateActiveTab((tab) => ({ ...tab, loadError: false }));
    if (iframeRef.current) {
      try { iframeRef.current.src = activeTab.url; } catch { /* ignore */ }
    }
    setTimeout(() => setStatus('Done'), 600);
  };

  const goHome = () => navigateTo(DEFAULT_HOME);

  const openNewTab = (url: string = DEFAULT_HOME) => {
    const tab = createTab(url, nextTabId);
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(nextTabId);
    setAddressBarValue(url);
    setNextTabId((v) => v + 1);
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) {
      const fresh = createTab(DEFAULT_HOME, nextTabId);
      setTabs([fresh]);
      setActiveTabId(nextTabId);
      setAddressBarValue(DEFAULT_HOME);
      setNextTabId((v) => v + 1);
      return;
    }
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      const last = remaining[remaining.length - 1];
      setActiveTabId(last.id);
      setAddressBarValue(last.url);
    }
  };

  const switchTab = (tabId: number) => {
    setActiveTabId(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) setAddressBarValue(tab.url);
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateTo(addressBarValue);
    }
  };

  const handleIframeError = () => {
    updateActiveTab((tab) => ({ ...tab, loadError: true }));
    setStatus('Page cannot be displayed in frame');
  };

  const btnClass = 'rounded-[3px] border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-2 py-1 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:brightness-105 active:brightness-95 disabled:opacity-40';

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white font-sans text-sm text-slate-800">
      {/* Tab bar */}
      <div className="border-b border-[#a2c6e0] bg-[linear-gradient(180deg,#f4fbff_0%,#d9ebf7_100%)] px-2 pt-2 shadow-sm">
        <div className="mb-1.5 flex items-center gap-0.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`group flex max-w-[180px] items-center gap-1.5 rounded-t-[6px] border border-b-0 px-2.5 py-[5px] text-[11px] transition-colors ${
                activeTabId === tab.id
                  ? 'bg-white border-[#a2c6e0] text-slate-800'
                  : 'bg-[#e4eef7] border-transparent text-slate-600 hover:bg-[#edf4fb]'
              }`}
            >
              <span className="text-[10px]">🌐</span>
              <span className="truncate">{tab.title}</span>
              <span
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="ml-1 rounded px-0.5 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
              >
                ✕
              </span>
            </button>
          ))}
          <button type="button" onClick={() => openNewTab()} className={`${btnClass} ml-1 text-[10px]`} title="New Tab">
            ＋
          </button>
        </div>

        {/* Navigation bar */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <button type="button" onClick={goBack} disabled={activeTab.historyIndex <= 0} className={`${btnClass} w-7 text-center`} title="Back">◀</button>
            <button type="button" onClick={goForward} disabled={activeTab.historyIndex >= activeTab.history.length - 1} className={`${btnClass} w-7 text-center`} title="Forward">▶</button>
            <button type="button" onClick={refresh} className={`${btnClass} w-7 text-center`} title="Refresh">↻</button>
            <button type="button" onClick={goHome} className={`${btnClass}`} title="Home">🏠</button>
          </div>

          {/* Address bar */}
          <div className="flex h-[26px] flex-1 items-center rounded-[4px] border border-[#8da9c2] bg-white px-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
            <span className="mr-1.5 text-[10px] text-green-600">🔒</span>
            <input
              value={addressBarValue}
              onChange={(e) => setAddressBarValue(e.target.value)}
              onKeyDown={handleAddressKeyDown}
              className="flex-1 bg-transparent text-[12px] outline-none"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => navigateTo(addressBarValue)}
              className="ml-1 text-[12px] text-blue-600 hover:text-blue-800"
              title="Go"
            >
              →
            </button>
          </div>
        </div>

        {/* Favorites bar */}
        <div className="mb-1.5 flex items-center gap-1 border-t border-[#d3e3f0] pt-1 text-[11px]">
          <span className="mr-1 text-[10px] text-slate-400">★ Favorites</span>
          <span className="mx-1 text-slate-300">|</span>
          {FAVORITES.map((fav) => (
            <button
              key={fav.label}
              type="button"
              onClick={() => navigateTo(fav.url)}
              className="flex items-center gap-1 rounded-[3px] px-2 py-[2px] text-[#1e5e93] hover:bg-[#dcebf7] hover:text-blue-800 transition-colors"
            >
              <span className="text-[10px]">🌐</span>
              {fav.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content — iframe */}
      <div className="relative flex-1 bg-white">
        {activeTab.loadError ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="text-4xl">⚠️</div>
            <div className="text-lg font-semibold text-[#164f83]">This page can&apos;t be displayed in a frame</div>
            <p className="max-w-md text-sm text-slate-600">
              The website <strong>{activeTab.url}</strong> has security settings that prevent it from being displayed here.
            </p>
            <a
              href={activeTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[4px] border border-[#95b7d9] bg-[linear-gradient(180deg,#ffffff_0%,#dfeaf6_100%)] px-4 py-2 text-sm text-[#1e5e93] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:brightness-105"
            >
              Open in a new window ↗
            </a>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            key={`${activeTab.id}-${activeTab.url}`}
            src={activeTab.url}
            title={activeTab.title}
            className="h-full w-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
            onError={handleIframeError}
          />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-[#a2c6e0] bg-[#ebf3f9] px-3 py-[3px] text-[10px] text-slate-500">
        <div>{status}</div>
        <div className="flex items-center gap-4">
          <span>🌐 Internet</span>
          <span>Protected Mode: On</span>
        </div>
      </div>
    </div>
  );
}
