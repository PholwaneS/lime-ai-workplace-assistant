// Mock AI response engine — simulates realistic AI-generated content
// with artificial latency so the UI shows loading states naturally.

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withDelay<T>(value: T, ms = 1200): Promise<T> {
  await delay(ms);
  return value;
}

// ─── Email Generator ───────────────────────────────────────────────

export interface EmailInput {
  recipient: string;
  subject: string;
  purpose: string;
  details: string;
  tone: 'formal' | 'friendly' | 'persuasive' | 'follow-up';
}

export function generateEmail(input: EmailInput): string {
  const { recipient, subject, purpose, details, tone } = input;
  const recipientName = recipient || 'Team';
  const greeting =
    tone === 'formal' ? `Dear ${recipientName},`
    : tone === 'friendly' ? `Hi ${recipientName},`
    : tone === 'persuasive' ? `Hello ${recipientName},`
    : `Dear ${recipientName},`;

  const closing =
    tone === 'formal' ? 'Yours sincerely,\n\n[Your Name]'
    : tone === 'friendly' ? 'Best regards,\n\n[Your Name]'
    : tone === 'persuasive' ? 'Thank you for your consideration.\n\nKind regards,\n\n[Your Name]'
    : 'Thank you for your attention.\n\nBest regards,\n\n[Your Name]';

  const body = buildEmailBody(purpose, details, tone);

  return `Subject: ${subject || 'Workplace correspondence'}

${greeting}

${body}

${closing}`;
}

function buildEmailBody(purpose: string, details: string, tone: string): string {
  const p = purpose || 'the matter at hand';
  const d = details || 'as discussed in our previous communication';

  if (tone === 'follow-up') {
    return `I hope this message finds you well. I am writing to follow up on ${p}. ${d}

I would appreciate an update at your earliest convenience. If there is any additional information you require from my side, please do not hesitate to ask.

Could we schedule a brief call this week to discuss the next steps? I am available on Tuesday or Thursday afternoon.`;
  }

  if (tone === 'persuasive') {
    return `I am writing to you regarding ${p}. ${d}

This is a time-sensitive opportunity that I believe aligns strongly with our shared objectives. Acting promptly will allow us to maximise the benefits and stay ahead of competing priorities.

I have outlined the key advantages below:
  • Clear alignment with our strategic goals
  • Measurable impact within the current quarter
  • Minimal resource commitment relative to the expected return

I would welcome the chance to discuss this further at a time that suits you.`;
  }

  if (tone === 'friendly') {
    return `Just reaching out about ${p}. ${d}

No rush on this one — I just wanted to keep you in the loop and make sure we're on the same page. Let me know what you think when you get a moment, and happy to jump on a quick call if that's easier.

Thanks for taking the time to look at this!`;
  }

  return `I am writing to formally communicate ${p}. ${d}

Please review the information provided and advise on any further action required. Should you need clarification on any point, I am available to discuss at your convenience.

I look forward to your response and am happy to provide any supplementary documentation that may assist.`;
}

// ─── Meeting Notes Summarizer ──────────────────────────────────────

export interface MeetingSummary {
  summary: string;
  decisions: string[];
  actionItems: { item: string; person: string; deadline: string }[];
}

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const DAYS = 'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday';

function detectDeadline(line: string): string {
  // "by/before/due" + date phrase
  let m = line.match(
    new RegExp(
      `\\b(?:by|before|due)\\s+((?:next|this)\\s+(?:week|month|${DAYS})|${MONTHS}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s+\\d{4})?|\\d{1,2}(?:st|nd|rd|th)?\\s+${MONTHS}(?:\\s+\\d{4})?|${DAYS})`,
      'i',
    ),
  );
  if (m) return m[1];

  // "next Tuesday" / "this Friday" / "this week"
  m = line.match(new RegExp(`\\b((?:next|this)\\s+(?:week|month|${DAYS}))\\b`, 'i'));
  if (m) return m[1];

  // "September 15th" / "20 September 2026"
  m = line.match(
    new RegExp(
      `\\b(${MONTHS}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s+\\d{4})?|\\d{1,2}(?:st|nd|rd|th)?\\s+${MONTHS}(?:\\s+\\d{4})?)`,
      'i',
    ),
  );
  if (m) return m[1];

  return 'Not specified';
}

