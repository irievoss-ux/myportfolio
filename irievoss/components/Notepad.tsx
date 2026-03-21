"use client";

import type { VistaNode } from '@/lib/vista/filesystem';

export default function Notepad({ file }: { file: VistaNode | null }) {
  const content = file && 'content' in file ? file.content : 'File not found.';

  return (
    <div className="flex h-full flex-col bg-white font-mono text-sm select-text">
      <div className="flex gap-4 border-b border-gray-300 bg-[#f0f0f0] px-2 py-1 text-xs text-black">
        <span className="cursor-default px-1 hover:bg-blue-100">File</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Edit</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Format</span>
        <span className="cursor-default px-1 hover:bg-blue-100">View</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Help</span>
      </div>
      <textarea className="flex-1 resize-none bg-white p-2 text-black outline-none" defaultValue={content} spellCheck={false} />
    </div>
  );
}
