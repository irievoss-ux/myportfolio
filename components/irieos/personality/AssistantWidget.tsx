"use client";

import { useMemo, useState } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";

const tips = [
  "Right-click the desktop for tiny OS rituals.",
  "Type glitter in Start search for a little secret.",
  "File Explorer has a secret sparkle file.",
  "The cat can nap if you click enough.",
  "Alerts opens your notification center.",
];

export default function AssistantWidget() {
  const assistantOpen = useOSStore((state) => state.assistantOpen);
  const setAssistantOpen = useOSStore((state) => state.setAssistantOpen);
  const openApp = useOSStore((state) => state.openApp);
  const showToast = useOSStore((state) => state.showToast);
  const [tipIndex, setTipIndex] = useState(0);
  const tip = useMemo(() => tips[tipIndex % tips.length], [tipIndex]);

  if (!assistantOpen) return null;

  return (
    <aside className="fixed bottom-24 right-5 z-[150000] w-[min(92vw,300px)] rounded-[30px] border border-white/75 bg-white/68 p-4 text-[#765080] shadow-[0_24px_70px_rgba(126,91,141,0.22)] backdrop-blur-2xl">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#ffd5ef,#d8ecff)] text-3xl shadow-inner">✿</div>
        <div>
          <h2 className="text-lg font-black text-[#7e5488]">Irie Helper</h2>
          <p className="mt-1 text-sm font-semibold">Welcome back. I kept the windows soft.</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white/58 p-3 text-sm font-bold leading-5">{tip}</div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          ["About", "about"],
          ["Gallery", "gallery"],
          ["Twitch", "twitch"],
          ["Settings", "settings"],
        ].map(([label, appId]) => (
          <button key={label} type="button" onClick={() => openApp(appId as Parameters<typeof openApp>[0])} className="rounded-2xl bg-white/58 px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 hover:bg-white">
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setTipIndex((value) => value + 1)} className="flex-1 rounded-2xl bg-[#fff0fb] px-3 py-2 text-xs font-black transition hover:bg-white">
          another tip
        </button>
        <button type="button" onClick={() => showToast("Irie Helper tucked a note into stardust.")} className="flex-1 rounded-2xl bg-[#ecf8ff] px-3 py-2 text-xs font-black transition hover:bg-white">
          help
        </button>
      </div>
      <button type="button" onClick={() => setAssistantOpen(false)} className="mt-2 w-full rounded-2xl bg-white/42 px-3 py-2 text-xs font-black transition hover:bg-white">
        close helper
      </button>
    </aside>
  );
}
