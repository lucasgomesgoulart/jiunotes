# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # run ESLint
npm run setup:sheets # initialize Google Sheets headers (one-time)
```

No test suite is configured.

## Required environment variables

See `SETUP.md` for full setup. All must be in `.env.local`:

| Variable | Purpose |
|---|---|
| `PROFESSOR_PASSWORD` | Login password |
| `SESSION_SECRET` | ≥32-char string for iron-session |
| `GOOGLE_SHEETS_ID` | Spreadsheet ID from the URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | GCP service account email |
| `GOOGLE_PRIVATE_KEY` | GCP private key (`\n` as literal newlines) |
| `ANTHROPIC_API_KEY` | Claude API key |

## Architecture

**Single-teacher app** — no user table, auth is just a password checked in `app/api/auth/login/route.ts` against `PROFESSOR_PASSWORD`. Session is stored in an encrypted cookie via `iron-session` (`lib/session.ts`).

**Data layer is Google Sheets** — `lib/sheets.ts` is the only file that touches the Sheets API. Three tabs: `Alunos`, `Aulas`, `Presencas`. The `ensureHeaders` helper auto-creates column headers on first write. Dates from Sheets are serial numbers (e.g. `46181`) and must be converted via `normalizeDate`. Always append to `SheetName!A:A` (not `A1`) to avoid the column-shift bug.

**Route structure**

- `app/(dashboard)/` — protected pages behind the `proxy.ts` auth guard (layout adds `BottomNav`)
- `app/login/` — public login page
- `app/api/` — API routes:
  - `auth/login` & `auth/logout` — session management
  - `alunos` (GET/POST) + `alunos/[id]` (PUT/DELETE)
  - `aulas` (GET/POST)
  - `dashboard` — aggregate stats
  - `ai/sugestao` — calls Claude to suggest the next training session

**AI integration** — `lib/ai.ts` calls `claude-haiku-4-5-20251001` with a structured prompt; expects a raw JSON response and extracts it with a regex. The route is GET-only (no auth check), so it reads the last 10 sessions + active students and returns a `SugestaoIA` object.

**Auth middleware** lives in `proxy.ts` (not `middleware.ts`). It uses `unsealData` directly because Next.js middleware cannot use the cookie-based `getSession()` helper. The matcher excludes `/api`, `_next/*`, and static assets.

## Key types (`types/index.ts`)

`Aluno`, `Aula`, `Presenca`, `AulaComPresencas`, `SugestaoIA` — all domain types live here. `Faixa` covers belt colors from Branca to Preta (includes Cinza/Amarela/Laranja/Verde for kids belts).

## UI

Components are in `components/ui/` (shadcn-based) and `components/layout/` (sidebar, top-header, bottom-nav). `FaixaBadge` renders colored belt badges. The dashboard layout is mobile-first with a bottom nav bar.
