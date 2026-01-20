'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const COLORS = ['red','green','blue','yellow'];

export default function SimonGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [player, setPlayer] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    const first = Math.floor(Math.random()*COLORS.length);
    const seq = [first];
    setSequence(seq);
    setPlayer([]);
    setStep(0);
    setPlaying(true);
    play(seq);
  };

  const play = (seq: number[]) => {
    let i = 0;
    const loop = () => {
      if (i >= seq.length) { setFlash(null); return; }
      setFlash(seq[i]);
      timerRef.current = setTimeout(() => { setFlash(null); i++; setTimeout(loop, 250); }, 400);
    };
    loop();
  };

  const click = (idx: number) => {
    if (!playing) return;
    const next = [...player, idx];
    setPlayer(next);
    const ok = sequence[next.length - 1] === idx;
    if (!ok) {
      setPlaying(false);
      return;
    }
    if (next.length === sequence.length) {
      // success
      const nextColor2 = Math.floor(Math.random()*COLORS.length);
      const nextSeq = [...sequence, nextColor2];
      setSequence(nextSeq);
      setPlayer([]);
      setStep(s => s+1);
      // small delay before next sequence
      setTimeout(() => play(nextSeq), 500);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-4 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Simon</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(2, 120px)`, gap:12 }}>
        {COLORS.map((c, i) => (
          <button key={i} onClick={() => click(i)} style={{ width:120, height:120, background: c, opacity: flash===i ? 1 : 0.7, border:'none' }} />
        ))}
      </div>
      <button onClick={start} className="mt-6 px-4 py-2 border rounded">Start</button>
    </div>
  );
}
