"use client";

// EDIT YOUR HINTS HERE
export const HINTS_DATA = {
  name: "HINTS.txt",
  type: "text",
  content: `HINTS:

1. Search the C: drive for hidden system files.
2. You can change the user profile in the Control Panel.
3. My TFT stats are real-time in the sidebar.
4. Try to end the Explorer task in Task Manager if you want to break the OS.

-- Irie Voss`
};

export default function Hints() {
  return (
    <pre className="font-mono text-xs whitespace-pre-wrap p-2 text-black bg-white h-full">
      {HINTS_DATA.content}
    </pre>
  );
}