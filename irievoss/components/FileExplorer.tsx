"use client";

import { useMemo, useState } from 'react';
import { createVistaFileSystem, getChildrenAtPath, getNodeAtPath, pathToWindowsString, type VistaNode, type VistaPath } from '@/lib/vista/filesystem';
import { useVistaProfile } from './providers/VistaProfileProvider';
import VistaIcon, { getFileTypeIcon } from '@/components/VistaIconMap';
import { BackArrowIcon, ForwardArrowIcon, SearchIcon } from '@/components/VistaIcons';

interface FileExplorerProps {
  path: VistaPath;
  setPath: (path: VistaPath) => void;
  onOpenNode: (node: VistaNode, parentPath: VistaPath) => void;
}

type ViewMode = 'icons' | 'list' | 'details';

export default function FileExplorer({ path, setPath, onOpenNode }: FileExplorerProps) {
  const { accountFolder } = useVistaProfile();
  const fileSystem = useMemo(() => createVistaFileSystem(accountFolder), [accountFolder]);
  const [selectedItem, setSelectedItem] = useState<VistaNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('icons');
  const [searchFilter, setSearchFilter] = useState('');

  const currentNode = getNodeAtPath(fileSystem, path);
  const allItems = getChildrenAtPath(fileSystem, path);
  const items = searchFilter.trim()
    ? allItems.filter((i) => i.name.toLowerCase().includes(searchFilter.toLowerCase()))
    : allItems;

  const openItem = (item: VistaNode) => {
    if ('children' in item) { setPath([...path, item.name]); setSelectedItem(null); setSearchFilter(''); return; }
    onOpenNode(item, path);
  };

  const quickLinks: VistaPath[] = [
    ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Documents'],
    ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Pictures'],
    ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Videos'],
    ['Computer', 'OSDisk (C:)', 'Windows', 'System32'],
    ['Computer', 'Data (D:)', 'Captured Footage'],
  ];

  const getItemIconKey = (item: VistaNode) => {
    if (item.name === 'Computer') return 'computer';
    if (item.name.includes('OSDisk')) return 'drive';
    if (item.name.includes('Data')) return 'drive';
    if (item.name === 'Documents') return 'folder-documents';
    if (item.name === 'Pictures') return 'folder-pictures';
    if (item.name === 'Videos') return 'folder-videos';
    if (item.name === 'Games') return 'games';
    if (item.name === 'Program Files') return 'folder-small';
    return getFileTypeIcon(item.type, item.name);
  };

  const totalSize = items.reduce((a, i) => {
    if ('size' in i && i.size) { const m = i.size.match(/([\d.]+)/); return a + (m ? parseFloat(m[1]) : 0); }
    return a;
  }, 0);

  return (
    <div className="flex h-full flex-col bg-white text-sm text-slate-800" onClick={() => setSelectedItem(null)}>
      {/* Address Bar */}
      <div className="border-b border-[#b5cade] bg-[linear-gradient(180deg,#f4f9fe_0%,#ddeaf5_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-2">
          <button type="button" onClick={(e) => { e.stopPropagation(); if (path.length > 1) setPath(path.slice(0, -1)); }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7b9ac0] bg-[linear-gradient(180deg,#7dbdf6_0%,#1663b1_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={path.length === 1}>
            <BackArrowIcon size={12} />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#a8b8c8] bg-[linear-gradient(180deg,#e8eef4_0%,#c8d4e0_100%)] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <ForwardArrowIcon size={12} />
          </button>
          <div className="flex flex-1 items-center overflow-hidden rounded-[6px] border border-[#8aa8c3] bg-white px-2 py-1 text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
            {path.map((seg, i) => (
              <button key={`${seg}-${i}`} type="button" onClick={(e) => { e.stopPropagation(); setPath(path.slice(0, i + 1)); setSearchFilter(''); }} className="flex items-center rounded px-1 hover:bg-blue-100">
                {i > 0 && <span className="mx-1 text-slate-400">▶</span>}
                <span className="truncate">{seg}</span>
              </button>
            ))}
          </div>
          <div className="flex h-7 w-40 items-center rounded-[6px] border border-[#8aa8c3] bg-white px-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
            <SearchIcon size={12} className="text-slate-400 mr-1" />
            <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Search"
              className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="rounded-[6px] border border-[#d2deea] bg-white/80 px-3 py-1 text-[11px] text-slate-500">Address: {pathToWindowsString(path)}</div>
          <div className="flex gap-0.5">
            {([{ mode: 'icons' as ViewMode, label: '⊞', title: 'Icons' }, { mode: 'list' as ViewMode, label: '☰', title: 'List' }, { mode: 'details' as ViewMode, label: '▤', title: 'Details' }]).map(({ mode, label, title }) => (
              <button key={mode} type="button" onClick={(e) => { e.stopPropagation(); setViewMode(mode); }}
                className={`flex h-6 w-7 items-center justify-center rounded border text-[11px] ${viewMode === mode ? 'border-[#7b9ac0] bg-[#d6e8fc] text-blue-700' : 'border-transparent text-slate-500 hover:bg-slate-100'}`} title={title}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Nav sidebar */}
        <aside className="w-52 shrink-0 border-r border-[#c8d7e5] bg-[linear-gradient(180deg,#f6fbff_0%,#edf5fb_100%)] p-3">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Favorites</div>
          <div className="space-y-1 text-[12px]">
            {quickLinks.map((link) => {
              const tn = getNodeAtPath(fileSystem, link);
              const ik = link[link.length - 1] === 'Documents' ? 'folder-documents' : link[link.length - 1] === 'Pictures' ? 'folder-pictures' : link[link.length - 1] === 'Videos' ? 'folder-videos' : 'folder-small';
              return (
                <button key={link.join('>')} type="button" onClick={(e) => { e.stopPropagation(); setPath(link); setSearchFilter(''); }}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left hover:bg-[#dff0ff]">
                  <VistaIcon name={ik} size={16} />
                  <span className="truncate">{tn.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content area */}
        <section className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'icons' && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3">
                {items.map((item) => (
                  <button key={item.name} type="button" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }} onDoubleClick={() => openItem(item)}
                    className={`group flex min-h-[108px] flex-col items-center rounded-[10px] border p-2 text-center ${selectedItem?.name === item.name ? 'border-[#8ebcea] bg-[#dff0ff]' : 'border-transparent hover:border-[#d5e7f8] hover:bg-[#f5fbff]'}`}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-[12px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#edf3fa_100%)] shadow-[0_3px_8px_rgba(0,0,0,0.08)] group-hover:scale-105">
                      <VistaIcon name={getItemIconKey(item)} size={36} />
                    </div>
                    <div className="mt-2 line-clamp-2 text-[11px] leading-4 text-slate-700">{item.name}</div>
                    <div className="mt-0.5 text-[10px] text-slate-400">{item.size ?? ('children' in item ? 'File folder' : item.type)}</div>
                  </button>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-0.5">
                {items.map((item) => (
                  <button key={item.name} type="button" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }} onDoubleClick={() => openItem(item)}
                    className={`flex w-full items-center gap-3 rounded-[6px] border px-3 py-1.5 text-left ${selectedItem?.name === item.name ? 'border-[#8ebcea] bg-[#dff0ff]' : 'border-transparent hover:bg-[#f5fbff]'}`}>
                    <VistaIcon name={getItemIconKey(item)} size={20} />
                    <span className="flex-1 truncate text-[12px]">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.size ?? ('children' in item ? 'Folder' : '')}</span>
                  </button>
                ))}
              </div>
            )}

            {viewMode === 'details' && (
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[#c8d7e5] text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    <th className="px-2 py-1.5">Name</th><th className="px-2 py-1.5 w-24">Date Modified</th><th className="px-2 py-1.5 w-20">Type</th><th className="px-2 py-1.5 w-16 text-right">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.name} onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }} onDoubleClick={() => openItem(item)}
                      className={`cursor-default border-b border-slate-100 ${selectedItem?.name === item.name ? 'bg-[#dff0ff]' : 'hover:bg-[#f5fbff]'}`}>
                      <td className="flex items-center gap-2 px-2 py-1"><VistaIcon name={getItemIconKey(item)} size={16} /><span className="truncate">{item.name}</span></td>
                      <td className="px-2 py-1 text-slate-500">{item.modified ?? ''}</td>
                      <td className="px-2 py-1 text-slate-500">{'children' in item ? 'File folder' : item.type}</td>
                      <td className="px-2 py-1 text-right text-slate-500">{item.size ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {items.length === 0 && (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                {searchFilter ? 'No items match your search.' : 'This folder is empty.'}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="flex h-16 items-center gap-4 border-t border-[#9cb8d2] bg-[linear-gradient(180deg,#4ba1cc_0%,#1e5a8d_100%)] px-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/15">
          <VistaIcon name={selectedItem ? getItemIconKey(selectedItem) : getItemIconKey(currentNode)} size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{selectedItem?.name ?? currentNode.name}</div>
          <div className="truncate text-[11px] text-white/70">{selectedItem?.description ?? ('children' in (selectedItem ?? currentNode) ? 'Folder ready' : `${selectedItem?.size ?? currentNode.size ?? 'Shell item'}`)}</div>
        </div>
        <div className="text-right text-[10px] text-white/60">
          <div>{items.length} item{items.length !== 1 ? 's' : ''}</div>
          {totalSize > 0 && <div>{totalSize.toFixed(0)} KB</div>}
        </div>
      </footer>
    </div>
  );
}
