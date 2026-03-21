"use client";

import { useMemo, useState } from 'react';
import { createVistaFileSystem, getChildrenAtPath, getNodeAtPath, pathToWindowsString, type VistaNode, type VistaPath } from '@/lib/vista/filesystem';
import { useVistaProfile } from './providers/VistaProfileProvider';

interface FileExplorerProps {
  path: VistaPath;
  setPath: (path: VistaPath) => void;
  onOpenNode: (node: VistaNode, parentPath: VistaPath) => void;
}

export default function FileExplorer({ path, setPath, onOpenNode }: FileExplorerProps) {
  const { accountFolder } = useVistaProfile();
  const fileSystem = useMemo(() => createVistaFileSystem(accountFolder), [accountFolder]);
  const [selectedItem, setSelectedItem] = useState<VistaNode | null>(null);

  const currentNode = getNodeAtPath(fileSystem, path);
  const items = getChildrenAtPath(fileSystem, path);

  const openItem = (item: VistaNode) => {
    if ('children' in item) {
      setPath([...path, item.name]);
      setSelectedItem(null);
      return;
    }

    onOpenNode(item, path);
  };

  const quickLinks = [
    ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Documents'],
    ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Videos'],
    ['Computer', 'OSDisk (C:)', 'Windows', 'System32'],
    ['Computer', 'Data (D:)', 'Captured Footage'],
  ] satisfies VistaPath[];

  return (
    <div className="flex h-full flex-col bg-white text-sm text-slate-800" onClick={() => setSelectedItem(null)}>
      <div className="border-b border-[#b5cade] bg-[linear-gradient(180deg,#f4f9fe_0%,#ddeaf5_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (path.length > 1) setPath(path.slice(0, -1));
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7b9ac0] bg-[linear-gradient(180deg,#7dbdf6_0%,#1663b1_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={path.length === 1}
          >
            ◀
          </button>
          <div className="flex flex-1 items-center overflow-hidden rounded-[6px] border border-[#8aa8c3] bg-white px-2 py-1 text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
            {path.map((segment, index) => (
              <button key={`${segment}-${index}`} type="button" onClick={(event) => { event.stopPropagation(); setPath(path.slice(0, index + 1)); }} className="flex items-center rounded px-1 hover:bg-blue-100">
                {index > 0 && <span className="mx-1 text-slate-400">▶</span>}
                <span className="truncate">{segment}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 rounded-[6px] border border-[#d2deea] bg-white/80 px-3 py-1 text-[11px] text-slate-500">Address: {pathToWindowsString(path)}</div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 border-r border-[#c8d7e5] bg-[linear-gradient(180deg,#f6fbff_0%,#edf5fb_100%)] p-3">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Navigation Pane</div>
          <div className="space-y-1 text-[12px]">
            {quickLinks.map((link) => {
              const targetNode = getNodeAtPath(fileSystem, link);
              return (
                <button
                  key={link.join('>')}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPath(link);
                    setSelectedItem(targetNode);
                  }}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left hover:bg-[#dff0ff]"
                >
                  <span>{targetNode.icon}</span>
                  <span className="truncate">{targetNode.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Folder Tasks</div>
          <div className="mt-2 space-y-2 text-[11px] text-[#1d5c90]">
            <button type="button" className="block hover:underline">Organize</button>
            <button type="button" className="block hover:underline">Open in new window</button>
            <button type="button" className="block hover:underline">Burn to disc</button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-4 overflow-y-auto p-5">
            {items.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedItem(item);
                }}
                onDoubleClick={() => openItem(item)}
                className={`group flex min-h-[108px] flex-col items-center rounded-[10px] border p-2 text-center ${selectedItem?.name === item.name ? 'border-[#8ebcea] bg-[#dff0ff]' : 'border-transparent hover:border-[#d5e7f8] hover:bg-[#f5fbff]'}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[12px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#edf3fa_100%)] text-3xl shadow-[0_3px_8px_rgba(0,0,0,0.08)] group-hover:scale-105">
                  {item.icon}
                </div>
                <div className="mt-2 line-clamp-2 text-[11px] leading-4 text-slate-700">{item.name}</div>
                <div className="mt-1 text-[10px] text-slate-400">{item.size ?? item.description ?? ('children' in item ? 'File folder' : item.type)}</div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="flex h-18 items-center gap-4 border-t border-[#9cb8d2] bg-[linear-gradient(180deg,#4ba1cc_0%,#1e5a8d_100%)] px-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/15 text-3xl">{selectedItem?.icon ?? currentNode.icon}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{selectedItem?.name ?? currentNode.name}</div>
          <div className="truncate text-[11px] text-white/70">{selectedItem?.description ?? ('children' in (selectedItem ?? currentNode) ? 'Folder ready' : `${selectedItem?.size ?? currentNode.size ?? 'Shell item'} • Double-click to open`)}</div>
        </div>
      </footer>
    </div>
  );
}
