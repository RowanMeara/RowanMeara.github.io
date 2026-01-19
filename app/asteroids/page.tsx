'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = 520, H = 520; canvas.width = W; canvas.height = H;

    // simple ship
    const ship = { x: W/2, y: H/2, r: 12 };
    const bullets: { x: number; y: number; vx: number; vy: number }[] = [];
    const asteroids: { x: number; y: number; vx: number; vy: number; r: number; alive: boolean }[] = Array.from({ length: 6 }).map(() => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() > 0.5 ? 1 : -1) * 0.6, vy: (Math.random() > 0.5 ? 1 : -1) * 0.6, r: 20, alive: true }));

    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last; last = t;
      ctx.clearRect(0,0,W,H);
      // move a minimal amount with a tiny orbit
      ship.x += Math.sin(t/500) * 0.2; ship.y += Math.cos(t/500) * 0.2;
      bullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
      asteroids.forEach(a => { a.x += a.vx; a.y += a.vy; });
      // wrap edges
      asteroids.forEach(a => { if (a.x < -a.r) a.x = W + a.r; if (a.x > W + a.r) a.x = -a.r; if (a.y < -a.r) a.y = H + a.r; if (a.y > H + a.r) a.y = -a.r; });
      // render ship
      ctx.fillStyle = '#0f0'; ctx.beginPath(); ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI*2); ctx.fill();
      // render bullets
      ctx.fillStyle = '#ff0'; bullets.forEach(b => { ctx.fillRect(b.x, b.y, 2, 4); });
      // render asteroids
      ctx.fillStyle = '#888'; asteroids.forEach(a => { ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI*2); ctx.fill(); });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Asteroids</h1>
      </div>
      <canvas ref={canvasRef} width={520} height={520} style={{ border:'1px solid #333' }} />
      <p className="text-xs text-stone-500 mt-2">Prototype ship/asteroid scene</p>
    </div>
  );
}
