export type ViewKey =
  | 'dashboard'
  | 'email'
  | 'notes'
  | 'planner'
  | 'research'
  | 'chatbot';

export interface ActivityItem {
  id: string;
  module: ViewKey;
  title: string;
  detail: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface TaskItem {
  id: string;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  hoursNeeded: number;
  completed: boolean;
  isTender?: boolean;
}
