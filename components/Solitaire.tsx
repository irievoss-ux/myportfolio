"use client";
import { useState, useCallback } from 'react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

interface Card {
  suit: Suit;
  value: CardValue;
  faceUp: boolean;
  id: string;
}

type PileType = 'stock' | 'waste' | 'foundation' | 'tableau';
interface DragSource { pile: PileType; index: number; cardIndex: number; }

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const suitColor = (s: Suit) => s === 'hearts' || s === 'diamonds' ? '#c0392b' : '#1a1a2e';
const suitSymbol = (s: Suit) => ({ hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }[s]);
const FACE_CARD_NAMES: Partial<Record<CardValue, string>> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
const valueName = (v: CardValue) => FACE_CARD_NAMES[v] ?? String(v);

const getTableauOffsets = (pile: Card[]) => {
  const offsets: number[] = [];
  let currentTop = 0;
  for (let i = 0; i < pile.length; i++) {
    offsets.push(currentTop);
    currentTop += pile[i].faceUp ? 22 : 10;
  }
  return offsets;
};

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let v = 1; v <= 13; v++) {
      deck.push({ suit, value: v as CardValue, faceUp: false, id: `${suit}-${v}` });
    }
  }
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  moves: number;
  score: number;
}

function dealGame(): GameState {
  const deck = createDeck();
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] };
      if (row === col) card.faceUp = true;
      tableau[col].push(card);
    }
  }
  const stock = deck.slice(idx).map(c => ({ ...c, faceUp: false }));
  return { stock, waste: [], foundations: [[], [], [], []], tableau, moves: 0, score: 0 };
}

