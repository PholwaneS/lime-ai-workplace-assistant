import { type ViewKey, type ActivityItem } from '@/types';
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck,
  Search,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
  Sparkles,
  Clock,
} from 'lucide-react';
import { type ReactNode } from 'react';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: ReactNode;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, description: 'Overview & recent activity' },
  { key: 'email', label: 'Email Generator', icon: <Mail className="w-5 h-5" />, description: 'Draft professional emails' },
  { key: 'notes', label: 'Meeting Notes', icon: <FileText className="w-5 h-5" />, description: 'Summarise & extract actions' },
  { key: 'planner', label: 'Task Planner', icon: <CalendarCheck className="w-5 h-5" />, description: 'Plan tasks & schedules' },
  { key: 'research', label: 'Research Assistant', icon: <Search className="w-5 h-5" />, description: 'Analyse topics & tenders' },
  { key: 'chatbot', label: 'AI Chatbot', icon: <MessageSquare className="w-5 h-5" />, description: 'Ask workplace questions' },
];

interface SidebarProps {
  current: ViewKey;
  onNavigate: (key: ViewKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activities: ActivityItem[];
}

export function Sidebar({ current, onNavigate, collapsed, onToggleCollapse, activities }: SidebarProps) {
  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-72'} shrink-0 bg-navy-900 dark:bg-navy-950 text-navy-100 flex flex-col transition-all duration-300 ease-in-out border-r border-navy-800 hidden md:flex`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0 border-b border-navy-800">
        <div className="w-9 h-9 rounded-lg bg-[#E8DFD0] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#171717]" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-white text-lg leading-tight whitespace-nowrap">LIME AI</h1>
            <p className="text-xs text-navy-400 whitespace-nowrap">Workplace Assistant</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-2 px-5 py-3 text-navy-400 hover:text-white hover:bg-navy-800 transition-colors text-sm"
      >
        {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group ${
                active
                  ? 'bg-[#E8DFD0] text-[#171717]'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium whitespace-nowrap">{item.label}</p>
                  <p className={`text-xs ${active ? 'text-navy-600' : 'text-navy-500'} truncate`}>{item.description}</p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Recent activity (collapsed hides) */}
      {!collapsed && activities.length > 0 && (
        <div className="px-4 py-3 border-t border-navy-800">
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Recent Activity
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
            {activities.slice(0, 4).map((a) => (
              <button
                key={a.id}
                onClick={() => onNavigate(a.module)}
                className="w-full text-left text-xs text-navy-400 hover:text-teal-300 truncate block transition-colors"
              >
                {a.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI disclaimer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-navy-800">
          <div className="flex items-start gap-2 rounded-lg bg-amber-900/30 border border-amber-700/40 px-3 py-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/90 leading-snug">
              AI-generated content may contain errors. Always verify before use. Do not enter passwords or confidential info.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
