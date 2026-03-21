import { HINTS_DATA } from '@/components/Hints';

export type VistaNodeType = 'root' | 'drive' | 'folder' | 'text' | 'video' | 'app' | 'system';

interface VistaNodeBase {
  name: string;
  type: VistaNodeType;
  icon: string;
  description?: string;
  size?: string;
  modified?: string;
  hidden?: boolean;
}

export interface VistaFolderNode extends VistaNodeBase {
  type: 'root' | 'drive' | 'folder';
  children: VistaNode[];
}

export interface VistaTextNode extends VistaNodeBase {
  type: 'text';
  content: string;
}

export interface VistaVideoNode extends VistaNodeBase {
  type: 'video';
  url: string;
  duration: string;
}

export interface VistaAppNode extends VistaNodeBase {
  type: 'app';
  windowId: string;
  requiresElevation?: boolean;
  command?: string;
}

export interface VistaSystemNode extends VistaNodeBase {
  type: 'system';
  content: string;
}

export type VistaNode = VistaFolderNode | VistaTextNode | VistaVideoNode | VistaAppNode | VistaSystemNode;
export type VistaPath = string[];

const stamp = '11/08/2006  09:45 PM';

export function createVistaFileSystem(accountFolder: string): VistaFolderNode {
  return {
    name: 'Computer',
    type: 'root',
    icon: '🖥️',
    description: 'System root',
    children: [
      {
        name: 'OSDisk (C:)',
        type: 'drive',
        icon: '💽',
        description: 'Local Disk',
        size: '120 GB',
        modified: stamp,
        children: [
          {
            name: 'Program Files',
            type: 'folder',
            icon: '📁',
            modified: stamp,
            children: [
              {
                name: 'Internet Explorer',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'iexplore.exe',
                    type: 'app',
                    icon: '🌐',
                    size: '714 KB',
                    modified: stamp,
                    description: 'Launch Internet Explorer',
                    windowId: 'browser',
                  },
                ],
              },
              {
                name: 'Windows Media Player',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'wmplayer.exe',
                    type: 'app',
                    icon: '🎞️',
                    size: '2.2 MB',
                    modified: stamp,
                    description: 'Launch Windows Media Player 11',
                    windowId: 'media',
                  },
                ],
              },
              {
                name: 'Games',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'Minesweeper.exe',
                    type: 'app',
                    icon: '💣',
                    size: '44 KB',
                    modified: stamp,
                    description: 'Classic game binary',
                    windowId: 'minesweeper',
                  },
                ],
              },
            ],
          },
          {
            name: 'Users',
            type: 'folder',
            icon: '📁',
            modified: stamp,
            children: [
              {
                name: accountFolder,
                type: 'folder',
                icon: '👤',
                modified: stamp,
                children: [
                  {
                    name: 'Desktop',
                    type: 'folder',
                    icon: '📁',
                    modified: stamp,
                    children: [
                      {
                        name: 'Games.lnk',
                        type: 'app',
                        icon: '🎮',
                        size: '1 KB',
                        modified: stamp,
                        description: 'Desktop shortcut',
                        windowId: 'minesweeper',
                      },
                    ],
                  },
                  {
                    name: 'Documents',
                    type: 'folder',
                    icon: '📁',
                    modified: stamp,
                    children: [
                      {
                        name: 'About Me.txt',
                        type: 'text',
                        icon: '📄',
                        size: '3 KB',
                        modified: stamp,
                        content: `IRIE PROFILE

Display Name: Irie
Role: Streamer / tactician / builder
Favorite shell: Windows Vista Ultimate
Notes: The shell is clean on purpose. Everything else lives in the file system.`,
                      },
                      {
                        name: 'Aero Moodboard.txt',
                        type: 'text',
                        icon: '📄',
                        size: '2 KB',
                        modified: stamp,
                        content: 'Blurred glass. Soft bloom. Dense shadows. Vista before minimalism became sterile.',
                      },
                      {
                        name: HINTS_DATA.name,
                        type: 'text',
                        icon: '📄',
                        size: HINTS_DATA.size,
                        modified: stamp,
                        content: HINTS_DATA.content,
                      },
                      {
                        name: 'CakeRecipe.txt',
                        type: 'text',
                        icon: '🧁',
                        size: '1 KB',
                        modified: stamp,
                        hidden: true,
                        content: 'The cake is not a lie; it is just hidden behind the details pane.',
                      },
                    ],
                  },
                  {
                    name: 'Pictures',
                    type: 'folder',
                    icon: '🖼️',
                    modified: stamp,
                    children: [
                      {
                        name: 'SelfPortrait.txt',
                        type: 'text',
                        icon: '📄',
                        size: '1 KB',
                        modified: stamp,
                        content: 'Photo Gallery is intentionally dormant. Vista-era text galleries still count.',
                      },
                    ],
                  },
                  {
                    name: 'Videos',
                    type: 'folder',
                    icon: '🎬',
                    modified: stamp,
                    children: [
                      {
                        name: 'Aurora Dreamscape.mp4',
                        type: 'video',
                        icon: '🎥',
                        size: '1.3 MB',
                        modified: stamp,
                        duration: '00:13',
                        description: 'Sample local media clip',
                        url: '/media/aurora-dreamscape.mp4',
                      },
                    ],
                  },
                  {
                    name: 'Games',
                    type: 'folder',
                    icon: '🎮',
                    modified: stamp,
                    children: [
                      {
                        name: 'Minesweeper.exe',
                        type: 'app',
                        icon: '💣',
                        size: '44 KB',
                        modified: stamp,
                        description: 'Launch Minesweeper',
                        windowId: 'minesweeper',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Public',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'Shared Videos',
                    type: 'folder',
                    icon: '📁',
                    modified: stamp,
                    children: [
                      {
                        name: 'Vista Showcase.mp4',
                        type: 'video',
                        icon: '🎞️',
                        size: '1.3 MB',
                        modified: stamp,
                        duration: '00:13',
                        description: 'Public media sample',
                        url: '/media/aurora-dreamscape.mp4',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'Windows',
            type: 'folder',
            icon: '📁',
            modified: stamp,
            children: [
              {
                name: 'System32',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'cmd.exe',
                    type: 'app',
                    icon: '🖥️',
                    size: '402 KB',
                    modified: stamp,
                    description: 'Launch elevated command prompt',
                    windowId: 'terminal',
                    requiresElevation: true,
                    command: 'cmd',
                  },
                  {
                    name: 'Taskmgr.exe',
                    type: 'app',
                    icon: '📊',
                    size: '684 KB',
                    modified: stamp,
                    description: 'Launch Task Manager',
                    windowId: 'taskmanager',
                    requiresElevation: true,
                  },
                  {
                    name: 'control.exe',
                    type: 'app',
                    icon: '⚙️',
                    size: '712 KB',
                    modified: stamp,
                    description: 'Launch Control Panel',
                    windowId: 'controlpanel',
                    requiresElevation: true,
                  },
                  {
                    name: 'explorer.exe',
                    type: 'app',
                    icon: '🗂️',
                    size: '1.9 MB',
                    modified: stamp,
                    description: 'Launch shell window',
                    windowId: 'computer',
                  },
                  {
                    name: 'kernel32.dll',
                    type: 'system',
                    icon: '⚙️',
                    size: '1.1 MB',
                    modified: stamp,
                    content: 'System DLL loaded successfully. (Mock binary details only.)',
                  },
                ],
              },
              {
                name: 'Media',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'startup.wav',
                    type: 'text',
                    icon: '🎵',
                    size: '512 KB',
                    modified: stamp,
                    content: 'Startup sound asset registered. See public/startup.mp3 for the modern stand-in.',
                  },
                ],
              },
              {
                name: 'win.ini',
                type: 'text',
                icon: '📄',
                size: '1 KB',
                modified: stamp,
                content: `[fonts]
Segoe UI=segoeui.ttf
[shell]
Shell=explorer.exe`,
              },
            ],
          },
        ],
      },
      {
        name: 'Data (D:)',
        type: 'drive',
        icon: '💿',
        description: 'Archive drive',
        size: '320 GB',
        modified: stamp,
        children: [
          {
            name: 'Captured Footage',
            type: 'folder',
            icon: '📁',
            modified: stamp,
            children: [
              {
                name: 'LAN Party 2006.mp4',
                type: 'video',
                icon: '🎬',
                size: '1.3 MB',
                modified: stamp,
                duration: '00:13',
                description: 'Archived local video',
                url: '/media/aurora-dreamscape.mp4',
              },
            ],
          },
        ],
      },
    ],
  };
}

export function getNodeAtPath(root: VistaFolderNode, path: VistaPath): VistaNode {
  let current: VistaNode = root;

  for (const segment of path.slice(1)) {
    if (!('children' in current)) {
      throw new Error(`Path segment ${segment} is not a folder`);
    }

    const nextNode: VistaNode | undefined = current.children.find((child) => child.name === segment);
    if (!nextNode) {
      throw new Error(`Path segment ${segment} was not found`);
    }
    current = nextNode;
  }

  return current;
}

export function getChildrenAtPath(root: VistaFolderNode, path: VistaPath): VistaNode[] {
  const node = getNodeAtPath(root, path);
  return 'children' in node ? node.children : [];
}

export function pathToWindowsString(path: VistaPath): string {
  const translated = path.map((segment, index) => {
    if (index === 0) return 'Computer';
    return segment;
  });
  return translated.join('\\');
}
