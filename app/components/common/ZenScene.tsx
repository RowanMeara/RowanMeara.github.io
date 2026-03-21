'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const statPills = ['Distributed systems', 'Backend services', 'Web products'];

export default function ZenScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = windowHeight * 1.15;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doorOpenAmount = clamp(0.08 + scrollProgress * 1.25, 0.08, 1);
  const initialContentFade = clamp(1 - scrollProgress * 2.1, 0, 1);
  const revealedContentFadeIn = clamp((scrollProgress - 0.08) * 1.9, 0, 1);
  const revealedContentFadeOut = clamp(1 - (scrollProgress - 0.34) * 3.2, 0, 1);
  const revealedContentFade = revealedContentFadeIn * revealedContentFadeOut;
  const sceneLift = scrollProgress * 36;
  const mistOpacity = clamp(0.26 - scrollProgress * 0.14, 0.08, 0.26);

  return (
    <div className="relative h-[145vh] min-h-[980px] w-full">
      <div className="fixed inset-0 overflow-hidden bg-[#e8ddcb]">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${-sceneLift * 0.18}px)` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#dfe6dc_0%,#ebe6da_38%,#d8cfbe_72%,#cbbda5_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(255,248,234,0.48),transparent_24%),linear-gradient(180deg,transparent_0%,rgba(78,58,36,0.08)_100%)]" />

          <div className="absolute left-1/2 top-[10%] h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#f9f2df_0%,#efe2c1_52%,rgba(239,226,193,0)_74%)] opacity-80 blur-[1px] sm:h-40 sm:w-40" />

          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMax slice"
            viewBox="0 0 1440 920"
          >
            <path
              d="M-200 600 Q90 428 320 492 Q536 410 768 492 Q990 432 1216 500 Q1368 450 1640 558 L1640 920 L-200 920 Z"
              fill="#b6c0af"
              opacity="0.52"
            />
            <path
              d="M-200 684 Q76 552 308 614 Q528 536 722 606 Q960 540 1170 622 Q1330 566 1640 656 L1640 920 L-200 920 Z"
              fill="#93a08a"
              opacity="0.56"
            />
          </svg>

          <div className="absolute bottom-[21%] left-[10%] h-96 w-72 text-[#666151]/90 opacity-90 sm:left-[8%]">
            <svg className="h-full w-full" viewBox="0 0 260 320">
              <path
                d="M132 320 Q122 250 132 192 Q122 144 132 96"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M132 182 Q92 166 70 142 M132 160 Q88 138 54 106 M132 132 Q98 90 78 58 M132 132 Q162 86 186 54 M132 158 Q176 138 210 104 M132 184 Q170 166 198 142"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
              {([
                ['70', '140', '29'],
                ['52', '104', '34'],
                ['90', '54', '40'],
                ['136', '44', '44'],
                ['188', '52', '38'],
                ['212', '104', '33'],
                ['196', '142', '30'],
              ] as const).map(([cx, cy, r]) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="currentColor"
                  opacity="0.68"
                />
              ))}
            </svg>
          </div>

          <div className="absolute bottom-[26%] right-[14%] h-32 w-20 text-[#706858]/90 sm:right-[18%] sm:h-36 sm:w-24">
            <svg className="h-full w-full" viewBox="0 0 80 140">
              <rect x="24" y="56" width="32" height="72" fill="currentColor" />
              <rect x="14" y="28" width="52" height="28" fill="currentColor" />
              <polygon points="40,4 2,30 78,30" fill="currentColor" />
              <rect x="28" y="68" width="24" height="16" fill="#c7ab7c" opacity="0.82" />
              <rect x="18" y="128" width="44" height="10" fill="currentColor" />
            </svg>
          </div>

          <div className="absolute bottom-[16%] right-[18%] h-32 w-64 rounded-[50%] bg-[radial-gradient(circle_at_45%_35%,rgba(138,156,165,0.8),rgba(87,101,108,0.88)_62%,rgba(87,101,108,0)_76%)] blur-[0.5px]" />
          <div className="absolute bottom-[16.4%] right-[13.5%] h-9 w-14 rounded-[50%] bg-[#5b6058]" />
          <div className="absolute bottom-[15.8%] right-[12%] h-12 w-18 rounded-[50%] bg-[#4c5149]" />

          <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-[linear-gradient(180deg,#d9cfbc_0%,#c9baa0_100%)]">
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(117,101,76,0.12) 0px, rgba(117,101,76,0.12) 2px, transparent 2px, transparent 18px)',
              }}
            />
            <div className="absolute inset-x-[10%] top-0 h-px bg-[#8e7a5a]/40" />
            <div className="absolute left-1/2 top-[16%] h-28 w-[28rem] -translate-x-1/2 rounded-[50%] border border-[#857354]/35" />
            <div className="absolute left-1/2 top-[22%] h-28 w-[28rem] -translate-x-1/2 rounded-[50%] border border-[#857354]/28" />
          </div>
        </div>

        <div
          className="absolute inset-0 z-[5] bg-[linear-gradient(180deg,rgba(255,250,242,0.4),rgba(255,250,242,0.1)_44%,transparent_78%)]"
          style={{ opacity: mistOpacity }}
        />

        <div
          className="absolute inset-y-0 left-0 z-20 w-1/2"
          style={{
            transform: `translateX(${-doorOpenAmount * 100}%)`,
            transition: mounted ? 'transform 120ms linear' : 'none',
          }}
        >
          <div className="absolute inset-0 border-r-[3px] border-[#7c6348] bg-[#efe6d3] shadow-[inset_-18px_0_28px_rgba(0,0,0,0.16)]">
            <div className="absolute inset-3 sm:inset-4 border-[3px] border-[#806448]">
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
            transform: `translateX(${doorOpenAmount * 100}%)`,
            transition: mounted ? 'transform 120ms linear' : 'none',
          }}
        >
          <div className="absolute inset-0 border-l-[3px] border-[#7c6348] bg-[#efe6d3] shadow-[inset_18px_0_28px_rgba(0,0,0,0.16)]">
            <div className="absolute inset-3 sm:inset-4 border-[3px] border-[#806448]">
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

        <div
          className="absolute inset-0 z-30 flex items-center justify-center px-6"
          style={{
            opacity: initialContentFade,
            pointerEvents: initialContentFade > 0.08 ? 'auto' : 'none',
          }}
        >
          <div className="w-full max-w-6xl pt-12 sm:pt-0">
            <div className="max-w-md rounded-[2rem] border border-[#e5dac5]/90 bg-[#f7f0e4]/88 p-6 shadow-[0_28px_70px_rgba(58,43,26,0.12)] backdrop-blur-[3px] sm:max-w-3xl sm:p-10">
              <p className="text-xs uppercase tracking-[0.36em] text-[#7a6855]">
                Seattle - Software Engineer
              </p>
              <h1 className="mt-5 max-w-2xl font-editorial text-[3.15rem] leading-[0.9] tracking-[0.03em] text-[#362d23] sm:mt-6 sm:text-6xl sm:leading-[0.96] lg:text-7xl">
                Rowan Meara
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#5d5348] sm:mt-6 sm:text-lg sm:leading-8">
                Building reliable systems, strong product experiences, and engineering work that feels calm under pressure.
              </p>
              <div className="mt-7 grid gap-2 text-[10px] uppercase tracking-[0.2em] text-[#695d50] sm:mt-8 sm:flex sm:flex-wrap sm:gap-3 sm:text-xs sm:tracking-[0.24em]">
                {statPills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#d3c4aa] bg-[#f4ecdf]/90 px-3 py-2 text-center sm:px-4"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/projects"
                  className="inline-flex min-w-44 items-center justify-center rounded-full bg-[#556851] px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#f7f3ea] shadow-[0_12px_28px_rgba(43,61,40,0.2)] transition hover:-translate-y-0.5 hover:bg-[#465743]"
                >
                  Selected work
                </Link>
                <a
                  href="https://www.linkedin.com/in/rowanmeara/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-44 items-center justify-center rounded-full border border-[#c7b594] bg-[#f3ecdf]/92 px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#5c5144] transition hover:-translate-y-0.5 hover:bg-[#ece2d2]"
                >
                  Connect on LinkedIn
                </a>
              </div>
              <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-[#7a6854]/80 sm:mt-14 sm:text-xs sm:tracking-[0.36em]">
                Scroll to open the garden
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 z-10 flex items-center justify-end px-6 py-24"
          style={{
            opacity: revealedContentFade,
            transform: `translateY(${scrollProgress * 18}px) scale(${1 - scrollProgress * 0.05})`,
            filter: `blur(${Math.max((1 - revealedContentFadeOut) * 10, 0)}px)`,
            pointerEvents: revealedContentFade > 0.18 ? 'auto' : 'none',
          }}
        >
          <div className="w-full max-w-6xl">
            <div className="ml-auto max-w-2xl rounded-[2rem] border border-[#ddcfb5]/80 bg-[#f5efe5]/78 p-8 shadow-[0_28px_80px_rgba(58,43,26,0.1)] backdrop-blur-[2px] sm:p-10">
              <p className="text-xs uppercase tracking-[0.34em] text-[#776654]">
                Current focus
              </p>
              <p className="mt-6 font-editorial text-3xl leading-[1.1] text-[#2f281f] sm:text-4xl">
                Building robust, scalable systems at Niantic with the same attention to product quality, reliability, and execution.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-[#d7c7ad] bg-[#f8f2e7]/90 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#7f6d59]">
                    Work style
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f5446]">Measured, systems-minded, and detail-oriented.</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#d7c7ad] bg-[#f8f2e7]/90 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#7f6d59]">
                    Strength
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f5446]">Turning complexity into something reliable and clear.</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#d7c7ad] bg-[#f8f2e7]/90 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#7f6d59]">
                    Lens
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f5446]">Engineering as craft, not only implementation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
