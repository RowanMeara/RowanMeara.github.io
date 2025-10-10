import Link from 'next/link';
import { projects } from './data/projects';
import { ProjectCard } from './components/common/ProjectCard';
import { Section } from './components/common/Section';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section background="gradient" className="md:py-32">
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
            <Link href="/projects" className="button-primary">
              View Projects
            </Link>
            <Link href="/contact" className="button-secondary">
              Contact Me
            </Link>
          </div>
        </div>
      </Section>

      {/* About Section */}
      <Section background="white">
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
      </Section>
      
      {/* Projects Section */}
      <Section background="gray">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A selection of my recent work. These projects showcase my skills and approach to solving complex problems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/projects" className="button-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
