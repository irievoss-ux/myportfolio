"use client";

import { useState } from 'react';

interface RunDialogProps {
  onClose: () => void;
  onRun: (command: string) => void;
}

export default function RunDialog({ onClose, onRun }: RunDialogProps) {
  const [command, setCommand] = useState('');

  const handleSubmit = () => {
    if (command.trim()) {
      onRun(command.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[250000] flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="w-[460px] overflow-hidden rounded-[10px] border border-white/50 bg-[linear-gradient(180deg,rgba(240,248,255,0.98),rgba(220,235,250,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
        {/* Title */}
        <div className="flex items-center gap-3 border-b border-[#b5cade] px-5 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-[#7db7f0] to-[#2a70c4] text-xl text-white shadow-md">⚡</div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Run</div>
            <div className="text-[10px] text-slate-500">Type the name of a program to open it.</div>
          </div>
        </div>

        {/* Input */}
        <div className="px-5 py-4">
          <label className="mb-2 block text-xs text-slate-600">Open:</label>
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="calc, notepad, cmd, mspaint, explorer..."
            autoFocus
            className="w-full rounded-[6px] border border-[#8aa8c3] bg-white px-3 py-2 text-sm text-slate-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] outline-none focus:border-[#3f8cf4] focus:ring-1 focus:ring-[#3f8cf4]/30"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 border-t border-[#c8d8e8] bg-[#f0f4f8] px-5 py-3">
          <button type="button" onClick={handleSubmit} className="rounded-[5px] border border-[#5a8abf] bg-[linear-gradient(180deg,#7db7f0_0%,#2a6ec4_100%)] px-6 py-1.5 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 transition">OK</button>
          <button type="button" onClick={onClose} className="rounded-[5px] border border-[#8aa0b8] bg-[linear-gradient(180deg,#ffffff_0%,#dfe9f2_100%)] px-5 py-1.5 text-xs font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:brightness-105 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
