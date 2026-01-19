'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  const lastDirectionRef = useRef(direction); // Track the direction used in last game tick
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    lastDirectionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  }, [generateFood]);

  const gameLoop = useCallback(() => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      // Update lastDirectionRef so key handler knows the actual direction of movement
      lastDirectionRef.current = currentDirection;

      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(prev => Math.max(prev, score));
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(prev => Math.max(prev, score));
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, score]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
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

      // Use lastDirectionRef to prevent 180-degree turns even with rapid key presses
      const lastDir = lastDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, resetGame]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block"
        >
          &larr; back
        </Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">
          Snake
        </h1>
      </div>

      {/* Score */}
      <div className="flex gap-8 mb-6 text-sm text-stone-500 dark:text-stone-400">
        <span>Score: {score}</span>
        <span>Best: {highScore}</span>
      </div>

      {/* Game Board */}
      <div
        className="relative border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: GRID_SIZE - 1 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-stone-400 dark:border-stone-600"
              style={{ top: (i + 1) * CELL_SIZE }}
            />
          ))}
          {Array.from({ length: GRID_SIZE - 1 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-stone-400 dark:border-stone-600"
              style={{ left: (i + 1) * CELL_SIZE }}
            />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${
              index === 0
                ? 'bg-stone-700 dark:bg-stone-300'
                : 'bg-stone-500 dark:bg-stone-500'
            }`}
            style={{
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute rounded-full bg-stone-400 dark:bg-stone-500"
          style={{
            left: food.x * CELL_SIZE + 3,
            top: food.y * CELL_SIZE + 3,
            width: CELL_SIZE - 6,
            height: CELL_SIZE - 6,
          }}
        />

        {/* Game Over / Start Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-stone-50/90 dark:bg-stone-950/90 flex flex-col items-center justify-center">
            {gameOver ? (
              <>
                <p className="text-xl text-stone-700 dark:text-stone-300 mb-2">Game Over</p>
                <p className="text-stone-500 dark:text-stone-400 mb-4">Score: {score}</p>
              </>
            ) : (
              <p className="text-xl text-stone-700 dark:text-stone-300 mb-4">Snake</p>
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

      {/* Controls hint */}
      <p className="mt-6 text-xs text-stone-400 dark:text-stone-500">
        Arrow keys or WASD to move
      </p>
    </div>
  );
}
