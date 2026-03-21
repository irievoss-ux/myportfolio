"use client";
import { useState, useRef, useEffect } from 'react';

export default function Terminal({ onClose, userName }: any) {
  const [history, setHistory] = useState<string[]>([
    "Microsoft Windows [Version 6.0.6002]",
    "Copyright (c) 2006 Microsoft Corporation.  All rights reserved.",
    ""
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.toLowerCase().trim();
    let response = "";

    switch (cmd) {
      case 'help':
        response = "Available commands: HELP, DIR, WHOAMI, CLS, EXIT, COLOR, DATE";
        break;
      case 'whoami':
        response = `irievoss-pc\\${userName.toLowerCase().replace(/\s/g, '')}`;
        break;
      case 'cls':
        setHistory([]);
        setInput("");
        return;
      case 'exit':
        onClose();
        return;
      case 'dir':
        response = " Volume in drive C is OSDisk\n Directory of C:\\Windows\\System32\n\n03/21/2006  12:00 PM    <DIR>          .\n03/21/2006  12:00 PM    <DIR>          ..\n03/21/2006  09:45 AM           402,432 cmd.exe\n03/21/2006  09:45 AM         1,204,224 kernel32.dll\n               2 File(s)      1,606,656 bytes";
        break;
      case 'date':
        response = `The current date is: ${new Date().toLocaleDateString()}`;
        break;
      case 'color a':
        // Classic matrix green Easter egg
        const terminal = document.getElementById('terminal-body');
        if (terminal) terminal.style.color = "#00FF00";
        response = "Color changed to light green.";
        break;
      default:
        response = `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
    }

    setHistory([...history, `C:\\Windows\\System32>${input}`, response, ""]);
    setInput("");
  };

  return (
    <div 
      id="terminal-body"
      className="flex flex-col h-full bg-black text-white font-mono text-xs p-2 overflow-hidden"
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto whitespace-pre-wrap mb-2">
        {history.map((line, i) => (
          <div key={i} className="min-h-[1em]">{line}</div>
        ))}
      </div>
      
      <form onSubmit={handleCommand} className="flex">
        <span className="shrink-0 text-white">C:\Windows\System32&gt;</span>
        <input
          id="terminal-input"
          autoFocus
          className="flex-1 bg-transparent outline-none border-none text-white ml-1 p-0 font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}