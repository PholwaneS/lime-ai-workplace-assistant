import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { AIDisclaimer, AILabel, LoadingDots, EmptyState } from '@/components/ui/Feedback';
import { createChatResponse } from '@/lib/ai';
import { type ChatMessage } from '@/types';
import { MessageSquare, Send, User, Bot, Trash2 } from 'lucide-react';

interface Props {
  onActivity: (title: string, detail: string) => void;
}

const SUGGESTIONS = [
  'How do I prepare a tender submission?',
  'Tips for running effective meetings',
  'Help me plan my tasks for the week',
  'What are key construction safety priorities?',
];

export function Chatbot({ onActivity }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await createChatResponse(content, [...messages, userMsg]);
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
    onActivity('Chatbot conversation', content.slice(0, 50));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900 dark:text-navy-50">AI Workplace Chatbot</h2>
            <p className="text-sm text-navy-400 dark:text-navy-500">Ask about workplace, construction, or tender topics</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4" /> Clear
          </Button>
        )}
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <EmptyState
                icon={<MessageSquare className="w-7 h-7" />}
                title="Start a conversation"
                description="Ask me anything about workplace tasks, construction, tenders, or general productivity."
              />
              <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-navy-200 dark:border-navy-700 px-4 py-2 text-sm text-navy-600 dark:text-navy-300 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-navy-200 dark:bg-navy-700 text-navy-600 dark:text-navy-200'
                  : 'bg-teal-500 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-navy-800 text-white dark:bg-navy-700'
                  : 'bg-navy-50 dark:bg-navy-900 border border-navy-200 dark:border-navy-800 text-navy-800 dark:text-navy-100'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="mb-1.5">
                    <AILabel />
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl bg-navy-50 dark:bg-navy-900 border border-navy-200 dark:border-navy-800 px-4 py-3">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-navy-200 dark:border-navy-800 p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-32 resize-none"
            />
            <Button onClick={() => handleSend()} disabled={!input.trim() || loading} className="self-end">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2">
            <AIDisclaimer variant="compact" />
          </div>
        </div>
      </Card>
    </div>
  );
}
