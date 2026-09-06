import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/Toggle';
import { CopyButton } from '@/components/ui/CopyButton';
import { AIDisclaimer, AILabel, EmptyState, Spinner, Badge } from '@/components/ui/Feedback';
import { summarizeMeeting, withDelay, type MeetingSummary } from '@/lib/mockAI';
import { downloadText } from '@/lib/utils';
import { FileText, Sparkles, Download, Trash2, CheckCircle2, ListTodo, Users, Calendar, ClipboardList, Edit3, Check } from 'lucide-react';

const SAMPLE_NOTES = `Meeting: Weekly Project Sync
Date: 2026-09-04

Attendees: Sarah, Mike, James, Priya

Sarah reported that the foundation work is 80% complete and on track.
Agreed that the concrete pour will happen next Tuesday.
Mike will follow up with the supplier by Friday to confirm delivery.
James raised a safety concern about scaffolding on the north side.
Decided to halt work on north side until inspection is completed.
Priya will schedule the inspection by Wednesday.
Agreed to submit the tender documents by September 20th.
Action: Mike to send updated cost estimate to client by Monday.
Action: Priya to prepare tender compliance checklist before September 15th.
James will coordinate with the safety officer this week.`;

interface Props {
  onActivity: (title: string, detail: string) => void;
}

export function MeetingSummarizer({ onActivity }: Props) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setEditing(false);
    const summary = summarizeMeeting(notes);
    const delayed = await withDelay(summary, 1200);
    setResult(delayed);
    setEditedSummary(delayed.summary);
    setLoading(false);
    onActivity('Meeting notes summarised', `${delayed.decisions.length} decisions, ${delayed.actionItems.length} action items`);
  };

  const handleSaveEdit = () => {
    if (result) {
      setResult({ ...result, summary: editedSummary });
    }
    setEditing(false);
  };

  const handleClear = () => {
    setNotes('');
    setResult(null);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = formatResultText(result);
    downloadText('meeting-summary.txt', text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div>
        <SectionTitle
          icon={<FileText className="w-5 h-5" />}
          title="Meeting Notes Summarizer"
          description="Paste your raw notes and extract key information"
        />
        <Card>
          <CardBody className="space-y-4">
            <Textarea
              label="Meeting Notes"
              placeholder="Paste your meeting notes here..."
              rows={14}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setNotes(SAMPLE_NOTES)}>
                Use sample notes
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleGenerate} disabled={loading || !notes.trim()}>
                  {loading ? <><Spinner className="w-4 h-4" /> Summarising...</> : <><Sparkles className="w-4 h-4" /> Generate Summary</>}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={loading}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div>
        <SectionTitle title="Summary & Extracted Info" description="Decisions, action items, owners and deadlines" />
        <Card className="min-h-[400px]">
          <CardBody>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner className="w-8 h-8 text-teal-500" />
                <p className="text-sm text-navy-400 mt-3">Analysing notes...</p>
              </div>
            )}
            {!loading && !result && (
              <EmptyState
                icon={<FileText className="w-7 h-7" />}
                title="No summary yet"
                description="Paste your meeting notes and click Generate to extract key information."
              />
            )}
            {!loading && result && (
              <div className="space-y-5 animate-slide-up">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <AILabel />
                  <div className="flex items-center gap-1">
                    {editing ? (
                      <Button size="sm" variant="primary" onClick={handleSaveEdit}>
                        <Check className="w-3.5 h-3.5" /> Save
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(true); setEditedSummary(result.summary); }}>
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Button>
                    )}
                    <CopyButton text={formatResultText(result)} />
                    <Button size="sm" variant="ghost" onClick={handleDownload}>
                      <Download className="w-3.5 h-3.5" /> Report
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-navy-50 dark:bg-navy-950 p-4 border border-navy-200 dark:border-navy-800">
                  <h4 className="text-sm font-semibold text-navy-700 dark:text-navy-200 mb-2 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-teal-500" /> Summary
                  </h4>
                  {editing ? (
                    <textarea
                      className="w-full rounded-lg border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-3 py-2.5 text-sm text-navy-900 dark:text-navy-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 focus:outline-none resize-y scrollbar-thin min-h-[100px]"
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">{result.summary}</p>
                  )}
                </div>

                {/* Decisions */}
                <div>
                  <h4 className="text-sm font-semibold text-navy-700 dark:text-navy-200 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" /> Decisions
                  </h4>
                  <ul className="space-y-1.5">
                    {result.decisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-navy-600 dark:text-navy-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div>
                  <h4 className="text-sm font-semibold text-navy-700 dark:text-navy-200 mb-2 flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-teal-500" /> Action Items
                  </h4>
                  <div className="space-y-2">
                    {result.actionItems.map((a, i) => (
                      <div key={i} className="rounded-lg border border-navy-200 dark:border-navy-800 p-3 bg-white dark:bg-navy-900">
                        <p className="text-sm text-navy-700 dark:text-navy-200 mb-2">{a.item}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="navy"><Users className="w-3 h-3" /> {a.person}</Badge>
                          <Badge variant="amber"><Calendar className="w-3 h-3" /> {a.deadline}</Badge>
                        </div>
                      </div>
                    ))}
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

function formatResultText(r: MeetingSummary): string {
  let text = '=== MEETING SUMMARY ===\n\n' + r.summary + '\n\n';
  text += '=== DECISIONS ===\n';
  r.decisions.forEach((d, i) => { text += `${i + 1}. ${d}\n`; });
  text += '\n=== ACTION ITEMS ===\n';
  r.actionItems.forEach((a, i) => { text += `${i + 1}. ${a.item}\n   Person: ${a.person}\n   Deadline: ${a.deadline}\n`; });
  return text;
}
