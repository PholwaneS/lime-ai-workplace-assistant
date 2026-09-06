import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { SectionTitle, Toggle } from '@/components/ui/Toggle';
import { CopyButton } from '@/components/ui/CopyButton';
import { AIDisclaimer, AILabel, EmptyState, Spinner, Badge } from '@/components/ui/Feedback';
import { type PlannedSlot, type TaskPlanInput } from '@/lib/mockAI';
import { createTaskPlan } from '@/lib/ai';
import { downloadText } from '@/lib/utils';
import { CalendarCheck, Sparkles, Trash2, Plus, Download, AlertTriangle, Clock, Flag } from 'lucide-react';

interface TaskForm {
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  hoursNeeded: number;
  isTender: boolean;
}

interface Props {
  onActivity: (title: string, detail: string) => void;
}

export function TaskPlanner({ onActivity }: Props) {
  const [tasks, setTasks] = useState<TaskForm[]>([
    { title: '', deadline: '', priority: 'medium', hoursNeeded: 2, isTender: false },
  ]);
  const [workingHours, setWorkingHours] = useState(8);
  const [planType, setPlanType] = useState<'daily' | 'weekly'>('weekly');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlannedSlot[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const addTask = () => {
    setTasks([...tasks, { title: '', deadline: '', priority: 'medium', hoursNeeded: 2, isTender: false }]);
  };

  const updateTask = (idx: number, field: keyof TaskForm, value: string | number | boolean) => {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  const removeTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setPlan([]);
    setCompleted(new Set());
    const input: TaskPlanInput = {
      tasks: tasks.filter((t) => t.title.trim()),
      workingHoursPerDay: workingHours,
      planType,
    };
    const result = await createTaskPlan(input);
    setPlan(result);
    setLoading(false);
    onActivity('Task plan generated', `${planType} plan • ${result.length} slots`);
  };

  const toggleComplete = (key: string) => {
    const next = new Set(completed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCompleted(next);
  };

  const handleDownload = () => {
    const text = plan.map((s) =>
      `[${s.day}] ${s.task} — ${s.hours}h, ${s.priority} priority${s.isTender ? ' [TENDER]' : ''}`
    ).join('\n');
    downloadText('task-plan.txt', text);
  };

  const priorityColor: Record<string, 'red' | 'amber' | 'green'> = {
    high: 'red',
    medium: 'amber',
    low: 'green',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div>
        <SectionTitle
          icon={<CalendarCheck className="w-5 h-5" />}
          title="AI Task Planner"
          description="Add tasks, set priorities, and generate a schedule"
        />
        <Card>
          <CardBody className="space-y-4">
            {/* Plan settings */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Working hours/day"
                type="number"
                min={1}
                max={16}
                value={workingHours}
                onChange={(e) => setWorkingHours(Number(e.target.value))}
              />
              <Select
                label="Plan type"
                value={planType}
                onChange={(e) => setPlanType(e.target.value as 'daily' | 'weekly')}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Select>
            </div>

            {/* Tasks list */}
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div key={idx} className="rounded-lg border border-navy-200 dark:border-navy-800 p-3 space-y-2.5 bg-navy-50/30 dark:bg-navy-950/30">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Task title..."
                      value={task.title}
                      onChange={(e) => updateTask(idx, 'title', e.target.value)}
                      className="flex-1"
                    />
                    {tasks.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeTask(idx)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="date"
                      value={task.deadline}
                      onChange={(e) => updateTask(idx, 'deadline', e.target.value)}
                    />
                    <Select
                      value={task.priority}
                      onChange={(e) => updateTask(idx, 'priority', e.target.value)}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                    <Input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={task.hoursNeeded}
                      onChange={(e) => updateTask(idx, 'hoursNeeded', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle
                      checked={task.isTender}
                      onChange={(v) => updateTask(idx, 'isTender', v)}
                      label="Tender task"
                    />
                    <span className="text-xs text-navy-500 dark:text-navy-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" /> Tender closing date
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={addTask} className="w-full">
              <Plus className="w-4 h-4" /> Add Task
            </Button>

            <Button onClick={handleGenerate} disabled={loading || tasks.every((t) => !t.title.trim())} className="w-full">
              {loading ? <><Spinner className="w-4 h-4" /> Planning...</> : <><Sparkles className="w-4 h-4" /> Generate {planType === 'daily' ? 'Daily' : 'Weekly'} Plan</>}
            </Button>
          </CardBody>
        </Card>
      </div>

      <div>
        <SectionTitle title="Generated Schedule" description="Prioritised schedule with completion tracking" />
        <Card className="min-h-[400px]">
          <CardBody>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner className="w-8 h-8 text-teal-500" />
                <p className="text-sm text-navy-400 mt-3">Creating your schedule...</p>
              </div>
            )}
            {!loading && plan.length === 0 && (
              <EmptyState
                icon={<CalendarCheck className="w-7 h-7" />}
                title="No schedule yet"
                description="Add your tasks and click Generate to create a prioritised schedule."
              />
            )}
            {!loading && plan.length > 0 && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <AILabel />
                  <div className="flex items-center gap-1">
                    <CopyButton text={plan.map((s) => `[${s.day}] ${s.task} — ${s.hours}h`).join('\n')} />
                    <Button size="sm" variant="ghost" onClick={handleDownload}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Group by day */}
                {Array.from(new Set(plan.map((s) => s.day))).map((day) => (
                  <div key={day}>
                    <h4 className="text-sm font-semibold text-navy-700 dark:text-navy-200 mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-teal-500" /> {day}
                    </h4>
                    <div className="space-y-2">
                      {plan.filter((s) => s.day === day).map((slot, i) => {
                        const key = `${day}-${i}`;
                        const isDone = completed.has(key);
                        return (
                          <button
                            key={key}
                            onClick={() => toggleComplete(key)}
                            className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                              isDone
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                                : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-800 hover:border-teal-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                              isDone ? 'bg-green-500 border-green-500' : 'border-navy-300 dark:border-navy-600'
                            }`}>
                              {isDone && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isDone ? 'line-through text-navy-400' : 'text-navy-800 dark:text-navy-100'}`}>
                                {slot.task}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <Badge variant={priorityColor[slot.priority]}>
                                  <Flag className="w-3 h-3" /> {slot.priority}
                                </Badge>
                                <Badge variant="navy">{slot.hours}h</Badge>
                                {slot.isTender && <Badge variant="red"><AlertTriangle className="w-3 h-3" /> Tender</Badge>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between text-xs text-navy-400 pt-2 border-t border-navy-100 dark:border-navy-800">
                  <span>{completed.size} of {plan.length} completed</span>
                  <div className="w-32 h-2 rounded-full bg-navy-100 dark:bg-navy-800 overflow-hidden">
                    <div className="h-full bg-teal-500 transition-all" style={{ width: `${(completed.size / plan.length) * 100}%` }} />
                  </div>
                </div>

                <AIDisclaimer />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
