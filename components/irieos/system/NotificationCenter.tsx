"use client";

import { useOSStore } from "@/components/irieos/store/useOSStore";

interface NotificationCenterProps {
  onClose: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const notifications = useOSStore((state) => state.notificationHistory);
  const clearNotifications = useOSStore((state) => state.clearNotifications);
  const focusMode = useOSStore((state) => state.focusMode);
  const glitterMode = useOSStore((state) => state.glitterMode);
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const uiSounds = useOSStore((state) => state.uiSounds);
  const setFocusMode = useOSStore((state) => state.setFocusMode);
  const setGlitterMode = useOSStore((state) => state.setGlitterMode);
  const setReducedMotion = useOSStore((state) => state.setReducedMotion);
  const setUISounds = useOSStore((state) => state.setUISounds);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[#7c5488]">Notifications</h2>
        <button type="button" onClick={onClose} className="rounded-2xl bg-white/58 px-3 py-1.5 text-xs font-black transition hover:bg-white">
          close
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["Focus Mode", focusMode, () => setFocusMode(!focusMode)],
          ["Glitter Mode", glitterMode, () => setGlitterMode(!glitterMode)],
          ["Reduced Motion", reducedMotion, () => setReducedMotion(!reducedMotion)],
          ["Mute Sounds", !uiSounds, () => setUISounds(!uiSounds)],
        ].map(([label, active, action]) => (
          <button
            key={String(label)}
            type="button"
            onClick={action as () => void}
            className={`rounded-2xl px-3 py-3 text-xs font-black transition hover:-translate-y-0.5 ${(active as boolean) ? "bg-[#ecfff8] text-[#4f8b74]" : "bg-white/58 text-[#80598a]"}`}
          >
            {label as string}
          </button>
        ))}
      </div>
      <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
        {notifications.length === 0 ? (
          <div className="rounded-2xl bg-white/52 p-5 text-center text-sm font-bold text-[#9875a0]">
            No notifications. The system is quietly sparkling.
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl bg-white/58 px-3 py-2 text-sm font-bold text-[#765080]">
              {notification.text}
            </div>
          ))
        )}
      </div>
      <button type="button" onClick={clearNotifications} className="mt-3 w-full rounded-2xl bg-[#fff0fb] px-3 py-2 text-xs font-black text-[#80598a] transition hover:bg-white">
        Clear all
      </button>
    </section>
  );
}
