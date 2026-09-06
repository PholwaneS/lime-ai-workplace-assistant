const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_INPUT_CHARS = 18_000;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) return json({ error: 'Gemini is not configured.' }, 503);

    const body = await request.json();
    const mode = String(body?.mode ?? '');
    const input = body?.input;
    if (!['email', 'meeting', 'planner', 'research', 'chat'].includes(mode)) {
      return json({ error: 'Invalid AI mode.' }, 400);
    }

    const inputText = JSON.stringify(input ?? {});
    if (!inputText || inputText.length > MAX_INPUT_CHARS) {
      return json({ error: 'Input is empty or too long.' }, 400);
    }

    const { system, prompt, jsonOutput } = buildPrompt(mode, input);
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: mode === 'chat' ? 0.5 : 0.25,
            maxOutputTokens: mode === 'chat' ? 900 : 1600,
            ...(jsonOutput ? { responseMimeType: 'application/json' } : {}),
          },
        }),
      },
    );

    const gemini = await response.json();
    if (!response.ok) {
      console.error('Gemini request failed', response.status);
      return json({ error: 'The AI service is temporarily unavailable.' }, 502);
    }

    const text = gemini?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim();
    if (!text) return json({ error: 'The AI service returned an empty response.' }, 502);

    const data = jsonOutput ? JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')) : text;
    return json({ data });
  } catch (error) {
    console.error('AI function error', error instanceof Error ? error.message : 'Unknown error');
    return json({ error: 'Unable to generate a response.' }, 500);
  }
});

function buildPrompt(mode: string, input: unknown) {
  const shared = `You are LIME AI, a responsible workplace productivity assistant for South African professionals and construction tender teams. Use only the information supplied by the user for factual claims. Never invent tender requirements, dates, prices, laws, sources, people or commitments. Clearly state when information is missing. Keep outputs practical, professional and concise.`;

  if (mode === 'email') return {
    system: shared,
    jsonOutput: false,
    prompt: `Draft a complete professional email from this JSON: ${JSON.stringify(input)}. Respect the requested tone. Include a Subject line, greeting, concise body, clear requested action and professional closing. Do not invent names or dates.`,
  };

  if (mode === 'meeting') return {
    system: shared,
    jsonOutput: true,
    prompt: `Analyse these meeting notes: ${JSON.stringify(input)}. Return ONLY valid JSON with this exact shape: {"summary":"string","decisions":["string"],"actionItems":[{"item":"string","person":"string","deadline":"string"}]}. Preserve complete dates exactly. Use "Unassigned" when no owner is stated and "Not specified" when no deadline is stated. Do not classify a decision as an action unless a responsible person is explicitly assigned.`,
  };

  if (mode === 'planner') return {
    system: shared,
    jsonOutput: true,
    prompt: `Create a realistic schedule from this task-planning JSON: ${JSON.stringify(input)}. Return ONLY a valid JSON array with this exact item shape: {"task":"string","priority":"high|medium|low","hours":number,"day":"string","isTender":boolean}. Prioritise deadlines, high-priority work and tender tasks. Do not allocate more than the provided working hours per day.`,
  };

  if (mode === 'research') return {
    system: shared,
    jsonOutput: true,
    prompt: `Analyse the user-provided material in this JSON: ${JSON.stringify(input)}. Return ONLY valid JSON with this exact shape: {"summary":"string","keyFindings":["string"],"risks":["string"],"recommendations":["string"]}. Key findings must come from the supplied text. Label uncertainty in the wording. Recommendations may be AI suggestions. Do not claim live web research or cite sources that were not provided.`,
  };

  return {
    system: shared,
    jsonOutput: false,
    prompt: `Continue this workplace-assistant conversation. Conversation JSON: ${JSON.stringify(input)}. Answer the latest message directly. For tender, legal, safety or financial matters, remind the user to verify critical requirements with the official document or qualified professional.`,
  };
}

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
