'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationLinks } from '../../data/navigation';

export default function Navigation() {
  const pathname = usePathname();

  // Check if the link is the current page
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') {
      return false;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="hidden sm:flex items-center space-x-1">
      {navigationLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive(link.href)
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
} 