"use client";

import { useEffect, useState, useRef } from 'react';


export default function VistaSidebar() {


  return (
    <aside className="fixed right-0 top-0 z-[15] flex h-[calc(100%-46px)] w-[170px] flex-col items-center gap-4 border-l border-white/12 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.04)_30%,rgba(0,0,0,0.14))] px-3 py-4 backdrop-blur-md overflow-y-auto">
      {/* Analog Clock Gadget */}
      <AnalogClockGadget />
      {/* Music Player Gadget */}
      <MusicGadget />
      {/* Slideshow / Picture gadget */}
      <PictureGadget />
      {/* CPU Meter Gadget */}
      <CpuMeterGadget />
      <div className="mt-auto" />
      {/* Plus button to "add gadgets" */}
      <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/8 text-[14px] text-white/40 hover:bg-white/15 hover:text-white/70 transition" title="Add Gadgets">
        +
      </button>
    </aside>
  );
}

function AnalogClockGadget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(t => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 130;
    const r = size / 2;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Clock face
    const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(0, 'rgba(250,252,255,0.92)');
    gradient.addColorStop(0.85, 'rgba(220,230,240,0.88)');
    gradient.addColorStop(1, 'rgba(180,200,220,0.6)');
    ctx.beginPath();
    ctx.arc(r, r, r - 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Outer ring
    ctx.beginPath();
    ctx.arc(r, r, r - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100,130,160,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner shadow
    const innerShadow = ctx.createRadialGradient(r, r, r * 0.7, r, r, r - 4);
    innerShadow.addColorStop(0, 'transparent');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0.06)');
    ctx.beginPath();
    ctx.arc(r, r, r - 4, 0, Math.PI * 2);
    ctx.fillStyle = innerShadow;
    ctx.fill();

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const isQuarter = i % 3 === 0;
      const outerR = r - 10;
      const innerR = isQuarter ? r - 22 : r - 16;
      ctx.beginPath();
      ctx.moveTo(r + Math.cos(angle) * innerR, r + Math.sin(angle) * innerR);
      ctx.lineTo(r + Math.cos(angle) * outerR, r + Math.sin(angle) * outerR);
      ctx.strokeStyle = isQuarter ? 'rgba(40,60,80,0.8)' : 'rgba(80,105,130,0.5)';
      ctx.lineWidth = isQuarter ? 2.5 : 1.2;
      ctx.stroke();
    }

    // Numbers at 12, 3, 6, 9
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(40,60,80,0.75)';
    const numR = r - 28;
    const nums = [{ n: '12', a: -90 }, { n: '3', a: 0 }, { n: '6', a: 90 }, { n: '9', a: 180 }];
    nums.forEach(({ n, a }) => {
      const rad = a * (Math.PI / 180);
      ctx.fillText(n, r + Math.cos(rad) * numR, r + Math.sin(rad) * numR);
    });

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Hour hand
    const hAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.lineTo(r + Math.cos(hAngle) * (r * 0.42), r + Math.sin(hAngle) * (r * 0.42));
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Minute hand
    const mAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.lineTo(r + Math.cos(mAngle) * (r * 0.58), r + Math.sin(mAngle) * (r * 0.58));
    ctx.strokeStyle = '#3a5060';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Second hand
    const sAngle = (seconds * 6 - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(r - Math.cos(sAngle) * 10, r - Math.sin(sAngle) * 10);
    ctx.lineTo(r + Math.cos(sAngle) * (r * 0.62), r + Math.sin(sAngle) * (r * 0.62));
    ctx.strokeStyle = '#d03030';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(r, r, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#3a5060';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r, r, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#d03030';
    ctx.fill();

  });

  return (
    <div className="gadget-panel flex flex-col items-center rounded-[14px] border border-white/20 bg-black/15 p-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <canvas ref={canvasRef} className="h-[130px] w-[130px]" />
    </div>
  );
}

function PictureGadget() {
  const [index, setIndex] = useState(0);
  const slides = [
    { bg: 'linear-gradient(135deg, #1a4a7a 0%, #2a7abd 40%, #6ac470 60%, #90d886 100%)', label: 'Aurora' },
    { bg: 'linear-gradient(180deg, #0a2040 0%, #1a3a60 40%, #2a5a80 100%)', label: 'Midnight' },
    { bg: 'linear-gradient(135deg, #3a1a50 0%, #8a3060 50%, #d06040 100%)', label: 'Sunset' },
  ];

  useEffect(() => {
    const t = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 5000);
    return () => window.clearInterval(t);
  }, [slides.length]);

  return (
    <div className="gadget-panel overflow-hidden rounded-[12px] border border-white/20 bg-black/15 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="h-[95px] w-[144px] transition-all duration-1000" style={{ background: slides[index].bg }} />
      <div className="px-2 py-1 text-center text-[9px] text-white/50">{slides[index].label}</div>
    </div>
  );
}