export default function Solitaire() {
  const [game, setGame] = useState<GameState>(() => dealGame());
  const [selected, setSelected] = useState<DragSource | null>(null);
  const won = game.foundations.reduce((s, f) => s + f.length, 0) === 52;

  const drawFromStock = useCallback(() => {
    setGame(g => {
      if (g.stock.length === 0) {
        return { ...g, stock: g.waste.map(c => ({ ...c, faceUp: false })).reverse(), waste: [], moves: g.moves + 1 };
      }
      const card = { ...g.stock[g.stock.length - 1], faceUp: true };
      return { ...g, stock: g.stock.slice(0, -1), waste: [...g.waste, card], moves: g.moves + 1 };
    });
    setSelected(null);
  }, []);

  const canPlaceOnFoundation = (card: Card, foundation: Card[]): boolean => {
    if (foundation.length === 0) return card.value === 1;
    const top = foundation[foundation.length - 1];
    return top.suit === card.suit && card.value === top.value + 1;
  };

  const canPlaceOnTableau = (card: Card, pile: Card[]): boolean => {
    if (pile.length === 0) return card.value === 13;
    const top = pile[pile.length - 1];
    if (!top.faceUp) return false;
    const topRed = top.suit === 'hearts' || top.suit === 'diamonds';
    const cardRed = card.suit === 'hearts' || card.suit === 'diamonds';
    return topRed !== cardRed && card.value === top.value - 1;
  };

  const handleSelect = (pile: PileType, pileIndex: number, cardIndex: number) => {
    if (!selected) {
      setSelected({ pile, index: pileIndex, cardIndex });
      return;
    }

    // Try to place selected on target
    setGame(g => {
      const newGame = { ...g, stock: [...g.stock], waste: [...g.waste], foundations: g.foundations.map(f => [...f]), tableau: g.tableau.map(t => [...t]) };

      // Get source cards
      let sourceCards: Card[] = [];
      if (selected.pile === 'waste') {
        sourceCards = [newGame.waste[newGame.waste.length - 1]];
      } else if (selected.pile === 'tableau') {
        sourceCards = newGame.tableau[selected.index].slice(selected.cardIndex);
      } else if (selected.pile === 'foundation') {
        sourceCards = [newGame.foundations[selected.index][newGame.foundations[selected.index].length - 1]];
      }

      if (sourceCards.length === 0) { setSelected(null); return g; }

      let success = false;
      if (pile === 'foundation' && sourceCards.length === 1) {
        if (canPlaceOnFoundation(sourceCards[0], newGame.foundations[pileIndex])) {
          newGame.foundations[pileIndex].push(sourceCards[0]);
          success = true;
        }
      } else if (pile === 'tableau') {
        if (canPlaceOnTableau(sourceCards[0], newGame.tableau[pileIndex])) {
          newGame.tableau[pileIndex].push(...sourceCards);
          success = true;
        }
      }

      if (success) {
        if (selected.pile === 'waste') {
          newGame.waste.pop();
        } else if (selected.pile === 'foundation') {
          newGame.foundations[selected.index].pop();
        } else if (selected.pile === 'tableau') {
          newGame.tableau[selected.index] = newGame.tableau[selected.index].slice(0, selected.cardIndex);
          // Flip top card if needed
          const tab = newGame.tableau[selected.index];
          if (tab.length > 0 && !tab[tab.length - 1].faceUp) {
            tab[tab.length - 1] = { ...tab[tab.length - 1], faceUp: true };
          }
        }
        newGame.moves += 1;
        newGame.score += pile === 'foundation' ? 10 : 5;
        setSelected(null);
        return newGame;
      }

      setSelected({ pile, index: pileIndex, cardIndex });
      return g;
    });
  };

  // Auto-send to foundation on double-click
  const autoFoundation = (card: Card, sourcePile: PileType, sourceIndex: number) => {
    setSelected(null);
    setGame(g => {
      const newGame = { ...g, stock: [...g.stock], waste: [...g.waste], foundations: g.foundations.map(f => [...f]), tableau: g.tableau.map(t => [...t]) };
      for (let fi = 0; fi < 4; fi++) {
        if (canPlaceOnFoundation(card, newGame.foundations[fi])) {
          newGame.foundations[fi].push(card);
          if (sourcePile === 'waste') { newGame.waste.pop(); }
          else if (sourcePile === 'tableau') {
            newGame.tableau[sourceIndex].pop();
            const tab = newGame.tableau[sourceIndex];
            if (tab.length > 0 && !tab[tab.length - 1].faceUp) tab[tab.length - 1] = { ...tab[tab.length - 1], faceUp: true };
          }
          newGame.moves += 1;
          newGame.score += 10;
          return newGame;
        }
      }
      return g;
    });
  };

  return (
    <div className="flex h-full flex-col bg-[#0a5e2f] font-[Segoe_UI,sans-serif] select-none">
      {/* Menu bar */}
      <div className="flex items-center gap-4 bg-[#0d7a3c] px-3 py-1 text-[11px] text-white/80 border-b border-[#085a2a]">
        <span className="cursor-pointer hover:text-white">Game</span>
        <span className="cursor-pointer hover:text-white">Help</span>
        <div className="ml-auto flex items-center gap-4 text-[10px]">
          <span>Score: {game.score}</span>
          <span>Moves: {game.moves}</span>
          <button type="button" onClick={() => { setGame(dealGame()); setSelected(null); }}
            className="rounded border border-white/20 bg-white/10 px-2 py-0.5 hover:bg-white/20">New Game</button>
        </div>
      </div>

      {won && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-8 text-center shadow-2xl">
            <div className="text-[24px] font-bold text-[#0a5e2f] mb-2">🏆 You Win!</div>
            <div className="text-sm text-slate-600 mb-4">Score: {game.score} · Moves: {game.moves}</div>
            <button type="button" onClick={() => { setGame(dealGame()); setSelected(null); }}
              className="rounded border border-[#0a5e2f] bg-[#0d7a3c] px-6 py-2 text-white font-semibold hover:brightness-110">Play Again</button>
          </div>
        </div>
      )}

      {/* Playing field */}
      <div className="flex-1 overflow-auto p-3">
        {/* Top row: stock, waste, gap, foundations */}
        <div className="flex items-start gap-2 mb-4">
          {/* Stock */}
          <div className="cursor-pointer" onClick={drawFromStock}>
            {game.stock.length > 0 ? <CardBack /> : <EmptyPile label="↺" />}
          </div>
          {/* Waste */}
          <div onClick={() => game.waste.length > 0 && handleSelect('waste', 0, 0)}
            onDoubleClick={() => game.waste.length > 0 && autoFoundation(game.waste[game.waste.length - 1], 'waste', 0)}>
            {game.waste.length > 0 ? (
              <CardFace card={game.waste[game.waste.length - 1]}
                isSelected={selected?.pile === 'waste'} />
            ) : <EmptyPile />}
          </div>
          <div className="w-[66px]" /> {/* spacer */}
          {/* Foundations */}
          {game.foundations.map((f, fi) => (
            <div key={fi} onClick={() => handleSelect('foundation', fi, 0)}>
              {f.length > 0 ? <CardFace card={f[f.length - 1]} isSelected={selected?.pile === 'foundation' && selected.index === fi} /> : <EmptyPile label={suitSymbol(SUITS[fi])} />}
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="flex items-start gap-2">
          {game.tableau.map((pile, ti) => {
            const offsets = getTableauOffsets(pile);
            const colHeight = pile.length === 0 ? 90 : offsets[pile.length - 1] + 90;
            return (
            <div key={ti} className="relative" style={{ width: 66, height: colHeight, minHeight: 90 }}>
              {pile.length === 0 ? (
                <div onClick={() => handleSelect('tableau', ti, 0)} className="w-[66px] h-[90px]"><EmptyPile /></div>
              ) : (
                pile.map((card, ci) => (
                  <div key={card.id} className="absolute left-0" style={{ top: offsets[ci] }}
                    onClick={() => card.faceUp && handleSelect('tableau', ti, ci)}
                    onDoubleClick={() => card.faceUp && ci === pile.length - 1 && autoFoundation(card, 'tableau', ti)}>
                    {card.faceUp ? (
                      <CardFace card={card}
                        isSelected={selected?.pile === 'tableau' && selected.index === ti && selected.cardIndex <= ci} />
                    ) : <CardBack />}
                  </div>
                ))
              )}
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}

function CardFace({ card, isSelected }: { card: Card; isSelected?: boolean }) {
  const color = suitColor(card.suit);
  const symbol = suitSymbol(card.suit);
  return (
    <div className={`relative h-[90px] w-[66px] rounded-[5px] border ${isSelected ? 'border-yellow-400 shadow-[0_0_8px_rgba(250,200,50,0.5)]' : 'border-[#888]'} bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="absolute left-1 top-0.5 text-[11px] font-bold leading-tight" style={{ color }}>{valueName(card.value)}<br />{symbol}</div>
      <div className="absolute inset-0 flex items-center justify-center text-[24px]" style={{ color }}>{symbol}</div>
      <div className="absolute bottom-0.5 right-1 rotate-180 text-[11px] font-bold leading-tight" style={{ color }}>{valueName(card.value)}<br />{symbol}</div>
    </div>
  );
}

function CardBack() {
  return (
    <div className="h-[90px] w-[66px] rounded-[5px] border border-[#234] bg-[linear-gradient(135deg,#1a3a6a_0%,#2a5a8a_50%,#1a3a6a_100%)] shadow-sm cursor-pointer">
      <div className="flex h-full items-center justify-center">
        <div className="h-[70px] w-[46px] rounded-[3px] border border-white/20 bg-[linear-gradient(135deg,#1a3060,#2a4a7a)]">
          <div className="flex h-full items-center justify-center text-white/20 text-[10px]">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M15 3L27 15L15 27L3 15Z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
              <path d="M15 8L22 15L15 22L8 15Z" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
              <circle cx="15" cy="15" r="3" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyPile({ label }: { label?: string }) {
  return (
    <div className="flex h-[90px] w-[66px] items-center justify-center rounded-[5px] border-2 border-dashed border-white/15 text-[18px] text-white/20">
      {label || ''}
    </div>
  );
}
