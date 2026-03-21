"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { createVistaFileSystem, getChildrenAtPath, pathToWindowsString, type VistaPath } from '@/lib/vista/filesystem';
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const prompt = `${pathToWindowsString(cwd).replace('Computer\\OSDisk (C:)', 'C:')}>`;

  const appendHistory = (lines: string[]) => setHistory((current) => [...current, ...lines, '']);

  const listDirectory = (targetPath: VistaPath) => {
    const items = getChildrenAtPath(fileSystem, targetPath);
    const header = ` Directory of ${pathToWindowsString(targetPath)
      .replace('Computer\\OSDisk (C:)', 'C:')
      .replace(`Computer\\OSDisk (C:)\\Users\\${accountFolder}`, '%USERPROFILE%')}`;
    const lines = items.map((item) => `${item.modified ?? '11/08/2006  09:45 PM'}    ${'children' in item ? '<DIR>' : '     '}    ${item.name}`);
    return [' Volume in drive C is OSDisk', header, '', ...lines];
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const raw = input.trim();
    if (!raw) return;

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
      appendHistory(['HELP  DIR  CD  WHOAMI  DATE  CLS  EXIT  COLOR A']);
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

    if (normalized === 'color a') {
      const terminal = document.getElementById('terminal-body');
      if (terminal) terminal.style.color = '#88ff88';
      appendHistory(['Color changed to light green.']);
      setInput('');
      return;
    }

    appendHistory([`'${raw}' is not recognized as an internal or external command, operable program or batch file.`]);
    setInput('');
  };

  return (
    <div id="terminal-body" className="flex h-full flex-col bg-black p-3 font-mono text-xs text-white" onClick={() => document.getElementById('vista-terminal-input')?.focus()}>
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
          className="ml-1 flex-1 bg-transparent outline-none"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
