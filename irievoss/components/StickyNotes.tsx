"use client";

import { useState } from 'react';

interface Note {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
}

const noteColors = [
  { bg: '#fff9c4', border: '#f9e54a' },
  { bg: '#c8e6c9', border: '#66bb6a' },
  { bg: '#bbdefb', border: '#42a5f5' },
  { bg: '#f8bbd0', border: '#ec407a' },
  { bg: '#e1bee7', border: '#ab47bc' },
  { bg: '#ffe0b2', border: '#ffa726' },
];

export default function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [nextId, setNextId] = useState(1);
  const [dragging, setDragging] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);

  const addNote = () => {
    const colorSet = noteColors[notes.length % noteColors.length];
    const newNote: Note = {
      id: nextId,
      text: '',
      color: colorSet.bg,
      x: 300 + (notes.length % 4) * 30,
      y: 200 + (notes.length % 4) * 30,
    };
    setNotes((prev) => [...prev, newNote]);
    setNextId((prev) => prev + 1);
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateText = (id: number, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setDragging({ id, offsetX: e.clientX - note.x, offsetY: e.clientY - note.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === dragging.id ? { ...n, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY } : n,
      ),
    );
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[50]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {notes.map((note) => {
        const colorSet = noteColors.find((c) => c.bg === note.color) ?? noteColors[0];
        return (
          <div
            key={note.id}
            className="pointer-events-auto absolute w-52 rounded-[3px] shadow-[2px_4px_16px_rgba(0,0,0,0.25)]"
            style={{ left: note.x, top: note.y, background: note.color, borderTop: `3px solid ${colorSet.border}` }}
          >
            {/* Header */}
            <div
              className="flex cursor-move items-center justify-between px-2 py-1"
              onMouseDown={(e) => handleMouseDown(e, note.id)}
            >
              <button
                type="button"
                onClick={addNote}
                className="flex h-5 w-5 items-center justify-center rounded text-lg font-bold leading-none opacity-50 hover:opacity-100"
                style={{ color: colorSet.border }}
                title="New Note"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                className="flex h-5 w-5 items-center justify-center rounded text-sm opacity-40 hover:opacity-100"
                title="Delete Note"
              >
                ✕
              </button>
            </div>
            {/* Body */}
            <textarea
              value={note.text}
              onChange={(e) => updateText(note.id, e.target.value)}
              placeholder="Type a note..."
              className="h-36 w-full resize-none border-none bg-transparent px-3 pb-3 text-[12px] text-slate-700 outline-none placeholder:text-slate-400/60"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Export a function component that can add notes from outside
export function useStickyNotes() {
  return { addNote: () => {} };
}
