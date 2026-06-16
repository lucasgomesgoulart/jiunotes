# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # run ESLint
# DB setup: paste schema.sql into the Neon SQL Editor (one-time)
```

No test suite is configured.

## Required environment variables

See `SETUP.md` for full setup. All must be in `.env.local`:

| Variable | Purpose |
|---|---|
| `PROFESSOR_PASSWORD` | Login password |
| `SESSION_SECRET` | ≥32-char string for iron-session |
| `DATABASE_URL` | Postgres (Neon) connection string — use the **pooled** variant |
| `ANTHROPIC_API_KEY` | Claude API key |

## Architecture

**Single-teacher app** — no user table, auth is just a password checked in `app/api/auth/login/route.ts` against `PROFESSOR_PASSWORD`. Session is stored in an encrypted cookie via `iron-session` (`lib/session.ts`).

**Data layer is Postgres (Neon)** — `lib/db.ts` is the only file that touches the database, via the `@neondatabase/serverless` HTTP driver. The client is created lazily (`getSql()`) so the build doesn't require `DATABASE_URL`. Tables: `alunos`, `aulas`, `presencas`, `graduacoes`, `ia_usos` (see `schema.sql`). **Dates are stored as `text` in ISO `YYYY-MM-DD`** — the whole app treats dates as strings, so there's no serial/timezone conversion. FKs use `ON DELETE CASCADE`, so deleting an aluno/aula removes its presenças (and graduações) automatically. Multi-statement writes (createPresencas, setPresencas) use `sql.transaction([...])`.

**Route structure**

- `app/(dashboard)/` — protected pages behind the `proxy.ts` auth guard (layout adds `BottomNav`)
- `app/login/` — public login page
- `app/api/` — API routes:
  - `auth/login` & `auth/logout` — session management
  - `alunos` (GET/POST) + `alunos/[id]` (GET perfil / PUT / DELETE) + `alunos/[id]/graduar` (POST)
  - `aulas` (GET/POST) + `aulas/[id]` (GET / PUT / DELETE)
  - `dashboard` — aggregate stats
  - `ai/sugestao` & `ai/usos` — Claude next-session suggestion (currently unused in the redesigned UI)

**AI integration** — `lib/ai.ts` calls `claude-haiku-4-5-20251001` with a structured prompt; expects a raw JSON response and extracts it with a regex. The route is GET-only (no auth check), so it reads the last 10 sessions + active students and returns a `SugestaoIA` object.

**Auth middleware** lives in `proxy.ts` (not `middleware.ts`). It uses `unsealData` directly because Next.js middleware cannot use the cookie-based `getSession()` helper. The matcher excludes `/api`, `_next/*`, and static assets.

## Key types (`types/index.ts`)

`Aluno`, `Aula`, `Presenca`, `AulaComPresencas`, `Graduacao`, `PresencaResumo`, `AlunoPerfil`, `SugestaoIA` — all domain types live here. `Faixa` covers belt colors from Branca to Preta (includes Cinza/Amarela/Laranja/Verde for kids belts).

## UI

Components are in `components/ui/` (shadcn-based) and `components/layout/` (sidebar, top-header, bottom-nav). `FaixaBadge` renders colored belt badges. The dashboard layout is mobile-first with a bottom nav bar.
