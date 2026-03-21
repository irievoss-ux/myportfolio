"use client";

import { useState } from 'react';
import type { VistaNode } from '@/lib/vista/filesystem';

export default function Notepad({ file }: { file: VistaNode | null }) {
  const initialContent = file && 'content' in file ? file.content : 'File not found.';
  const [content, setContent] = useState(initialContent);
  const [wordWrap, setWordWrap] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file?.name ?? 'Untitled.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectAll = () => {
    const textarea = document.querySelector('#notepad-textarea') as HTMLTextAreaElement | null;
    textarea?.select();
  };

  const menuItems: Record<string, { label: string; action?: () => void; toggle?: boolean; checked?: boolean; divider?: boolean }[]> = {
    File: [
      { label: 'New', action: () => setContent('') },
      { label: 'Save As...', action: handleSave },
      { divider: true, label: '' },
      { label: 'Exit', action: () => {} },
    ],
    Edit: [
      { label: 'Undo' },
      { divider: true, label: '' },
      { label: 'Cut' },
      { label: 'Copy' },
      { label: 'Paste' },
      { label: 'Delete' },
      { divider: true, label: '' },
      { label: 'Select All', action: handleSelectAll },
    ],
    Format: [
      { label: 'Word Wrap', toggle: true, checked: wordWrap, action: () => setWordWrap((v) => !v) },
      { divider: true, label: '' },
      { label: 'Font Size +', action: () => setFontSize((v) => Math.min(v + 1, 24)) },
      { label: 'Font Size −', action: () => setFontSize((v) => Math.max(v - 1, 8)) },
    ],
    View: [
      { label: 'Status Bar', toggle: true, checked: showStatusBar, action: () => setShowStatusBar((v) => !v) },
    ],
  };

  return (
    <div className="flex h-full flex-col bg-white font-mono text-sm select-text" onClick={() => setActiveMenu(null)}>
      {/* Menu bar */}
      <div className="relative flex gap-0 border-b border-gray-300 bg-[#f0f0f0] text-xs text-black">
        {Object.keys(menuItems).map((menu) => (
          <div key={menu} className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === menu ? null : menu); }}
              onMouseEnter={() => activeMenu && setActiveMenu(menu)}
              className={`cursor-default px-3 py-1 hover:bg-blue-100 ${activeMenu === menu ? 'bg-blue-100' : ''}`}
            >
              {menu}
            </button>
            {activeMenu === menu && (
              <div className="absolute left-0 top-full z-50 min-w-[180px] rounded-b border border-gray-300 bg-white py-0.5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                {menuItems[menu].map((item, i) => {
                  if (item.divider) return <div key={`d-${i}`} className="mx-2 my-1 h-px bg-gray-200" />;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => { item.action?.(); setActiveMenu(null); }}
                      className="flex w-full items-center gap-2 px-6 py-1 text-left hover:bg-blue-100"
                    >
                      {item.toggle && <span className="w-3 text-center">{item.checked ? '✓' : ''}</span>}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Editor */}
      <textarea
        id="notepad-textarea"
        className="flex-1 resize-none bg-white p-3 text-black outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre', overflowWrap: wordWrap ? 'break-word' : 'normal' }}
      />

      {/* Status bar */}
      {showStatusBar && (
        <div className="flex items-center justify-between border-t border-gray-300 bg-[#f0f0f0] px-3 py-0.5 text-[10px] text-gray-600">
          <span>Ln {lineCount}, Col 1</span>
          <span>{charCount} characters</span>
          <span>UTF-8</span>
        </div>
      )}
    </div>
  );
}
