'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { SIZE, addRandom, emptyBoard, hasAnyMove, moveBoardDetailed, type Direction } from './gameLogic';
import { addSpawnTile, buildSettledTiles, buildSlidePhaseTiles, type Tile } from './tileAnimator';

let nextTileId = 0;

function tileColors(value: number): { background: string; color: string } {
  const map: Record<number, { background: string; color: string }> = {
    2: { background: '#eee4da', color: '#776e65' },
    4: { background: '#ede0c8', color: '#776e65' },
    8: { background: '#f2b179', color: '#f9f6f2' },
    16: { background: '#f59563', color: '#f9f6f2' },
    32: { background: '#f67c5f', color: '#f9f6f2' },
    64: { background: '#f65e3b', color: '#f9f6f2' },
    128: { background: '#edcf72', color: '#f9f6f2' },
    256: { background: '#edcc61', color: '#f9f6f2' },
    512: { background: '#edc850', color: '#f9f6f2' },
    1024: { background: '#edc53f', color: '#f9f6f2' },
    2048: { background: '#edc22e', color: '#f9f6f2' },
  };

  if (map[value]) return map[value];

  const level = Math.log2(value);
  const hue = (36 + level * 23) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue} 74% 56%), hsl(${(hue + 30) % 360} 72% 42%))`,
    color: '#ffffff',
  };
}

function tileFontSize(value: number): string {
  const digits = String(value).length;
  if (digits <= 2) return 'clamp(20px, 5.2vw, 34px)';
  if (digits === 3) return 'clamp(18px, 4.5vw, 28px)';
  if (digits === 4) return 'clamp(15px, 3.8vw, 22px)';
  return 'clamp(12px, 3.1vw, 18px)';
}

export default function Game2048() {
  const MOVE_MS = 170;
  const [cellSize, setCellSize] = useState(72);
  const [gapSize, setGapSize] = useState(8);
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winReached, setWinReached] = useState(false);
  const [continueAfterWin, setContinueAfterWin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearFlagsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardRef = useRef<number[][]>(board);
  const tilesRef = useRef<Tile[]>(tiles);
  const maxTile = board.flat().reduce((m, v) => Math.max(m, v), 0);
  const boardPx = SIZE * cellSize + (SIZE - 1) * gapSize;

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
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    if (clearFlagsTimerRef.current) {
      clearTimeout(clearFlagsTimerRef.current);
      clearFlagsTimerRef.current = null;
    }
    nextTileId = 0;
    const seeded = addRandom(addRandom(emptyBoard()));
    boardRef.current = seeded;
    setBoard(seeded);
    const seededTiles = boardToTiles(seeded);
    tilesRef.current = seededTiles;
    setTiles(seededTiles);
    setScore(0);
    setGameOver(false);
    setWinReached(false);
    setContinueAfterWin(false);
    setIsAnimating(false);
    setStarted(true);
  }, [boardToTiles]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cpu-2048-best') : null;
    const parsed = saved ? Number.parseInt(saved, 10) : NaN;
    if (Number.isFinite(parsed) && parsed >= 0) {
      setBest(parsed);
    }
  }, []);

  useEffect(() => {
    setBest((prev) => {
      const next = Math.max(prev, score);
      if (next !== prev && typeof window !== 'undefined') {
        localStorage.setItem('cpu-2048-best', String(next));
      }
      return next;
    });
  }, [score]);

  const performMove = useCallback((dir: Direction) => {
    const prevBoard = boardRef.current;
    const prevTiles = tilesRef.current;
    const { board: movedBoard, gained, moved, cells } = moveBoardDetailed(prevBoard, dir);
    if (!moved) return;

    const settledPhaseTiles = buildSettledTiles(prevTiles, cells, () => nextTileId++);
    const slidePhaseTiles = buildSlidePhaseTiles(prevTiles, cells);

    boardRef.current = movedBoard;
    tilesRef.current = slidePhaseTiles;
    setBoard(movedBoard);
    setTiles(slidePhaseTiles);
    setIsAnimating(true);
    setScore((s) => s + gained);

    if (!winReached && movedBoard.some((row) => row.some((value) => value >= 2048))) {
      setWinReached(true);
    }

    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    if (clearFlagsTimerRef.current) {
      clearTimeout(clearFlagsTimerRef.current);
    }

    animationTimerRef.current = setTimeout(() => {
      const finalBoard = addRandom(movedBoard);
      const withSpawn = addSpawnTile(settledPhaseTiles, movedBoard, finalBoard, () => nextTileId++);

      boardRef.current = finalBoard;
      tilesRef.current = withSpawn;
      setBoard(finalBoard);
      setTiles(withSpawn);

      if (!hasAnyMove(finalBoard)) {
        setGameOver(true);
      }

      clearFlagsTimerRef.current = setTimeout(() => {
        setTiles((existing) => {
          const cleaned = existing.map((t) => ({ ...t, isNew: false, isMerged: false }));
          tilesRef.current = cleaned;
          return cleaned;
        });
      }, 130);

      setIsAnimating(false);
    }, MOVE_MS);
  }, [MOVE_MS, winReached]);

  const overlayWinOpen = winReached && !continueAfterWin && !gameOver;

  const handleMove = useCallback((dir: Direction) => {
    if (!started || gameOver || overlayWinOpen || isAnimating) return;
    performMove(dir);
  }, [started, gameOver, overlayWinOpen, isAnimating, performMove]);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !started || gameOver || overlayWinOpen) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 28;

    if (Math.max(absX, absY) < threshold) return;

    if (absX > absY * 1.2) {
      handleMove(dx > 0 ? 'RIGHT' : 'LEFT');
      return;
    }

    if (absY > absX * 1.2) {
      handleMove(dy > 0 ? 'DOWN' : 'UP');
    }
  }, [gameOver, handleMove, overlayWinOpen, started]);

  const onTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started || gameOver || overlayWinOpen) return;
      if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
        let dir: Direction = 'LEFT';
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
          case 'A':
            dir = 'LEFT';
            break;
          case 'ArrowUp':
          case 'w':
          case 'W':
            dir = 'UP';
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            dir = 'RIGHT';
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            dir = 'DOWN';
            break;
          default:
            break;
        }
        handleMove(dir);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameOver, handleMove, overlayWinOpen, started]);

  useEffect(() => {
    if (!started) newGame();
  }, [started, newGame]);

  useEffect(() => {
    const computeMetrics = () => {
      if (typeof window === 'undefined') return;
      const maxBoard = Math.min(420, Math.max(280, window.innerWidth - 36));
      const nextGap = Math.max(6, Math.min(10, Math.round(maxBoard * 0.02)));
      const nextCell = Math.max(58, Math.min(86, Math.floor((maxBoard - (SIZE - 1) * nextGap) / SIZE)));
      setGapSize(nextGap);
      setCellSize(nextCell);
    };

    computeMetrics();
    window.addEventListener('resize', computeMetrics);
    return () => window.removeEventListener('resize', computeMetrics);
  }, []);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      if (clearFlagsTimerRef.current) clearTimeout(clearFlagsTimerRef.current);
    };
  }, []);

  const statusAnnouncement = gameOver
    ? `Game over. Score ${score}. Best ${best}.`
    : overlayWinOpen
      ? `You reached 2048 with score ${score}. Choose Continue or New Game.`
      : `Score ${score}. Best ${best}.`;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <style jsx>{`
        .game-shell {
          position: relative;
          touch-action: none;
          user-select: none;
        }
        .grid-cell {
          position: absolute;
          border-radius: 10px;
          background: rgba(238, 228, 218, 0.35);
        }
        .tile {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          pointer-events: none;
          transition: transform 0.17s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .tile-inner {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .tile-inner--new {
          animation: spawn 0.18s ease;
        }
        .tile-inner--merged {
          animation: merge 0.18s ease;
        }
        .overlay {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: rgba(20, 20, 20, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 16px;
          z-index: 15;
        }
        .overlay-card {
          background: rgba(255, 255, 255, 0.95);
          color: #1f2937;
          border-radius: 12px;
          padding: 18px;
          width: min(90%, 320px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        @keyframes spawn {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes merge {
          0% { transform: scale(1); }
          50% { transform: scale(1.14); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tile {
            transition: transform 0.09s linear;
          }
          .tile-inner--new,
          .tile-inner--merged {
            animation: none;
          }
        }
      `}</style>

      <div className="mb-6 text-center">
        <Link
          href="/projects"
          className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors mb-4 inline-block"
        >
          &larr; back
        </Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">2048</h1>
        <p className="mt-2 text-xs text-stone-500">Use arrow keys/WASD or swipe on the board.</p>
      </div>

      <div className="mb-4 flex items-center gap-3" aria-label="Scoreboard">
        <div className="rounded-lg border border-stone-300/70 dark:border-stone-700 px-3 py-2 text-sm">
          Score: <span className="font-semibold">{score}</span>
        </div>
        <div className="rounded-lg border border-stone-300/70 dark:border-stone-700 px-3 py-2 text-sm">
          Best: <span className="font-semibold">{best}</span>
        </div>
        <div className="rounded-lg border border-stone-300/70 dark:border-stone-700 px-3 py-2 text-sm">
          Max Tile: <span className="font-semibold">{maxTile || 0}</span>
        </div>
      </div>

      <div
        className="game-shell"
        style={{ width: boardPx, height: boardPx }}
        role="grid"
        aria-label="2048 board"
        aria-describedby="game-help"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          const top = r * (cellSize + gapSize);
          const left = c * (cellSize + gapSize);
          return <div key={`cell-${i}`} className="grid-cell" style={{ top, left, width: cellSize, height: cellSize }} aria-hidden="true" />;
        })}

        {tiles.map((tile) => {
          const top = tile.row * (cellSize + gapSize);
          const left = tile.col * (cellSize + gapSize);
          const palette = tileColors(tile.value);
          const innerCls = `tile-inner ${tile.isNew ? 'tile-inner--new' : ''} ${tile.isMerged ? 'tile-inner--merged' : ''}`;
          const powerfulTile = tile.value > 2048;

          return (
            <div
              key={tile.id}
              className="tile"
              style={{
                transform: `translate3d(${left}px, ${top}px, 0)`,
                width: cellSize,
                height: cellSize,
              }}
              aria-hidden="true"
            >
              <div
                className={innerCls}
                style={{
                  background: palette.background,
                  color: palette.color,
                  fontSize: tileFontSize(tile.value),
                  textShadow: powerfulTile ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
                  letterSpacing: powerfulTile ? '0.02em' : '0',
                }}
              >
                {tile.value}
              </div>
            </div>
          );
        })}

        {gameOver && (
          <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
            <div className="overlay-card">
              <h2 id="game-over-title" className="text-xl font-semibold">Game Over</h2>
              <p className="mt-2 text-sm text-stone-700">Final score: {score}</p>
              <button
                onClick={newGame}
                className="mt-4 w-full rounded-md border border-stone-800 bg-stone-800 text-white px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {overlayWinOpen && (
          <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
            <div className="overlay-card">
              <h2 id="win-title" className="text-xl font-semibold">You made 2048</h2>
              <p className="mt-2 text-sm text-stone-700">Keep going for a higher score or start over.</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setContinueAfterWin(true)}
                  className="flex-1 rounded-md border border-stone-700 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500"
                >
                  Continue
                </button>
                <button
                  onClick={newGame}
                  className="flex-1 rounded-md border border-stone-800 bg-stone-800 text-white px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-5">
        <button
          onClick={newGame}
          className="px-4 py-2 border rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500"
        >
          New Game
        </button>
      </div>

      <p id="game-help" className="mt-3 text-xs text-stone-500">
        Swipe on touch devices. Keyboard: arrows or WASD.
      </p>

      <div className="sr-only" aria-live="polite">{statusAnnouncement}</div>

      <div className="sr-only" aria-live="polite" role="status">
        {winReached ? '2048 reached.' : 'Playing.'}
      </div>
    </main>
  );
}