function detectPerson(line: string): string {
  // After "Action:" label — first capitalised word is the owner
  const actionMatch = line.match(/^\s*action\s*:\s*([A-Z][a-z]+)/i);
  if (actionMatch) return actionMatch[1];

  // "[Name] will ..." pattern
  const willMatch = line.match(/\b([A-Z][a-z]+)\s+will\b/);
  if (willMatch) return willMatch[1];

  return 'Unassigned';
}

function cleanItemText(line: string): string {
  return line
    .replace(/^[-•*]\s*/, '')
    .replace(/^\s*action\s*:\s*/i, '');
}

export function summarizeMeeting(notes: string): MeetingSummary {
  const lines = notes
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const decisions: string[] = [];
  const actionItems: { item: string; person: string; deadline: string }[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const stripped = line.replace(/^[-•*]\s*/, '');
    const isDecision = lower.includes('agreed') || lower.includes('decided') || lower.includes('approved');
    const isAgreedOrDecided = /^(agreed|decided)\b/i.test(stripped);

    // Action item detection
    const isActionLabel = /^\s*action\s*:/i.test(stripped);
    const hasWillPattern = /\b([A-Z][a-z]+)\s+will\b/.test(line);
    const hasFollowUp = /to\s+follow\s+up/i.test(line);
    const hasResponsible = /\bresponsible\b/i.test(line);

    if (isDecision) {
      decisions.push(stripped.replace(/^(agreed|decided|approved)\s*(that|to|on)?\s*/i, ''));
    }

    // Determine if this line is an action item
    let isActionItem = false;
    if (isActionLabel) {
      isActionItem = true;
    } else if (!isAgreedOrDecided && (hasWillPattern || hasFollowUp || hasResponsible)) {
      isActionItem = true;
    } else if (isAgreedOrDecided && hasWillPattern) {
      isActionItem = true;
    }

    if (isActionItem) {
      const person = detectPerson(line);
      const deadline = detectDeadline(line);
      const item = cleanItemText(line);
      actionItems.push({ item, person, deadline });
    }
  }

  if (decisions.length === 0) {
    decisions.push('No explicit decisions were detected — please review the notes manually.');
  }
  if (actionItems.length === 0) {
    actionItems.push({ item: 'Review meeting notes and assign follow-up tasks', person: 'Unassigned', deadline: 'Not specified' });
  }

  const summary = `This meeting covered ${lines.length} key points. The discussion centred on project progress, resource allocation, and upcoming deadlines. ${decisions.length} decision(s) were formally recorded and ${actionItems.length} action item(s) were assigned with specific owners and target dates. Participants agreed to review outstanding items before the next scheduled meeting.`;

  return { summary, decisions, actionItems };
}

// ─── Task Planner ──────────────────────────────────────────────────

export interface TaskPlanInput {
  tasks: { title: string; deadline: string; priority: 'high' | 'medium' | 'low'; hoursNeeded: number; isTender?: boolean }[];
  workingHoursPerDay: number;
  planType: 'daily' | 'weekly';
}

export interface PlannedSlot {
  task: string;
  priority: 'high' | 'medium' | 'low';
  hours: number;
  day: string;
  isTender: boolean;
}

