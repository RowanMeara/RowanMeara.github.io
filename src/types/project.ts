export type ProjectCategory = 
  | 'Web Development'
  | 'Mobile Development'
  | 'Backend Development'
  | 'Full Stack'
  | 'Other';

export type Technology = 
  | 'React'
  | 'Next.js'
  | 'TypeScript'
  | 'Node.js'
  | 'Python'
  | 'SQL'
  | 'AWS'
  | 'Docker'
  | 'Git'
  | 'REST APIs'
  | 'Tailwind CSS'
  | 'MongoDB'
  | 'PostgreSQL'
  | 'Express'
  | 'Django'
  | 'Flask'
  | 'React Native'
  | 'Swift'
  | 'Kotlin'
  | 'Java';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: Technology[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  date: string;
  highlights: string[];
} 