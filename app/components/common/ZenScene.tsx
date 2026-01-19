'use client';

import { useEffect, useState } from 'react';

export default function ZenScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = windowHeight * 1.5;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Door animation: opens from 0% to 100% over first half of scroll
  const doorOpenAmount = Math.min(scrollProgress * 2, 1);

  // Content fades
  const initialContentFade = Math.max(0, 1 - scrollProgress * 3);
  const gardenContentFade = Math.max(0, (scrollProgress - 0.5) * 2);

  return (
    <div className="relative w-full h-[200vh]">
      <div className="fixed inset-0 overflow-hidden">

        {/* ===== ZEN GARDEN (behind doors) ===== */}
        <div className="absolute inset-0">
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-200 via-stone-100 to-stone-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-800" />

          {/* Distant mountains */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="[stop-color:var(--mountain-top)]" style={{ '--mountain-top': '#a8a29e' } as React.CSSProperties} />
                <stop offset="100%" className="[stop-color:var(--mountain-bottom)]" style={{ '--mountain-bottom': '#d6d3d1' } as React.CSSProperties} />
              </linearGradient>
              <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="[stop-color:var(--mountain-top)]" style={{ '--mountain-top': '#78716c' } as React.CSSProperties} />
                <stop offset="100%" className="[stop-color:var(--mountain-bottom)]" style={{ '--mountain-bottom': '#a8a29e' } as React.CSSProperties} />
              </linearGradient>
            </defs>
            {/* Back mountain */}
            <path d="M-100 600 Q200 300 400 450 Q600 350 800 400 Q1000 300 1200 380 Q1400 320 1600 400 L1600 600 Z" fill="url(#mountain1)" opacity="0.5" />
            {/* Front mountain */}
            <path d="M-100 600 Q100 400 300 500 Q500 380 700 480 Q900 400 1100 460 Q1300 380 1500 450 L1600 600 Z" fill="url(#mountain2)" opacity="0.4" />
          </svg>

          {/* Garden ground - raked sand */}
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-stone-200 via-stone-100 to-transparent dark:from-stone-700 dark:via-stone-800 dark:to-transparent">
            {/* Raked pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              {Array.from({ length: 25 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={20 + i * 12}
                  x2="100%"
                  y2={20 + i * 12}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-stone-400 dark:text-stone-500"
                />
              ))}
            </svg>

            {/* Concentric circles around stones */}
            <svg className="absolute bottom-20 right-[20%] w-64 h-32 opacity-20">
              {[0, 1, 2, 3, 4].map((i) => (
                <ellipse
                  key={i}
                  cx="50%"
                  cy="80%"
                  rx={30 + i * 25}
                  ry={10 + i * 8}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-stone-500 dark:text-stone-400"
                />
              ))}
            </svg>
          </div>

          {/* Meditation stones */}
          <div className="absolute bottom-[18%] right-[22%] w-16 h-10 rounded-[50%] bg-stone-500 dark:bg-stone-600 shadow-lg" />
          <div className="absolute bottom-[16%] right-[18%] w-10 h-7 rounded-[50%] bg-stone-600 dark:bg-stone-500 shadow-md" />
          <div className="absolute bottom-[19%] right-[15%] w-6 h-5 rounded-[50%] bg-stone-400 dark:bg-stone-600 shadow-sm" />

          {/* Maple tree silhouette */}
          <div className="absolute bottom-[15%] left-[10%]">
            <svg width="200" height="280" viewBox="0 0 200 280" className="text-stone-600 dark:text-stone-500">
              {/* Trunk */}
              <path
                d="M100 280 Q95 240 98 200 Q90 160 100 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Branches */}
              <path
                d="M100 180 Q70 160 40 170 M100 150 Q60 130 30 120 M100 120 Q80 90 50 70 M100 120 Q120 80 150 60 M100 150 Q140 130 170 120 M100 180 Q130 160 160 170"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Foliage clusters */}
              <circle cx="40" cy="165" r="25" fill="currentColor" opacity="0.6" />
              <circle cx="30" cy="115" r="30" fill="currentColor" opacity="0.5" />
              <circle cx="50" cy="65" r="28" fill="currentColor" opacity="0.55" />
              <circle cx="100" cy="50" r="35" fill="currentColor" opacity="0.5" />
              <circle cx="150" cy="55" r="30" fill="currentColor" opacity="0.55" />
              <circle cx="170" cy="115" r="28" fill="currentColor" opacity="0.5" />
              <circle cx="160" cy="165" r="25" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          {/* Stone lantern */}
          <div className="absolute bottom-[15%] right-[40%]">
            <svg width="40" height="80" viewBox="0 0 40 80" className="text-stone-500 dark:text-stone-400">
              {/* Base */}
              <rect x="10" y="70" width="20" height="10" fill="currentColor" />
              {/* Pillar */}
              <rect x="15" y="35" width="10" height="35" fill="currentColor" />
              {/* Light chamber */}
              <rect x="5" y="20" width="30" height="15" fill="currentColor" />
              {/* Roof */}
              <polygon points="20,5 0,20 40,20" fill="currentColor" />
            </svg>
          </div>

          {/* Bamboo in corner */}
          <div className="absolute bottom-0 right-0 opacity-40">
            <svg width="120" height="400" viewBox="0 0 120 400" className="text-stone-500 dark:text-stone-400">
              {[0, 30, 55].map((x, i) => (
                <g key={i}>
                  <line x1={x + 20} y1="400" x2={x + 15} y2="50" stroke="currentColor" strokeWidth="6" />
                  {[100, 180, 260, 340].map((y, j) => (
                    <line key={j} x1={x + 10} y1={y} x2={x + 25} y2={y} stroke="currentColor" strokeWidth="2" />
                  ))}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* ===== SHOJI DOORS ===== */}
        {/* Left Door */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1/2 z-20"
          style={{
            transform: `translateX(${-doorOpenAmount * 100}%)`,
            transition: mounted ? 'transform 0.1s ease-out' : 'none',
          }}
        >
          {/* Door frame */}
          <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 border-r-4 border-stone-700 dark:border-stone-600">
            {/* Wooden frame grid */}
            <div className="absolute inset-4 border-4 border-stone-700 dark:border-stone-500">
              {/* Horizontal bars */}
              <div className="absolute inset-0 flex flex-col justify-evenly">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-1 bg-stone-700 dark:bg-stone-500" />
                ))}
              </div>
              {/* Vertical bars */}
              <div className="absolute inset-0 flex flex-row justify-evenly">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 bg-stone-700 dark:bg-stone-500" />
                ))}
              </div>
              {/* Paper panels - subtle texture */}
              <div className="absolute inset-0 bg-stone-50/90 dark:bg-stone-800/90" />
            </div>
            {/* Handle */}
            <div className="absolute right-8 top-2/3 w-2 h-16 bg-stone-800 dark:bg-stone-400 rounded-full" />
          </div>
        </div>

        {/* Right Door */}
        <div
          className="absolute top-0 bottom-0 right-0 w-1/2 z-20"
          style={{
            transform: `translateX(${doorOpenAmount * 100}%)`,
            transition: mounted ? 'transform 0.1s ease-out' : 'none',
          }}
        >
          {/* Door frame */}
          <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 border-l-4 border-stone-700 dark:border-stone-600">
            {/* Wooden frame grid */}
            <div className="absolute inset-4 border-4 border-stone-700 dark:border-stone-500">
              {/* Horizontal bars */}
              <div className="absolute inset-0 flex flex-col justify-evenly">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-1 bg-stone-700 dark:bg-stone-500" />
                ))}
              </div>
              {/* Vertical bars */}
              <div className="absolute inset-0 flex flex-row justify-evenly">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 bg-stone-700 dark:bg-stone-500" />
                ))}
              </div>
              {/* Paper panels */}
              <div className="absolute inset-0 bg-stone-50/90 dark:bg-stone-800/90" />
            </div>
            {/* Handle */}
            <div className="absolute left-8 top-2/3 w-2 h-16 bg-stone-800 dark:bg-stone-400 rounded-full" />
          </div>
        </div>

        {/* ===== CONTENT OVERLAYS ===== */}
        {/* Initial content (on doors) */}
        <div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          style={{ opacity: initialContentFade }}
        >
          <div className="text-center px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-stone-800 dark:text-stone-200 mb-6 tracking-wide">
              Rowan Meara
            </h1>
            <div className="w-16 h-px bg-stone-400 dark:bg-stone-500 mx-auto mb-6" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-light text-stone-600 dark:text-stone-400 tracking-widest uppercase">
              Software Engineer
            </h2>
            <p className="mt-16 text-sm text-stone-500 dark:text-stone-500 tracking-wider animate-pulse">
              scroll to enter
            </p>
          </div>
        </div>

        {/* Garden content (revealed) */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ opacity: gardenContentFade }}
        >
          <div className="text-center px-8 max-w-2xl">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-stone-700 dark:text-stone-300 leading-relaxed mb-10">
              Building robust, scalable distributed systems at Niantic on Pokémon GO.
            </p>
            <a
              href="https://www.linkedin.com/in/rowanmeara/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 text-sm tracking-widest uppercase text-stone-600 dark:text-stone-400 border border-stone-400 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all duration-300"
            >
              Connect
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
