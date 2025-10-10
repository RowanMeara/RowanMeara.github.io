import Link from 'next/link';

export default function DistributedAnalyticsProject() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back to Projects Link */}
        <div className="mb-8">
          <Link 
            href="/projects" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Distributed Analytics Platform
          </h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="tag-lg">Python</span>
            <span className="tag-lg">TensorFlow</span>
            <span className="tag-lg">Apache Spark</span>
            <span className="tag-lg">AWS</span>
          </div>
        </div>

        {/* Project Content - Placeholder */}
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            A scalable platform for processing and analyzing large datasets using distributed computing and machine learning algorithms.
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This is a placeholder for the Distributed Analytics Platform project page. You can add detailed information about this project here, including:
          </p>

          <ul className="list-disc pl-6 mb-8 text-gray-600 dark:text-gray-400">
            <li>Project overview and goals</li>
            <li>Technologies and architecture</li>
            <li>Key features and functionality</li>
            <li>Development challenges and solutions</li>
            <li>Project outcomes and results</li>
            <li>Future development plans</li>
          </ul>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ready to add content</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This page is ready for you to add your project content. Edit this file to add details, images, and any other information about your Distributed Analytics Platform project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 