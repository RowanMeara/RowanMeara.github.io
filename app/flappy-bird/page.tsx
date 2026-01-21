'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const WORLD_W = 400, WORLD_H = 600;
  const BIRD_RADIUS = 12;
  const PIPE_GAP = 120;

  // Use refs to persist game state across renders
  const gameStateRef = useRef({
    birdY: WORLD_H / 2,
    birdV: 0,
    pipes: [] as { x: number; gapY: number; gapH: number }[],
    lastPipe: 0,
  });

  const reset = () => {
    gameStateRef.current = {
      birdY: WORLD_H / 2,
      birdV: 0,
      pipes: [],
      lastPipe: 0,
    };
    setScore(0);
    setPlaying(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.4;
    let animationId: number;

    const loop = () => {
      const state = gameStateRef.current;

      // Draw background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);

      if (playing) {
        // Spawn pipes
        const now = Date.now();
        if (now - state.lastPipe > 1500) {
          state.lastPipe = now;
          const gapY = 120 + Math.random() * 260;
          state.pipes.push({ x: WORLD_W + 20, gapY, gapH: PIPE_GAP });
        }

        // Update physics
        state.birdV += gravity;
        state.birdY += state.birdV;

        // Move pipes
        for (const p of state.pipes) {
          p.x -= 3;
        }

        // Collision with ground
        if (state.birdY > WORLD_H - BIRD_RADIUS) {
          setPlaying(false);
          setBest(b => Math.max(b, Math.floor(score)));
        }

        // Collision with ceiling
        if (state.birdY < BIRD_RADIUS) {
          state.birdY = BIRD_RADIUS;
          state.birdV = 0;
        }

        // Collision with pipes
        const birdX = WORLD_W / 2;
        for (const p of state.pipes) {
          // Check if bird is in horizontal range of pipe
          if (birdX + BIRD_RADIUS > p.x && birdX - BIRD_RADIUS < p.x + 60) {
            // Check if bird is outside the gap
            if (state.birdY - BIRD_RADIUS < p.gapY - p.gapH/2 ||
                state.birdY + BIRD_RADIUS > p.gapY + p.gapH/2) {
              setPlaying(false);
              setBest(b => Math.max(b, Math.floor(score)));
            }
          }
        }

        // Remove offscreen pipes
        while (state.pipes.length && state.pipes[0].x < -60) {
          state.pipes.shift();
        }

        // Increment score
        setScore(s => Math.min(999, s + 0.01));
      }

      // Draw pipes
      ctx.fillStyle = 'green';
      for (const p of state.pipes) {
        // Upper pipe
        ctx.fillRect(p.x, 0, 60, p.gapY - p.gapH/2);
        // Lower pipe
        ctx.fillRect(p.x, p.gapY + p.gapH/2, 60, WORLD_H - (p.gapY + p.gapH/2));
      }

      // Draw bird
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(WORLD_W/2, state.birdY, BIRD_RADIUS, 0, Math.PI*2);
      ctx.fill();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    const flap = () => {
      if (playing) {
        gameStateRef.current.birdV = -6;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(animationId);
    };
  }, [playing]); // Only depend on playing, not score

  useEffect(() => {
    if (score > best) setBest(Math.floor(score));
  }, [score, best]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Flappy Bird</h1>
      </div>
      <canvas ref={canvasRef} width={400} height={600} style={{ border:'1px solid #333' }} onClick={() => setPlaying(p => !p)} />
      <div className="mt-4">Score: {Math.floor(score)}  Best: {best}</div>
      <p className="mt-2 text-xs text-stone-500">Click canvas to start/pause. Space to flap.</p>
    </div>
  );
}
