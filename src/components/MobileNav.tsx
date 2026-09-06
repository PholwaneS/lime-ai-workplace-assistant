import { type ViewKey, type ActivityItem } from '@/types';
import { NAV_ITEMS } from './Sidebar';
import { Sparkles, AlertTriangle, X } from 'lucide-react';

interface MobileNavProps {
  current: ViewKey;
  onNavigate: (key: ViewKey) => void;
  open: boolean;
  onClose: () => void;
  activities: ActivityItem[];
}

export function MobileNav({ current, onNavigate, open, onClose, activities }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <aside className="relative w-72 bg-navy-900 text-navy-100 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-5 h-16 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">LIME AI</h1>
              <p className="text-xs text-navy-400">Workplace Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-navy-400 hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                  active ? 'bg-teal-500 text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {item.icon}
                <div className="text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className={`text-xs ${active ? 'text-teal-50' : 'text-navy-500'}`}>{item.description}</p>
                </div>
              </button>
            );
          })}
        </nav>
        {activities.length > 0 && (
          <div className="px-4 py-3 border-t border-navy-800">
            <p className="text-xs font-semibold text-navy-400 uppercase mb-2">Recent Activity</p>
            <div className="space-y-1.5 max-h-24 overflow-y-auto scrollbar-thin">
              {activities.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onNavigate(a.module);
                    onClose();
                  }}
                  className="w-full text-left text-xs text-navy-400 hover:text-teal-300 truncate block"
                >
                  {a.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="px-4 py-3 border-t border-navy-800">
          <div className="flex items-start gap-2 rounded-lg bg-amber-900/30 border border-amber-700/40 px-3 py-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/90 leading-snug">
              AI content may contain errors. Verify before use. No passwords or confidential info.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
