'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 10;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;
const BRICK_WIDTH = 44;
const BRICK_HEIGHT = 16;
const BRICK_GAP = 4;
const PADDLE_SPEED = 10;
const INITIAL_BALL_SPEED = 5;

type Brick = { x: number; y: number; alive: boolean; color: string };

const BRICK_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
];

export default function BreakoutGame() {
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ballPos, setBallPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 });
  const [ballVel, setBallVel] = useState({ x: INITIAL_BALL_SPEED, y: -INITIAL_BALL_SPEED });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [won, setWon] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);

  const initBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    const startX = (GAME_WIDTH - (BRICK_COLS * (BRICK_WIDTH + BRICK_GAP) - BRICK_GAP)) / 2;
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: startX + col * (BRICK_WIDTH + BRICK_GAP),
          y: 60 + row * (BRICK_HEIGHT + BRICK_GAP),
          alive: true,
          color: BRICK_COLORS[row],
        });
      }
    }
    return newBricks;
  }, []);

  const resetBall = useCallback(() => {
    setBallPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 });
    const angle = (Math.random() * 0.5 + 0.25) * Math.PI;
    const speed = INITIAL_BALL_SPEED;
    setBallVel({
      x: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      y: -Math.abs(Math.sin(angle) * speed),
    });
  }, []);

  const resetGame = useCallback(() => {
    setPaddleX(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBricks(initBricks());
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setIsPlaying(true);
    resetBall();
  }, [initBricks, resetBall]);

  useEffect(() => {
    if (!isPlaying || gameOver || won) return;

    const gameLoop = () => {
      // Handle paddle movement
      setPaddleX(prev => {
        let newX = prev;
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('A')) {
          newX = Math.max(0, prev - PADDLE_SPEED);
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || keysPressed.current.has('D')) {
          newX = Math.min(GAME_WIDTH - PADDLE_WIDTH, prev + PADDLE_SPEED);
        }
        return newX;
      });

      // Move ball
      setBallPos(prev => {
        let newX = prev.x + ballVel.x;
        let newY = prev.y + ballVel.y;
        let newVelX = ballVel.x;
        let newVelY = ballVel.y;

        // Wall collisions
        if (newX <= BALL_SIZE / 2) {
          newX = BALL_SIZE / 2;
          newVelX = Math.abs(newVelX);
        }
        if (newX >= GAME_WIDTH - BALL_SIZE / 2) {
          newX = GAME_WIDTH - BALL_SIZE / 2;
          newVelX = -Math.abs(newVelX);
        }
        if (newY <= BALL_SIZE / 2) {
          newY = BALL_SIZE / 2;
          newVelY = Math.abs(newVelY);
        }

        // Paddle collision
        const paddleTop = GAME_HEIGHT - PADDLE_HEIGHT - 20;
        if (
          newY + BALL_SIZE / 2 >= paddleTop &&
          newY - BALL_SIZE / 2 <= paddleTop + PADDLE_HEIGHT &&
          newX >= paddleX &&
          newX <= paddleX + PADDLE_WIDTH &&
          newVelY > 0
        ) {
          const hitPos = (newX - paddleX) / PADDLE_WIDTH;
          const angle = (hitPos - 0.5) * Math.PI * 0.7;
          const speed = Math.sqrt(newVelX * newVelX + newVelY * newVelY) * 1.01;
          const cappedSpeed = Math.min(speed, 12);
          newVelX = Math.sin(angle) * cappedSpeed;
          newVelY = -Math.abs(Math.cos(angle) * cappedSpeed);
          newY = paddleTop - BALL_SIZE / 2;
        }

        // Brick collisions
        setBricks(prevBricks => {
          let bricksHit = false;
          const newBricks = prevBricks.map(brick => {
            if (!brick.alive) return brick;

            const ballLeft = newX - BALL_SIZE / 2;
            const ballRight = newX + BALL_SIZE / 2;
            const ballTop = newY - BALL_SIZE / 2;
            const ballBottom = newY + BALL_SIZE / 2;

            const brickLeft = brick.x;
            const brickRight = brick.x + BRICK_WIDTH;
            const brickTop = brick.y;
            const brickBottom = brick.y + BRICK_HEIGHT;

            if (
              ballRight >= brickLeft &&
              ballLeft <= brickRight &&
              ballBottom >= brickTop &&
              ballTop <= brickBottom
            ) {
              bricksHit = true;
              setScore(s => s + 10);

              // Determine collision side
              const overlapLeft = ballRight - brickLeft;
              const overlapRight = brickRight - ballLeft;
              const overlapTop = ballBottom - brickTop;
              const overlapBottom = brickBottom - ballTop;

              const minOverlapX = Math.min(overlapLeft, overlapRight);
              const minOverlapY = Math.min(overlapTop, overlapBottom);

              if (minOverlapX < minOverlapY) {
                newVelX = -newVelX;
              } else {
                newVelY = -newVelY;
              }

              return { ...brick, alive: false };
            }
            return brick;
          });

          // Check win condition
          if (newBricks.every(b => !b.alive)) {
            setWon(true);
            setIsPlaying(false);
            setHighScore(h => Math.max(h, score + 10));
          }

          return bricksHit ? newBricks : prevBricks;
        });

        // Ball fell past paddle
        if (newY > GAME_HEIGHT) {
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setIsPlaying(false);
              setHighScore(h => Math.max(h, score));
            } else {
              resetBall();
            }
            return newLives;
          });
          return prev;
        }

        if (newVelX !== ballVel.x || newVelY !== ballVel.y) {
          setBallVel({ x: newVelX, y: newVelY });
        }

        return { x: newX, y: newY };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, won, ballVel, paddleX, score, resetBall]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
      }

      keysPressed.current.add(e.key);

      if (e.key === ' ') {
        if (!isPlaying && !gameOver && !won) {
          resetGame();
        } else if (gameOver || won) {
          resetGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, gameOver, won, resetGame]);

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
          Breakout
        </h1>
      </div>

      <div className="flex gap-8 mb-6 text-sm text-stone-500 dark:text-stone-400">
        <span>Score: {score}</span>
        <span>Lives: {lives}</span>
        <span>Best: {highScore}</span>
      </div>

      <div
        className="relative border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Bricks */}
        {bricks.filter(b => b.alive).map((brick, i) => (
          <div
            key={i}
            className={`absolute ${brick.color}`}
            style={{
              left: brick.x,
              top: brick.y,
              width: BRICK_WIDTH,
              height: BRICK_HEIGHT,
            }}
          />
        ))}

        {/* Ball */}
        <div
          className="absolute bg-stone-700 dark:bg-stone-300 rounded-full"
          style={{
            left: ballPos.x - BALL_SIZE / 2,
            top: ballPos.y - BALL_SIZE / 2,
            width: BALL_SIZE,
            height: BALL_SIZE,
          }}
        />

        {/* Paddle */}
        <div
          className="absolute bg-stone-700 dark:bg-stone-300 rounded-sm"
          style={{
            left: paddleX,
            bottom: 20,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        />

        {/* Game Over / Start / Win Overlay */}
        {(!isPlaying || gameOver || won) && (
          <div className="absolute inset-0 bg-stone-50/90 dark:bg-stone-950/90 flex flex-col items-center justify-center">
            {gameOver ? (
              <>
                <p className="text-xl text-stone-700 dark:text-stone-300 mb-2">Game Over</p>
                <p className="text-stone-500 dark:text-stone-400 mb-4">Score: {score}</p>
              </>
            ) : won ? (
              <>
                <p className="text-xl text-stone-700 dark:text-stone-300 mb-2">You Win!</p>
                <p className="text-stone-500 dark:text-stone-400 mb-4">Score: {score}</p>
              </>
            ) : (
              <p className="text-xl text-stone-700 dark:text-stone-300 mb-4">Breakout</p>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-2 text-sm tracking-wider uppercase text-stone-600 dark:text-stone-400 border border-stone-400 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              {gameOver || won ? 'Play Again' : 'Start'}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-stone-400 dark:text-stone-500">
        Arrow keys or A/D to move paddle
      </p>
    </div>
  );
}
