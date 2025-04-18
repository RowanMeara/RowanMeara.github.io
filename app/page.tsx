import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Rowan Meara
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8">
            Software Engineer
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            I build robust, scalable software systems and web applications with a focus on 
            distributed systems, machine learning, and modern web technologies.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/projects" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              View Projects
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              I&apos;m a software engineer with expertise in building distributed systems, 
              machine learning applications, and modern web technologies. With a passion for 
              creating efficient, scalable solutions, I approach each project with a focus on 
              quality and user experience.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Based in San Francisco, I&apos;m constantly exploring new technologies and methodologies 
              to improve the way we build software.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
