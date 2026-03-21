"use client";

import { useEffect, useRef, useState } from 'react';
import type { VistaVideoNode } from '@/lib/vista/filesystem';

export default function MediaPlayer({ file }: { file: VistaVideoNode | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      const nextProgress = video.duration ? (video.currentTime / video.duration) * 100 : 0;
      setProgress(nextProgress);
      setPlaying(!video.paused);
    };

    sync();
    video.addEventListener('timeupdate', sync);
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);

    return () => {
      video.removeEventListener('timeupdate', sync);
      video.removeEventListener('play', sync);
      video.removeEventListener('pause', sync);
    };
  }, [file]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  if (!file) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,#0a2138_0%,#02060b_100%)] text-white">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,rgba(36,120,212,0.2),transparent_55%)]">
          <div className="flex h-30 w-30 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-6xl shadow-[0_0_50px_rgba(73,188,255,0.2)]">🎵</div>
          <div className="text-center">
            <div className="text-lg font-light">Windows Media Player 11</div>
            <div className="mt-1 text-sm text-white/60">Open a local video from the recursive file system.</div>
          </div>
        </div>
        <PlayerChrome playing={false} progress={20} title="Library" subtitle="Now Playing" onToggle={togglePlayback} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,#10161e_0%,#030608_100%)] text-white">
      <div className="flex h-14 items-center justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] px-5 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">Now Playing</div>
          <div className="mt-1 font-semibold">{file.name}</div>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-cyan-100">WMP 11</div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(58,167,255,0.24),transparent_30%)]" />
        {!failed ? (
          <video ref={videoRef} src={file.url} className="relative h-full w-full object-contain" autoPlay controls={false} onClick={togglePlayback} onError={() => setFailed(true)} />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,rgba(72,173,255,0.28),transparent_45%)]">
            <div className="text-7xl">🎞️</div>
            <div className="text-center">
              <div className="text-lg font-light">Preview unavailable in this environment</div>
              <div className="mt-1 text-sm text-white/60">The local video entry is wired up, but playback fell back to shell chrome.</div>
            </div>
          </div>
        )}
        {!playing && (
          <button type="button" onClick={togglePlayback} className="absolute flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/40 text-4xl text-white backdrop-blur-sm">
            ▶
          </button>
        )}
      </div>

      <PlayerChrome playing={playing} progress={failed ? 100 : progress} title={file.name} subtitle={failed ? 'Local asset fallback' : file.duration} onToggle={togglePlayback} />
    </div>
  );
}

function PlayerChrome({
  playing,
  progress,
  title,
  subtitle,
  onToggle,
}: {
  playing: boolean;
  progress: number;
  title: string;
  subtitle: string;
  onToggle: () => void;
}) {
  return (
    <div className="border-t border-white/10 bg-[linear-gradient(180deg,#242f3f_0%,#0d131b_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div className="h-2 overflow-hidden rounded-full bg-black/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
        <div className="h-full bg-[linear-gradient(90deg,#52c5ff_0%,#d8fbff_100%)] shadow-[0_0_12px_rgba(91,218,255,0.8)]" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/65">{subtitle}</div>
          <div className="mt-1 text-sm font-medium">{title}</div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="text-lg text-white/65">⏮</button>
          <button type="button" onClick={onToggle} className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-100/40 bg-[linear-gradient(180deg,#5cb8ff_0%,#0d5ca0_100%)] text-lg text-white shadow-[0_0_20px_rgba(72,175,255,0.45)]">
            {playing ? '⏸' : '▶'}
          </button>
          <button type="button" className="text-lg text-white/65">⏭</button>
        </div>
        <div className="text-right text-xs text-white/60">
          <div>🔊 75%</div>
          <div className="text-[10px] uppercase tracking-[0.2em]">SRS WOW</div>
        </div>
      </div>
    </div>
  );
}
