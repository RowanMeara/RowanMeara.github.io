import Link from 'next/link';
import { Icon } from './Icon';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <div className="text-blue-500 dark:text-blue-400">
          <Icon name={project.icon} />
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
              className="tag"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link 
          href={`/projects/${project.id}`}
          className="text-gray-900 dark:text-white font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}




