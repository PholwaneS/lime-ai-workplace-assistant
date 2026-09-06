# LIME AI Workplace Productivity Assistant

LIME AI is one integrated workplace productivity dashboard with five AI-assisted modules:

- Smart Email Generator
- Meeting Notes Summarizer
- AI Task Planner
- AI Research Assistant
- Workplace Chatbot

The interface uses a minimalist black, grey, beige and off-white design with responsive desktop/mobile layouts and light/dark modes.

## Responsible AI

AI output may be incomplete or incorrect. Users must verify dates, calculations, legal statements, safety advice, financial information and tender requirements against official sources before acting. Do not enter passwords or highly confidential information.

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Bolt Cloud / Supabase-compatible server function
- Google Gemini API

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Without the environment variables, the app intentionally runs in Prototype Mode using local demonstration responses.

## Gemini setup

1. Create a Gemini API key in Google AI Studio.
2. Connect a Bolt Database to the project.
3. In Bolt, open Database > Secrets.
4. Create a secret named `GEMINI_API_KEY` and paste the key there.
5. Optionally create `GEMINI_MODEL` with the value `gemini-2.5-flash`.
6. Confirm that Bolt supplies `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the frontend.
7. Deploy the `gemini-assistant` server function and republish the site.

Never put the Gemini API key in `.env`, frontend code, screenshots or GitHub.

## How the integration works

The React interface sends a module name and user input to one secure server function. The function selects a purpose-built system prompt, calls Gemini, validates the response format and returns only the generated result. If the backend is not configured or temporarily unavailable, the interface falls back to its local prototype response.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Team members

- Pholwane S.
