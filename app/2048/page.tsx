'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';

const SIZE = 4;

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

let nextTileId = 0;

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
      const after = transpose(movedCols);
      b = after;
      moved = !before.every((row, i) => row.every((v, j) => v === b[i][j]));
      break;
    }
case 'DOWN': {
  // Down move: Down move: process each column from bottom to top with sliding
  const before = b.map(r => r.slice());
  let movedLocal = false;
  let gainLocal = 0;
  const newBoard = board.map(row => row.slice());
  for (let c = 0; c < SIZE; c++) {
    const col: number[] = [];
    for (let r = SIZE - 1; r >= 0; r--) col.push(newBoard[r][c]);
    const { newLine, gained } = slideLine(col);
    gainLocal += gained;
    for (let i = 0; i < SIZE; i++) {
      newBoard[SIZE - 1 - i][c] = newLine[i];
    }
  }
  // detect move
  movedLocal = !before.every((row, r) => row.every((v, c) => newBoard[r][c] === v));
  b = newBoard;
  moved = movedLocal;
  gainedTotal += gainLocal;
  break;
}
  }
  return { board: b, gained: gainedTotal, moved };
}

export default function Game2048() {
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(0);
  const [anim, setAnim] = useState<string[][]>(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => '')));
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const boardToTiles = useCallback((b: number[][]): Tile[] => {
    const result: Tile[] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] !== 0) {
          result.push({
            id: nextTileId++,
            value: b[r][c],
            row: r,
            col: c,
          });
        }
      }
    }
    return result;
  }, []);

  const newGame = useCallback(() => {
    nextTileId = 0;
    let b = emptyBoard();
    b = addRandom(addRandom(b));
    setBoard(b);
    setTiles(boardToTiles(b));
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setAnim(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => '')));
  }, [boardToTiles]);

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

      // Update tiles based on the new board state
      setTiles(prevTiles => {
        const newTiles: Tile[] = [];
        const usedTiles = new Set<number>();

        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            if (finalBoard[r][c] !== 0) {
              const movedValue = movedBoard[r][c];
              const finalValue = finalBoard[r][c];
              const isNewTile = movedValue === 0 && finalValue !== 0;

              if (isNewTile) {
                newTiles.push({
                  id: nextTileId++,
                  value: finalValue,
                  row: r,
                  col: c,
                  isNew: true,
                });
              } else {
                // Find matching tile from previous state
                let foundTile: Tile | undefined;

                for (const oldTile of prevTiles) {
                  if (usedTiles.has(oldTile.id)) continue;

                  // Check if this tile could have moved to this position
                  const couldMove =
                    (dir === 'LEFT' && oldTile.row === r && oldTile.col >= c) ||
                    (dir === 'RIGHT' && oldTile.row === r && oldTile.col <= c) ||
                    (dir === 'UP' && oldTile.col === c && oldTile.row >= r) ||
                    (dir === 'DOWN' && oldTile.col === c && oldTile.row <= r);

                  if (couldMove && (oldTile.value === finalValue || oldTile.value === finalValue / 2)) {
                    foundTile = oldTile;
                    usedTiles.add(oldTile.id);
                    break;
                  }
                }

                if (foundTile) {
                  newTiles.push({
                    id: foundTile.id,
                    value: finalValue,
                    row: r,
                    col: c,
                    isMerged: finalValue !== foundTile.value,
                  });
                } else {
                  newTiles.push({
                    id: nextTileId++,
                    value: finalValue,
                    row: r,
                    col: c,
                  });
                }
              }
            }
          }
        }

        return newTiles;
      });

      // Update score
      setScore(s => s + gained);

      // Handle game over
      const anyMove = (mb: number[][]) => {
        for (let i=0;i<SIZE;i++) for (let j=0;j<SIZE;j++) if (mb[i][j] === 0) return true;
        for (let i=0;i<SIZE;i++) for (let j=0;j<SIZE-1;j++) if (mb[i][j] === mb[i][j+1]) return true;
        for (let i=0;i<SIZE-1;i++) for (let j=0;j<SIZE;j++) if (mb[i][j] === mb[i+1][j]) return true;
        return false;
      };
      if (!anyMove(finalBoard)) {
        setGameOver(true);
      }

      // Clear animation flags after a delay
      setTimeout(() => {
        setTiles(tiles => tiles.map(t => ({ ...t, isNew: false, isMerged: false })));
      }, 200);

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
      <style jsx>{`
        .game-container {
          position: relative;
          width: ${SIZE * 72 + (SIZE - 1) * 8}px;
          height: ${SIZE * 72 + (SIZE - 1) * 8}px;
        }
        .grid-cell {
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 6px;
          background: rgba(238, 228, 218, 0.35);
        }
        .tile {
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.15s ease-in-out;
        }
        .tile--new {
          animation: spawn 0.2s ease;
        }
        .tile--merged {
          animation: merge 0.2s ease;
        }
        @keyframes spawn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes merge {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">2048</h1>
      </div>
      <div className="game-container">
        {/* Background grid */}
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          const top = r * (72 + 8);
          const left = c * (72 + 8);
          return <div key={`cell-${i}`} className="grid-cell" style={{ top, left }} />;
        })}
        {/* Tiles */}
        {tiles.map(tile => {
          const top = tile.row * (72 + 8);
          const left = tile.col * (72 + 8);
          const bg = colorFor(tile.value);
          const cls = `tile ${tile.isNew ? 'tile--new' : ''} ${tile.isMerged ? 'tile--merged' : ''}`;
          return (
            <div
              key={tile.id}
              className={cls}
              style={{
                top,
                left,
                background: bg,
                color: tile.value <= 4 ? '#776e65' : '#f9f6f2',
                fontSize: tile.value > 999 ? 14 : 20,
              }}
            >
              {tile.value}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={newGame} className="px-4 py-2 border rounded">New Game</button>
      </div>
      <div className="mt-4 text-xs text-stone-500">Score: {score}  Best: {best}</div>
    </div>
  );
}
