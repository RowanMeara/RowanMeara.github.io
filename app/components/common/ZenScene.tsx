'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function ZenScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = windowHeight * 1.4;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doorOpenAmount = clamp(scrollProgress * 1.8, 0, 1);
  const initialContentFade = clamp(1 - scrollProgress * 2.8, 0, 1);
  const gardenContentFade = clamp((scrollProgress - 0.25) * 1.7, 0, 1);
  const sceneLift = scrollProgress * 24;
  const mistOpacity = clamp(0.55 - scrollProgress * 0.25, 0.18, 0.55);

  return (
    <div className="relative h-[190vh] w-full">
      <div className="fixed inset-0 overflow-hidden bg-[#ede7da]">
        {/* Garden backdrop */}
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${-sceneLift * 0.18}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#d7e2d6] via-[#e8e5da] to-[#d8d2c3]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.62),transparent_45%),radial-gradient(circle_at_85%_28%,rgba(255,255,255,0.3),transparent_50%)]" />

          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMax slice"
            viewBox="0 0 1440 920"
          >
            <path
              d="M-160 620 Q120 440 340 510 Q560 430 790 510 Q970 460 1210 520 Q1330 460 1600 560 L1600 920 L-160 920 Z"
              fill="#b7c4b4"
              opacity="0.6"
            />
            <path
              d="M-160 700 Q90 560 330 620 Q520 540 730 620 Q980 540 1180 620 Q1320 560 1600 650 L1600 920 L-160 920 Z"
              fill="#9ca995"
              opacity="0.58"
            />
          </svg>

          <div className="absolute bottom-0 left-0 right-0 h-[46%] bg-gradient-to-b from-[#d7cfbf] via-[#d4cab9] to-[#c4b99f]">
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(139,123,99,0.1) 0px, rgba(139,123,99,0.1) 2px, transparent 2px, transparent 16px)',
              }}
            />
            <div className="absolute -top-4 right-[13%] h-36 w-72 rounded-[50%] border border-[#8f826a]/45" />
            <div className="absolute top-5 right-[10%] h-36 w-72 rounded-[50%] border border-[#8f826a]/35" />
          </div>

          <div className="absolute bottom-[18%] right-[18%] h-28 w-52 rounded-[60%] bg-gradient-to-br from-[#8ea0a6]/70 to-[#61737a]/70 blur-[1px]" />
          <div className="absolute bottom-[17%] right-[17.4%] h-4 w-4 rounded-full bg-[#6f726a]" />
          <div className="absolute bottom-[18.3%] right-[14%] h-7 w-10 rounded-[50%] bg-[#6f726a]" />
          <div className="absolute bottom-[16.5%] right-[12.2%] h-9 w-14 rounded-[50%] bg-[#5d6058]" />

          <div className="absolute bottom-[14%] left-[6%] h-80 w-64 text-[#6a6658]/85">
            <svg className="h-full w-full" viewBox="0 0 260 320">
              <path
                d="M132 320 Q118 250 130 188 Q120 142 130 104"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M130 178 Q98 162 76 136 M130 156 Q82 136 52 98 M130 130 Q102 90 84 54 M130 130 Q156 88 178 54 M130 156 Q176 136 208 98 M130 182 Q166 162 198 138"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
              {([["76", "134", "28"], ["52", "94", "34"], ["96", "52", "40"], ["134", "44", "44"], ["186", "52", "38"], ["210", "95", "32"], ["196", "138", "30"]] as const).map(
                ([cx, cy, r]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.68" />
                ),
              )}
            </svg>
          </div>

          <div className="absolute bottom-[14%] left-[47%] h-28 w-16 text-[#716d5f]/85">
            <svg className="h-full w-full" viewBox="0 0 64 120">
              <rect x="20" y="52" width="24" height="60" fill="currentColor" />
              <rect x="12" y="30" width="40" height="24" fill="currentColor" />
              <polygon points="32,8 2,30 62,30" fill="currentColor" />
              <rect x="22" y="62" width="20" height="12" fill="#b89e6f" opacity="0.75" />
              <rect x="16" y="112" width="32" height="8" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Mist wash softens the scene while doors are still mostly closed */}
        <div
          className="absolute inset-0 z-[5] bg-gradient-to-b from-white/55 via-white/25 to-transparent"
          style={{ opacity: mistOpacity }}
        />

        {/* Shoji doors */}
        <div
          className="absolute inset-y-0 left-0 z-20 w-1/2"
          style={{
            transform: `translateX(${-doorOpenAmount * 102}%)`,
            transition: mounted ? 'transform 120ms linear' : 'none',
          }}
        >
          <div className="absolute inset-0 border-r-[3px] border-[#7c6348] bg-[#efe6d3] shadow-[inset_-18px_0_28px_rgba(0,0,0,0.15)]">
            <div className="absolute inset-4 border-4 border-[#806448]">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(140,119,88,0.08)_0px,rgba(140,119,88,0.08)_1px,transparent_1px,transparent_8px)] opacity-70" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`left-h-${i}`}
                  className="absolute left-0 right-0 h-[3px] bg-[#806448]"
                  style={{ top: `${(i + 1) * 16.6}%` }}
                />
              ))}
              {[25, 50, 75].map((position) => (
                <div
                  key={`left-v-${position}`}
                  className="absolute top-0 bottom-0 w-[3px] bg-[#806448]"
                  style={{ left: `${position}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-y-0 right-0 z-20 w-1/2"
          style={{
            transform: `translateX(${doorOpenAmount * 102}%)`,
            transition: mounted ? 'transform 120ms linear' : 'none',
          }}
        >
          <div className="absolute inset-0 border-l-[3px] border-[#7c6348] bg-[#efe6d3] shadow-[inset_18px_0_28px_rgba(0,0,0,0.15)]">
            <div className="absolute inset-4 border-4 border-[#806448]">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(60deg,rgba(140,119,88,0.08)_0px,rgba(140,119,88,0.08)_1px,transparent_1px,transparent_8px)] opacity-70" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`right-h-${i}`}
                  className="absolute left-0 right-0 h-[3px] bg-[#806448]"
                  style={{ top: `${(i + 1) * 16.6}%` }}
                />
              ))}
              {[25, 50, 75].map((position) => (
                <div
                  key={`right-v-${position}`}
                  className="absolute top-0 bottom-0 w-[3px] bg-[#806448]"
                  style={{ left: `${position}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Intro copy while doors are closed */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
          style={{
            opacity: initialContentFade,
            pointerEvents: initialContentFade > 0.08 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl font-light tracking-[0.2em] text-[#4f4233] sm:text-5xl md:text-6xl">
              Rowan Meara
            </h1>
            <div className="mx-auto mt-6 h-px w-20 bg-[#6e5a44]/55" />
            <p className="mt-6 text-sm uppercase tracking-[0.32em] text-[#6e5a44]/80 sm:text-base">
              Software Engineer
            </p>
            <p className="mt-14 text-xs uppercase tracking-[0.32em] text-[#7a6854]/70 sm:text-sm">
              scroll to enter
            </p>
          </div>
        </div>

        {/* Revealed content */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{
            opacity: gardenContentFade,
            pointerEvents: gardenContentFade > 0.2 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-3xl rounded-2xl bg-[#f4efe5]/78 p-8 text-center backdrop-blur-[1px] sm:p-10">
            <p className="text-lg leading-relaxed text-[#4e564a] sm:text-2xl">
              Building robust, scalable distributed systems at Niantic on Pokemon GO.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex min-w-44 items-center justify-center rounded-md bg-[#556852] px-7 py-3 text-xs uppercase tracking-[0.2em] text-[#f7f3ea] shadow-[0_10px_22px_rgba(43,61,40,0.2)] transition hover:-translate-y-0.5 hover:bg-[#465743]"
              >
                Projects
              </Link>
              <a
                href="https://www.linkedin.com/in/rowanmeara/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-44 items-center justify-center rounded-md border border-[#63735e] bg-[#edf0e8]/90 px-7 py-3 text-xs uppercase tracking-[0.2em] text-[#4d5849] transition hover:-translate-y-0.5 hover:bg-[#e2e8da]"
              >
                Connect
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
