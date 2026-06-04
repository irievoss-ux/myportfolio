"use client";

import { useState } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";

export default function SystemDialog() {
  const dialog = useOSStore((state) => state.dialog);
  const closeDialog = useOSStore((state) => state.closeDialog);
  const [value, setValue] = useState(dialog?.inputValue ?? "");

  if (!dialog) return null;

  return (
    <div className="fixed inset-0 z-[254000] flex items-center justify-center bg-[#7b5487]/18 p-5 backdrop-blur-sm">
      <section className="w-[min(92vw,430px)] rounded-[30px] border border-white/75 bg-white/82 p-5 text-[#74517c] shadow-[0_28px_82px_rgba(126,91,141,0.24)] backdrop-blur-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ffd5ef,#d8ecff)] text-2xl shadow-inner">
            {dialog.tone === "warning" ? "!" : dialog.tone === "confirm" ? "?" : "✦"}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-[#7e5488]">{dialog.title}</h2>
            <p className="mt-2 text-sm leading-6">{dialog.message}</p>
          </div>
        </div>
        {dialog.inputLabel && (
          <label className="mt-4 block text-sm font-black text-[#80598a]">
            {dialog.inputLabel}
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#ecd0ee] bg-white/75 px-3 py-2 text-sm outline-none focus:border-[#d99dde]"
            />
          </label>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={closeDialog} className="rounded-2xl bg-white/64 px-4 py-2 text-xs font-black text-[#80598a] transition hover:bg-white">
            {dialog.cancelLabel ?? "Close"}
          </button>
          {dialog.onConfirm && (
            <button
              type="button"
              onClick={() => {
                dialog.onConfirm?.(value);
                closeDialog();
              }}
              className="rounded-2xl bg-[#ffd9ef] px-4 py-2 text-xs font-black text-[#894f79] transition hover:-translate-y-0.5 hover:bg-[#ffc9e8]"
            >
              {dialog.confirmLabel ?? "OK"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
