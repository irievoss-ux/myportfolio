"use client";
import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 10;
const MINE_COUNT = 15;
const CELL_SIZE = 26;

export default function Minesweeper() {
  const [grid, setGrid] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flags, setFlags] = useState(0);
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);

  const initGrid = useCallback(() => {
    let newGrid = Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, i) => ({
      id: i, isMine: false, revealed: false, flagged: false, neighborCount: 0
    }));

    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const rand = Math.floor(Math.random() * newGrid.length);
      if (!newGrid[rand].isMine) {
        newGrid[rand].isMine = true;
        minesPlaced++;
      }
    }

    newGrid = newGrid.map((cell, i) => {
      if (cell.isMine) return cell;
      const neighbors = getNeighbors(i);
      const count = neighbors.filter(n => newGrid[n].isMine).length;
      return { ...cell, neighborCount: count };
    });

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setFlags(0);
    setTimer(0);
    setActive(false);
  }, []);

  useEffect(() => { initGrid(); }, [initGrid]);

  useEffect(() => {
    let interval: any;
    if (active && !gameOver && !win) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [active, gameOver, win]);

  const getNeighbors = (id: number) => {
    const res = [];
    const row = Math.floor(id / GRID_SIZE);
    const col = id % GRID_SIZE;
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue;
        const newRow = row + r;
        const newCol = col + c;
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          res.push(newRow * GRID_SIZE + newCol);
        }
      }
    }
    return res;
  };

  const reveal = (id: number) => {
    if (gameOver || win || grid[id].flagged || grid[id].revealed) return;
    if (!active) setActive(true);
    const newGrid = [...grid];
    if (newGrid[id].isMine) {
      setGameOver(true);
      newGrid.forEach(c => { if (c.isMine) c.revealed = true; });
      setGrid(newGrid);
      return;
    }
    const floodFill = (idx: number) => {
      if (newGrid[idx].revealed || newGrid[idx].flagged) return;
      newGrid[idx].revealed = true;
      if (newGrid[idx].neighborCount === 0) {
        getNeighbors(idx).forEach(n => floodFill(n));
      }
    };
    floodFill(id);
    setGrid(newGrid);
    if (newGrid.filter(c => !c.isMine && !c.revealed).length === 0) setWin(true);
  };

  const toggleFlag = (e: any, id: number) => {
    e.preventDefault();
    e.stopPropagation(); // <--- FIXED: Stops the desktop context menu from showing
    if (gameOver || win || grid[id].revealed) return;
    const newGrid = [...grid];
    newGrid[id].flagged = !newGrid[id].flagged;
    setFlags(prev => newGrid[id].flagged ? prev + 1 : prev - 1);
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center bg-[#D4D0C8] p-4 h-full overflow-hidden select-none border-t border-l border-white shadow-[inset_-1px_-1px_#808080]">
      <div className="w-[264px] bg-[#C0C7D1] border-2 border-[#808080] p-2 mb-4 flex justify-between items-center shadow-inner">
        <div className="bg-black text-[#FF0000] font-mono text-2xl px-1 w-14 text-right border border-gray-400">
          {String(Math.max(0, MINE_COUNT - flags)).padStart(3, '0')}
        </div>
        <button onClick={initGrid} className="w-10 h-10 border-2 border-gray-100 bg-[#D4D0C8] flex items-center justify-center text-xl shadow-[2px_2px_0_#808080] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
          {gameOver ? '😵' : win ? '😎' : '🙂'}
        </button>
        <div className="bg-black text-[#FF0000] font-mono text-2xl px-1 w-14 text-right border border-gray-400">
          {String(timer).padStart(3, '0')}
        </div>
      </div>
      <div className="bg-[#808080] p-[3px] shadow-[inset_2px_2px_0_#404040,2px_2px_0_white]" style={{ width: `${GRID_SIZE * CELL_SIZE + 6}px` }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
          {grid.map((cell) => (
            <div key={cell.id} onClick={() => reveal(cell.id)} onContextMenu={(e) => toggleFlag(e, cell.id)} style={{ width: CELL_SIZE, height: CELL_SIZE }}
              className={`flex items-center justify-center text-xs font-bold border-r border-b border-[#808080] ${cell.revealed ? 'bg-[#C0C0C0] border-[#808080]' : 'bg-[#C0C0C0] border-t-2 border-l-2 border-white cursor-default hover:brightness-110 active:border-none'}`}>
              {cell.revealed && (cell.isMine ? '💣' : (cell.neighborCount > 0 ? cell.neighborCount : ''))}
              {!cell.revealed && cell.flagged && '🚩'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}