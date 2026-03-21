"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { VistaImageNode } from '@/lib/vista/filesystem';

interface PhotoViewerProps {
  file: VistaImageNode | null;
}

export default function PhotoViewer({ file }: PhotoViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [chromeOpen, setChromeOpen] = useState(true);

  const transform = useMemo(() => `scale(${zoom / 100}) rotate(${rotation}deg)`, [rotation, zoom]);

  if (!file) {
    return <div className="flex h-full items-center justify-center bg-[#f0f0f0] text-gray-500">No file selected.</div>;
  }

  return (
    <div className="flex h-full flex-col bg-[#fcfcfc] font-sans select-none">
      {chromeOpen && (
        <div className="h-10 shrink-0 border-b border-[#a2c6e0] bg-gradient-to-b from-[#f2f7fa] to-[#c9dfee] px-4 text-xs text-gray-700 shadow-sm">
          <div className="flex h-full items-center gap-4">
            <button type="button" onClick={() => setZoom((value) => Math.min(value + 10, 180))} className="hover:text-blue-800">🔍 Zoom In</button>
            <button type="button" onClick={() => setZoom((value) => Math.max(value - 10, 60))} className="hover:text-blue-800">🔎 Zoom Out</button>
            <button type="button" onClick={() => setRotation((value) => value - 90)} className="hover:text-blue-800">↺ Rotate Left</button>
            <button type="button" onClick={() => setRotation((value) => value + 90)} className="hover:text-blue-800">↻ Rotate Right</button>
            <button type="button" onClick={() => { setZoom(100); setRotation(0); }} className="hover:text-blue-800">Reset</button>
          </div>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden bg-[#eef3f6] p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
        <div className="absolute right-5 top-5 z-20">
          <button type="button" onClick={() => setChromeOpen((value) => !value)} className="rounded-md border border-white/50 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {chromeOpen ? 'Hide Chrome' : 'Show Chrome'}
          </button>
        </div>

        <div className="flex h-full items-center justify-center overflow-auto rounded-[16px] border border-white/70 bg-white/50 p-8 backdrop-blur-sm">
          <div className="relative h-full w-full">
            <Image src={file.url} alt={file.name} fill className="object-contain transition-transform duration-300" style={{ transform }} unoptimized />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-14 shrink-0 items-center justify-between border-t border-white/20 bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#000] px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-2 text-white/80">
          <span>{file.icon}</span>
          <span className="text-xs">{file.name}</span>
        </div>

        <div className="flex items-center gap-4 text-white">
          <button type="button" onClick={() => setRotation((value) => value - 90)} className="text-lg hover:text-blue-300">↺</button>
          <button type="button" onClick={() => setRotation((value) => value + 90)} className="text-lg hover:text-blue-300">↻</button>
          <button type="button" onClick={() => setZoom((value) => Math.max(value - 10, 60))} className="text-lg hover:text-blue-300">－</button>
          <div className="text-xs">{zoom}%</div>
          <button type="button" onClick={() => setZoom((value) => Math.min(value + 10, 180))} className="text-lg hover:text-blue-300">＋</button>
        </div>

        <div className="text-[10px] text-white/60">{file.size}</div>
      </div>
    </div>
  );
}
