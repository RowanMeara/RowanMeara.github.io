'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

// Simple Wordle-like game: 5-letter words, 6 attempts
const WORDS = [
  'apple','crane','slate','grape','plane','stone','pride','grind','shine','smart','flame','grain','prism','trace','spark','blaze','glide','reach','queen','quick'
].filter(w => w.length === 5);

type Feedback = 'correct' | 'present' | 'absent';

type Attempt = {
  word: string;
  feedback: Feedback[];
};

const WORD_LEN = 5;
const MAX_ATTEMPTS = 6;

function feedbackFor(guess: string, target: string): Feedback[] {
  const fb: Feedback[] = Array(WORD_LEN).fill('absent');
  const used = Array.from({length: WORD_LEN}).map(() => false);
  // First pass: correct positions
  for (let i=0; i<WORD_LEN; i++) {
    if (guess[i] === target[i]) {
      fb[i] = 'correct';
      used[i] = true;
    }
  }
  // Second pass: present elsewhere
  for (let i=0; i<WORD_LEN; i++) {
    if (fb[i] === 'correct') continue;
    for (let j=0; j<WORD_LEN; j++) {
      if (!used[j] && guess[i] === target[j]) {
        fb[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }
  return fb;
}

export default function WordleGame() {
  const [target, setTarget] = useState<string>(WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase());
  const [guesses, setGuesses] = useState<Attempt[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [status, setStatus] = useState<'playing'|'won'|'lost'>('playing');

  const reset = useCallback(() => {
    const t = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
    setTarget(t);
    setGuesses([]);
    setCurrent('');
    setStatus('playing');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      const key = e.key;
      if (/^[a-zA-Z]$/.test(key)) {
        if (current.length < WORD_LEN) {
          setCurrent(c => (c + key.toLowerCase()).slice(0, WORD_LEN));
        }
        e.preventDefault();
      } else if (key === 'Backspace') {
        setCurrent(c => c.slice(0, -1));
        e.preventDefault();
      } else if (key === 'Enter') {
        if (current.length === WORD_LEN) {
          const fb = feedbackFor(current, target);
          const attempt: Attempt = { word: current, feedback: fb };
          setGuesses(gs => [...gs, attempt]);
          setCurrent('');
          if (current === target) {
            setStatus('won');
          } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
            setStatus('lost');
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, status, guesses.length, target]);

  // keyboard focus guidance
  useEffect(() => {
    // initialize on mount
  }, []);

  const grid = useMemo(() => {
    const rows = Array.from({ length: MAX_ATTEMPTS }, (_, r) => {
      const g = guesses[r];
      if (g) return g.word.padEnd(WORD_LEN, ' ').split('').slice(0, WORD_LEN).map((ch, i) => ({ ch, fb: g.feedback[i] }));
      // empty row
      return Array.from({ length: WORD_LEN }, () => ({ ch: '', fb: 'absent' as Feedback }));
    });
    // add current row as letters with no feedback yet
    if (guesses.length < MAX_ATTEMPTS) {
      const cur = current.padEnd(WORD_LEN, ' ').split('').slice(0, WORD_LEN).map((ch) => ({ ch, fb: 'absent' as Feedback }));
      rows[guesses.length] = cur;
    }
    return rows;
  }, [guesses, current]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/projects" className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-2 inline-block">&larr; back</Link>
        <h1 className="text-3xl font-light text-stone-800 dark:text-stone-200 tracking-wide">Wordle Clone</h1>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${WORD_LEN}, 60px)`, gap:8 }}>
        {grid.map((row, r) => row.map((cell, c) => {
          const key = `${r}-${c}`;
          const ch = cell.ch;
          const fb = guesses[r]?.feedback[c] ?? 'absent';
          const colors: Record<Feedback, string> = {
            correct: '#4caf50',
            present: '#ffd54f',
            absent: '#e0e0e0'
          };
          return (
            <div key={key} style={{ width:60, height:60, border:'2px solid #bbb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background: ch.trim() ? colors[fb] : '#fff', fontWeight:700 }}>
              {ch.toUpperCase()}
            </div>
          );
        }))}
      </div>
      <div className="mt-4 text-xs text-stone-500">Type letters on your keyboard. Enter to submit. Backspace to delete.</div>
      {(status === 'won' || status === 'lost') && (
        <div className="mt-6 p-4 border rounded bg-stone-100">
          {status === 'won' ? (
            <div>You win! The word was {target.toUpperCase()}.</div>
          ) : (
            <div>Out of attempts. The word was {target.toUpperCase()}.</div>
          )}
          <button className="mt-4 px-4 py-2 border rounded" onClick={reset}>Play Again</button>
        </div>
      )}
    </div>
  );
}
