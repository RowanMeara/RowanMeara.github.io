import { Section } from './components/common/Section';
import ZenScene from './components/common/ZenScene';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Zen Scene Hero Section */}
      <ZenScene />

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
      
    </div>
  );
}
