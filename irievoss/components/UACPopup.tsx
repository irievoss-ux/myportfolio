"use client";

interface UACPopupProps {
  appName: string;
  publisher?: string;
  description?: string;
  onContinue: () => void;
  onCancel: () => void;
}

export default function UACPopup({
  appName,
  publisher = 'Microsoft Windows',
  description = 'A protected application is requesting elevated privileges.',
  onContinue,
  onCancel,
}: UACPopupProps) {
  return (
    <div className="fixed inset-0 z-[250000] flex items-center justify-center bg-[radial-gradient(circle,rgba(6,16,28,0.15),rgba(0,0,0,0.82))] backdrop-blur-[2px]">
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative w-[520px] overflow-hidden rounded-[12px] border border-[#27384f] bg-[#f8f8f8] shadow-[0_26px_80px_rgba(0,0,0,0.7)]">
        <div className="border-b border-[#103b63] bg-[linear-gradient(180deg,#376d9d_0%,#154a78_100%)] px-5 py-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl">🛡️</div>
            <div>
              <div className="text-sm font-semibold">User Account Control</div>
              <div className="text-[11px] text-white/70">Secure Desktop</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 bg-white px-6 py-6 text-slate-800">
          <div className="mt-1 text-5xl">🛡️</div>
          <div className="flex-1">
            <h2 className="text-[22px] font-semibold leading-7 text-[#063e77]">Windows needs your permission to continue</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>

            <div className="mt-5 rounded-[8px] border border-[#c9d1db] bg-[#f4f7fb] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="grid gap-3 text-sm">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Program Name</div>
                  <div className="mt-1 font-semibold text-slate-800">{appName}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Verified Publisher</div>
                  <div className="mt-1 text-slate-800">{publisher}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-500">Secure Desktop is dimming the shell until you choose an option.</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#d0d6df] bg-[linear-gradient(180deg,#f7f7f7_0%,#e8ebef_100%)] px-5 py-4">
          <button type="button" className="text-[11px] text-[#2c5d8f] hover:underline">Show details</button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onContinue}
              className="rounded-[4px] border border-[#778ba0] bg-[linear-gradient(180deg,#ffffff_0%,#dfe6ee_100%)] px-7 py-1.5 text-xs font-semibold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:brightness-105"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-[4px] border border-[#778ba0] bg-[linear-gradient(180deg,#ffffff_0%,#dfe6ee_100%)] px-7 py-1.5 text-xs text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] hover:brightness-105"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
