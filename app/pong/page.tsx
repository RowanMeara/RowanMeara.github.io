'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const W = 640, H = 320;
    canvas.width = W; canvas.height = H;

    const leftPad = { x: 20, y: H/2 - 40, w: 10, h: 80 };
    const rightPad = { x: W - 30, y: H/2 - 40, w: 10, h: 80 };

    let ball = { x: W/2, y: H/2, vx: 3, vy: 2, r: 6 };

    const keys = new Set<string>();

    const loop = () => {
      if (!playing) { requestAnimationFrame(loop); return; }
      ctx.clearRect(0,0,W,H);
      // move paddles
      if (keys.has('w') || keys.has('W')) leftPad.y = Math.max(0, leftPad.y - 5);
      if (keys.has('s') || keys.has('S')) leftPad.y = Math.min(H - leftPad.h, leftPad.y + 5);
      if (keys.has('ArrowUp')) rightPad.y = Math.max(0, rightPad.y - 5);
      if (keys.has('ArrowDown')) rightPad.y = Math.min(H - rightPad.h, rightPad.y + 5);
      // move ball
      ball.x += ball.vx; ball.y += ball.vy;
      // collide walls
      if (ball.y - ball.r < 0 || ball.y + ball.r > H) ball.vy = -ball.vy;
      if (ball.x - ball.r < 0) { setScoreRight(s => s+1); ball.x = W/2; ball.y = H/2; ball.vx = 3; ball.vy = 2; }
      if (ball.x + ball.r > W) { setScoreLeft(s => s+1); ball.x = W/2; ball.y = H/2; ball.vx = -3; ball.vy = -2; }
      // paddles collide
      const hitLeft = ball.x - ball.r < leftPad.x + leftPad.w && ball.y > leftPad.y && ball.y < leftPad.y + leftPad.h;
      const hitRight = ball.x + ball.r > rightPad.x && ball.y > rightPad.y && ball.y < rightPad.y + rightPad.h;
      if (hitLeft || hitRight) ball.vx = -ball.vx;

      // draw
      ctx.fillStyle = '#111'; ctx.fillRect(leftPad.x, leftPad.y, leftPad.w, leftPad.h);
      ctx.fillStyle = '#111'; ctx.fillRect(rightPad.x, rightPad.y, rightPad.w, rightPad.h);
      ctx.fillStyle = '#f00'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
      requestAnimationFrame(loop);
    };

    loop();

    const keyDown = (e: KeyboardEvent) => {
      if (e.key === ' '){ setPlaying(p => !p); e.preventDefault(); }
      if (e.key.toLowerCase() === 'w') keys.add('w');
      if (e.key.toLowerCase() === 's') keys.add('s');
      if (e.key === 'ArrowUp') keys.add('ArrowUp');
      if (e.key === 'ArrowDown') keys.add('ArrowDown');
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keys.delete('w');
      if (e.key.toLowerCase() === 's') keys.delete('s');
      if (e.key === 'ArrowUp') keys.delete('ArrowUp');
      if (e.key === 'ArrowDown') keys.delete('ArrowDown');
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return () => { window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); };
  }, [playing]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Pong</h1>
      </div>
      <canvas ref={canvasRef} width={640} height={320} onClick={() => setPlaying(p => !p)} style={{ border:'1px solid #333' }} />
      <div className="mt-4">Score L: {scoreLeft} - R: {scoreRight}</div>
      <p className="text-xs text-stone-500 mt-2">W/S and Up/Down to move paddles. Space to toggle play.</p>
    </div>
  );
}
