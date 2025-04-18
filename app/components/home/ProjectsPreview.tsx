import Link from 'next/link';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

export default function ProjectsPreview() {
  // Sample featured projects
  const featuredProjects: Project[] = [
    {
      id: 'project-1',
      title: 'Distributed AI Analytics Platform',
      description: 'A scalable platform for processing and analyzing large datasets using distributed computing and machine learning techniques.',
      image: '/projects/project1.jpg',
      tags: ['Python', 'TensorFlow', 'Kubernetes', 'Redis']
    },
    {
      id: 'project-2',
      title: 'Real-time Collaboration Tool',
      description: 'A web application enabling teams to collaborate in real-time on documents, code, and designs with instant synchronization.',
      image: '/projects/project2.jpg',
      tags: ['React', 'Node.js', 'WebSockets', 'MongoDB']
    },
    {
      id: 'project-3',
      title: 'E-commerce Microservices',
      description: 'A modern e-commerce platform built with a microservices architecture for scalability and maintainability.',
      image: '/projects/project3.jpg',
      tags: ['TypeScript', 'Docker', 'AWS', 'GraphQL']
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
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
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                {/* Placeholder for project image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  [Project Image]
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={`${project.id}-${tag}`}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/projects/${project.id}`}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/projects" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 inline-block"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
} 