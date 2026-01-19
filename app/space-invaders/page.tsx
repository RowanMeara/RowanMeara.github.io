'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

type Position = { x: number; y: number };
type Alien = Position & { alive: boolean };
type Bullet = Position & { direction: 'up' | 'down' };

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 20;
const ALIEN_ROWS = 4;
const ALIEN_COLS = 8;
const ALIEN_SPACING_X = 45;
const ALIEN_SPACING_Y = 35;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 12;
const PLAYER_SPEED = 8;
const BULLET_SPEED = 8;
const ALIEN_BULLET_SPEED = 4;
const ALIEN_MOVE_INTERVAL = 500;
const ALIEN_DROP = 20;

export default function SpaceInvadersGame() {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [alienDirection, setAlienDirection] = useState<'left' | 'right'>('right');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);

  const keysPressed = useRef<Set<string>>(new Set());
  const lastAlienMove = useRef(0);
  const lastAlienShot = useRef(0);
  const gameLoopRef = useRef<number | null>(null);

  const initAliens = useCallback(() => {
    const newAliens: Alien[] = [];
    const startX = (GAME_WIDTH - (ALIEN_COLS * ALIEN_SPACING_X)) / 2 + 10;
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIEN_COLS; col++) {
        newAliens.push({
          x: startX + col * ALIEN_SPACING_X,
          y: 50 + row * ALIEN_SPACING_Y,
          alive: true,
        });
      }
    }
    return newAliens;
  }, []);

  const resetGame = useCallback(() => {
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setAliens(initAliens());
    setBullets([]);
    setAlienDirection('right');
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(true);
    lastAlienMove.current = Date.now();
    lastAlienShot.current = Date.now();
  }, [initAliens]);

  const shoot = useCallback(() => {
    setBullets(prev => {
      const playerBullets = prev.filter(b => b.direction === 'up');
      if (playerBullets.length < 3) {
        return [...prev, { x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 30, direction: 'up' as const }];
      }
      return prev;
    });
  }, [playerX]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      const now = Date.now();

      // Handle player movement
      setPlayerX(prev => {
        let newX = prev;
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('A')) {
          newX = Math.max(0, prev - PLAYER_SPEED);
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || keysPressed.current.has('D')) {
          newX = Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + PLAYER_SPEED);
        }
        return newX;
      });

      // Move bullets
      setBullets(prev => prev.map(bullet => ({
        ...bullet,
        y: bullet.direction === 'up' ? bullet.y - BULLET_SPEED : bullet.y + ALIEN_BULLET_SPEED
      })).filter(bullet => bullet.y > -BULLET_HEIGHT && bullet.y < GAME_HEIGHT));

      // Move aliens
      if (now - lastAlienMove.current > ALIEN_MOVE_INTERVAL - (level * 50)) {
        lastAlienMove.current = now;
        setAliens(prev => {
          const aliveAliens = prev.filter(a => a.alive);
          if (aliveAliens.length === 0) return prev;

          const minX = Math.min(...aliveAliens.map(a => a.x));
          const maxX = Math.max(...aliveAliens.map(a => a.x));

          let newDirection = alienDirection;
          let shouldDrop = false;

          if (alienDirection === 'right' && maxX + ALIEN_WIDTH >= GAME_WIDTH - 10) {
            newDirection = 'left';
            shouldDrop = true;
          } else if (alienDirection === 'left' && minX <= 10) {
            newDirection = 'right';
            shouldDrop = true;
          }

          if (newDirection !== alienDirection) {
            setAlienDirection(newDirection);
          }

          return prev.map(alien => ({
            ...alien,
            x: alien.x + (shouldDrop ? 0 : (alienDirection === 'right' ? 10 : -10)),
            y: alien.y + (shouldDrop ? ALIEN_DROP : 0)
          }));
        });
      }

      // Alien shooting
      if (now - lastAlienShot.current > 1500 - (level * 100)) {
        lastAlienShot.current = now;
        setAliens(prev => {
          const aliveAliens = prev.filter(a => a.alive);
          if (aliveAliens.length > 0) {
            const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            setBullets(b => [...b, { x: shooter.x + ALIEN_WIDTH / 2 - BULLET_WIDTH / 2, y: shooter.y + ALIEN_HEIGHT, direction: 'down' }]);
          }
          return prev;
        });
      }

      // Check collisions
      setBullets(prevBullets => {
        const bulletsToRemove: number[] = [];

        setAliens(prevAliens => {
          const newAliens = [...prevAliens];
          let scoreIncrease = 0;

          prevBullets.forEach((bullet, bulletIndex) => {
            if (bullet.direction === 'up') {
              newAliens.forEach((alien, alienIndex) => {
                if (alien.alive &&
                    bullet.x < alien.x + ALIEN_WIDTH &&
                    bullet.x + BULLET_WIDTH > alien.x &&
                    bullet.y < alien.y + ALIEN_HEIGHT &&
                    bullet.y + BULLET_HEIGHT > alien.y) {
                  newAliens[alienIndex] = { ...alien, alive: false };
                  bulletsToRemove.push(bulletIndex);
                  scoreIncrease += 10;
                }
              });
            }
          });

          if (scoreIncrease > 0) {
            setScore(s => s + scoreIncrease);
          }

          // Check if all aliens are dead
          if (newAliens.every(a => !a.alive)) {
            setLevel(l => l + 1);
            setAliens(initAliens());
            setBullets([]);
            lastAlienMove.current = Date.now();
          }

          return newAliens;
        });

        // Check player hit
        const playerHit = prevBullets.some(bullet =>
          bullet.direction === 'down' &&
          bullet.x < playerX + PLAYER_WIDTH &&
          bullet.x + BULLET_WIDTH > playerX &&
          bullet.y + BULLET_HEIGHT > GAME_HEIGHT - PLAYER_HEIGHT - 20 &&
          bullet.y < GAME_HEIGHT - 20
        );

        if (playerHit) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore(h => Math.max(h, score));
        }

        return prevBullets.filter((_, i) => !bulletsToRemove.includes(i));
      });

      // Check if aliens reached bottom
      setAliens(prev => {
        const reachedBottom = prev.some(a => a.alive && a.y + ALIEN_HEIGHT >= GAME_HEIGHT - PLAYER_HEIGHT - 40);
        if (reachedBottom) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore(h => Math.max(h, score));
        }
        return prev;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, alienDirection, playerX, score, level, initAliens]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
      }

      keysPressed.current.add(e.key);

      if (e.key === ' ') {
        if (!isPlaying && !gameOver) {
          resetGame();
        } else if (gameOver) {
          resetGame();
        } else if (isPlaying) {
          shoot();
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
  }, [isPlaying, gameOver, resetGame, shoot]);

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
          Space Invaders
        </h1>
      </div>

      <div className="flex gap-8 mb-6 text-sm text-stone-500 dark:text-stone-400">
        <span>Score: {score}</span>
        <span>Level: {level}</span>
        <span>Best: {highScore}</span>
      </div>

      <div
        className="relative border border-stone-300 dark:border-stone-700 bg-stone-900 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Stars background */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-stone-400 opacity-60"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
            />
          ))}
        </div>

        {/* Aliens */}
        {aliens.filter(a => a.alive).map((alien, i) => (
          <div
            key={i}
            className="absolute bg-stone-300 dark:bg-stone-400"
            style={{
              left: alien.x,
              top: alien.y,
              width: ALIEN_WIDTH,
              height: ALIEN_HEIGHT,
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
            }}
          />
        ))}

        {/* Bullets */}
        {bullets.map((bullet, i) => (
          <div
            key={i}
            className={`absolute ${bullet.direction === 'up' ? 'bg-stone-200' : 'bg-red-500'}`}
            style={{
              left: bullet.x,
              top: bullet.y,
              width: BULLET_WIDTH,
              height: BULLET_HEIGHT,
            }}
          />
        ))}

        {/* Player */}
        <div
          className="absolute bg-stone-200 dark:bg-stone-300"
          style={{
            left: playerX,
            bottom: 20,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Game Over / Start Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center">
            {gameOver ? (
              <>
                <p className="text-xl text-stone-300 mb-2">Game Over</p>
                <p className="text-stone-400 mb-4">Score: {score}</p>
              </>
            ) : (
              <p className="text-xl text-stone-300 mb-4">Space Invaders</p>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-2 text-sm tracking-wider uppercase text-stone-400 border border-stone-600 hover:bg-stone-800 transition-colors"
            >
              {gameOver ? 'Play Again' : 'Start'}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-stone-400 dark:text-stone-500">
        Arrow keys or A/D to move, Space to shoot
      </p>
    </div>
  );
}
