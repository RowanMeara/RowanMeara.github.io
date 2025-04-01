import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website built with Next.js and Tailwind CSS. Features include dark mode, animations, and a clean, professional design.',
    category: 'Web Development',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    imageUrl: '/projects/portfolio.png',
    githubUrl: 'https://github.com/RowanMeara/RowanMeara.github.io',
    featured: true,
    date: '2024-03',
    highlights: [
      'Built with modern web technologies',
      'Responsive design for all devices',
      'Dark mode support',
      'Smooth animations and transitions'
    ]
  },
  {
    id: 'project-2',
    title: 'Project 2',
    description: 'Description of project 2',
    category: 'Full Stack',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    imageUrl: '/projects/project2.png',
    githubUrl: 'https://github.com/RowanMeara/project2',
    liveUrl: 'https://project2.com',
    featured: true,
    date: '2024-02',
    highlights: [
      'Full-stack application',
      'Real-time updates',
      'User authentication',
      'Database integration'
    ]
  },
  {
    id: 'project-3',
    title: 'Project 3',
    description: 'Description of project 3',
    category: 'Backend Development',
    technologies: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    imageUrl: '/projects/project3.png',
    githubUrl: 'https://github.com/RowanMeara/project3',
    featured: false,
    date: '2024-01',
    highlights: [
      'RESTful API development',
      'Database optimization',
      'Cloud deployment',
      'API documentation'
    ]
  }
]; 