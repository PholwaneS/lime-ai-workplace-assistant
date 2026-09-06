import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className = '', id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-700 dark:text-navy-200">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-sm text-navy-900 dark:text-navy-100 placeholder-navy-400 dark:placeholder-navy-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 focus:outline-none transition-all ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-navy-400 dark:text-navy-500">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className = '', id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-700 dark:text-navy-200">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-lg border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-sm text-navy-900 dark:text-navy-100 placeholder-navy-400 dark:placeholder-navy-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 focus:outline-none transition-all resize-y scrollbar-thin ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-navy-400 dark:text-navy-500">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function Select({ label, className = '', id, children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-700 dark:text-navy-200">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-lg border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-sm text-navy-900 dark:text-navy-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 focus:outline-none transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
