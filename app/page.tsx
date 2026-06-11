import Link from 'next/link';
import ZenScene from './components/common/ZenScene';

const focusAreas = [
  {
    title: 'Distributed systems',
    body: 'Services and data flows designed to stay predictable under real traffic — resilient, observable, and calm to operate.',
  },
  {
    title: 'Product engineering',
    body: 'Features shipped with equal weight on architecture, usability, and business context, rather than optimizing one in isolation.',
  },
  {
    title: 'Craft',
    body: 'Code, interfaces, and decisions that age well — clear enough to hand off, simple enough to still like a year later.',
  },
];

export default function Home() {
  return (
    <div className="bg-[#f6f2e9] text-[#2b251d]">
      <ZenScene />

      <section className="border-t border-[#e0d5bf] px-6 py-24 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-[#9a8a70]">
              About
            </p>
            <h2 className="font-editorial mt-6 text-3xl leading-[1.2] text-[#2b251d] sm:text-[2.5rem]">
              A software engineer in Seattle, building systems that stay calm in production.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5d5345]">
              I work across distributed systems, backend services, and modern web stacks,
              with a working style centered on clarity, reliability, and decisions that age well.
            </p>
          </div>

          <dl className="space-y-7 border-t border-[#d8cbb0] pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#9a8a70]">
                Now
              </dt>
              <dd className="mt-2 text-[15px] leading-7 text-[#534a3c]">
                Engineering on Pokémon GO at Niantic, focused on robust production systems.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#9a8a70]">
                Focus
              </dt>
              <dd className="mt-2 text-[15px] leading-7 text-[#534a3c]">
                Distributed systems, backend services, and product-minded web engineering.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#9a8a70]">
                Elsewhere
              </dt>
              <dd className="mt-2 flex gap-6 text-[15px] text-[#534a3c]">
                <a
                  href="https://github.com/RowanMeara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-[#c9ba9c] pb-0.5 transition hover:border-[#ae4f2c] hover:text-[#2b251d]"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/rowanmeara/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-[#c9ba9c] pb-0.5 transition hover:border-[#ae4f2c] hover:text-[#2b251d]"
                >
                  LinkedIn
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-t border-[#e0d5bf] bg-[#f1ebdc] px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-3 sm:gap-10">
          {focusAreas.map((area) => (
            <article key={area.title} className="border-t-2 border-[#4c5a48] pt-6">
              <h3 className="font-editorial text-[1.45rem] leading-tight text-[#2b251d]">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#665b4a]">{area.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#e0d5bf] px-6 py-24 text-center sm:py-28">
        <p className="text-xs uppercase tracking-[0.42em] text-[#9a8a70]">
          Selected work
        </p>
        <Link
          href="/projects"
          className="font-editorial mt-6 inline-block text-3xl text-[#2b251d] underline decoration-[#c9ba9c] decoration-1 underline-offset-[10px] transition hover:decoration-[#ae4f2c] sm:text-4xl"
        >
          View projects
        </Link>
      </section>
    </div>
  );
}
