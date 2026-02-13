import ZenScene from './components/common/ZenScene';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Zen Scene Hero */}
      <ZenScene />

      {/* About Section */}
      <section id="about" className="relative py-32 px-6 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-px bg-stone-300 dark:bg-stone-700 mb-12" />

          <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-stone-200 mb-8 tracking-wide">
            About
          </h2>

          <div className="space-y-6 text-stone-600 dark:text-stone-400 leading-relaxed">
            <p>
              Software engineer with expertise in building distributed systems,
              machine learning applications, and modern web technologies.
            </p>
            <p>
              I approach each project with a focus on simplicity, quality, and
              thoughtful design. Currently based in Seattle.
            </p>
          </div>

          <div className="mt-16 pt-16 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-wrap gap-8 text-sm text-stone-500 dark:text-stone-500">
              <Link
                href="/projects"
                className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors duration-300"
              >
                Projects
              </Link>
              <a
                href="https://www.linkedin.com/in/rowanmeara/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors duration-300"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/RowanMeara"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors duration-300"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
