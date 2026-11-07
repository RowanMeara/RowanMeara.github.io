import Link from 'next/link';
import ShojiHero from './components/common/ShojiHero';

const focusAreas = [
  {
    title: 'Scale',
    body: 'High-throughput services and data pipelines designed for the load that is coming, not just the load that is here today.',
  },
  {
    title: 'Consistency',
    body: 'Clear guarantees about what is true and when — data that stays correct through retries, partitions, and partial failure, so everything downstream can trust it.',
  },
  {
    title: 'Reliability',
    body: 'Systems that degrade gracefully and are calm to operate: observable, well understood, and simple enough to hand off.',
  },
];

export default function Home() {
  return (
    <div className="bg-[#f6f2e9] text-[#2b251d]">
      <ShojiHero />

      <section className="border-t border-[#e0d5bf] px-6 py-24 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-[#9a8a70]">
              About
            </p>
            <h2 className="font-editorial mt-6 text-3xl leading-[1.2] text-[#2b251d] sm:text-[2.5rem]">
              A distributed systems engineer, building for massive scale without giving up on correctness.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5d5345]">
              I design and run backend systems where the volume is high and mistakes are expensive:
              high-throughput services, large data pipelines, and the consistency guarantees that keep
              them honest. I like the hard parts — failure modes, data integrity, latency — and making
              them simple enough for a team to operate with confidence.
            </p>
          </div>

          <dl className="space-y-7 border-t border-[#d8cbb0] pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#9a8a70]">
                Now
              </dt>
              <dd className="mt-2 text-[15px] leading-7 text-[#534a3c]">
                Software engineer on the Ads team at OpenAI.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#9a8a70]">
                Before
              </dt>
              <dd className="mt-2 text-[15px] leading-7 text-[#534a3c]">
                Tech lead for the Pokémon GO backend at Niantic.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#9a8a70]">
                Focus
              </dt>
              <dd className="mt-2 text-[15px] leading-7 text-[#534a3c]">
                Large-scale distributed systems, data consistency, and high-throughput backend services.
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
