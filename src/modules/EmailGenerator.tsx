import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/Toggle';
import { CopyButton } from '@/components/ui/CopyButton';
import { AIDisclaimer, AILabel, EmptyState, Spinner } from '@/components/ui/Feedback';
import { type EmailInput } from '@/lib/mockAI';
import { createEmail } from '@/lib/ai';
import { downloadText } from '@/lib/utils';
import { Mail, Sparkles, RefreshCw, Download, Trash2, Edit3, Check } from 'lucide-react';

interface Props {
  onActivity: (title: string, detail: string) => void;
}

export function EmailGenerator({ onActivity }: Props) {
  const [form, setForm] = useState<EmailInput>({
    recipient: '',
    subject: '',
    purpose: '',
    details: '',
    tone: 'formal',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    const email = await createEmail(form);
    setResult(email);
    setEdited(email);
    setLoading(false);
    onActivity('Email generated', `To: ${form.recipient || '—'} • ${form.tone} tone`);
  };

  const handleSaveEdit = () => {
    setResult(edited);
    setEditing(false);
  };

  const handleClear = () => {
    setForm({ recipient: '', subject: '', purpose: '', details: '', tone: 'formal' });
    setResult('');
    setEdited('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Input side */}
      <div>
        <SectionTitle
          icon={<Mail className="w-5 h-5" />}
          title="Smart Email Generator"
          description="Fill in the details and generate a professional email"
        />
        <Card>
          <CardBody className="space-y-4">
            <Input
              label="Recipient"
              placeholder="e.g. John Smith, Procurement Team"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
            <Input
              label="Subject"
              placeholder="e.g. Project Update — Q3 Milestones"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Input
              label="Purpose"
              placeholder="e.g. Request approval for budget revision"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
            <Textarea
              label="Important Details"
              placeholder="Include any key points, dates, or context that should appear in the email..."
              rows={4}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
            <Select
              label="Tone"
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value as EmailInput['tone'] })}
            >
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
              <option value="persuasive">Persuasive</option>
              <option value="follow-up">Follow-up</option>
            </Select>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleGenerate} disabled={loading} className="flex-1">
                {loading ? <><Spinner className="w-4 h-4" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Email</>}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={loading}>
                <Trash2 className="w-4 h-4" /> Clear
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Output side */}
      <div>
        <SectionTitle title="Generated Email" description="Review, edit, copy, or download the result" />
        <Card className="min-h-[400px]">
          <CardBody>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner className="w-8 h-8 text-teal-500" />
                <p className="text-sm text-navy-400 mt-3">Drafting your email...</p>
              </div>
            )}
            {!loading && !result && (
              <EmptyState
                icon={<Mail className="w-7 h-7" />}
                title="No email generated yet"
                description="Fill in the form and click Generate to create a professional email."
              />
            )}
            {!loading && result && (
              <div className="space-y-3 animate-slide-up">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <AILabel />
                  <div className="flex items-center gap-1">
                    {editing ? (
                      <Button size="sm" variant="primary" onClick={handleSaveEdit}>
                        <Check className="w-3.5 h-3.5" /> Save
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(true); setEdited(result); }}>
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={handleGenerate}>
                      <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                    </Button>
                    <CopyButton text={result} />
                    <Button size="sm" variant="ghost" onClick={() => downloadText('email.txt', result)}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {editing ? (
                  <textarea
                    className="w-full rounded-lg border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-4 py-3 text-sm font-mono text-navy-900 dark:text-navy-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 focus:outline-none resize-y scrollbar-thin min-h-[300px]"
                    value={edited}
                    onChange={(e) => setEdited(e.target.value)}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-navy-800 dark:text-navy-100 leading-relaxed bg-navy-50 dark:bg-navy-950 rounded-lg p-4 border border-navy-200 dark:border-navy-800 min-h-[300px]">
                    {result}
                  </pre>
                )}
                <AIDisclaimer />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
