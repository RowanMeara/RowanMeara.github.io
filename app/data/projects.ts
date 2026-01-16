export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export const projects: Project[] = [
  {
    id: 'distributed-analytics',
    title: 'Distributed Analytics Platform',
    description: 'A scalable platform for processing and analyzing large datasets using distributed computing and machine learning algorithms.',
    tags: ['Python', 'TensorFlow', 'Apache Spark', 'AWS'],
    icon: 'chart-bar'
  },
  {
    id: 'realtime-collaboration',
    title: 'Real-time Collaboration Tool',
    description: 'A web application enabling teams to collaborate in real-time on documents, code, and designs with instant synchronization.',
    tags: ['React', 'Node.js', 'WebSockets', 'MongoDB'],
    icon: 'users'
  },
  {
    id: 'ecommerce-microservices',
    title: 'E-commerce Microservices',
    description: 'A modern e-commerce platform built with a microservices architecture for scalability and maintainability.',
    tags: ['TypeScript', 'Docker', 'AWS', 'GraphQL'],
    icon: 'shopping-cart'
  }
];




