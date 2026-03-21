"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { createVistaFileSystem, getChildrenAtPath, getNodeAtPath, pathToWindowsString, type VistaPath, type VistaNode } from '@/lib/vista/filesystem';
import { useVistaProfile } from './providers/VistaProfileProvider';

export default function Terminal({ onClose }: { onClose: () => void }) {
  const { accountFolder } = useVistaProfile();
  const fileSystem = useMemo(() => createVistaFileSystem(accountFolder), [accountFolder]);
  const [cwd, setCwd] = useState<VistaPath>(['Computer', 'OSDisk (C:)', 'Windows', 'System32']);
  const [history, setHistory] = useState<string[]>([
    'Microsoft Windows [Version 6.0.6002]',
    '(C) 2006 Microsoft Corporation. All rights reserved.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textColor, setTextColor] = useState('white');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const prompt = `${pathToWindowsString(cwd).replace('Computer\\OSDisk (C:)', 'C:')}>`;

  const appendHistory = (lines: string[]) => setHistory((current) => [...current, ...lines, '']);

  const formatPath = (path: string) => path.replace('Computer\\OSDisk (C:)', 'C:').replace(`Computer\\OSDisk (C:)\\Users\\${accountFolder}`, '%USERPROFILE%');

  const listDirectory = (targetPath: VistaPath) => {
    const items = getChildrenAtPath(fileSystem, targetPath);
    const header = ` Directory of ${formatPath(pathToWindowsString(targetPath))}`;
    const lines = items.map((item) => `${item.modified ?? '11/08/2006  09:45 PM'}    ${'children' in item ? '<DIR>' : '     '}    ${item.name}`);
    return [' Volume in drive C is OSDisk', header, '', ...lines, '', `               ${items.length} File(s)`, `               ${items.filter(i => 'children' in i).length} Dir(s)  48,232,140,800 bytes free`];
  };

  const buildTree = (node: VistaNode, prefix: string = '', isLast: boolean = true): string[] => {
    const lines: string[] = [];
    const connector = isLast ? '└── ' : '├── ';
    lines.push(`${prefix}${connector}${node.name}`);
    if ('children' in node) {
      const children = node.children;
      children.forEach((child, index) => {
        const childPrefix = prefix + (isLast ? '    ' : '│   ');
        lines.push(...buildTree(child, childPrefix, index === children.length - 1));
      });
    }
    return lines;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const raw = input.trim();
    if (!raw) return;

    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    const normalized = raw.toLowerCase();
    appendHistory([`${prompt}${raw}`]);

    if (normalized === 'exit') {
      onClose();
      return;
    }

    if (normalized === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    if (normalized === 'help') {
      appendHistory([
        'For more information on a specific command, type HELP command-name',
        '',
        'CD          Changes the current directory.',
        'CLS         Clears the screen.',
        'COLOR       Sets the colors of the console.',
        'DATE        Displays the date.',
        'DIR         Displays a list of files and directories.',
        'ECHO        Displays messages.',
        'EXIT        Quits the command prompt.',
        'HELP        Provides help information for commands.',
        'IPCONFIG    Displays network configuration.',
        'PING        Sends test packets to a host.',
        'SYSTEMINFO  Displays system information.',
        'TIME        Displays the system time.',
        'TREE        Displays the directory structure.',
        'TYPE        Displays the contents of a text file.',
        'VER         Displays the Windows version.',
        'WHOAMI      Displays the current user.',
      ]);
      setInput('');
      return;
    }

    if (normalized === 'dir') {
      appendHistory(listDirectory(cwd));
      setInput('');
      return;
    }

    if (normalized.startsWith('cd ')) {
      const target = raw.slice(3).trim();
      if (target === '..') {
        if (cwd.length > 1) setCwd((current) => current.slice(0, -1));
      } else if (target === '\\' || target === '/') {
        setCwd(['Computer', 'OSDisk (C:)']);
      } else {
        const children = getChildrenAtPath(fileSystem, cwd);
        const next = children.find((child) => 'children' in child && child.name.toLowerCase() === target.toLowerCase());
        if (next && 'children' in next) {
          setCwd((current) => [...current, next.name]);
        } else {
          appendHistory([`The system cannot find the path specified: ${target}`]);
        }
      }
      setInput('');
      return;
    }

    if (normalized === 'whoami') {
      appendHistory([`irievista\\${accountFolder.toLowerCase()}`]);
      setInput('');
      return;
    }

    if (normalized === 'date') {
      appendHistory([`The current date is: ${new Date().toLocaleDateString()}`]);
      setInput('');
      return;
    }

    if (normalized === 'time') {
      appendHistory([`The current time is: ${new Date().toLocaleTimeString()}`]);
      setInput('');
      return;
    }

    if (normalized === 'ver') {
      appendHistory([`Microsoft Windows [Version 6.0.6002]`]);
      setInput('');
      return;
    }

    if (normalized.startsWith('echo ')) {
      appendHistory([raw.slice(5)]);
      setInput('');
      return;
    }

    if (normalized === 'tree') {
      try {
        const node = getNodeAtPath(fileSystem, cwd);
        const lines = buildTree(node);
        appendHistory([formatPath(pathToWindowsString(cwd)), ...lines]);
      } catch {
        appendHistory(['Error reading directory tree.']);
      }
      setInput('');
      return;
    }

    if (normalized.startsWith('type ')) {
      const filename = raw.slice(5).trim();
      try {
        const children = getChildrenAtPath(fileSystem, cwd);
        const file = children.find((c) => c.name.toLowerCase() === filename.toLowerCase());
        if (file && 'content' in file) {
          appendHistory([file.content]);
        } else if (file) {
          appendHistory([`Cannot display binary file: ${filename}`]);
        } else {
          appendHistory([`The system cannot find the file specified: ${filename}`]);
        }
      } catch {
        appendHistory([`Error reading file: ${filename}`]);
      }
      setInput('');
      return;
    }

    if (normalized === 'ipconfig') {
      appendHistory([
        'Windows IP Configuration',
        '',
        'Ethernet adapter Local Area Connection:',
        '',
        '   Connection-specific DNS Suffix  . : irievista.local',
        '   IPv4 Address. . . . . . . . . . . : 192.168.1.42',
        '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
        '   Default Gateway . . . . . . . . . : 192.168.1.1',
      ]);
      setInput('');
      return;
    }

    if (normalized.startsWith('ping ')) {
      const host = raw.slice(5).trim() || 'localhost';
      appendHistory([
        `Pinging ${host} with 32 bytes of data:`,
        `Reply from ${host}: bytes=32 time<1ms TTL=128`,
        `Reply from ${host}: bytes=32 time<1ms TTL=128`,
        `Reply from ${host}: bytes=32 time<1ms TTL=128`,
        `Reply from ${host}: bytes=32 time<1ms TTL=128`,
        '',
        `Ping statistics for ${host}:`,
        '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),',
        'Approximate round trip times in milli-seconds:',
        '    Minimum = 0ms, Maximum = 0ms, Average = 0ms',
      ]);
      setInput('');
      return;
    }

    if (normalized === 'systeminfo') {
      appendHistory([
        `Host Name:                 IRIEVISTA`,
        `OS Name:                   Microsoft Windows Vista Ultimate`,
        `OS Version:                6.0.6002 Service Pack 2 Build 6002`,
        `OS Manufacturer:           Microsoft Corporation`,
        `System Manufacturer:       Custom Build`,
        `System Model:              Portfolio Terminal`,
        `System Type:               x64-based PC`,
        `Processor(s):              1 Processor(s) Installed.`,
        `                           Intel(R) Core(TM)2 Duo CPU @ 2.40GHz`,
        `Total Physical Memory:     4,096 MB`,
        `Available Physical Memory: 2,847 MB`,
        `Page File:                 8,192 MB`,
        `Domain:                    WORKGROUP`,
        `Logon Server:              \\\\IRIEVISTA`,
      ]);
      setInput('');
      return;
    }

    if (normalized.startsWith('color ')) {
      const code = raw.slice(6).trim().toLowerCase();
      const colorMap: Record<string, string> = {
        '0': 'black', 'a': '#88ff88', 'b': '#5555ff', 'c': '#ff5555',
        'd': '#ff55ff', 'e': '#ffff55', 'f': 'white', '2': '#22cc22',
        '3': '#22cccc', '9': '#5555ff',
      };
      const newColor = colorMap[code] ?? 'white';
      setTextColor(newColor);
      appendHistory([`Color changed.`]);
      setInput('');
      return;
    }

    appendHistory([`'${raw}' is not recognized as an internal or external command, operable program or batch file.`]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-black p-3 font-mono text-xs" style={{ color: textColor }} onClick={() => document.getElementById('vista-terminal-input')?.focus()}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto whitespace-pre-wrap pr-2">
        {history.map((line, index) => (
          <div key={`${line}-${index}`} className="min-h-[1.2em]">{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex items-center">
        <span className="shrink-0">{prompt}</span>
        <input
          id="vista-terminal-input"
          autoFocus
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          className="ml-1 flex-1 bg-transparent outline-none"
          style={{ color: textColor, caretColor: textColor }}
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
