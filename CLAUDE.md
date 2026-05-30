# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

30天寶可夢繪畫特訓營 — a personal 30-day Pokémon drawing-practice PWA. Each day unlocks a subject + technique; the user draws on paper, photographs the result, and Claude (multimodal) returns gentle Traditional-Chinese feedback using a fixed「三步驟點評法」(praise → one precise tweak → one technique tip). Drawings and feedback are collected into a「圖鑑牆」(gallery wall).

## Commands

```bash
npm run dev          # Vite dev server at :5173 — ALSO serves /api in-process (see below)
npm run build        # tsc -b (typecheck) + vite build + PWA generation -> dist/
npm run typecheck    # tsc -b --noEmit (covers src + vite config/plugin/shared, NOT functions/)
npm run preview      # serve the production build
npm run pages:dev    # wrangler pages dev — real workerd runtime (optional; may fail in non-interactive sandboxes with "write EOF")
```

Typecheck the Cloudflare Function separately (it is excluded from `tsc -b`):

```bash
npx tsc -p functions/tsconfig.json --noEmit
```

There is no test suite. `build` + the two typecheck commands are the verification gates (CI runs `typecheck` then `build`).

## Architecture

**Three runtime surfaces, one shared brain.** The AI critique logic (the "三步驟" system prompt + the Anthropic Messages API call) lives ONLY in `shared/critique.ts`. Two surfaces import it so the prompt never drifts:
- `functions/api/critique.ts` — Cloudflare Pages Function, used in **production**. Reads the key from `env.ANTHROPIC_API_KEY`.
- `vite-dev-api.ts` — a Vite plugin (`apply: 'serve'`) that serves `/api/status` and `/api/critique` in-process during `npm run dev`, reading the key from `process.env` or `.dev.vars`. This exists so local dev needs only one command and does not depend on wrangler.

The React frontend NEVER imports `shared/` — it only talks to `/api/*` over fetch. When editing critique behavior, change `shared/critique.ts`; the two surfaces are thin wrappers (env wiring + error→HTTP mapping).

**AI is optional, and the UI reflects it.** `/api/status` returns `{ aiEnabled }` (true iff a key is set). `src/lib/api.ts#getAiStatus` is the single client check. When `aiEnabled` is false, the app stays fully usable: `DayView` lets the user save a drawing with empty `feedback`, and later (once a key exists) offers a "請老師現在點評" button to backfill the critique on the stored image. `completedAt`/gallery progress count entries regardless of feedback. Don't reintroduce a hard requirement for the key.

**Storage is local-only and the backend is stateless.** All user data (drawings as compressed JPEG data URLs + feedback + progress) lives in IndexedDB via `src/lib/db.ts` (using `idb`). There is NO server database — the Cloudflare Function is a pure stateless proxy. Consequences:
- Data is per-browser/per-device; it does not sync. `db.ts` exports `exportAll`/`importAll` (JSON backup) and calls `navigator.storage.persist()` on startup to resist eviction. Settings surfaces both.
- Images are downscaled to ≤1024px JPEG in `src/lib/image.ts` BEFORE storage/upload (token cost + size). Keep this on the upload path.

**Content is data-driven.** `src/data/curriculum.ts` is the source of truth for all 30 days and the 4 phases (`lines`/`pencil`/`watercolor`/`mixed`, day ranges 1–7 / 8–15 / 16–23 / 24–30). UI derives everything (phase badges, progress bars, gallery grouping) from it. `useProgress` computes `currentDay` as the first uncompleted day — unlocking is intentionally NOT calendar-locked (de-frustration design); any day is always openable.

**Feedback rendering.** `src/lib/feedback.ts#parseFeedback` splits the model's free-text reply into three cards by locating the `【...】` section markers. It tolerates drift (falls back to one card). If you change the prompt's section headings in `shared/critique.ts`, update the marker lists here in lockstep.

## TypeScript project layout

Three tsconfigs via project references (`tsconfig.json` references app + node):
- `tsconfig.app.json` → `src/` (DOM libs, React JSX).
- `tsconfig.node.json` → `vite.config.ts`, `vite-dev-api.ts`, `shared/**` (Node types; `fetch`/`Response` come from `@types/node`).
- `functions/tsconfig.json` → `functions/**` (Cloudflare `@cloudflare/workers-types` provides `PagesFunction`, global `fetch`); pulls in `shared/` via import resolution. Not part of `tsc -b`.

## Deployment

Cloudflare Pages via GitHub Actions (`.github/workflows/deploy.yml`): push to `main` → typecheck + build + `wrangler pages deploy`. Two secret locations, do not mix them up:
- **Cloudflare Pages env vars** (runtime): `ANTHROPIC_API_KEY` (required for AI), `ANTHROPIC_MODEL` (optional, default `claude-sonnet-4-6`).
- **GitHub Actions secrets** (deploy only): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. The Anthropic key must NOT go here.

The Pages project name (`poke-canvas-trainer`) must match `--project-name` in the workflow and `name` in `wrangler.toml`.
