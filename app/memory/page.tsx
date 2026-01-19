'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SIZE = 4; // 4x4 memory game

type Card = { id: number; value: number; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] { for (let i=arr.length-1; i>0; i--){ const j=Math.floor(Math.random()* (i+1)); [arr[i], arr[j]]=[arr[j], arr[i]]; } return arr; }

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);

  const reset = useCallback(() => {
    const vals = shuffle([1,1,2,2,3,3,4,4]);
    const c = vals.map((v, idx) => ({ id: idx, value: v, flipped: false, matched: false }));
    setCards(c);
    setFirst(null); setSecond(null); setLock(false); setMoves(0);
  }, []);

  useEffect(() => { reset(); }, [reset]);

  const flip = (idx: number) => {
    if (lock) return;
    setCards(prev => prev.map((r,i)=> i===idx ? { ...r, flipped: !r.flipped }: r));
    if (first === null) setFirst(idx);
    else if (second === null) {
      setSecond(idx);
      setLock(true);
      // check after short delay
      setTimeout(() => {
        const a = cards.find((c, i) => i===first)?.value;
        const b = cards[idx]?.value;
        if (a===b) {
          setCards(cs => cs.map((c,i)=> i===first||i===idx? { ...c, matched: true, flipped: true } : c));
        } else {
          setCards(cs => cs.map((c,i)=> i===first||i===idx? { ...c, flipped: false } : c));
        }
        setFirst(null); setSecond(null); setLock(false); setMoves(m => m+1);
      }, 400);
    }
  };

  const gameOver = cards.length>0 && cards.every(c => c.matched);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Memory</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${SIZE}, 80px)`, gap:8 }}>
        {cards.map((c, idx) => (
          <div key={idx} onClick={() => flip(idx)} style={{ width:80, height:80, background: c.flipped || c.matched ? '#fafafa' : '#999', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #333', fontSize:28 }}>
            {c.flipped || c.matched ? c.value : ''}
          </div>
        ))}
      </div>
      {gameOver && <div className="mt-4 text-green-700">You matched all cards!</div>}
      <button onClick={reset} className="mt-4 px-4 py-2 border rounded">New Game</button>
    </div>
  );
}
