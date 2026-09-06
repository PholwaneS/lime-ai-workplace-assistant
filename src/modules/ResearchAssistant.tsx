import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/Toggle';
import { CopyButton } from '@/components/ui/CopyButton';
import { AIDisclaimer, AILabel, EmptyState, Spinner, Badge, Alert } from '@/components/ui/Feedback';
import { generateResearch, withDelay, type ResearchResult } from '@/lib/mockAI';
import { downloadText } from '@/lib/utils';
import { Search, Sparkles, Download, Trash2, CheckCircle2, AlertTriangle, Lightbulb, FileSearch, ShieldCheck } from 'lucide-react';

interface Props {
  onActivity: (title: string, detail: string) => void;
}

export function ResearchAssistant({ onActivity }: Props) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const research = generateResearch(topic);
    const delayed = await withDelay(research, 1400);
    setResult(delayed);
    setLoading(false);
    onActivity('Research generated', topic.slice(0, 50) || '—');
  };

  const handleDownload = () => {
    if (!result) return;
    downloadText('research-report.txt', formatText(result, topic));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div>
        <SectionTitle
          icon={<Search className="w-5 h-5" />}
          title="AI Research Assistant"
          description="Analyse topics, articles, or tender information"
        />
        <Card>
          <CardBody className="space-y-4">
            <Textarea
              label="Topic / Article / Tender Information"
              placeholder="Enter a research topic, paste an article, or tender details..."
              rows={12}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Alert type="info">
              <strong>Tip:</strong> For tender research, include the tender reference, scope, and any deadlines for more relevant analysis.
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} disabled={loading || !topic.trim()} className="flex-1">
                {loading ? <><Spinner className="w-4 h-4" /> Researching...</> : <><Sparkles className="w-4 h-4" /> Generate Analysis</>}
              </Button>
              <Button variant="outline" onClick={() => { setTopic(''); setResult(null); }} disabled={loading}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <div>
        <SectionTitle title="Research Report" description="Summary, findings, risks & recommendations" />
        <Card className="min-h-[400px]">
          <CardBody>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner className="w-8 h-8 text-teal-500" />
                <p className="text-sm text-navy-400 mt-3">Conducting research...</p>
              </div>
            )}
            {!loading && !result && (
              <EmptyState
                icon={<Search className="w-7 h-7" />}
                title="No research yet"
                description="Enter a topic or paste tender information to generate an analysis."
              />
            )}
            {!loading && result && (
              <div className="space-y-5 animate-slide-up">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <AILabel />
                  <div className="flex items-center gap-1">
                    <CopyButton text={formatText(result, topic)} />
                    <Button size="sm" variant="ghost" onClick={handleDownload}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <Section icon={<FileSearch className="w-4 h-4 text-teal-500" />} title="Summary">
                  <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">{result.summary}</p>
                </Section>

                {/* Key Findings */}
                <Section icon={<CheckCircle2 className="w-4 h-4 text-teal-500" />} title="Key Findings">
                  <div className="space-y-2">
                    {result.keyFindings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Badge variant="green">Confirmed</Badge>
                        <p className="text-sm text-navy-600 dark:text-navy-300 flex-1">{f}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Risks */}
                <Section icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} title="Risks">
                  <div className="space-y-2">
                    {result.risks.map((r, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Badge variant="amber">Risk</Badge>
                        <p className="text-sm text-navy-600 dark:text-navy-300 flex-1">{r}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Recommendations */}
                <Section icon={<Lightbulb className="w-4 h-4 text-teal-500" />} title="Recommendations">
                  <div className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Badge variant="teal">AI Suggestion</Badge>
                        <p className="text-sm text-navy-600 dark:text-navy-300 flex-1">{r}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Confirmed vs AI label */}
                <div className="flex items-center gap-4 rounded-lg bg-navy-50 dark:bg-navy-950 p-3 border border-navy-200 dark:border-navy-800">
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-navy-600 dark:text-navy-300">Confirmed = from provided data</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                    <span className="text-navy-600 dark:text-navy-300">AI Suggestion = generated, verify before use</span>
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

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-navy-700 dark:text-navy-200 mb-2 flex items-center gap-1.5">
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function formatText(r: ResearchResult, topic: string): string {
  let text = `=== RESEARCH REPORT ===\nTopic: ${topic}\n\n`;
  text += `=== SUMMARY ===\n${r.summary}\n\n`;
  text += `=== KEY FINDINGS ===\n`;
  r.keyFindings.forEach((f, i) => { text += `${i + 1}. ${f}\n`; });
  text += `\n=== RISKS ===\n`;
  r.risks.forEach((r, i) => { text += `${i + 1}. ${r}\n`; });
  text += `\n=== RECOMMENDATIONS ===\n`;
  r.recommendations.forEach((r, i) => { text += `${i + 1}. ${r}\n`; });
  return text;
}
