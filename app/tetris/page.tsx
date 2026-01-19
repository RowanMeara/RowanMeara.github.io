'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 24;
const INITIAL_DROP_INTERVAL = 800;
const MIN_DROP_INTERVAL = 100;

type Cell = string | null;
type Board = Cell[][];

const TETROMINOES: { [key: string]: { shape: number[][]; color: string } } = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
};

const TETROMINO_KEYS = Object.keys(TETROMINOES);

function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = [];
  for (let col = 0; col < cols; col++) {
    const newRow: number[] = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(matrix[row][col]);
    }
    rotated.push(newRow);
  }
  return rotated;
}

export default function TetrisGame() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<{ type: string; shape: number[][]; x: number; y: number } | null>(null);
  const [nextPiece, setNextPiece] = useState<string>('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveRef = useRef(0);

  const getRandomPiece = useCallback(() => {
    return TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  }, []);

  const spawnPiece = useCallback((type: string) => {
    const tetromino = TETROMINOES[type];
    return {
      type,
      shape: tetromino.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
    };
  }, []);

  const checkCollision = useCallback((piece: { shape: number[][]; x: number; y: number }, boardState: Board): boolean => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newX = piece.x + col;
          const newY = piece.y + row;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          if (newY >= 0 && boardState[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const mergePiece = useCallback((piece: { type: string; shape: number[][]; x: number; y: number }, boardState: Board): Board => {
    const newBoard = boardState.map(row => [...row]);
    const color = TETROMINOES[piece.type].color;
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newY = piece.y + row;
          const newX = piece.x + col;
          if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
            newBoard[newY][newX] = color;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((boardState: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = boardState.filter(row => row.some(cell => !cell));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    return { newBoard, linesCleared };
  }, []);

  const resetGame = useCallback(() => {
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    setBoard(createEmptyBoard());
    setCurrentPiece(spawnPiece(firstPiece));
    setNextPiece(secondPiece);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(true);
  }, [getRandomPiece, spawnPiece]);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || !isPlaying) return false;

    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
      return true;
    }
    return false;
  }, [currentPiece, board, gameOver, isPlaying, checkCollision]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || !isPlaying) return;

    const rotatedShape = rotateMatrix(currentPiece.shape);
    const newPiece = { ...currentPiece, shape: rotatedShape };

    // Try normal rotation
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
      return;
    }

    // Wall kick attempts
    const kicks = [-1, 1, -2, 2];
    for (const kick of kicks) {
      const kickedPiece = { ...newPiece, x: newPiece.x + kick };
      if (!checkCollision(kickedPiece, board)) {
        setCurrentPiece(kickedPiece);
        return;
      }
    }
  }, [currentPiece, board, gameOver, isPlaying, checkCollision]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || !isPlaying) return;

    let newY = currentPiece.y;
    while (!checkCollision({ ...currentPiece, y: newY + 1 }, board)) {
      newY++;
    }
    setCurrentPiece(prev => prev ? { ...prev, y: newY } : null);
  }, [currentPiece, board, gameOver, isPlaying, checkCollision]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = mergePiece(currentPiece, board);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level;
      setScore(s => s + points);
      setLines(l => {
        const newLines = l + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        if (newLevel !== level) {
          setLevel(newLevel);
        }
        return newLines;
      });
    }

    setBoard(clearedBoard);

    const newPiece = spawnPiece(nextPiece);
    if (checkCollision(newPiece, clearedBoard)) {
      setGameOver(true);
      setIsPlaying(false);
      setHighScore(h => Math.max(h, score + (linesCleared > 0 ? [0, 100, 300, 500, 800][linesCleared] * level : 0)));
    } else {
      setCurrentPiece(newPiece);
      setNextPiece(getRandomPiece());
    }
  }, [currentPiece, board, nextPiece, level, score, spawnPiece, mergePiece, clearLines, checkCollision, getRandomPiece]);

  // Game loop for automatic dropping
  useEffect(() => {
    if (!isPlaying || gameOver || !currentPiece) return;

    const dropInterval = Math.max(MIN_DROP_INTERVAL, INITIAL_DROP_INTERVAL - (level - 1) * 75);

    dropIntervalRef.current = setInterval(() => {
      if (!movePiece(0, 1)) {
        lockPiece();
      }
    }, dropInterval);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [isPlaying, gameOver, currentPiece, level, movePiece, lockPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying && !gameOver && e.key === ' ') {
        resetGame();
        return;
      }

      if (gameOver && e.key === ' ') {
        resetGame();
        return;
      }

      if (!isPlaying || gameOver) return;

      const now = Date.now();
      if (now - lastMoveRef.current < 50) return;
      lastMoveRef.current = now;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (!movePiece(0, 1)) {
            lockPiece();
          }
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          rotatePiece();
          break;
        case ' ':
          hardDrop();
          setTimeout(() => lockPiece(), 10);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, resetGame, movePiece, rotatePiece, hardDrop, lockPiece]);

  // Render the board with the current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      const color = TETROMINOES[currentPiece.type].color;
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const y = currentPiece.y + row;
            const x = currentPiece.x + col;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = color;
            }
          }
        }
      }
    }
    return displayBoard;
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    const shape = TETROMINOES[nextPiece].shape;
    const color = TETROMINOES[nextPiece].color;
    return (
      <div className="flex flex-col items-center">
        {shape.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                className={`${cell ? color : 'bg-transparent'}`}
                style={{ width: 16, height: 16, margin: 1 }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link
          href="/projects"
          className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block"
        >
          &larr; back
        </Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">
          Tetris
        </h1>
      </div>

      <div className="flex gap-8">
        <div>
          <div className="flex gap-8 mb-6 text-sm text-stone-500 dark:text-stone-400">
            <span>Score: {score}</span>
            <span>Lines: {lines}</span>
            <span>Level: {level}</span>
          </div>

          <div
            className="relative border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900"
            style={{ width: BOARD_WIDTH * CELL_SIZE, height: BOARD_HEIGHT * CELL_SIZE }}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: BOARD_HEIGHT - 1 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-stone-400 dark:border-stone-600"
                  style={{ top: (i + 1) * CELL_SIZE }}
                />
              ))}
              {Array.from({ length: BOARD_WIDTH - 1 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-stone-400 dark:border-stone-600"
                  style={{ left: (i + 1) * CELL_SIZE }}
                />
              ))}
            </div>

            {/* Board cells */}
            {displayBoard.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                cell && (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`absolute ${cell} border border-stone-200 dark:border-stone-800`}
                    style={{
                      left: colIdx * CELL_SIZE + 1,
                      top: rowIdx * CELL_SIZE + 1,
                      width: CELL_SIZE - 2,
                      height: CELL_SIZE - 2,
                    }}
                  />
                )
              ))
            )}

            {/* Game Over / Start Overlay */}
            {(!isPlaying || gameOver) && (
              <div className="absolute inset-0 bg-stone-50/90 dark:bg-stone-950/90 flex flex-col items-center justify-center">
                {gameOver ? (
                  <>
                    <p className="text-xl text-stone-700 dark:text-stone-300 mb-2">Game Over</p>
                    <p className="text-stone-500 dark:text-stone-400 mb-4">Score: {score}</p>
                  </>
                ) : (
                  <p className="text-xl text-stone-700 dark:text-stone-300 mb-4">Tetris</p>
                )}
                <button
                  onClick={resetGame}
                  className="px-6 py-2 text-sm tracking-wider uppercase text-stone-600 dark:text-stone-400 border border-stone-400 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                >
                  {gameOver ? 'Play Again' : 'Start'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <div className="text-sm text-stone-500 dark:text-stone-400 mb-2">Next:</div>
          <div className="border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 p-4 w-24 h-24 flex items-center justify-center">
            {renderNextPiece()}
          </div>
          <div className="text-sm text-stone-500 dark:text-stone-400 mt-4">
            Best: {highScore}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-stone-400 dark:text-stone-500">
        Arrow keys or WASD to move/rotate, Space to drop
      </p>
    </div>
  );
}
