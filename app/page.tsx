import Link from 'next/link';
import ZenScene from './components/common/ZenScene';

const focusAreas = [
  {
    title: 'Platform and distributed systems',
    body: 'Designing resilient services, data flows, and operationally calm systems that hold up as products grow.',
  },
  {
    title: 'Product-minded engineering',
    body: 'Shipping features that balance architecture, usability, and business context rather than optimizing one in isolation.',
  },
  {
    title: 'Web and product engineering',
    body: 'Building clear, dependable interfaces and product experiences that support real users and real teams.',
  },
];

const highlights = [
  'Engineering on Pokemon GO at Niantic, with a focus on robust production systems.',
  'Experience across distributed systems, backend services, and modern web stacks.',
  'A working style centered on clarity, quality, and decisions that age well.',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-stone-900">
      <ZenScene />

      <section className="relative -mt-36 overflow-hidden px-6 pb-24 pt-10 sm:-mt-44 sm:pb-28 sm:pt-16">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-[#d9cfbe] bg-[#f8f3eb]/96 p-8 shadow-[0_24px_80px_rgba(77,61,39,0.08)] backdrop-blur-[2px] sm:p-10">
              <p className="text-xs uppercase tracking-[0.34em] text-[#7d6b57]">
                Profile
              </p>
              <h2 className="font-editorial mt-6 max-w-2xl text-4xl leading-[1.02] tracking-[0.03em] text-[#2f281f] sm:text-5xl">
                Calm systems, thoughtful product judgment, and a portfolio that should feel as considered as the work itself.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5446] sm:text-lg">
                I am a software engineer based in Seattle, building scalable systems and dependable product experiences with an eye for reliability, simplicity, and craft.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 text-sm text-[#5d5348]">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full border border-[#5b6b55] bg-[#556851] px-6 py-3 uppercase tracking-[0.18em] text-[#f7f3ea] transition hover:-translate-y-0.5 hover:bg-[#4a5b46]"
                >
                  View work
                </Link>
                <a
                  href="https://www.linkedin.com/in/rowanmeara/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#cabb9d] bg-[#f5eee2] px-6 py-3 uppercase tracking-[0.18em] text-[#64584a] transition hover:-translate-y-0.5 hover:border-[#b9a883] hover:bg-[#f0e7d8]"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/RowanMeara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-transparent px-2 py-3 text-sm text-[#6a5f53] transition hover:text-[#312a21]"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d8cdb9] bg-[linear-gradient(180deg,rgba(248,243,235,0.98),rgba(239,232,219,0.94))] p-8 shadow-[0_24px_60px_rgba(77,61,39,0.06)] backdrop-blur-[2px] sm:p-10">
              <p className="text-xs uppercase tracking-[0.34em] text-[#7d6b57]">
                Current lens
              </p>
              <div className="mt-8 space-y-6">
                {highlights.map((item) => (
                  <div key={item} className="border-l border-[#bda88d] pl-5">
                    <p className="text-base leading-7 text-[#574c40]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="rounded-[1.75rem] border border-[#ddd2bf] bg-[#fbf7f0]/92 p-7 shadow-[0_18px_48px_rgba(77,61,39,0.05)] backdrop-blur-[2px]">
                <div className="h-10 w-10 rounded-full border border-[#c8b79b] bg-[radial-gradient(circle_at_30%_30%,#f8f0e3,#e8dcc8)]" />
                <h3 className="font-editorial mt-6 text-[1.75rem] leading-[1.05] tracking-[0.03em] text-[#30281e]">
                  {area.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#625748]">{area.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#ddd1be] bg-[#efe7db] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#7d6b57]">
              Approach
            </p>
            <h2 className="font-editorial mt-6 text-4xl leading-[1.02] tracking-[0.03em] text-[#2f281f] sm:text-5xl">
              Professional, restrained, and built to communicate signal quickly.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#d6c9b4] bg-[#f7f1e6] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7a6855]">
                How I build
              </p>
              <p className="mt-4 text-sm leading-7 text-[#5e5448]">
                I prefer systems that are understandable in production, interfaces that respect attention, and architectures that remain flexible under change.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#d6c9b4] bg-[#f7f1e6] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7a6855]">
                What this site should show
              </p>
              <p className="mt-4 text-sm leading-7 text-[#5e5448]">
                Not just experiments, but judgment: the ability to ship product, reason about tradeoffs, and care about finish.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
