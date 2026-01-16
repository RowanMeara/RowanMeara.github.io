'use client';

import { useEffect, useState } from 'react';

export default function ZenScene() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = windowHeight * 2; // Full animation over 2 viewport heights
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Door opening animation: 0 = closed, 1 = fully open
  const doorOpenAmount = Math.min(scrollProgress * 2, 1); // Opens fully at 50% scroll

  return (
    <div className="relative w-full h-[200vh] overflow-hidden">
      {/* Building Interior */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950">
        {/* Tatami floor pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-6 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-r border-b border-amber-800/30"
                style={{
                  background: i % 2 === 0 ? '#fef3c7' : '#fde68a',
                }}
              />
            ))}
          </div>
        </div>

        {/* Room elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          {/* Tokonoma alcove */}
          <div className="absolute left-8 top-8 w-64 h-80 bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-900 rounded-lg shadow-2xl border-4 border-amber-800 dark:border-amber-700">
            <div className="p-6 h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🌸</div>
              <div className="text-amber-900 dark:text-amber-100 text-sm text-center font-serif">
                Zen Moment
              </div>
            </div>
          </div>

          {/* Low table */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-16 bg-amber-800 dark:bg-amber-900 rounded-lg shadow-xl"></div>
        </div>

        {/* Sliding Doors (Fusuma) */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative w-full h-full">
            {/* Left door */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-50 dark:from-amber-800 dark:via-amber-700 dark:to-amber-600 border-r-4 border-amber-800 dark:border-amber-700 shadow-2xl transition-transform duration-1000 ease-out"
              style={{
                transform: `translateX(${-doorOpenAmount * 100}%)`,
              }}
            >
              {/* Door frame pattern */}
              <div className="absolute inset-0 p-4">
                <div className="h-full border-2 border-amber-700 dark:border-amber-600 rounded">
                  <div className="grid grid-cols-2 h-full divide-x divide-amber-700 dark:divide-amber-600">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 border border-amber-600 dark:border-amber-500 rounded-full opacity-50"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right door */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-200 via-amber-100 to-amber-50 dark:from-amber-800 dark:via-amber-700 dark:to-amber-600 border-l-4 border-amber-800 dark:border-amber-700 shadow-2xl transition-transform duration-1000 ease-out"
              style={{
                transform: `translateX(${doorOpenAmount * 100}%)`,
              }}
            >
              {/* Door frame pattern */}
              <div className="absolute inset-0 p-4">
                <div className="h-full border-2 border-amber-700 dark:border-amber-600 rounded">
                  <div className="grid grid-cols-2 h-full divide-x divide-amber-700 dark:divide-amber-600">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 border border-amber-600 dark:border-amber-500 rounded-full opacity-50"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zen Garden - Revealed as doors open */}
        <div
          className="absolute inset-0 transition-opacity duration-2000"
          style={{
            opacity: Math.max(0, (scrollProgress - 0.3) * 2),
            pointerEvents: doorOpenAmount > 0.5 ? 'auto' : 'none',
          }}
        >
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-green-50 dark:from-blue-950 dark:via-blue-900 dark:to-green-950"></div>

          {/* Mountains in background */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3">
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-600 to-gray-400 dark:from-gray-800 dark:to-gray-600 opacity-60 rounded-t-full"></div>
            <div className="absolute bottom-0 right-0 w-3/4 h-48 bg-gradient-to-t from-gray-500 to-gray-300 dark:from-gray-700 dark:to-gray-500 opacity-50 rounded-t-full"></div>
          </div>

          {/* Garden elements */}
          <div className="absolute inset-0">
            {/* Sand/gravel area */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-100 to-amber-50 dark:from-amber-900 dark:to-amber-800">
              {/* Raked sand pattern */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 5 + '%'}
                      x2="100%"
                      y2={i * 5 + '%'}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-amber-700 dark:text-amber-600"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Stones */}
            <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gray-600 dark:bg-gray-700 rounded-full shadow-xl transform rotate-12"></div>
            <div className="absolute bottom-28 right-1/3 w-32 h-20 bg-gray-500 dark:bg-gray-600 rounded-full shadow-xl transform -rotate-6"></div>
            <div className="absolute bottom-36 left-1/2 w-20 h-20 bg-gray-700 dark:bg-gray-800 rounded-full shadow-xl"></div>

            {/* Bonsai tree */}
            <div className="absolute bottom-40 right-1/4">
              <div className="relative">
                {/* Trunk */}
                <div className="w-8 h-32 bg-amber-900 dark:bg-amber-950 mx-auto rounded-full"></div>
                {/* Foliage */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-600 dark:bg-green-800 rounded-full opacity-80 shadow-lg"></div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-500 dark:bg-green-700 rounded-full opacity-90 shadow-md"></div>
              </div>
            </div>

            {/* Lantern */}
            <div className="absolute bottom-24 left-1/3">
              <div className="relative">
                <div className="w-12 h-20 bg-stone-600 dark:bg-stone-700 mx-auto rounded-t-lg shadow-xl">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-200 dark:bg-yellow-900 rounded-full opacity-60 blur-sm"></div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-stone-700 dark:bg-stone-800 rounded-t-full"></div>
              </div>
            </div>

            {/* Water feature / pond */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-blue-400 dark:bg-blue-900 rounded-full opacity-60 shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-300 dark:border-blue-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Cherry blossoms */}
            <div className="absolute top-1/4 left-1/4 text-4xl opacity-70 animate-pulse">🌸</div>
            <div className="absolute top-1/3 right-1/4 text-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
              🌸
            </div>
            <div className="absolute top-1/5 right-1/3 text-5xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}>
              🌸
            </div>
          </div>
        </div>

        {/* Content overlay - appears initially */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.5),
          }}
        >
          <div className="text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-amber-900 dark:text-amber-100 mb-4 font-serif">
              Rowan Meara
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-amber-700 dark:text-amber-300 mb-8 font-serif">
              Software Engineer
            </h2>
            <p className="text-lg md:text-xl text-amber-800 dark:text-amber-200 max-w-2xl mx-auto mb-10 font-serif">
              Scroll to enter the garden
            </p>
          </div>
        </div>

        {/* Garden content - appears after doors open */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000"
          style={{
            opacity: Math.max(0, (scrollProgress - 0.6) * 2.5),
          }}
        >
          <div className="text-center px-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white dark:text-gray-100 mb-4 font-serif drop-shadow-lg">
              Welcome to My Garden
            </h1>
            <p className="text-lg md:text-xl text-white dark:text-gray-200 max-w-2xl mx-auto mb-10 font-serif drop-shadow-md">
              I build robust, scalable software systems and web applications with a focus on 
              distributed systems, machine learning, and modern web technologies.
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.linkedin.com/in/rowanmeara/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-transparent border-2 border-white/80 dark:border-gray-200/80 text-white dark:text-gray-100 font-medium rounded-lg hover:bg-white/20 dark:hover:bg-gray-200/20 transition duration-300 backdrop-blur-sm"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