function CpuMeterGadget() {
  const [cpu, setCpu] = useState(23);
  const [ram, setRam] = useState(42);

  useEffect(() => {
    const t = window.setInterval(() => {
      setCpu(Math.min(100, Math.max(5, 23 + Math.floor(Math.random() * 30 - 10))));
      setRam(Math.min(100, Math.max(20, 42 + Math.floor(Math.random() * 15 - 5))));
    }, 2000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="gadget-panel flex w-[144px] flex-col items-center gap-2 rounded-[12px] border border-white/20 bg-black/15 p-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">CPU / Memory</div>
      <div className="flex w-full items-center gap-3">
        <MiniGauge value={cpu} label="CPU" color="#4ade80" />
        <MiniGauge value={ram} label="RAM" color="#60a5fa" />
      </div>
    </div>
  );
}

function MiniGauge({ value, label, color }: { value: number; label: string; color: string }) {
  const angle = (value / 100) * 180;
  return (
    <div className="flex flex-col items-center">
      <svg width="52" height="32" viewBox="0 0 52 32">
        {/* Background arc */}
        <path d="M6 28 A20 20 0 0 1 46 28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />
        {/* Value arc */}
        <path d="M6 28 A20 20 0 0 1 46 28" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 62.83} 62.83`} opacity="0.8" />
        {/* Needle */}
        <line x1="26" y1="28" x2={26 + Math.cos((180 + angle) * Math.PI / 180) * 16} y2={28 + Math.sin((180 + angle) * Math.PI / 180) * 16}
          stroke="white" strokeWidth="1.5" opacity="0.7" />
        <circle cx="26" cy="28" r="2" fill="white" opacity="0.6" />
      </svg>
      <div className="text-[10px] font-bold text-white/60">{value}%</div>
      <div className="text-[8px] text-white/35">{label}</div>
    </div>
  );
}

const PLAYLIST = [
  { title: 'Decode', src: '/media/Decode.mp3' },
  { title: 'Leave Out All The Rest', src: '/media/Leave-Out-All-The-Rest.mp3' },
  { title: 'Let Me', src: '/media/Let-Me.mp3' },
  { title: 'Ohio Is For Lovers', src: '/media/Ohio-Is-For-Lovers.mp3' },
  { title: 'When Your Heart Stops Beating', src: '/media/When-Your-Heart-Stops-Beating.mp3' },
];

function MusicGadget() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const track = PLAYLIST[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setTrackIndex((i) => (i + 1) % PLAYLIST.length);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [trackIndex]);

  // Auto-play on track change when playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    if (playing) {
      void audio.play().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const prevTrack = () => {
    setProgress(0);
    setTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const nextTrack = () => {
    setProgress(0);
    setTrackIndex((i) => (i + 1) % PLAYLIST.length);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  };

  return (
    <div className="gadget-panel flex w-[144px] flex-col items-center gap-2 rounded-[12px] border border-white/20 bg-black/15 p-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <audio ref={audioRef} preload="metadata" />
      <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">♫ Music</div>

      {/* Track name — scrolling */}
      <div className="w-full overflow-hidden">
        <div className="whitespace-nowrap text-center text-[10px] font-medium text-white/80 animate-marquee">
          {track.title}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[4px] w-full cursor-pointer overflow-hidden rounded-full bg-black/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]" onClick={seek}>
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#52c5ff,#d8fbff)] shadow-[0_0_8px_rgba(91,218,255,0.6)] transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button type="button" onClick={prevTrack} className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition" title="Previous">
          ⏮
        </button>
        <button type="button" onClick={togglePlay} className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-100/30 bg-[linear-gradient(180deg,rgba(92,184,255,0.3),rgba(13,92,160,0.3))] text-[12px] text-white shadow-[0_0_12px_rgba(72,175,255,0.3)] hover:brightness-125 transition" title={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button type="button" onClick={nextTrack} className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition" title="Next">
          ⏭
        </button>
      </div>

      {/* Track number */}
      <div className="text-[8px] text-white/30">{trackIndex + 1} / {PLAYLIST.length}</div>
    </div>
  );
}

