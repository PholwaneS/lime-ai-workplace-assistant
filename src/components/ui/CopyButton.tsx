import { type ReactNode, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'} ${className}`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

interface OutputPanelProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

export function OutputPanel({ children, title, actions }: OutputPanelProps) {
  return (
    <div className="rounded-xl border border-navy-200 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-950/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900">
        <h4 className="text-sm font-semibold text-navy-700 dark:text-navy-200">{title}</h4>
        <div className="flex items-center gap-1">{actions}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
