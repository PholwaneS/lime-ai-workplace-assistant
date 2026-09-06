import { type ReactNode } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${checked ? 'bg-teal-500' : 'bg-navy-300 dark:bg-navy-700'}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

interface SectionTitleProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function SectionTitle({ icon, title, description }: SectionTitleProps) {
  return (
    <div className="flex items-start gap-3 mb-6">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-navy-900 dark:text-navy-50">{title}</h2>
        {description && <p className="text-sm text-navy-400 dark:text-navy-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
