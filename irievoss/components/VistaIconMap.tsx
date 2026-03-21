// Helper that maps icon string keys to SVG components.
// This replaces ALL emoji usage throughout the OS.

import React from 'react';
import {
  ComputerIcon, IEIcon, RecycleBinIcon, FolderIcon, DocumentsFolderIcon,
  NotepadIcon, CalculatorIcon, PaintIcon, ControlPanelIcon, MailIcon,
  GamesIcon, MediaPlayerIcon, PhotoIcon, TerminalIcon, MinesweeperIcon,
  TaskManagerIcon, SystemIcon, WEIIcon, FileIcon, TextFileIcon,
  ImageFileIcon, VideoFileIcon, AppIcon, SystemFileIcon, DllIcon,
  DriveIcon, FolderSmallIcon, UserIcon, NetworkIcon, VolumeIcon,
  VolumeMuteIcon, BatteryIcon, WindowIcon, PicturesFolderIcon, VideosFolderIcon,
  SearchIcon, RunIcon, ShutdownIcon, BackArrowIcon, ForwardArrowIcon, RefreshIcon,
  SolitaireIcon, PurblePlaceIcon, ChessTitansIcon,
} from './VistaIcons';

// Map of icon key → component, used throughout the entire OS
const iconRegistry: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  computer: ComputerIcon,
  ie: IEIcon,
  recyclebin: RecycleBinIcon,
  folder: FolderIcon,
  'folder-documents': DocumentsFolderIcon,
  'folder-pictures': PicturesFolderIcon,
  'folder-videos': VideosFolderIcon,
  notepad: NotepadIcon,
  calculator: CalculatorIcon,
  paint: PaintIcon,
  controlpanel: ControlPanelIcon,
  mail: MailIcon,
  games: GamesIcon,
  mediaplayer: MediaPlayerIcon,
  photo: PhotoIcon,
  terminal: TerminalIcon,
  minesweeper: MinesweeperIcon,
  taskmanager: TaskManagerIcon,
  system: SystemIcon,
  wei: WEIIcon,
  file: FileIcon,
  'file-text': TextFileIcon,
  'file-image': ImageFileIcon,
  'file-video': VideoFileIcon,
  'file-app': AppIcon,
  'file-system': SystemFileIcon,
  'file-dll': DllIcon,
  drive: DriveIcon,
  'folder-small': FolderSmallIcon,
  user: UserIcon,
  network: NetworkIcon,
  volume: VolumeIcon,
  'volume-mute': VolumeMuteIcon,
  battery: BatteryIcon,
  window: WindowIcon,
  search: SearchIcon,
  run: RunIcon,
  shutdown: ShutdownIcon,
  back: BackArrowIcon,
  forward: ForwardArrowIcon,
  refresh: RefreshIcon,
  solitaire: SolitaireIcon,
  purbleplace: PurblePlaceIcon,
  chesstitans: ChessTitansIcon,
};

export function VistaIcon({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const IconComponent = iconRegistry[name];
  if (!IconComponent) {
    // Fallback for unknown icons
    return <WindowIcon size={size} className={className} />;
  }
  return <IconComponent size={size} className={className} />;
}

// Get icon key from filesystem node type
export function getFileTypeIcon(type: string, name?: string): string {
  if (type === 'folder') return 'folder-small';
  if (type === 'drive') return 'drive';
  if (type === 'text') return 'file-text';
  if (type === 'image') return 'file-image';
  if (type === 'video') return 'file-video';
  if (type === 'app') {
    if (name === 'Solitaire.exe') return 'solitaire';
    if (name === 'Purble Place.exe') return 'purbleplace';
    if (name === 'Chess Titans.exe') return 'chesstitans';
    if (name === 'Minesweeper.exe') return 'minesweeper';
    return 'file-app';
  }
  if (type === 'system') {
    if (name?.endsWith('.dll')) return 'file-dll';
    return 'file-system';
  }
  return 'file';
}

export default VistaIcon;
