import { Project, ProjectCategory, Technology } from '@/types/project';

export const getFeaturedProjects = (projects: Project[]): Project[] => {
  return projects.filter(project => project.featured);
};

export const getProjectsByCategory = (projects: Project[], category: ProjectCategory): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getProjectsByTechnology = (projects: Project[], technology: Technology): Project[] => {
  return projects.filter(project => project.technologies.includes(technology));
};

export const getAllCategories = (projects: Project[]): ProjectCategory[] => {
  return Array.from(new Set(projects.map(project => project.category)));
};

export const getAllTechnologies = (projects: Project[]): Technology[] => {
  return Array.from(new Set(projects.flatMap(project => project.technologies)));
};

export const sortProjectsByDate = (projects: Project[], ascending: boolean = false): Project[] => {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
}; 