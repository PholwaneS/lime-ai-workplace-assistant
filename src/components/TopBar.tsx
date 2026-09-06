import { type ViewKey } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, Sparkles } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

interface TopBarProps {
  current: ViewKey;
  onMobileMenu: () => void;
}

export function TopBar({ current, onMobileMenu }: TopBarProps) {
  const { theme, toggle } = useTheme();
  const item = NAV_ITEMS.find((n) => n.key === current);

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-navy-900 border-b border-navy-200 dark:border-navy-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenu}
          className="md:hidden p-2 rounded-lg text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base md:text-lg font-bold text-navy-900 dark:text-navy-50">{item?.label ?? 'Dashboard'}</h2>
          <p className="text-xs text-navy-400 dark:text-navy-500 hidden sm:block">{item?.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20">
          <Sparkles className="w-3.5 h-3.5" />
          Prototype Mode
        </div>
        <button
          onClick={toggle}
          className="p-2.5 rounded-lg text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-9 h-9 rounded-full bg-navy-200 dark:bg-navy-700 flex items-center justify-center text-sm font-semibold text-navy-600 dark:text-navy-200">
          You
        </div>
      </div>
    </header>
  );
}
