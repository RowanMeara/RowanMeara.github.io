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
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900">
      <ZenScene />

      <section className="relative -mt-36 overflow-hidden border-t border-[#cfc0a8] bg-[#f6f1e8] px-6 pb-24 pt-12 sm:-mt-44 sm:pb-28 sm:pt-16">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),transparent)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-l border-[#bba783] pl-6 sm:pl-8">
              <p className="text-xs uppercase tracking-[0.34em] text-[#7d6b57]">
                Profile
              </p>
              <h2 className="font-editorial mt-6 max-w-3xl text-4xl leading-[1.02] tracking-[0.03em] text-[#2f281f] sm:text-5xl">
                Calm systems, thoughtful product judgment, and a portfolio that should feel as considered as the work itself.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5446] sm:text-lg">
                I am a software engineer based in Seattle, building scalable systems and dependable product experiences with an eye for reliability, simplicity, and craft.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 text-sm text-[#5d5348]">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center border border-[#3f5748] bg-[#3f5748] px-6 py-3 uppercase tracking-[0.18em] text-[#f7f3ea] transition hover:-translate-y-0.5 hover:bg-[#344a3d]"
                >
                  View work
                </Link>
                <a
                  href="https://www.linkedin.com/in/rowanmeara/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-[#cabb9d] bg-[#f8f3eb] px-6 py-3 uppercase tracking-[0.18em] text-[#64584a] transition hover:-translate-y-0.5 hover:border-[#b9a883] hover:bg-[#efe5d5]"
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

            <aside className="border-t border-[#c9b99b] pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
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
            </aside>
          </div>

          <div className="mt-16 grid gap-px border border-[#d7c8ab] bg-[#d7c8ab] md:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="bg-[#fbf8f1] p-7 sm:p-8">
                <div className="h-px w-12 bg-[#3f5748]" />
                <h3 className="font-editorial mt-6 text-[1.65rem] leading-[1.08] tracking-[0.03em] text-[#30281e]">
                  {area.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#625748]">{area.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#ddd1be] bg-[#eae1d2] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#7d6b57]">
              Approach
            </p>
            <h2 className="font-editorial mt-6 text-4xl leading-[1.02] tracking-[0.03em] text-[#2f281f] sm:text-5xl">
              Professional, restrained, and built to communicate signal quickly.
            </h2>
          </div>

          <div className="grid gap-px border border-[#cfc0a8] bg-[#cfc0a8] sm:grid-cols-2">
            <div className="bg-[#f7f1e6] p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7a6855]">
                How I build
              </p>
              <p className="mt-4 text-sm leading-7 text-[#5e5448]">
                I prefer systems that are understandable in production, interfaces that respect attention, and architectures that remain flexible under change.
              </p>
            </div>

            <div className="bg-[#f7f1e6] p-6 sm:p-7">
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
