'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Cell = 0 | 1 | 2; // 0 empty, 1 player, 2 AI (O)

function winner(board: Cell[]): number {
  // 3x3 flatten
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (const [a,b,c] of lines) {
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return 0;
}

function emptyBoard(): Cell[] { return Array(9).fill(0); }

function availableMoves(board: Cell[]): number[] { return board.map((v,i)=> v===0 ? i : -1).filter(i=> i>=0); }

function minimax(board: Cell[], depth: number, maximizing: boolean): number {
  const w = winner(board);
  if (w === 1) return 10 - depth;
  if (w === 2) return depth - 10;
  if (availableMoves(board).length === 0) return 0;
  if (depth === 0) return 0;
  if (maximizing) {
    let best = -Infinity;
    for (const m of availableMoves(board)) {
      const nb = board.slice(); nb[m] = 1;
      best = Math.max(best, minimax(nb, depth-1, false));
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of availableMoves(board)) {
      const nb = board.slice(); nb[m] = 2;
      best = Math.min(best, minimax(nb, depth-1, true));
    }
    return best;
  }
}

function bestMove(board: Cell[]): number {
  let move = -1; let bestVal = -Infinity;
  for (const m of availableMoves(board)) {
    const nb = board.slice(); nb[m] = 1;
    const val = minimax(nb, 5, false);
    if (val > bestVal) { bestVal = val; move = m; }
  }
  return move;
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [status, setStatus] = useState<'playing'|'win'|'lose'|'draw'>('playing');

  useEffect(() => {
    const w = winner(board);
    if (w === 1) { setStatus('win'); }
    else if (w === 2) { setStatus('lose'); }
    else if (availableMoves(board).length === 0) { setStatus('draw'); }
  }, [board]);

  const click = (idx: number) => {
    if (board[idx] !== 0 || status !== 'playing') return;
    const nb = board.slice(); nb[idx] = 1; // player
    setBoard(nb);
    // AI move
    const m = bestMove(nb);
    if (m >= 0) {
      setTimeout(() => {
        setBoard(b => {
          const nb2 = b.slice(); nb2[m] = 2; return nb2;
        });
      }, 200);
    }
  };

  // simple reset
  const reset = () => setBoard(emptyBoard());

  const renderCell = (idx: number) => {
    const v = board[idx];
    const ch = v === 1 ? 'X' : v === 2 ? 'O' : '';
    const bg = v === 0 ? '#fff' : '#ddd';
    return (
      <div key={idx} onClick={() => click(idx)} style={{ width: 80, height: 80, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #ccc', background: bg, fontSize: 28 }}>{ch}</div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Tic-Tac-Toe</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,80px)', gap:8 }}>
        {board.map((_, idx) => renderCell(idx))}
      </div>
      <button onClick={reset} className="mt-6 px-4 py-2 border rounded">New Game</button>
      <div className="mt-4 text-xs text-stone-500">Status: {status}</div>
    </div>
  );
}
