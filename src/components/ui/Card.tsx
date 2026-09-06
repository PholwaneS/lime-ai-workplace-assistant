import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-navy-900 rounded-2xl border border-navy-200 dark:border-navy-800 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`px-6 py-4 border-b border-navy-200 dark:border-navy-800 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
