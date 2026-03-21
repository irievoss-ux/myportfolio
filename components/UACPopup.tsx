"use client";

interface UACPopupProps {
  appName: string;
  publisher?: string;
  description?: string;
  onContinue: () => void;
  onCancel: () => void;
}

function ShieldIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M24 4 L40 12 L40 24 Q40 36 24 44 Q8 36 8 24 L8 12Z" fill="url(#shieldGrad)" stroke="#2a5a8a" strokeWidth="1.5"/>
      <path d="M24 8 L36 14 L36 24 Q36 34 24 40 Q12 34 12 24 L12 14Z" fill="url(#shieldInner)"/>
      <path d="M18 24 L22 28 L30 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdd835"/><stop offset="50%" stopColor="#f9a825"/><stop offset="100%" stopColor="#f57f17"/>
        </linearGradient>
        <linearGradient id="shieldInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffee58"/><stop offset="100%" stopColor="#fbc02d"/>
        </linearGradient>
      </defs>
    </svg>
  );
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
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10">
              <ShieldIcon size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold">User Account Control</div>
              <div className="text-[11px] text-white/70">Secure Desktop</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 bg-white px-6 py-6 text-slate-800">
          <div className="mt-1">
            <ShieldIcon size={48} />
          </div>
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
