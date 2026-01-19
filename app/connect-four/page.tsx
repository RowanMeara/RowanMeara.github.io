'use client';

import { useState } from 'react';
import Link from 'next/link';

const COLS = 7;
const ROWS = 6;

export default function ConnectFourGame() {
  const [board, setBoard] = useState<number[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState<number>(0);

  const drop = (col: number) => {
    const b = board.map(r => r.slice());
    for (let r = ROWS-1; r>=0; r--) {
      if (b[r][col] === 0) { b[r][col] = player; break; }
      if (r===0) return;
    }
    // simple win check
    const check = (pl: number) => {
      // horizontal
      for (let r=0; r<ROWS; r++) for (let c=0; c<=COLS-4; c++) if (b[r][c]===pl && b[r][c+1]===pl && b[r][c+2]===pl && b[r][c+3]===pl) return true;
      // vertical
      for (let c=0; c<COLS; c++) for (let r=0; r<=ROWS-4; r++) if (b[r][c]===pl && b[r+1][c]===pl && b[r+2][c]===pl && b[r+3][c]===pl) return true;
      // diag
      for (let r=0; r<=ROWS-4; r++) for (let c=0; c<=COLS-4; c++) if (b[r][c]===pl && b[r+1][c+1]===pl && b[r+2][c+2]===pl && b[r+3][c+3]===pl) return true;
      for (let r=0; r<=ROWS-4; r++) for (let c=3; c<COLS; c++) if (b[r][c]===pl && b[r+1][c-1]===pl && b[r+2][c-2]===pl && b[r+3][c-3]===pl) return true;
      return false;
    };
    if (check(player)) { setWinner(player); }
    setBoard(b);
    setPlayer(p => p === 1 ? 2 : 1);
  };

  const reset = () => { setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0))); setPlayer(1); setWinner(0); };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Connect Four</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${COLS}, 64px)`, gap:6 }}>
        {board.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} onClick={() => drop(c)} style={{ width:64, height:64, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #aaa', background: cell===0 ? '#fff' : cell===1 ? '#f88' : '#88f' }} />
        ))) }
      </div>
      <button onClick={reset} className="mt-6 px-4 py-2 border rounded">New Game</button>
      {winner ? <div className="mt-2 text-xl">Winner: {winner===1?'Red':'Blue'}</div> : null}
    </div>
  );
}
