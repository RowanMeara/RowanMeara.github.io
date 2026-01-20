'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

type Cell = { mine: boolean; adj: number; revealed: boolean; flagged: boolean };

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ mine: false, adj: 0, revealed: false, flagged: false })));
}

function inBounds(r: number, c: number) { return r >= 0 && r < ROWS && c >= 0 && c < COLS; }

function placeMines(board: Cell[][]): void {
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
  // compute adj
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      if (board[r][c].mine) continue;
      let adj = 0;
      for (let dr=-1; dr<=1; dr++) {
        for (let dc=-1; dc<=1; dc++) {
          if (dr===0 && dc===0) continue;
          const nr=r+dr, nc=c+dc;
          if (inBounds(nr,nc) && board[nr][nc].mine) adj++;
        }
      }
      board[r][c].adj = adj;
    }
  }
}

export default function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [tilesLeft, setTilesLeft] = useState(ROWS * COLS - MINES);

  const reset = useCallback(() => {
    const b = emptyBoard();
    placeMines(b);
    // reveal/flags reset
    setBoard(b);
    setGameOver(false);
    setStarted(true);
    setTilesLeft(ROWS * COLS - MINES);
  }, []);

  useEffect(() => {
    // init on first render
    reset();
  }, []);

  const reveal = useCallback((r: number, c: number) => {
    if (!inBounds(r,c)) return;
    setBoard(prev => {
      const nb = prev.map(row => row.map(cell => ({ ...cell })));
      if (nb[r][c].revealed || nb[r][c].flagged) return nb;
      nb[r][c].revealed = true;
      if (nb[r][c].mine) {
        setGameOver(true);
        return nb;
      }
      if (nb[r][c].adj === 0) {
        // flood fill
        const stack: [number,number][] = [[r,c]];
        while (stack.length) {
          const [rr,cc] = stack.pop()!;
          for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
            const nr=rr+dr, nc=cc+dc;
            if (inBounds(nr,nc) && !nb[nr][nc].revealed && !nb[nr][nc].flagged) {
              nb[nr][nc].revealed = true;
              if (nb[nr][nc].adj === 0 && !nb[nr][nc].mine) stack.push([nr,nc]);
            }
          }
        }
      }
      return nb;
    });
  }, []);

  const toggleFlag = useCallback((r: number, c: number) => {
    if (!inBounds(r,c)) return;
    setBoard(prev => {
      const nb = prev.map(row => row.map(cell => ({ ...cell })));
      if (nb[r][c].revealed) return nb;
      nb[r][c].flagged = !nb[r][c].flagged;
      return nb;
    });
  }, []);

  // Win check
  useEffect(() => {
    // If all non-mine cells revealed, win
    let revealedCount = 0;
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) if (board[r][c].revealed) revealedCount++;
    const totalSafe = ROWS*COLS - MINES;
    if (revealedCount === totalSafe && !gameOver) {
      setGameOver(true);
    }
  }, [board, gameOver]);

  const renderCell = (cell: Cell, r: number, c: number) => {
    const key = `${r}-${c}`;
    let content = '';
    let bg = '#ddd';
    if (cell.revealed) {
      if (cell.mine) {
        content = '💣'; bg = '#f87171';
      } else if (cell.adj > 0) {
        content = String(cell.adj);
        bg = '#eee';
      } else {
        content = '';
        bg = '#eee';
      }
    } else if (cell.flagged) {
      content = '🚩';
      bg = '#ddd';
    }
    return (
      <div key={key}
        onClick={() => reveal(r,c)}
        onContextMenu={(e) => { e.preventDefault(); toggleFlag(r,c); }}
        style={{ width: 32, height: 32, display:'inline-flex', alignItems:'center', justifyContent:'center', border: '1px solid #aaa', background: bg, fontWeight: 700, cursor:'pointer', userSelect:'none' }}
      >{content}</div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Minesweeper</h1>
      </div>
      <div className="grid grid-cols-9 gap-0">
        {board.map((row, r) => (
          row.map((cell, c) => ( renderCell(cell, r, c) ))
        ))}
      </div>
      <button onClick={reset} className="mt-6 px-4 py-2 border rounded">New Game</button>
    </div>
  );
}
