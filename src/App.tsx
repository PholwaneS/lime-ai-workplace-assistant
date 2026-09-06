import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { MobileNav } from '@/components/MobileNav';
import { Dashboard } from '@/modules/Dashboard';
import { EmailGenerator } from '@/modules/EmailGenerator';
import { MeetingSummarizer } from '@/modules/MeetingSummarizer';
import { TaskPlanner } from '@/modules/TaskPlanner';
import { ResearchAssistant } from '@/modules/ResearchAssistant';
import { Chatbot } from '@/modules/Chatbot';
import { type ViewKey, type ActivityItem } from '@/types';

function AppContent() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const addActivity = (module: ViewKey, title: string, detail: string) => {
    setActivities((prev) => [
      { id: crypto.randomUUID(), module, title, detail, timestamp: Date.now() },
      ...prev,
    ].slice(0, 20));
  };

  const handleNavigate = (key: ViewKey) => {
    setView(key);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={setView} activities={activities} />;
      case 'email':
        return <EmailGenerator onActivity={(t, d) => addActivity('email', t, d)} />;
      case 'notes':
        return <MeetingSummarizer onActivity={(t, d) => addActivity('notes', t, d)} />;
      case 'planner':
        return <TaskPlanner onActivity={(t, d) => addActivity('planner', t, d)} />;
      case 'research':
        return <ResearchAssistant onActivity={(t, d) => addActivity('research', t, d)} />;
      case 'chatbot':
        return <Chatbot onActivity={(t, d) => addActivity('chatbot', t, d)} />;
      default:
        return <Dashboard onNavigate={setView} activities={activities} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-navy-50 dark:bg-navy-950">
      <Sidebar
        current={view}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activities={activities}
      />
      <MobileNav
        current={view}
        onNavigate={handleNavigate}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        activities={activities}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar current={view} onMobileMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
