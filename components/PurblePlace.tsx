"use client";
import { useState, useEffect, useCallback } from 'react';

// Purble Pairs — the memory matching game from Purble Place
interface PurbleCard {
  id: number;
  image: string;
  color: string;
  matched: boolean;
  flipped: boolean;
}

const PURBLE_ITEMS = [
  { image: '♛', color: '#e74c3c' }, // crown
  { image: '★', color: '#f39c12' }, // star
  { image: '♦', color: '#3498db' }, // diamond
  { image: '♣', color: '#27ae60' }, // club
  { image: '♠', color: '#8e44ad' }, // spade
  { image: '♥', color: '#e91e63' }, // heart
  { image: '◆', color: '#00bcd4' }, // gem
  { image: '✿', color: '#ff9800' }, // flower
  { image: '☀', color: '#ffeb3b' }, // sun
  { image: '☾', color: '#607d8b' }, // moon
  { image: '✦', color: '#9c27b0' }, // sparkle
  { image: '⬟', color: '#009688' }, // hexagon
];

function createBoard(pairCount: number): PurbleCard[] {
  const items = PURBLE_ITEMS.slice(0, pairCount);
  const cards: PurbleCard[] = [];
  let id = 0;
  for (const item of items) {
    cards.push({ id: id++, image: item.image, color: item.color, matched: false, flipped: false });
    cards.push({ id: id++, image: item.image, color: item.color, matched: false, flipped: false });
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

type Difficulty = 'easy' | 'medium' | 'hard';
const pairCounts: Record<Difficulty, number> = { easy: 6, medium: 8, hard: 12 };
const gridCols: Record<Difficulty, number> = { easy: 4, medium: 4, hard: 6 };

export default function PurblePlace() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<PurbleCard[]>(() => createBoard(pairCounts.medium));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [locked, setLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);

  const totalPairs = pairCounts[difficulty];

  useEffect(() => {
    if (!started || gameOver) return;
    const t = window.setInterval(() => setTimer(s => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [started, gameOver]);

  const newGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setBoard(createBoard(pairCounts[diff]));
    setFlippedIds([]);
    setMoves(0);
    setMatched(0);
    setLocked(false);
    setGameOver(false);
    setTimer(0);
    setStarted(false);
  }, []);

  const handleFlip = (id: number) => {
    if (locked) return;
    const card = board.find(c => c.id === id);
    if (!card || card.matched || card.flipped) return;
    if (!started) setStarted(true);

    const newFlipped = [...flippedIds, id];
    setBoard(b => b.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [first, second] = newFlipped;
      const c1 = board.find(c => c.id === first)!;
      const c2 = board.find(c => c.id === second)!;

      if (c1.image === c2.image) {
        setTimeout(() => {
          setBoard(b => b.map(c => (c.id === first || c.id === second) ? { ...c, matched: true } : c));
          setMatched(m => {
            const newMatched = m + 1;
            if (newMatched === totalPairs) setGameOver(true);
            return newMatched;
          });
          setFlippedIds([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setBoard(b => b.map(c => (c.id === first || c.id === second) ? { ...c, flipped: false } : c));
          setFlippedIds([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#6a1b9a_0%,#4a148c_40%,#311b92_100%)] font-[Segoe_UI,sans-serif] select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-[rgba(0,0,0,0.2)] px-4 py-2 text-white border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold">Purble Place</span>
          <span className="text-[11px] text-white/50">— Purble Pairs</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Moves: {moves}</span>
          <span>{formatTime(timer)}</span>
          <span>Pairs: {matched}/{totalPairs}</span>
        </div>
      </div>

      {/* Difficulty picker */}
      <div className="flex items-center gap-2 bg-[rgba(0,0,0,0.1)] px-4 py-1.5 text-[11px]">
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button key={d} type="button" onClick={() => newGame(d)}
            className={`rounded-[4px] border px-3 py-0.5 capitalize transition ${difficulty === d
              ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold'
              : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'}`}>
            {d}
          </button>
        ))}
      </div>

      {/* Game board */}
      <div className="flex flex-1 items-center justify-center p-4 overflow-auto">
        {gameOver ? (
          <div className="flex flex-col items-center gap-4 text-white text-center">
            <div className="text-[28px] font-bold drop-shadow-lg">You found all pairs!</div>
            <div className="text-white/70">Moves: {moves} · Time: {formatTime(timer)}</div>
            <button type="button" onClick={() => newGame(difficulty)}
              className="mt-2 rounded-lg border border-yellow-400/50 bg-yellow-400/20 px-8 py-2 font-bold text-yellow-300 hover:bg-yellow-400/30">
              Play Again
            </button>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridCols[difficulty]}, 1fr)` }}>
            {board.map(card => (
              <button key={card.id} type="button" onClick={() => handleFlip(card.id)}
                className="relative transition-transform duration-200 hover:scale-105"
                style={{ width: difficulty === 'hard' ? 60 : 72, height: difficulty === 'hard' ? 72 : 88 }}>
                {card.flipped || card.matched ? (
                  <div className={`flex h-full w-full items-center justify-center rounded-[8px] border-2 shadow-lg ${card.matched ? 'border-green-400 bg-green-900/40' : 'border-white/30 bg-white/10'}`}>
                    <span style={{ color: card.color, fontSize: difficulty === 'hard' ? 24 : 30, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{card.image}</span>
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-[8px] border-2 border-purple-300/30 bg-[linear-gradient(135deg,#7e57c2_0%,#5c3d9e_50%,#7e57c2_100%)] shadow-lg cursor-pointer hover:border-purple-300/60 transition">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.1)" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
