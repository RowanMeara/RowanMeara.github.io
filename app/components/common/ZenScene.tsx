'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const RAIL_ROWS = 7;
// Lattice fills the top of the door; a solid wood hip panel (koshi) takes the rest.
const KOSHI_TOP = 87;

function ShojiDoor({ side, open }: { side: 'left' | 'right'; open: number }) {
  const isLeft = side === 'left';

  return (
    <div
      aria-hidden
      className={`absolute inset-y-0 z-20 w-1/2 will-change-transform ${isLeft ? 'left-0' : 'right-0'}`}
      style={{ transform: `translate3d(${(isLeft ? -open : open) * 104}%, 0, 0)` }}
    >
      <div className={`shoji-door shoji-door--${side}`}>
        <div className="shoji-door__paper" />
        {Array.from({ length: RAIL_ROWS }, (_, i) => (
          <div
            key={`h-${i}`}
            className="shoji-door__rail shoji-door__rail--h"
            style={{ top: `${((i + 1) * KOSHI_TOP) / (RAIL_ROWS + 1)}%` }}
          />
        ))}
        {[25, 50, 75].map((left) => (
          <div
            key={`v-${left}`}
            className="shoji-door__rail shoji-door__rail--v"
            style={{ left: `${left}%` }}
          />
        ))}
        <div className="shoji-door__koshi" />
        <div className="shoji-door__hikite" />
      </div>
    </div>
  );
}

function Garden({ progress }: { progress: number }) {
  return (
    <div
      className="absolute inset-0 z-0 will-change-transform"
      style={{ transform: `scale(${1.05 - progress * 0.05})` }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="zen-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4efe2" />
            <stop offset="100%" stopColor="#e9dfc9" />
          </linearGradient>
          <radialGradient id="zen-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eed9a4" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#eed9a4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#eed9a4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="zen-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ddd2b8" />
            <stop offset="100%" stopColor="#c8b998" />
          </linearGradient>
          <linearGradient id="zen-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7f3e7" stopOpacity="0" />
            <stop offset="50%" stopColor="#f7f3e7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f7f3e7" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#zen-sky)" />

        <circle cx="720" cy="318" r="170" fill="url(#zen-sun)" />
        <circle cx="720" cy="318" r="56" fill="#ecd8a6" />

        <path
          d="M0 565 Q190 478 380 528 Q560 470 760 516 Q950 472 1130 522 Q1290 484 1440 512 L1440 900 L0 900 Z"
          fill="#c4c8b3"
          opacity="0.55"
        />
        <rect x="0" y="470" width="1440" height="170" fill="url(#zen-mist)" opacity="0.8" />
        <path
          d="M0 648 Q210 572 440 620 Q650 568 870 612 Q1080 570 1270 618 Q1370 596 1440 608 L1440 900 L0 900 Z"
          fill="#9ca687"
          opacity="0.62"
        />

        <rect x="0" y="664" width="1440" height="236" fill="url(#zen-ground)" />
        <g fill="none" stroke="#a08c69" strokeOpacity="0.3" strokeWidth="1.5">
          <ellipse cx="720" cy="800" rx="430" ry="58" />
          <ellipse cx="720" cy="800" rx="330" ry="42" />
          <ellipse cx="720" cy="800" rx="230" ry="27" />
        </g>

        <g fill="#6b6353">
          <rect x="1028" y="668" width="62" height="10" rx="3" />
          <rect x="1052" y="614" width="14" height="56" />
          <rect x="1038" y="604" width="42" height="12" rx="3" />
          <rect x="1044" y="572" width="30" height="32" rx="2" />
          <path d="M1026 572 Q1059 544 1092 572 Z" />
          <circle cx="1059" cy="551" r="6" />
        </g>
        <rect x="1051" y="579" width="16" height="17" rx="1" fill="#ecd8a6" opacity="0.85" />

        <g>
          <path
            d="M-30 40 C140 70 260 110 420 180"
            fill="none"
            stroke="#4a4433"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M300 128 Q336 138 364 152 M380 160 Q412 168 438 180 M180 78 Q216 72 248 78"
            fill="none"
            stroke="#4a4433"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g fill="#54593f">
            <ellipse cx="210" cy="58" rx="54" ry="15" />
            <ellipse cx="322" cy="104" rx="60" ry="16" />
            <ellipse cx="434" cy="158" rx="62" ry="17" />
            <ellipse cx="510" cy="200" rx="42" ry="13" />
          </g>
        </g>

        <g
          fill="none"
          stroke="#6e6753"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.45"
        >
          <path d="M898 232 q9 -9 18 0 M932 246 q8 -8 16 0" />
        </g>
      </svg>
    </div>
  );
}

export default function ZenScene() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      setProgress(range > 0 ? clamp(-rect.top / range, 0, 1) : 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const open = 0.005 + smoothstep(clamp(progress / 0.82, 0, 1)) * 0.995;
  const heroFade = clamp(1 - progress * 4, 0, 1);
  const revealFade = smoothstep(clamp((progress - 0.48) / 0.24, 0, 1));

  return (
    <div ref={trackRef} className="relative h-[175vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#ece3cf]">
        <Garden progress={progress} />

        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{ opacity: revealFade }}
        >
          <div className="translate-y-[5vh] text-center">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[#7c7158]">
              Currently
            </p>
            <p className="font-editorial mx-auto mt-4 max-w-xl text-2xl leading-snug text-[#3a3428] sm:text-3xl">
              Engineering on Pokémon GO at Niantic.
            </p>
          </div>
        </div>

        <ShojiDoor side="left" open={open} />
        <ShojiDoor side="right" open={open} />

        <div className="shoji-beam absolute inset-x-0 top-0 z-[25]" />
        <div className="shoji-sill absolute inset-x-0 bottom-0 z-[25]" />

        <div
          className="absolute inset-0 z-30 flex items-center justify-center px-6"
          style={{
            opacity: heroFade,
            transform: `translateY(${progress * -80}px)`,
            pointerEvents: heroFade > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="relative text-center">
            <div
              aria-hidden
              className="hero-scrim absolute -inset-x-20 -inset-y-14 sm:-inset-x-36 sm:-inset-y-20"
            />
            <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.5em] text-[#8a7a63] sm:text-xs">
              Software Engineer · Seattle
            </p>
            <h1 className="font-editorial mt-6 text-5xl tracking-[0.02em] text-[#2b251d] sm:text-7xl lg:text-8xl">
              Rowan Meara
            </h1>
            <div className="mx-auto mt-8 h-[3px] w-10 bg-[#ae4f2c]" />
            <p className="mx-auto mt-8 max-w-md text-[15px] leading-7 text-[#5d5345] sm:text-base sm:leading-8">
              Building reliable systems and considered product experiences.
            </p>
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.3em] sm:text-xs">
              <Link
                href="/projects"
                className="border-b border-[#c9ba9c] pb-1 text-[#4f463a] transition hover:border-[#ae4f2c] hover:text-[#2b251d]"
              >
                Selected Work
              </Link>
              <a
                href="https://github.com/RowanMeara"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-transparent pb-1 text-[#4f463a] transition hover:border-[#ae4f2c] hover:text-[#2b251d]"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rowanmeara/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-transparent pb-1 text-[#4f463a] transition hover:border-[#ae4f2c] hover:text-[#2b251d]"
              >
                LinkedIn
              </a>
            </nav>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-7 z-30 flex flex-col items-center gap-3"
          style={{ opacity: heroFade }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#cdbfa4]">
            Scroll
          </p>
          <div className="scroll-hint-line" />
        </div>
      </div>
    </div>
  );
}
