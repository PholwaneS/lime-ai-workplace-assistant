import { type ViewKey, type ActivityItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge, AIDisclaimer } from '@/components/ui/Feedback';
import { NAV_ITEMS } from '@/components/Sidebar';
import { Mail, FileText, CalendarCheck, Search, MessageSquare, ArrowRight, Activity, Clock, Sparkles } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface DashboardProps {
  onNavigate: (key: ViewKey) => void;
  activities: ActivityItem[];
}

const MODULE_ICONS: Record<string, typeof Mail> = {
  email: Mail,
  notes: FileText,
  planner: CalendarCheck,
  research: Search,
  chatbot: MessageSquare,
};

export function Dashboard({ onNavigate, activities }: DashboardProps) {
  const moduleCards = NAV_ITEMS.filter((n) => n.key !== 'dashboard');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <Card className="overflow-hidden">
        <div className="relative bg-navy-900 px-6 py-8 md:px-8 md:py-10">
          <div className="relative">
            <Badge variant="teal">
              <Sparkles className="w-3 h-3" /> AI Workplace Productivity
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-2">
              Welcome to LIME AI Workplace Assistant
            </h2>
            <p className="text-navy-300 max-w-2xl text-sm md:text-base">
              Your all-in-one platform for drafting emails, summarising meetings, planning tasks,
              researching topics, and getting instant workplace answers — all powered by AI.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={() => onNavigate('email')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#E8DFD0] hover:bg-[#D8CAB5] px-4 py-2.5 text-sm font-medium text-[#171717] transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('chatbot')}
                className="inline-flex items-center gap-2 rounded-lg border border-navy-600 bg-transparent hover:bg-navy-800 px-4 py-2.5 text-sm font-medium text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Ask AI Assistant
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Module cards */}
      <div>
        <h3 className="text-sm font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wide mb-3">
          Productivity Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {moduleCards.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="group text-left"
            >
              <Card className="h-full hover:shadow-md hover:border-navy-400 dark:hover:border-navy-600 transition-all duration-200 group-hover:-translate-y-0.5">
                <div className="p-5">
                  <div className="w-11 h-11 rounded-lg bg-[#E8DFD0] dark:bg-navy-700 flex items-center justify-center text-navy-900 dark:text-[#E8DFD0] mb-3 transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-navy-900 dark:text-navy-50 text-sm mb-1">{item.label}</h4>
                  <p className="text-xs text-navy-400 dark:text-navy-500 leading-snug">{item.description}</p>
                </div>
                <div className="px-5 py-2.5 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
                  Open module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-navy-200 dark:border-navy-800">
            <h3 className="font-semibold text-navy-900 dark:text-navy-50 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-teal-500" /> Recent Activity
            </h3>
          </div>
          <div className="p-4">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="w-10 h-10 text-navy-300 dark:text-navy-700 mb-2" />
                <p className="text-sm text-navy-400 dark:text-navy-500">No activity yet. Start using a module to see your history here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activities.map((a) => {
                  const Icon = MODULE_ICONS[a.module] ?? Activity;
                  return (
                    <button
                      key={a.id}
                      onClick={() => onNavigate(a.module)}
                      className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-800 dark:text-navy-100 truncate">{a.title}</p>
                        <p className="text-xs text-navy-400 dark:text-navy-500 truncate">{a.detail}</p>
                      </div>
                      <span className="text-xs text-navy-400 dark:text-navy-500 shrink-0">{formatTime(a.timestamp)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-navy-200 dark:border-navy-800">
            <h3 className="font-semibold text-navy-900 dark:text-navy-50">Quick Stats</h3>
          </div>
          <div className="p-5 space-y-4">
            <StatRow label="Modules Available" value="5" />
            <StatRow label="Recent Generations" value={String(activities.length)} />
            <StatRow label="AI Status" value="Prototype" highlight />
            <div className="pt-3 border-t border-navy-100 dark:border-navy-800">
              <AIDisclaimer variant="compact" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-navy-500 dark:text-navy-400">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-teal-600 dark:text-teal-400' : 'text-navy-800 dark:text-navy-100'}`}>
        {value}
      </span>
    </div>
  );
}
