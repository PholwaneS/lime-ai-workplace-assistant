import {
  generateChatResponse,
  generateEmail,
  generatePlan,
  generateResearch,
  summarizeMeeting,
  type EmailInput,
  type MeetingSummary,
  type PlannedSlot,
  type ResearchResult,
  type TaskPlanInput,
} from '@/lib/mockAI';
import type { ChatMessage } from '@/types';

const apiUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isGeminiConfigured = Boolean(apiUrl && anonKey);

async function callGemini<T>(mode: string, input: unknown, fallback: () => T): Promise<T> {
  if (!isGeminiConfigured) return fallback();

  try {
    const response = await fetch(`${apiUrl}/functions/v1/gemini-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({ mode, input }),
    });

    if (!response.ok) throw new Error(`AI request failed (${response.status})`);
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error);
    return payload.data as T;
  } catch (error) {
    console.warn('Gemini unavailable; using the local prototype response.', error);
    return fallback();
  }
}

export function createEmail(input: EmailInput): Promise<string> {
  return callGemini('email', input, () => generateEmail(input));
}

export function createMeetingSummary(notes: string): Promise<MeetingSummary> {
  return callGemini('meeting', { notes }, () => summarizeMeeting(notes));
}

export function createTaskPlan(input: TaskPlanInput): Promise<PlannedSlot[]> {
  return callGemini('planner', input, () => generatePlan(input));
}

export function createResearch(topic: string): Promise<ResearchResult> {
  return callGemini('research', { topic }, () => generateResearch(topic));
}

export function createChatResponse(message: string, history: ChatMessage[]): Promise<string> {
  const compactHistory = history.slice(-8).map(({ role, content }) => ({ role, content }));
  return callGemini('chat', { message, history: compactHistory }, () => generateChatResponse(message));
}
