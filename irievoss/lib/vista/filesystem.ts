import { HINTS_DATA } from '@/components/Hints';

export type VistaNodeType = 'root' | 'drive' | 'folder' | 'text' | 'video' | 'image' | 'app' | 'system';

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

export interface VistaImageNode extends VistaNodeBase {
  type: 'image';
  url: string;
}

export interface VistaAppNode extends VistaNodeBase {
  type: 'app';
  windowId: string;
  requiresElevation?: boolean;
  launchPath?: VistaPath;
}

export interface VistaSystemNode extends VistaNodeBase {
  type: 'system';
  content: string;
}

export type VistaNode = VistaFolderNode | VistaTextNode | VistaVideoNode | VistaImageNode | VistaAppNode | VistaSystemNode;
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
                  {
                    name: 'branding.txt',
                    type: 'text',
                    icon: '📄',
                    size: '2 KB',
                    modified: stamp,
                    content: 'Internet Explorer is now your guided portfolio portal. Tabs, settings, and shortcuts all work.',
                  },
                ],
              },
              {
                name: 'Windows Mail',
                type: 'folder',
                icon: '📁',
                modified: stamp,
                children: [
                  {
                    name: 'WinMail.exe',
                    type: 'app',
                    icon: '✉️',
                    size: '2.6 MB',
                    modified: stamp,
                    description: 'Compose a message to Irie',
                    windowId: 'mail',
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
                    name: 'Games Explorer.exe',
                    type: 'app',
                    icon: '🎮',
                    size: '202 KB',
                    modified: stamp,
                    description: 'Open the games library',
                    windowId: 'computer',
                    launchPath: ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Games'],
                  },
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
                        windowId: 'computer',
                        launchPath: ['Computer', 'OSDisk (C:)', 'Users', accountFolder, 'Games'],
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
                        content: `IRIE PROFILE\n\nDisplay Name: Irie\nRole: Broadcaster, tactician, product-minded builder\nFavorite shell: Windows Vista Ultimate\nNote: Every shortcut in this shell is meant to lead to part of the portfolio.`,
                      },
                      {
                        name: 'Experience.txt',
                        type: 'text',
                        icon: '📄',
                        size: '4 KB',
                        modified: stamp,
                        content: `EXPERIENCE SNAPSHOT\n\n• Live broadcast strategy and on-air hosting\n• Community-first product thinking\n• High-fidelity interface design and front-end systems\n• Event ops, creative direction, and content packaging`,
                      },
                      {
                        name: 'Contact Card.txt',
                        type: 'text',
                        icon: '📄',
                        size: '2 KB',
                        modified: stamp,
                        content: `CONTACT\n\nEmail: irievosscontact@gmail.com\nPreferred: Windows Mail inside this shell\nAvailability: Open for collabs, contracts, and creative partnerships`,
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
                        name: 'Desktop Memory.jpg',
                        type: 'image',
                        icon: '🖼️',
                        size: '188 KB',
                        modified: stamp,
                        description: 'A Vista-style portfolio wallpaper memory.',
                        url: '/media/desktop-memory.svg',
                      },
                      {
                        name: 'Workspace Blueprint.png',
                        type: 'image',
                        icon: '🖼️',
                        size: '201 KB',
                        modified: stamp,
                        description: 'A quick map of the portfolio pillars.',
                        url: '/media/workspace-blueprint.svg',
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
                    name: 'winsat.exe',
                    type: 'app',
                    icon: '📈',
                    size: '128 KB',
                    modified: stamp,
                    description: 'Launch performance assessment',
                    windowId: 'wei',
                    requiresElevation: true,
                  },
                  {
                    name: 'systemproperties.exe',
                    type: 'app',
                    icon: '🧾',
                    size: '190 KB',
                    modified: stamp,
                    description: 'Open System Properties',
                    windowId: 'system',
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
                content: `[fonts]\nSegoe UI=segoeui.ttf\n[shell]\nShell=explorer.exe`,
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
              {
                name: 'Broadcast Deck.png',
                type: 'image',
                icon: '🖼️',
                size: '201 KB',
                modified: stamp,
                description: 'Portfolio blueprint export',
                url: '/media/workspace-blueprint.svg',
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
