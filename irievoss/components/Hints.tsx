export const HINTS_DATA = {
  name: 'HINTS.txt',
  type: 'text' as const,
  size: '4 KB',
  content: `HINTS.TXT
==============================
1. Secure Desktop only appears for protected tools such as Control Panel and cmd.exe.
2. Search inside C:\Users\Irie\Documents for personal notes and hidden callbacks.
3. The desktop is intentionally sparse: Computer, Network, and Games only.
4. Try COLOR A in cmd.exe if you remember your old LAN-party tricks.
5. Some clues are buried in System32 and in the sample videos library.`,
};

export default function Hints() {
  return (
    <pre className="h-full overflow-auto bg-white p-4 font-mono text-xs leading-5 text-black whitespace-pre-wrap">
      {HINTS_DATA.content}
    </pre>
  );
}
