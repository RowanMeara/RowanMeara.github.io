import Link from 'next/link';
import { games } from '../data/games';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-8 inline-block"
        >
          &larr; back
        </Link>

        <h1 className="text-3xl md:text-4xl font-light text-stone-800 dark:text-stone-200 tracking-wide mb-4">
          Projects
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mb-12">
          A collection of games built with React.
        </p>

        {/* Games Section */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <Link
                key={game.id}
                href={game.path}
                className="group p-6 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
              >
                <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200 mb-2 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {game.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
