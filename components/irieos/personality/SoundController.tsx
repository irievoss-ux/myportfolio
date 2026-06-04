"use client";

import { useEffect } from "react";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import type { SoundEvent } from "@/components/irieos/types";

const soundMap: Record<SoundEvent, { frequency: number; duration: number; type: OscillatorType }> = {
  click: { frequency: 640, duration: 0.035, type: "sine" },
  open: { frequency: 820, duration: 0.08, type: "triangle" },
  close: { frequency: 420, duration: 0.055, type: "sine" },
  notification: { frequency: 980, duration: 0.09, type: "triangle" },
  error: { frequency: 220, duration: 0.12, type: "sawtooth" },
};

export default function SoundController() {
  const soundEvent = useOSStore((state) => state.soundEvent);

  useEffect(() => {
    if (!soundEvent) return;
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const config = soundMap[soundEvent.type];
    oscillator.type = config.type;
    oscillator.frequency.value = config.frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + config.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + config.duration + 0.02);
    oscillator.onended = () => void context.close();
  }, [soundEvent]);

  return null;
}
