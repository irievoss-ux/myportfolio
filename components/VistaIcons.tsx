// Vista-authentic SVG icon library — no emojis, real OS icons.
// Every icon is an inline SVG matching Windows Vista's visual style.

import React from 'react';

type IconProps = { size?: number; className?: string };

// ── SYSTEM / SHELL ─────────────────────────────────────────────
export function ComputerIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="4" y="4" width="40" height="28" rx="2" fill="url(#monGrad)" stroke="#3a5f8a" strokeWidth="1.5"/>
      <rect x="7" y="7" width="34" height="22" rx="1" fill="#1a3a5c"/>
      <rect x="8" y="8" width="32" height="20" fill="url(#screenGrad)"/>
      <rect x="17" y="33" width="14" height="4" fill="#b0b8c4" rx="1"/>
      <rect x="13" y="37" width="22" height="3" rx="1.5" fill="url(#standGrad)"/>
      <defs>
        <linearGradient id="monGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eef4"/><stop offset="100%" stopColor="#8a9ab0"/>
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a90d9"/><stop offset="50%" stopColor="#2d6cb0"/><stop offset="100%" stopColor="#1a4a7a"/>
        </linearGradient>
        <linearGradient id="standGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d0d8"/><stop offset="100%" stopColor="#8898a8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IEIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="20" fill="url(#ieGrad)" stroke="#1a5276" strokeWidth="1"/>
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="white" strokeWidth="3.5" opacity="0.9"/>
      <path d="M14 14 Q24 8 34 14" fill="none" stroke="white" strokeWidth="2.5" opacity="0.7"/>
      <path d="M14 34 Q24 40 34 34" fill="none" stroke="white" strokeWidth="2.5" opacity="0.7"/>
      <text x="20" y="29" fontSize="14" fontWeight="bold" fontFamily="serif" fill="white" opacity="0.95">e</text>
      <defs>
        <linearGradient id="ieGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4fc3f7"/><stop offset="50%" stopColor="#1976d2"/><stop offset="100%" stopColor="#0d47a1"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RecycleBinIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M12 16 L15 42 Q15 44 17 44 L31 44 Q33 44 33 42 L36 16Z" fill="url(#binGrad)" stroke="#5a7a9a" strokeWidth="1"/>
      <rect x="10" y="12" width="28" height="4" rx="2" fill="url(#binLidGrad)" stroke="#5a7a9a" strokeWidth="1"/>
      <rect x="20" y="8" width="8" height="5" rx="1" fill="none" stroke="#6a8aaa" strokeWidth="1.5"/>
      <line x1="19" y1="20" x2="19" y2="40" stroke="#456a8a" strokeWidth="1" opacity="0.4"/>
      <line x1="24" y1="20" x2="24" y2="40" stroke="#456a8a" strokeWidth="1" opacity="0.4"/>
      <line x1="29" y1="20" x2="29" y2="40" stroke="#456a8a" strokeWidth="1" opacity="0.4"/>
      <defs>
        <linearGradient id="binGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0dce8"/><stop offset="100%" stopColor="#8aa0b8"/>
        </linearGradient>
        <linearGradient id="binLidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0d0e0"/><stop offset="100%" stopColor="#90a8c0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FolderIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M4 12 L4 40 Q4 42 6 42 L42 42 Q44 42 44 40 L44 16 Q44 14 42 14 L22 14 L18 10 Q17 9 16 9 L6 9 Q4 9 4 11Z" fill="url(#folderGrad)" stroke="#c49520" strokeWidth="0.8"/>
      <path d="M4 16 L44 16 L44 40 Q44 42 42 42 L6 42 Q4 42 4 40Z" fill="url(#folderFace)" opacity="0.9"/>
      <defs>
        <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdd835"/><stop offset="100%" stopColor="#e6a817"/>
        </linearGradient>
        <linearGradient id="folderFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe082"/><stop offset="100%" stopColor="#f9c22e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DocumentsFolderIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M4 12 L4 40 Q4 42 6 42 L42 42 Q44 42 44 40 L44 16 Q44 14 42 14 L22 14 L18 10 Q17 9 16 9 L6 9 Q4 9 4 11Z" fill="url(#docFolderGrad)" stroke="#c49520" strokeWidth="0.8"/>
      <path d="M4 16 L44 16 L44 40 Q44 42 42 42 L6 42 Q4 42 4 40Z" fill="url(#docFolderFace)" opacity="0.9"/>
      <rect x="18" y="22" width="12" height="15" rx="1" fill="white" stroke="#999" strokeWidth="0.6"/>
      <line x1="20" y1="26" x2="28" y2="26" stroke="#bbb" strokeWidth="0.8"/>
      <line x1="20" y1="29" x2="28" y2="29" stroke="#bbb" strokeWidth="0.8"/>
      <line x1="20" y1="32" x2="25" y2="32" stroke="#bbb" strokeWidth="0.8"/>
      <defs>
        <linearGradient id="docFolderGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdd835"/><stop offset="100%" stopColor="#e6a817"/>
        </linearGradient>
        <linearGradient id="docFolderFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe082"/><stop offset="100%" stopColor="#f9c22e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NotepadIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="10" y="4" width="28" height="40" rx="2" fill="url(#notepadGrad)" stroke="#7a8a9a" strokeWidth="1"/>
      <rect x="10" y="4" width="28" height="6" fill="url(#notepadTop)"/>
      <rect x="14" y="2" width="3" height="6" rx="1" fill="#6a7a8a"/>
      <rect x="22" y="2" width="3" height="6" rx="1" fill="#6a7a8a"/>
      <rect x="30" y="2" width="3" height="6" rx="1" fill="#6a7a8a"/>
      <line x1="14" y1="16" x2="34" y2="16" stroke="#8aa0b8" strokeWidth="0.7"/>
      <line x1="14" y1="20" x2="34" y2="20" stroke="#8aa0b8" strokeWidth="0.7"/>
      <line x1="14" y1="24" x2="34" y2="24" stroke="#8aa0b8" strokeWidth="0.7"/>
      <line x1="14" y1="28" x2="34" y2="28" stroke="#8aa0b8" strokeWidth="0.7"/>
      <line x1="14" y1="32" x2="28" y2="32" stroke="#8aa0b8" strokeWidth="0.7"/>
      <line x1="14" y1="36" x2="24" y2="36" stroke="#8aa0b8" strokeWidth="0.7"/>
      <defs>
        <linearGradient id="notepadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#e8eef4"/>
        </linearGradient>
        <linearGradient id="notepadTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a9ad6"/><stop offset="100%" stopColor="#3a7ab6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CalculatorIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="10" y="4" width="28" height="40" rx="3" fill="url(#calcGrad)" stroke="#5a7a9a" strokeWidth="1"/>
      <rect x="13" y="8" width="22" height="10" rx="1" fill="#1a2a3a" stroke="#3a5a7a" strokeWidth="0.5"/>
      <text x="32" y="16" fontSize="10" fontFamily="monospace" fill="#8aff8a" textAnchor="end">0</text>
      {[[13,22],[20,22],[27,22],[13,28],[20,28],[27,28],[13,34],[20,34],[27,34]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width="5" height="4" rx="0.5" fill={i%4===3?"#4a8abf":"#d0dce8"} stroke="#8a9aaa" strokeWidth="0.4"/>
      ))}
      <rect x="34" y="22" width="5" height="16" rx="0.5" fill="#4a8abf" stroke="#3a6a9a" strokeWidth="0.4"/>
      <defs>
        <linearGradient id="calcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e8f0"/><stop offset="100%" stopColor="#a0b0c0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PaintIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <ellipse cx="22" cy="28" rx="16" ry="14" fill="url(#paletteGrad)" stroke="#8a6a3a" strokeWidth="1"/>
      <circle cx="14" cy="24" r="3" fill="#e53935"/>
      <circle cx="20" cy="18" r="3" fill="#1e88e5"/>
      <circle cx="28" cy="18" r="3" fill="#43a047"/>
      <circle cx="32" cy="24" r="3" fill="#fdd835"/>
      <circle cx="28" cy="32" r="3" fill="#8e24aa"/>
      <circle cx="18" cy="33" r="2.5" fill="#ff8f00"/>
      <ellipse cx="24" cy="27" rx="3" ry="2.5" fill="url(#paletteHole)"/>
      <path d="M32 8 L36 4 Q38 2 40 4 L44 8 Q46 10 44 12 L36 20 L28 16Z" fill="url(#brushGrad)" stroke="#5a4a2a" strokeWidth="0.8"/>
      <path d="M28 16 L32 20 L30 22 L26 18Z" fill="#c0a060"/>
      <defs>
        <linearGradient id="paletteGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e6c8"/><stop offset="100%" stopColor="#c8a878"/>
        </linearGradient>
        <radialGradient id="paletteHole">
          <stop offset="0%" stopColor="#5a4a2a"/><stop offset="100%" stopColor="#3a2a1a"/>
        </radialGradient>
        <linearGradient id="brushGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d8c0"/><stop offset="100%" stopColor="#a89060"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ControlPanelIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="18" fill="url(#cpGrad)" stroke="#4a6a8a" strokeWidth="1.2"/>
      <circle cx="24" cy="24" r="14" fill="none" stroke="#8aaaca" strokeWidth="0.6"/>
      <path d="M24 6 L26 12 L22 12Z" fill="#4a8abf"/>
      <path d="M24 42 L26 36 L22 36Z" fill="#4a8abf"/>
      <path d="M6 24 L12 22 L12 26Z" fill="#4a8abf"/>
      <path d="M42 24 L36 22 L36 26Z" fill="#4a8abf"/>
      <circle cx="24" cy="24" r="6" fill="url(#cpInner)" stroke="#4a6a8a" strokeWidth="0.8"/>
      <circle cx="24" cy="24" r="2.5" fill="#3a5a8a"/>
      <defs>
        <linearGradient id="cpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f0f8"/><stop offset="100%" stopColor="#8aaaca"/>
        </linearGradient>
        <linearGradient id="cpInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d8e8"/><stop offset="100%" stopColor="#6a8aaa"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MailIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="4" y="10" width="40" height="28" rx="3" fill="url(#mailGrad)" stroke="#4a6a8a" strokeWidth="1"/>
      <path d="M4 13 L24 26 L44 13" fill="none" stroke="#3a5a7a" strokeWidth="1.5"/>
      <path d="M4 38 L18 24" fill="none" stroke="#5a7a9a" strokeWidth="0.6" opacity="0.4"/>
      <path d="M44 38 L30 24" fill="none" stroke="#5a7a9a" strokeWidth="0.6" opacity="0.4"/>
      <defs>
        <linearGradient id="mailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f6fc"/><stop offset="100%" stopColor="#b8cce0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GamesIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="6" y="12" width="36" height="24" rx="12" fill="url(#gameGrad)" stroke="#3a5a3a" strokeWidth="1"/>
      <circle cx="16" cy="24" r="5" fill="none" stroke="#2a4a2a" strokeWidth="1.5"/>
      <line x1="16" y1="20" x2="16" y2="28" stroke="#2a4a2a" strokeWidth="1.5"/>
      <line x1="12" y1="24" x2="20" y2="24" stroke="#2a4a2a" strokeWidth="1.5"/>
      <circle cx="31" cy="21" r="2.5" fill="#e53935" stroke="#8a2a2a" strokeWidth="0.5"/>
      <circle cx="36" cy="26" r="2.5" fill="#1e88e5" stroke="#1a4a7a" strokeWidth="0.5"/>
      <circle cx="31" cy="31" r="2" fill="#43a047" stroke="#2a5a2a" strokeWidth="0.5"/>
      <circle cx="26" cy="26" r="2" fill="#fdd835" stroke="#8a7a1a" strokeWidth="0.5"/>
      <defs>
        <linearGradient id="gameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8e0c8"/><stop offset="100%" stopColor="#4a8a4a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── APP ICONS ──────────────────────────────────────────────────
export function MediaPlayerIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="20" fill="url(#mpGrad)" stroke="#2a3a5a" strokeWidth="1"/>
      <circle cx="24" cy="24" r="16" fill="url(#mpInner)"/>
      <polygon points="20,14 36,24 20,34" fill="white" opacity="0.9"/>
      <defs>
        <linearGradient id="mpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a6a9a"/><stop offset="100%" stopColor="#1a2a4a"/>
        </linearGradient>
        <radialGradient id="mpInner">
          <stop offset="0%" stopColor="#3a6aaa"/><stop offset="100%" stopColor="#1a3a6a"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

export function PhotoIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="6" y="8" width="36" height="32" rx="2" fill="url(#photoGrad)" stroke="#5a7a3a" strokeWidth="1"/>
      <rect x="8" y="10" width="32" height="26" fill="#1a3a1a"/>
      <path d="M8 32 L18 22 L26 30 L32 24 L40 32 L40 36 L8 36Z" fill="#3a8a3a" opacity="0.8"/>
      <circle cx="16" cy="18" r="4" fill="#fdd835"/>
      <defs>
        <linearGradient id="photoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ac060"/><stop offset="100%" stopColor="#4a7a2a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TerminalIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="4" y="6" width="40" height="36" rx="2" fill="#1a1a1a" stroke="#4a4a4a" strokeWidth="1"/>
      <rect x="4" y="6" width="40" height="6" fill="url(#termBar)"/>
      <text x="8" y="22" fontSize="9" fontFamily="monospace" fill="#c0c0c0">C:\&gt;_</text>
      <rect x="32" y="18" width="6" height="2" fill="#c0c0c0" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite"/>
      </rect>
      <defs>
        <linearGradient id="termBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a4a"/><stop offset="100%" stopColor="#2a2a2a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MinesweeperIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="16" fill="url(#mineGrad)" stroke="#3a3a3a" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="8" fill="#2a2a2a"/>
      <line x1="24" y1="4" x2="24" y2="44" stroke="#2a2a2a" strokeWidth="3"/>
      <line x1="4" y1="24" x2="44" y2="24" stroke="#2a2a2a" strokeWidth="3"/>
      <line x1="10" y1="10" x2="38" y2="38" stroke="#2a2a2a" strokeWidth="2.5"/>
      <line x1="38" y1="10" x2="10" y2="38" stroke="#2a2a2a" strokeWidth="2.5"/>
      <circle cx="24" cy="24" r="5" fill="url(#mineInner)"/>
      <circle cx="21" cy="21" r="1.5" fill="white" opacity="0.6"/>
      <defs>
        <linearGradient id="mineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#808080"/><stop offset="100%" stopColor="#404040"/>
        </linearGradient>
        <radialGradient id="mineInner">
          <stop offset="0%" stopColor="#606060"/><stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

export function TaskManagerIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="6" y="6" width="36" height="36" rx="2" fill="url(#tmGrad)" stroke="#2a5a2a" strokeWidth="1"/>
      <rect x="10" y="10" width="28" height="28" fill="#0a2a0a"/>
      <polyline points="12,34 18,28 22,32 28,18 34,14" fill="none" stroke="#4aff4a" strokeWidth="2"/>
      <line x1="12" y1="22" x2="36" y2="22" stroke="#1a4a1a" strokeWidth="0.5"/>
      <line x1="22" y1="12" x2="22" y2="36" stroke="#1a4a1a" strokeWidth="0.5"/>
      <defs>
        <linearGradient id="tmGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a8a4a"/><stop offset="100%" stopColor="#1a4a1a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SystemIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="8" y="6" width="32" height="36" rx="2" fill="url(#sysGrad)" stroke="#5a7a9a" strokeWidth="1"/>
      <rect x="8" y="6" width="32" height="8" fill="url(#sysBanner)"/>
      <text x="14" y="12" fontSize="6" fill="white" fontWeight="bold">Windows</text>
      <rect x="12" y="18" width="24" height="4" rx="1" fill="#dce8f4"/>
      <rect x="12" y="18" width="16" height="4" rx="1" fill="#4a8abf"/>
      <rect x="12" y="26" width="24" height="3" rx="1" fill="#e8eef4"/>
      <rect x="12" y="32" width="24" height="3" rx="1" fill="#e8eef4"/>
      <rect x="12" y="38" width="12" height="2" rx="0.5" fill="#ccd8e4"/>
      <defs>
        <linearGradient id="sysGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f8fc"/><stop offset="100%" stopColor="#d0dce8"/>
        </linearGradient>
        <linearGradient id="sysBanner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a5a9a"/><stop offset="100%" stopColor="#3a8ad0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WEIIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="6" y="6" width="36" height="36" rx="3" fill="url(#weiGrad)" stroke="#3a6a9a" strokeWidth="1"/>
      <rect x="11" y="26" width="6" height="12" rx="1" fill="#4a8abf"/>
      <rect x="21" y="18" width="6" height="20" rx="1" fill="#3a7aaf"/>
      <rect x="31" y="12" width="6" height="26" rx="1" fill="#2a6a9f"/>
      <line x1="10" y1="40" x2="38" y2="40" stroke="#5a8aaa" strokeWidth="0.8"/>
      <defs>
        <linearGradient id="weiGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f0ff"/><stop offset="100%" stopColor="#a0c8e8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── FILESYSTEM ICONS (SMALL) ──────────────────────────────────
export function FileIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <path d="M4 2 L12 2 L16 6 L16 18 L4 18Z" fill="url(#fileG)" stroke="#8a9aaa" strokeWidth="0.6"/>
      <path d="M12 2 L12 6 L16 6" fill="#c8d8e8" stroke="#8a9aaa" strokeWidth="0.4"/>
      <defs>
        <linearGradient id="fileG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#e0e8f0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TextFileIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <path d="M4 2 L12 2 L16 6 L16 18 L4 18Z" fill="url(#txtG)" stroke="#8a9aaa" strokeWidth="0.6"/>
      <path d="M12 2 L12 6 L16 6" fill="#c8d8e8" stroke="#8a9aaa" strokeWidth="0.4"/>
      <line x1="6" y1="9" x2="14" y2="9" stroke="#aab" strokeWidth="0.5"/>
      <line x1="6" y1="11" x2="14" y2="11" stroke="#aab" strokeWidth="0.5"/>
      <line x1="6" y1="13" x2="14" y2="13" stroke="#aab" strokeWidth="0.5"/>
      <line x1="6" y1="15" x2="10" y2="15" stroke="#aab" strokeWidth="0.5"/>
      <defs>
        <linearGradient id="txtG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#e0e8f0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ImageFileIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <rect x="3" y="3" width="14" height="14" rx="1" fill="url(#imgG)" stroke="#5a7a3a" strokeWidth="0.6"/>
      <path d="M3 14 L8 9 L12 13 L14 11 L17 14 L17 17 L3 17Z" fill="#5a9a3a" opacity="0.7"/>
      <circle cx="7" cy="7" r="2" fill="#fdd835"/>
      <defs>
        <linearGradient id="imgG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d888"/><stop offset="100%" stopColor="#5a8a3a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function VideoFileIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <rect x="2" y="4" width="16" height="12" rx="1" fill="url(#vidG)" stroke="#4a4a6a" strokeWidth="0.6"/>
      <polygon points="8,7 14,10 8,13" fill="white" opacity="0.85"/>
      <defs>
        <linearGradient id="vidG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a6a9a"/><stop offset="100%" stopColor="#2a3a5a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AppIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <rect x="3" y="3" width="14" height="14" rx="2" fill="url(#appG)" stroke="#4a6a8a" strokeWidth="0.6"/>
      <polygon points="8,6 14,10 8,14" fill="white" opacity="0.8"/>
      <defs>
        <linearGradient id="appG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a9ad0"/><stop offset="100%" stopColor="#2a5a8a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SystemFileIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <circle cx="10" cy="10" r="7" fill="url(#sfG)" stroke="#5a6a7a" strokeWidth="0.6"/>
      <circle cx="10" cy="10" r="3" fill="#4a6a8a"/>
      <path d="M10 3 L11 6 L9 6Z" fill="#6a8aaa"/>
      <path d="M10 17 L11 14 L9 14Z" fill="#6a8aaa"/>
      <path d="M3 10 L6 9 L6 11Z" fill="#6a8aaa"/>
      <path d="M17 10 L14 9 L14 11Z" fill="#6a8aaa"/>
      <defs>
        <linearGradient id="sfG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0dce8"/><stop offset="100%" stopColor="#8aa0b8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DllIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <rect x="3" y="3" width="14" height="14" rx="1" fill="url(#dllG)" stroke="#6a7a8a" strokeWidth="0.6"/>
      <rect x="5" y="6" width="4" height="3" rx="0.5" fill="#4a6a8a" opacity="0.6"/>
      <rect x="11" y="6" width="4" height="3" rx="0.5" fill="#4a6a8a" opacity="0.6"/>
      <rect x="5" y="11" width="4" height="3" rx="0.5" fill="#4a6a8a" opacity="0.6"/>
      <rect x="11" y="11" width="4" height="3" rx="0.5" fill="#4a6a8a" opacity="0.6"/>
      <defs>
        <linearGradient id="dllG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f0f8"/><stop offset="100%" stopColor="#a0b0c0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DriveIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <rect x="2" y="5" width="16" height="10" rx="1.5" fill="url(#driveG)" stroke="#5a7a9a" strokeWidth="0.6"/>
      <rect x="4" y="7" width="8" height="6" rx="0.5" fill="#3a5a7a" opacity="0.3"/>
      <circle cx="15" cy="12" r="1.5" fill="#4aff4a" opacity="0.8"/>
      <defs>
        <linearGradient id="driveG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8e0e8"/><stop offset="100%" stopColor="#8a98a8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FolderSmallIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
      <path d="M2 6 L2 16 Q2 17 3 17 L17 17 Q18 17 18 16 L18 8 Q18 7 17 7 L10 7 L8 5 Q7.5 4.5 7 4.5 L3 4.5 Q2 4.5 2 5.5Z" fill="url(#fSmG)" stroke="#c49520" strokeWidth="0.4"/>
      <path d="M2 8 L18 8 L18 16 Q18 17 17 17 L3 17 Q2 17 2 16Z" fill="url(#fSmF)" opacity="0.9"/>
      <defs>
        <linearGradient id="fSmG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdd835"/><stop offset="100%" stopColor="#e6a817"/>
        </linearGradient>
        <linearGradient id="fSmF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe082"/><stop offset="100%" stopColor="#f9c22e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── SYSTEM TRAY / TASKBAR ICONS ───────────────────────────────
export function NetworkIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
      <rect x="2" y="10" width="2" height="4" fill="#8aff8a"/>
      <rect x="5" y="8" width="2" height="6" fill="#8aff8a"/>
      <rect x="8" y="5" width="2" height="9" fill="#8aff8a"/>
      <rect x="11" y="2" width="2" height="12" fill="#8aff8a"/>
    </svg>
  );
}

export function VolumeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M2 6 L4 6 L8 2 L8 14 L4 10 L2 10Z" fill="currentColor"/>
      <path d="M10 4 Q14 8 10 12" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M11 6 Q13 8 11 10" fill="none" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );
}

export function VolumeMuteIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M2 6 L4 6 L8 2 L8 14 L4 10 L2 10Z" fill="currentColor"/>
      <line x1="10" y1="5" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="15" y1="5" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function BatteryIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
      <rect x="1" y="4" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
      <rect x="13" y="6" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.6"/>
      <rect x="2.5" y="5.5" width="9" height="5" rx="0.5" fill="#4aff4a" opacity="0.8"/>
    </svg>
  );
}

// ── WINDOW ICONS ───────────────────────────────────────────────
export function WindowIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
      <rect x="2" y="2" width="12" height="12" rx="1" fill="url(#winI)" stroke="#4a6a8a" strokeWidth="0.6"/>
      <rect x="2" y="2" width="12" height="3" fill="#4a8abf" rx="1"/>
      <defs>
        <linearGradient id="winI" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f0f8"/><stop offset="100%" stopColor="#c8d8e8"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── START MENU ─────────────────────────────────────────────────
export function UserIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="12" r="7" fill="url(#userHead)" stroke="#5a7a9a" strokeWidth="0.8"/>
      <ellipse cx="16" cy="28" rx="12" ry="8" fill="url(#userBody)" stroke="#5a7a9a" strokeWidth="0.8"/>
      <defs>
        <linearGradient id="userHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8cce0"/><stop offset="100%" stopColor="#6a8aaa"/>
        </linearGradient>
        <linearGradient id="userBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a8abf"/><stop offset="100%" stopColor="#2a5a8a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ShutdownIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="8" y1="2" x2="8" y2="8" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="4.5"/>
      <line x1="10.5" y1="10.5" x2="14" y2="14"/>
    </svg>
  );
}

export function RunIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
      <rect x="1" y="3" width="14" height="10" rx="1" fill="#1a1a2a" stroke="#4a6a8a" strokeWidth="0.8"/>
      <text x="3" y="10" fontSize="6" fontFamily="monospace" fill="#8aff8a">&gt;_</text>
    </svg>
  );
}

// ── NAVIGATION ─────────────────────────────────────────────────
export function BackArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M10 2 L4 8 L10 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ForwardArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M6 2 L12 8 L6 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RefreshIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8 A6 6 0 1 1 8 14"/>
      <path d="M2 4 L2 8 L6 8"/>
    </svg>
  );
}

// ── MISC ───────────────────────────────────────────────────────
export function PicturesFolderIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M4 12 L4 40 Q4 42 6 42 L42 42 Q44 42 44 40 L44 16 Q44 14 42 14 L22 14 L18 10 Q17 9 16 9 L6 9 Q4 9 4 11Z" fill="url(#picFG)" stroke="#c49520" strokeWidth="0.8"/>
      <path d="M4 16 L44 16 L44 40 Q44 42 42 42 L6 42 Q4 42 4 40Z" fill="url(#picFF)" opacity="0.9"/>
      <path d="M14 34 L22 26 L28 32 L32 28 L38 34Z" fill="#5a9a3a" opacity="0.5"/>
      <circle cx="18" cy="24" r="3" fill="#fdd835" opacity="0.6"/>
      <defs>
        <linearGradient id="picFG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdd835"/><stop offset="100%" stopColor="#e6a817"/>
        </linearGradient>
        <linearGradient id="picFF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe082"/><stop offset="100%" stopColor="#f9c22e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function VideosFolderIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path d="M4 12 L4 40 Q4 42 6 42 L42 42 Q44 42 44 40 L44 16 Q44 14 42 14 L22 14 L18 10 Q17 9 16 9 L6 9 Q4 9 4 11Z" fill="url(#vidFG)" stroke="#c49520" strokeWidth="0.8"/>
      <path d="M4 16 L44 16 L44 40 Q44 42 42 42 L6 42 Q4 42 4 40Z" fill="url(#vidFF)" opacity="0.9"/>
      <polygon points="20,24 32,30 20,36" fill="#3a5a8a" opacity="0.5"/>
      <defs>
        <linearGradient id="vidFG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdd835"/><stop offset="100%" stopColor="#e6a817"/>
        </linearGradient>
        <linearGradient id="vidFF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe082"/><stop offset="100%" stopColor="#f9c22e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── GAME ICONS ─────────────────────────────────────────────────
export function SolitaireIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="8" y="6" width="24" height="32" rx="3" fill="url(#solCardG)" stroke="#5a6a7a" strokeWidth="1"/>
      <rect x="16" y="10" width="24" height="32" rx="3" fill="url(#solCardG2)" stroke="#5a6a7a" strokeWidth="1"/>
      <text x="20" y="28" fontSize="14" fontWeight="bold" fill="#c0392b" fontFamily="serif">A</text>
      <text x="32" y="22" fontSize="10" fill="#c0392b">♥</text>
      <defs>
        <linearGradient id="solCardG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a6a"/><stop offset="100%" stopColor="#2a5a8a"/>
        </linearGradient>
        <linearGradient id="solCardG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#e8eef4"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PurblePlaceIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#purbleG)" stroke="#5a2a8a" strokeWidth="1"/>
      <circle cx="16" cy="16" r="6" fill="#e74c3c" opacity="0.9"/>
      <circle cx="32" cy="16" r="6" fill="#3498db" opacity="0.9"/>
      <circle cx="16" cy="32" r="6" fill="#f39c12" opacity="0.9"/>
      <circle cx="32" cy="32" r="6" fill="#27ae60" opacity="0.9"/>
      <circle cx="16" cy="16" r="2" fill="white" opacity="0.6"/>
      <circle cx="32" cy="16" r="2" fill="white" opacity="0.6"/>
      <circle cx="16" cy="32" r="2" fill="white" opacity="0.6"/>
      <circle cx="32" cy="32" r="2" fill="white" opacity="0.6"/>
      <defs>
        <linearGradient id="purbleG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9b59b6"/><stop offset="100%" stopColor="#6a1b9a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ChessTitansIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <rect x="4" y="4" width="40" height="40" rx="3" fill="#1a1a2e" stroke="#4a4a6a" strokeWidth="1"/>
      {/* Checkerboard pattern */}
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        (r + c) % 2 === 0 ? <rect key={`${r}${c}`} x={8+c*8} y={8+r*8} width="8" height="8" fill="#e8d4a0" opacity="0.9"/> :
        <rect key={`${r}${c}`} x={8+c*8} y={8+r*8} width="8" height="8" fill="#b08850" opacity="0.9"/>
      )))}
      {/* King piece */}
      <text x="18" y="32" fontSize="18" fill="white" fontFamily="serif">♚</text>
      <defs/>
    </svg>
  );
}

