'use client';

import { useState } from 'react';

type Skill = {
  name: string;
  icon: string;
  categories: string[];
};

type SkillCategory = {
  name: string;
  description: string;
};

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories: SkillCategory[] = [
    { 
      name: 'all', 
      description: 'All of my technical skills and expertise'
    },
    { 
      name: 'frontend', 
      description: 'Technologies I use to build beautiful, responsive user interfaces'
    },
    { 
      name: 'backend', 
      description: 'Tools and frameworks I use for server-side development'
    },
    { 
      name: 'data', 
      description: 'Technologies I use for data processing and machine learning'
    },
    { 
      name: 'devops', 
      description: 'Tools I use for deployment, CI/CD, and infrastructure'
    }
  ];

  const skills: Skill[] = [
    { name: 'TypeScript', icon: '⚡', categories: ['frontend', 'backend'] },
    { name: 'React', icon: '⚛️', categories: ['frontend'] },
    { name: 'Next.js', icon: '▲', categories: ['frontend', 'backend'] },
    { name: 'Node.js', icon: '🟢', categories: ['backend'] },
    { name: 'Python', icon: '🐍', categories: ['backend', 'data'] },
    { name: 'TensorFlow', icon: '📊', categories: ['data'] },
    { name: 'AWS', icon: '☁️', categories: ['devops', 'backend'] },
    { name: 'Docker', icon: '🐳', categories: ['devops'] },
    { name: 'GraphQL', icon: '◼️', categories: ['backend'] },
    { name: 'SQL', icon: '🗃️', categories: ['backend', 'data'] },
    { name: 'Tailwind CSS', icon: '🎨', categories: ['frontend'] },
    { name: 'Git', icon: '📝', categories: ['devops'] },
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.categories.includes(activeCategory));

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of technologies and tools I work with to build scalable and efficient solutions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="text-center mb-10">
          <p className="text-gray-600 dark:text-gray-400 italic">
            {categories.find(c => c.name === activeCategory)?.description}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105 flex flex-col items-center justify-center"
            >
              <span className="text-3xl mb-3" role="img" aria-label={skill.name}>
                {skill.icon}
              </span>
              <h3 className="font-medium text-gray-900 dark:text-white text-center">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 