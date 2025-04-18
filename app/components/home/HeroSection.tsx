'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 -z-10" />
      
      {/* Animated dots/grid pattern */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]">
          {[...Array(100)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-1 w-1 rounded-full bg-black dark:bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 4}s infinite ${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {/* Greeting */}
          <motion.p 
            variants={fadeIn}
            className="text-blue-600 dark:text-blue-400 text-lg md:text-xl font-medium mb-4"
          >
            Hello, I'm
          </motion.p>
          
          {/* Name */}
          <motion.h1 
            variants={fadeIn}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Rowan Meara
          </motion.h1>
          
          {/* Title/Role */}
          <motion.h2 
            variants={fadeIn}
            className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8"
          >
            Software Engineer
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            variants={fadeIn}
            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed mb-10"
          >
            I build robust, scalable software systems and web applications with a focus on 
            distributed systems, machine learning, and modern web technologies.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link 
              href="/projects" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-center"
            >
              View Projects
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300 text-center"
            >
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 