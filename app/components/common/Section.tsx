import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient';
}

export function Section({ children, className = "", background = 'white' }: SectionProps) {
  const backgroundClasses = {
    white: 'bg-white dark:bg-gray-800',
    gray: 'bg-gray-50 dark:bg-gray-900',
    gradient: 'bg-white dark:bg-gray-800'
  };

  return (
    <section className={`py-20 ${backgroundClasses[background]} ${className}`}>
      {children}
    </section>
  );
}




