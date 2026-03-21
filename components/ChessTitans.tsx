"use client";
import { useState, useCallback } from 'react';

// Chess piece types
type Color = 'white' | 'black';
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
interface Piece { type: PieceType; color: Color; }
type Board = (Piece | null)[][];

const PIECE_CHARS: Record<Color, Record<PieceType, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

function createBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: 'black' };
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
    board[7][col] = { type: backRow[col], color: 'white' };
  }
  return board;
}

function getValidMoves(board: Board, row: number, col: number): [number, number][] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const isEnemy = (r: number, c: number) => inBounds(r, c) && board[r][c] !== null && board[r][c]!.color !== piece.color;
  const isEmpty = (r: number, c: number) => inBounds(r, c) && board[r][c] === null;
  const canMoveTo = (r: number, c: number) => isEmpty(r, c) || isEnemy(r, c);

  const slideDirs = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        const nr = row + dr * i, nc = col + dc * i;
        if (!inBounds(nr, nc)) break;
        if (isEmpty(nr, nc)) { moves.push([nr, nc]); continue; }
        if (isEnemy(nr, nc)) moves.push([nr, nc]);
        break;
      }
    }
  };

  switch (piece.type) {
    case 'pawn': {
      const dir = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      if (isEmpty(row + dir, col)) {
        moves.push([row + dir, col]);
        if (row === startRow && isEmpty(row + 2 * dir, col)) moves.push([row + 2 * dir, col]);
      }
      if (isEnemy(row + dir, col - 1)) moves.push([row + dir, col - 1]);
      if (isEnemy(row + dir, col + 1)) moves.push([row + dir, col + 1]);
      break;
    }
    case 'knight':
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        if (canMoveTo(row + dr, col + dc)) moves.push([row + dr, col + dc]);
      }
      break;
    case 'bishop': slideDirs([[-1,-1],[-1,1],[1,-1],[1,1]]); break;
    case 'rook': slideDirs([[-1,0],[1,0],[0,-1],[0,1]]); break;
    case 'queen': slideDirs([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]); break;
    case 'king':
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        if (canMoveTo(row + dr, col + dc)) moves.push([row + dr, col + dc]);
      }
      break;
  }
  return moves;
}

export default function ChessTitans() {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<Color>('white');
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn('white');
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveCount(0);
  }, []);

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];

    if (selected) {
      // Try to move
      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      if (isValid) {
        setBoard(prev => {
          const nb = prev.map(r => [...r]);
          const captured = nb[row][col];
          let movingPiece = nb[selected[0]][selected[1]]!;
          // Pawn promotion
          if (movingPiece.type === 'pawn' && (row === 0 || row === 7)) {
            movingPiece = { ...movingPiece, type: 'queen' };
          }
          nb[row][col] = movingPiece;
          nb[selected[0]][selected[1]] = null;
          if (captured) {
            if (captured.color === 'white') setCapturedWhite(p => [...p, captured]);
            else setCapturedBlack(p => [...p, captured]);
          }
          return nb;
        });
        setTurn(t => t === 'white' ? 'black' : 'white');
        setMoveCount(m => m + 1);
        setSelected(null);
        setValidMoves([]);
        return;
      }
      // Clicking own piece to re-select
      if (piece && piece.color === turn) {
        setSelected([row, col]);
        setValidMoves(getValidMoves(board, row, col));
        return;
      }
      setSelected(null);
      setValidMoves([]);
    } else {
      if (piece && piece.color === turn) {
        setSelected([row, col]);
        setValidMoves(getValidMoves(board, row, col));
      }
    }
  };

  const isValidTarget = (r: number, c: number) => validMoves.some(([vr, vc]) => vr === r && vc === c);
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#1a1a2e_0%,#16213e_50%,#0f0f1a_100%)] font-[Segoe_UI,sans-serif] select-none">
      {/* Menu bar */}
      <div className="flex items-center justify-between bg-[rgba(0,0,0,0.3)] px-4 py-1.5 text-[11px] text-white/70 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-white">Chess Titans</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{turn === 'white' ? '⬜' : '⬛'} {turn}&apos;s turn</span>
          <span>·</span>
          <span>Move {moveCount}</span>
          <button type="button" onClick={resetGame}
            className="rounded border border-white/15 bg-white/5 px-2 py-0.5 hover:bg-white/15">New Game</button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-4 p-4 overflow-auto">
        {/* Captured black pieces */}
        <div className="flex w-10 flex-col items-center gap-0.5">
          {capturedBlack.map((p, i) => (
            <span key={i} className="text-[16px] text-white/60">{PIECE_CHARS.black[p.type]}</span>
          ))}
        </div>

        {/* Board */}
        <div className="relative">
          {/* File labels */}
          <div className="flex pl-6">
            {files.map(f => <div key={f} className="w-[50px] text-center text-[10px] text-white/30">{f}</div>)}
          </div>
          <div className="flex">
            {/* Rank labels */}
            <div className="flex flex-col">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex h-[50px] w-6 items-center justify-center text-[10px] text-white/30">{8 - i}</div>
              ))}
            </div>
            {/* Squares */}
            <div className="rounded-[4px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {board.map((row, ri) => (
                <div key={ri} className="flex">
                  {row.map((piece, ci) => {
                    const isLight = (ri + ci) % 2 === 0;
                    const isSelected = selected?.[0] === ri && selected?.[1] === ci;
                    const isTarget = isValidTarget(ri, ci);
                    return (
                      <button key={ci} type="button" onClick={() => handleSquareClick(ri, ci)}
                        className={`relative flex h-[50px] w-[50px] items-center justify-center transition-colors
                          ${isLight
                            ? isSelected ? 'bg-[#b8d45a]' : isTarget ? 'bg-[#d4e88c]' : 'bg-[#e8d4a0]'
                            : isSelected ? 'bg-[#7a9e2a]' : isTarget ? 'bg-[#94b44a]' : 'bg-[#b08850]'
                          }`}>
                        {piece && (
                          <span className={`text-[30px] ${piece.color === 'white' ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-[#1a1a2e] drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]'}`}>
                            {PIECE_CHARS[piece.color][piece.type]}
                          </span>
                        )}
                        {isTarget && !piece && (
                          <div className="h-3 w-3 rounded-full bg-black/20" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Captured white pieces */}
        <div className="flex w-10 flex-col items-center gap-0.5">
          {capturedWhite.map((p, i) => (
            <span key={i} className="text-[16px] text-white/60">{PIECE_CHARS.white[p.type]}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
