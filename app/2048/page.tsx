'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';

const SIZE = 4;

function emptyBoard(): number[][] {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
}

function cloneBoard(b: number[][]): number[][] {
  return b.map(row => row.slice());
}

function addRandom(board: number[][]): number[][] {
  const empties: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return board;
  const [rr, cc] = empties[Math.floor(Math.random() * empties.length)];
  board[rr][cc] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

// Merge a single line to the left, returning the new line and the score gained by merges
function slideLine(line: number[]): { newLine: number[]; gained: number } {
  const nonZero = line.filter(v => v !== 0);
  const merged: number[] = [];
  let gained = 0;
  let skip = false;
  for (let i = 0; i < nonZero.length; i++) {
    if (skip) { skip = false; continue; }
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const val = nonZero[i] * 2;
      merged.push(val);
      gained += val;
      skip = true;
    } else {
      merged.push(nonZero[i]);
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { newLine: merged, gained };
}

function transpose(board: number[][]): number[][] {
  const res = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      res[c][r] = board[r][c];
    }
  }
  return res;
}

function moveBoard(board: number[][], dir: 'LEFT'|'UP'|'RIGHT'|'DOWN'):
  { board: number[][]; gained: number; moved: boolean } {
  let moved = false;
  let gainedTotal = 0;
  let b: number[][] = board.map(r => r.slice());
  const applyLeftToRows = (rows: number[][]): { rowsOut: number[][]; gained: number }[] => {
    return rows.map(row => {
      const { newLine, gained } = slideLine(row);
      return { newLine, gained };
    }).map(x => x as any);
  };
  switch (dir) {
    case 'LEFT': {
      const before = b.map(r => r.slice());
      const newRows = b.map((row) => {
        const { newLine, gained } = slideLine(row);
        gainedTotal += gained;
        return newLine;
      });
      b = newRows;
      moved = !before.every((row, i) => row.every((v, j) => v === b[i][j]));
      break;
    }
    case 'RIGHT': {
      const before = b.map(r => r.slice());
      const newRows = b.map((row) => {
        const rev = row.slice().reverse();
        const { newLine, gained } = slideLine(rev);
        gainedTotal += gained;
        return newLine.reverse();
      });
      b = newRows;
      moved = !before.every((row, i) => row.every((v, j) => v === b[i][j]));
      break;
    }
    case 'UP': {
      const before = b.map(r => r.slice());
      const t = transpose(b);
      const movedCols = t.map(col => {
        const { newLine, gained } = slideLine(col);
        gainedTotal += gained;
        return newLine;
      });
      const after = transpose(movedCols as any);
      b = after;
      moved = !before.every((row, i) => row.every((v, j) => v === b[i][j]));
      break;
    }
    case 'DOWN': {
      const before = b.map(r => r.slice());
      const t = transpose(b);
      const rev = t.map(col => col.slice().reverse());
      const movedCols = rev.map((col) => {
        const { newLine, gained } = slideLine(col);
        gainedTotal += gained;
        return newLine.reverse();
      });
      const unreversed = movedCols as any;
      b = transpose(unreversed.map((col: number[]) => col));
      // Since we transposed twice, better reconstruct properly
      const rev2 = transpose(b).map(col => col.slice().reverse());
      b = transpose(rev2 as any);
      moved = !board.every((row, i) => row.every((v, j) => b[i][j] === v));
      break;
    }
  }
  return { board: b, gained: gainedTotal, moved };
}

export default function Game2048() {
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(0);
  const [anim, setAnim] = useState<string[][]>(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => '')));
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const newGame = useCallback(() => {
    let b = emptyBoard();
    b = addRandom(addRandom(b));
    setBoard(b);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setAnim(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => '')));
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cpu-2048-best') : null;
    if (saved) setBest(parseInt(saved));
  }, []);

  useEffect(() => {
    if (gameOver) {
      setBest(old => {
        const next = Math.max(old, score);
        if (typeof window !== 'undefined') localStorage.setItem('cpu-2048-best', String(next));
        return next;
      });
    }
  }, [gameOver, score]);

  const performMove = useCallback((dir: 'LEFT'|'UP'|'RIGHT'|'DOWN') => {
    setBoard(prevBoard => {
      const { board: movedBoard, gained, moved } = moveBoard(prevBoard, dir);
      if (!moved) return prevBoard;
      const finalBoard = addRandom(movedBoard);
      // compute animation map
      const newAnim = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => '')) as string[][];
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (prevBoard[r][c] !== finalBoard[r][c] && finalBoard[r][c] !== 0) {
            newAnim[r][c] = prevBoard[r][c] === 0 ? 'spawn' : 'merge';
          }
        }
      }
      setAnim(newAnim);
      // clear after delay
      setTimeout(() => {
        setAnim(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => '')));
      }, 180);
      // update score
      setScore(s => s + gained);
      // handle game over (no moves left)
      const anyMove = (mb: number[][]) => {
        // simple check: is there any 0 cell or adjacent equal numbers horizontally/vertically
        for (let i=0;i<SIZE;i++) for (let j=0;j<SIZE;j++) if (mb[i][j] === 0) return true;
        // check left/right
        for (let i=0;i<SIZE;i++) for (let j=0;j<SIZE-1;j++) if (mb[i][j] === mb[i][j+1]) return true;
        // up/down
        for (let i=0;i<SIZE-1;i++) for (let j=0;j<SIZE;j++) if (mb[i][j] === mb[i+1][j]) return true;
        return false;
      };
      if (!anyMove(finalBoard)) {
        setGameOver(true);
      }
      return finalBoard;
    });
  }, []);

  const handleMove = useCallback((dir: 'LEFT'|'UP'|'RIGHT'|'DOWN') => {
    if (!started || gameOver) return;
    performMove(dir);
  }, [started, gameOver, performMove]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started || gameOver) return;
      if ([ 'ArrowLeft','ArrowUp','ArrowRight','ArrowDown','w','a','s','d' ].includes(e.key)) {
        e.preventDefault();
        let dir: 'LEFT'|'UP'|'RIGHT'|'DOWN' = 'LEFT';
        switch (e.key) {
          case 'ArrowLeft': case 'a': case 'A': dir = 'LEFT'; break;
          case 'ArrowUp': case 'w': case 'W': dir = 'UP'; break;
          case 'ArrowRight': case 'd': case 'D': dir = 'RIGHT'; break;
          case 'ArrowDown': case 's': case 'S': dir = 'DOWN'; break;
        }
        handleMove(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, gameOver, handleMove]);

  // Initialize
  useEffect(() => { if (!started) newGame(); }, [started, newGame]);

  const colorFor = (v: number): string => {
    const map: Record<number, string> = {
      2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return map[v] ?? '#3c3a32';
  };

  // Render grid
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">2048</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: `repeat(${SIZE}, 72px)`, gap: 8 }}>
        {board.map((row, r) => row.map((val, c) => {
          const key = `${r}-${c}`;
          const isAnim = anim[r]?.[c];
          const cls = `tile ${isAnim === 'spawn' ? 'tile--spawn' : isAnim === 'merge' ? 'tile--merge' : ''}`;
          const bg = colorFor(val);
          return (
            <div key={key} className={cls} style={{ width:72, height:72, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', background:bg, color: val <= 4 ? '#776e65' : '#f9f6f2', fontWeight:700, fontSize: val > 999 ? 14 : 20 }}>
              {val !== 0 ? val : ''}
            </div>
          );
        }))}
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={newGame} className="px-4 py-2 border rounded">New Game</button>
      </div>
      <div className="mt-4 text-xs text-stone-500">Score: {score}  Best: {best}</div>
    </div>
  );
}
