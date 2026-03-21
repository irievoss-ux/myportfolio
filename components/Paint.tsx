"use client";

import { useRef, useState, useEffect, useCallback } from 'react';

type Tool = 'brush' | 'eraser' | 'line' | 'rect' | 'fill';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ff8000', '#80ff00', '#00ff80', '#0080ff', '#8000ff', '#ff0080', '#ffc0cb', '#a0522d',
];

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [lineStart, setLineStart] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;

    const colorToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const [fr, fg, fb] = colorToRgb(fillColor);
    const idx = (Math.floor(startY) * w + Math.floor(startX)) * 4;
    const tr = data[idx], tg = data[idx + 1], tb = data[idx + 2];

    if (tr === fr && tg === fg && tb === fb) return;

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const match = (i: number) => data[i] === tr && data[i + 1] === tg && data[i + 2] === tb;

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const ci = (cy * w + cx) * 4;
      if (cx < 0 || cx >= w || cy < 0 || cy >= canvas.height || !match(ci)) continue;
      data[ci] = fr; data[ci + 1] = fg; data[ci + 2] = fb; data[ci + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, color);
      return;
    }

    if (tool === 'line' || tool === 'rect') {
      setLineStart(pos);
      setSnapshot(ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height));
      setIsDrawing(true);
      return;
    }

    setIsDrawing(true);
    setLastPoint(pos);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if ((tool === 'line' || tool === 'rect') && lineStart && snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(lineStart.x, lineStart.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else {
        ctx.strokeRect(lineStart.x, lineStart.y, pos.x - lineStart.x, pos.y - lineStart.y);
      }
      return;
    }

    if (tool === 'brush' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (lastPoint) ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setLastPoint(pos);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
    setLineStart(null);
    setSnapshot(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'vista-painting.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: 'brush', label: 'Brush', icon: '✏️' },
    { id: 'eraser', label: 'Eraser', icon: '🧹' },
    { id: 'line', label: 'Line', icon: '📏' },
    { id: 'rect', label: 'Rectangle', icon: '⬜' },
    { id: 'fill', label: 'Fill', icon: '🪣' },
  ];

  return (
    <div className="flex h-full flex-col bg-[#f0f0f0] font-sans text-sm">
      {/* Menu bar */}
      <div className="flex gap-4 border-b border-gray-300 bg-[#f8f8f8] px-3 py-1 text-[11px] text-slate-600">
        <span className="cursor-default px-1 hover:bg-blue-100">File</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Edit</span>
        <span className="cursor-default px-1 hover:bg-blue-100">View</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Image</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Colors</span>
        <span className="cursor-default px-1 hover:bg-blue-100">Help</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool sidebar */}
        <div className="flex w-14 flex-col items-center gap-1 border-r border-gray-300 bg-[#e8e8e8] py-2">
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              className={`flex h-10 w-10 items-center justify-center rounded border text-lg transition ${tool === t.id ? 'border-blue-500 bg-blue-100 shadow-inner' : 'border-transparent hover:bg-white'}`}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}

          <div className="my-2 h-px w-8 bg-gray-300" />

          {/* Brush size */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] text-gray-500">{brushSize}px</div>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-10"
              style={{ writingMode: 'vertical-lr' }}
            />
          </div>

          <div className="my-2 h-px w-8 bg-gray-300" />

          {/* Actions */}
          <button type="button" onClick={clearCanvas} className="flex h-8 w-10 items-center justify-center rounded border border-transparent text-xs hover:bg-white" title="Clear">🗑️</button>
          <button type="button" onClick={saveCanvas} className="flex h-8 w-10 items-center justify-center rounded border border-transparent text-xs hover:bg-white" title="Save">💾</button>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-200 p-2">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="bg-white shadow-[inset_0_0_0_1px_#ccc] cursor-crosshair"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Color palette */}
      <div className="flex items-center gap-2 border-t border-gray-300 bg-[#e8e8e8] px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-gray-400" style={{ background: color }} title="Current Color" />
        <div className="flex flex-wrap gap-[2px]">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-4 w-4 rounded-[2px] border transition hover:scale-125 ${c === color ? 'border-blue-600 ring-1 ring-blue-400' : 'border-gray-400'}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