export function generatePlan(input: TaskPlanInput): PlannedSlot[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...input.tasks].sort((a, b) => {
    const p = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (p !== 0) return p;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const days = input.planType === 'daily'
    ? ['Today']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const slots: PlannedSlot[] = [];
  let dayIdx = 0;
  let hoursLeft = input.workingHoursPerDay;

  for (const task of sorted) {
    let hoursNeeded = task.hoursNeeded;
    while (hoursNeeded > 0 && dayIdx < days.length) {
      const alloc = Math.min(hoursNeeded, hoursLeft);
      slots.push({
        task: task.title,
        priority: task.priority,
        hours: alloc,
        day: days[dayIdx],
        isTender: task.isTender || false,
      });
      hoursNeeded -= alloc;
      hoursLeft -= alloc;
      if (hoursLeft <= 0) {
        dayIdx++;
        hoursLeft = input.workingHoursPerDay;
      }
    }
  }

  return slots;
}

// ─── Research Assistant ────────────────────────────────────────────

export interface ResearchResult {
  summary: string;
  keyFindings: string[];
  risks: string[];
  recommendations: string[];
}

export function generateResearch(topic: string): ResearchResult {
  const t = topic || 'the requested topic';

  return {
    summary: `Based on the information provided regarding ${t}, the research indicates a moderately favourable outlook with several factors warranting closer attention. The available data suggests consistent patterns, though some gaps remain that would benefit from further verification. Overall, the findings support a cautious but proactive approach.`,
    keyFindings: [
      `The subject of ${t} shows alignment with current industry standards and regulatory expectations.`,
      `Historical data indicates a 15-20% variance in outcomes depending on execution methodology.`,
      `Key stakeholders have expressed moderate confidence, with reservations around timeline commitments.`,
      `Comparable projects in the same sector have achieved target milestones within expected parameters.`,
    ],
    risks: [
      `Timeline pressure may compromise quality if mitigation strategies are not in place early.`,
      `Regulatory changes could affect compliance requirements — monitor for updates before submission.`,
      `Resource availability constraints may impact delivery schedules during peak periods.`,
      `Cost overruns have been observed in similar projects where scope was not clearly defined upfront.`,
    ],
    recommendations: [
      `Conduct a detailed feasibility assessment before committing to the proposed timeline.`,
      `Engage legal counsel to review all compliance-related documentation prior to submission.`,
      `Establish a contingency budget of 10-15% to address potential scope changes.`,
      `Schedule weekly progress reviews with all responsible parties for the duration of the project.`,
    ],
  };
}

// ─── Chatbot ───────────────────────────────────────────────────────

export function generateChatResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('tender') || lower.includes('bid') || lower.includes('proposal')) {
    return `When it comes to tenders, here are the key things to keep in mind:

1. **Submission deadline** — Always confirm the exact date and time, including the timezone. Late submissions are typically rejected without review.

2. **Compliance requirements** — Check that all mandatory forms are included and signed. Missing a single document can disqualify an otherwise strong bid.

3. **Evaluation criteria** — Review the weighting of price vs. technical merit so you can allocate your effort accordingly.

4. **Financial capacity** — Ensure your pricing covers all costs while remaining competitive. A margin analysis is recommended.

Would you like me to help you draft a specific section of your tender response?`;
  }

  if (lower.includes('meeting') || lower.includes('agenda') || lower.includes('minutes')) {
    return `For effective meetings, I'd suggest:

• Start with a clear agenda circulated at least 24 hours in advance
• Assign a note-taker to capture decisions and action items
• Keep discussions time-boxed — use a timer if needed
• End with a recap of who is doing what by when
• Send follow-up notes within 24 hours while memory is fresh

Would you like me to generate a meeting agenda template or summarise some notes for you?`;
  }

  if (lower.includes('email')) {
    return `I can help you draft professional emails. To get the best result, let me know:

• Who is the recipient?
• What is the purpose of the email?
• What tone would you like — formal, friendly, persuasive, or follow-up?
• Any key details that must be included?

You can also use the Smart Email Generator module from the sidebar for a more structured approach.`;
  }

  if (lower.includes('task') || lower.includes('schedule') || lower.includes('plan')) {
    return `For task planning, I recommend breaking down your work into these categories:

1. **Urgent & important** — Do these first (high priority, near deadline)
2. **Important but not urgent** — Schedule dedicated time blocks
3. **Urgent but not important** — Delegate if possible
4. **Neither** — Consider dropping or deferring

For tender-related tasks, always work backwards from the submission deadline and build in a 2-3 day buffer for final review.

Would you like me to help create a structured schedule? Use the AI Task Planner module for a full plan.`;
  }

  if (lower.includes('construction') || lower.includes('site') || lower.includes('safety')) {
    return `In construction and site management, key priorities include:

• **Safety first** — Ensure all site inductions and risk assessments are current
• **Programme management** — Track critical path activities closely
• **Quality control** — Schedule inspections at key hold points
• **Documentation** — Keep records of variations, RFIs, and site instructions
• **Compliance** — Verify all certifications and permits are valid before work commences

Is there a specific construction-related question I can help with?`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! I'm your LIME AI workplace assistant. I can help you with:

• Drafting professional emails
• Summarising meeting notes
• Planning tasks and schedules
• Researching topics and tenders
• General workplace, construction, and tender-related questions

What can I help you with today?`;
  }

  return `That's a great question. Here's what I'd suggest:

Based on the context of your query, I'd recommend breaking the problem into smaller, manageable parts and addressing each systematically. If you can provide a bit more detail about your specific situation, I can give you more targeted guidance.

In the meantime, you can also try these modules from the sidebar:
• **Smart Email Generator** — for drafting communications
• **Meeting Notes Summarizer** — for condensing notes
• **AI Task Planner** — for scheduling work
• **AI Research Assistant** — for deeper analysis

Is there anything specific you'd like me to elaborate on?`;
}
