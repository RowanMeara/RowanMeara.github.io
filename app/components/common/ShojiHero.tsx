'use client';

import Link from 'next/link';
import { useEffect, useRef, type CSSProperties } from 'react';
import styles from './ShojiHero.module.css';

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const MAPLE_LEAF =
  'M50 91.9L46.4 91.6L42.9 90.8L39.6 89.5L36.5 87.7L33.7 85.5L31.1 83L29.6 81.8L27.4 81L24 80.5L19.4 79.9L15 78.7L13 76.4L14.2 73.3L17.8 70.4L21.6 67.9L21.2 65.8L15.8 62.8L9 58.6L4 53.7L4.1 49.9L9.7 48.5L17.6 49.2L24.6 50.6L26.5 49.2L22.7 42.6L18.2 33.7L16 25.3L18.4 21.6L24.7 24.2L32.1 30.8L38 37.5L41.4 40.1L42 32.8L43.1 22.4L45.8 12.4L50 8.1L54.2 12.4L56.9 22.4L58 32.8L58.6 40.1L62 37.5L67.9 30.8L75.3 24.2L81.6 21.6L84 25.3L81.8 33.7L77.3 42.6L73.5 49.2L75.4 50.6L82.4 49.2L90.3 48.5L95.9 49.9L96 53.7L91 58.6L84.2 62.8L78.8 65.8L78.4 67.9L82.2 70.4L85.8 73.3L87 76.4L85 78.7L80.6 79.9L76 80.5L72.6 81L70.4 81.8L68.9 83L66.3 85.5L63.5 87.7L60.4 89.5L57.1 90.8L53.6 91.6Z';

// A few maple leaves drifting across the garden once the doors are open.
const LEAVES = [
  { left: '62%', size: 22, duration: 15, delay: -3, drift: '-14cqw', color: '#b5432a' },
  { left: '74%', size: 16, duration: 18, delay: -11, drift: '-20cqw', color: '#c7612c' },
  { left: '86%', size: 19, duration: 16, delay: -7, drift: '-24cqw', color: '#a33a26' },
  { left: '48%', size: 14, duration: 20, delay: -15, drift: '-10cqw', color: '#cf7a35' },
  { left: '93%', size: 24, duration: 17, delay: -1, drift: '-30cqw', color: '#b84c2b' },
] as const;

function DoorPanel({ side }: { side: 'left' | 'right' }) {
  return (
    <>
      <div className={styles.paper} aria-hidden="true">
        <div className={`${styles.paperLight} ${side === 'left' ? styles.paperLightLeft : styles.paperLightRight}`} />
      </div>
      <div className={styles.lattice} aria-hidden="true" />
      <div className={styles.koshi} aria-hidden="true" />
      <div className={styles.pull} aria-hidden="true" />
    </>
  );
}

export default function ShojiHero() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let target = 0;
    let current = 0;
    let raf = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      target = range > 0 ? clamp01(-rect.top / range) : 1;
    };

    const apply = (p: number) => {
      const open = easeInOutCubic(smoothstep(0.03, 0.66, p));
      stage.style.setProperty('--open', open.toFixed(4));
      stage.style.setProperty('--push', smoothstep(0.1, 1, p).toFixed(4));
      stage.style.setProperty('--intro', (1 - smoothstep(0.01, 0.2, p)).toFixed(4));
      stage.style.setProperty('--hint', (1 - smoothstep(0, 0.05, p)).toFixed(4));
    };

    // Ease toward the scroll position so wheel steps glide instead of jumping.
    const tick = () => {
      raf = 0;
      current += (target - current) * (reducedMotion.matches ? 1 : 0.14);
      if (Math.abs(target - current) < 0.0004) current = target;
      apply(current);
      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    current = target;
    apply(current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Pause the ambient animations (leaf shadow, falling leaves) while off screen.
    const observer = new IntersectionObserver(([entry]) => {
      stage.dataset.visible = entry.isIntersecting ? 'true' : 'false';
    });
    observer.observe(stage);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={trackRef} className={styles.track} aria-labelledby="hero-title">
      <div ref={stageRef} className={styles.stage} data-visible="true">
        <div className={styles.garden} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`${styles.layer} ${styles.layerBack}`}
            src="/hero/garden-back.webp"
            srcSet="/hero/garden-back-1600.webp 1600w, /hero/garden-back.webp 2400w"
            sizes="max(100vw, 160vh)"
            alt=""
            decoding="async"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`${styles.layer} ${styles.layerGround}`}
            src="/hero/garden-ground.webp"
            srcSet="/hero/garden-ground-1600.webp 1600w, /hero/garden-ground.webp 2400w"
            sizes="max(100vw, 160vh)"
            alt=""
            decoding="async"
          />
          <div className={styles.leaves}>
            {LEAVES.map((leaf, i) => (
              <span
                key={i}
                className={styles.leaf}
                style={
                  {
                    left: leaf.left,
                    width: leaf.size,
                    height: leaf.size,
                    animationDuration: `${leaf.duration}s`,
                    animationDelay: `${leaf.delay}s`,
                    '--drift': leaf.drift,
                  } as CSSProperties
                }
              >
                <svg viewBox="0 0 100 100" style={{ animationDuration: `${leaf.duration / 3}s` }}>
                  <path d={MAPLE_LEAF} fill={leaf.color} />
                </svg>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.frame}>
          <div className={`${styles.door} ${styles.doorRight}`}>
            <DoorPanel side="right" />
          </div>

          <div className={`${styles.door} ${styles.doorLeft}`}>
            <DoorPanel side="left" />
            <div className={styles.intro}>
              <p className={styles.eyebrow}>Software Engineer · Seattle</p>
              <h1 id="hero-title" className={`font-editorial ${styles.name}`}>
                Rowan Meara
              </h1>
              <div className={styles.rule} />
              <p className={styles.tagline}>
                Building distributed systems that stay correct at massive scale.
              </p>
              <nav className={styles.links} aria-label="Elsewhere">
                <Link href="/projects">Selected Work</Link>
                <a href="https://github.com/RowanMeara" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/rowanmeara/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>

          <div className={styles.lintel} aria-hidden="true" />
          <div className={styles.floor} aria-hidden="true" />
          <div className={`${styles.post} ${styles.postLeft}`} aria-hidden="true" />
          <div className={`${styles.post} ${styles.postRight}`} aria-hidden="true" />
        </div>

        <div className={styles.hint} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
