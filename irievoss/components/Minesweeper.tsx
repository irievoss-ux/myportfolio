"use client";

import { useEffect, useState } from 'react';

const GRID_SIZE = 10;
const MINE_COUNT = 15;
const CELL_SIZE = 26;

interface Cell {
  id: number;
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  neighborCount: number;
}

const getNeighbors = (id: number) => {
  const neighbors: number[] = [];
  const row = Math.floor(id / GRID_SIZE);
  const col = id % GRID_SIZE;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const nextRow = row + r;
      const nextCol = col + c;
      if (nextRow >= 0 && nextRow < GRID_SIZE && nextCol >= 0 && nextCol < GRID_SIZE) {
        neighbors.push(nextRow * GRID_SIZE + nextCol);
      }
    }
  }

  return neighbors;
};

const createGrid = (): Cell[] => {
  const newGrid: Cell[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
    id: index,
    isMine: false,
    revealed: false,
    flagged: false,
    neighborCount: 0,
  }));

  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const rand = Math.floor(Math.random() * newGrid.length);
    if (!newGrid[rand].isMine) {
      newGrid[rand].isMine = true;
      minesPlaced++;
    }
  }

  return newGrid.map((cell, index) => {
    if (cell.isMine) return cell;
    const count = getNeighbors(index).filter((neighbor) => newGrid[neighbor].isMine).length;
    return { ...cell, neighborCount: count };
  });
};

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[]>(() => createGrid());
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flags, setFlags] = useState(0);
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (active && !gameOver && !win) {
      interval = setInterval(() => setTimer((value) => value + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, gameOver, win]);

  const initGrid = () => {
    setGrid(createGrid());
    setGameOver(false);
    setWin(false);
    setFlags(0);
    setTimer(0);
    setActive(false);
  };

  const reveal = (id: number) => {
    const target = grid[id];
    if (!target || gameOver || win || target.flagged || target.revealed) return;
    if (!active) setActive(true);

    const newGrid = [...grid];
    if (newGrid[id].isMine) {
      setGameOver(true);
      newGrid.forEach((cell) => {
        if (cell.isMine) cell.revealed = true;
      });
      setGrid(newGrid);
      return;
    }

    const floodFill = (idx: number) => {
      if (newGrid[idx].revealed || newGrid[idx].flagged) return;
      newGrid[idx].revealed = true;
      if (newGrid[idx].neighborCount === 0) {
        getNeighbors(idx).forEach((neighbor) => floodFill(neighbor));
      }
    };

    floodFill(id);
    setGrid(newGrid);
    if (newGrid.filter((cell) => !cell.isMine && !cell.revealed).length === 0) setWin(true);
  };

  const toggleFlag = (event: React.MouseEvent<HTMLDivElement>, id: number) => {
    event.preventDefault();
    event.stopPropagation();
    if (gameOver || win || grid[id]?.revealed) return;

    const newGrid = [...grid];
    newGrid[id].flagged = !newGrid[id].flagged;
    setFlags((prev) => (newGrid[id].flagged ? prev + 1 : prev - 1));
    setGrid(newGrid);
  };

  return (
    <div className="flex h-full flex-col items-center overflow-hidden border-t border-l border-white bg-[#D4D0C8] p-4 shadow-[inset_-1px_-1px_#808080] select-none">
      <div className="mb-4 flex w-[264px] items-center justify-between border-2 border-[#808080] bg-[#C0C7D1] p-2 shadow-inner">
        <div className="w-14 border border-gray-400 bg-black px-1 text-right font-mono text-2xl text-[#FF0000]">
          {String(Math.max(0, MINE_COUNT - flags)).padStart(3, '0')}
        </div>
        <button onClick={initGrid} className="flex h-10 w-10 items-center justify-center border-2 border-gray-100 bg-[#D4D0C8] text-xl shadow-[2px_2px_0_#808080] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
          {gameOver ? '😵' : win ? '😎' : '🙂'}
        </button>
        <div className="w-14 border border-gray-400 bg-black px-1 text-right font-mono text-2xl text-[#FF0000]">
          {String(timer).padStart(3, '0')}
        </div>
      </div>
      <div className="bg-[#808080] p-[3px] shadow-[inset_2px_2px_0_#404040,2px_2px_0_white]" style={{ width: `${GRID_SIZE * CELL_SIZE + 6}px` }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
          {grid.map((cell) => (
            <div
              key={cell.id}
              onClick={() => reveal(cell.id)}
              onContextMenu={(event) => toggleFlag(event, cell.id)}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
              className={`flex items-center justify-center border-r border-b border-[#808080] text-xs font-bold ${cell.revealed ? 'bg-[#C0C0C0] border-[#808080]' : 'cursor-default border-t-2 border-l-2 border-white bg-[#C0C0C0] hover:brightness-110 active:border-none'}`}
            >
              {cell.revealed && (cell.isMine ? '💣' : cell.neighborCount > 0 ? cell.neighborCount : '')}
              {!cell.revealed && cell.flagged && '🚩'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
