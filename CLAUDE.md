# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

30天寶可夢繪畫特訓營 — a personal 30-day Pokémon drawing-practice PWA. Each day unlocks a subject + technique; the user draws on paper, photographs the result, and Claude (multimodal) returns gentle Traditional-Chinese feedback using a fixed「三步驟點評法」(praise → one precise tweak → one technique tip). Drawings and feedback are collected into a「圖鑑牆」(gallery wall).

This is a **fully static, frontend-only app** deployed to GitHub Pages. There is no backend.

## Commands

```bash
npm run dev          # Vite dev server at /poke-canvas-trainer/ (note the base path)
npm run build        # tsc -b (typecheck) + vite build + PWA generation -> dist/
npm run typecheck    # tsc -b --noEmit
npm run preview      # serve the production build
```

There is no test suite. `build` + `typecheck` are the verification gates (CI runs both, then deploys).

## Architecture

**No backend — the browser calls Anthropic directly.** `src/lib/critique.ts` builds the 3-step system prompt and POSTs to `api.anthropic.com` from the browser, including the `anthropic-dangerous-direct-browser-access: true` header (Anthropic's opt-in for client-side calls). When changing critique behavior, this is the one file to edit.

**The API key lives in the user's browser.** `src/lib/apiKey.ts` stores the Anthropic key (and optional model override) in `localStorage`; the user enters it on the Settings page. This is a deliberate trade-off of the static-hosting design — Settings shows a security warning. Do not reintroduce a server proxy or env-var key without changing the deployment model.

**AI is optional, and the UI reflects it.** `getAiStatus()` in `src/lib/api.ts` is just `hasApiKey()` (synchronous — reads localStorage, no network). When no key is set, the app stays fully usable: `DayView` lets the user save a drawing with empty `feedback` and links to Settings; once a key exists it offers a "請老師現在點評" button to backfill the critique on the stored image. Progress/gallery count entries regardless of feedback. Keep the key non-mandatory.

**Storage is local-only.** All user data (drawings as compressed JPEG data URLs + feedback + progress) lives in IndexedDB via `src/lib/db.ts` (using `idb`). It does not sync across devices/browsers. `db.ts` exports `exportAll`/`importAll` (JSON backup) and calls `navigator.storage.persist()` on startup to resist eviction; Settings surfaces both. Images are downscaled to ≤1024px JPEG in `src/lib/image.ts` BEFORE storage/upload — keep this on the upload path.

**Content is data-driven.** `src/data/curriculum.ts` is the source of truth for all 30 days and the 4 phases (`lines`/`pencil`/`watercolor`/`mixed`, day ranges 1–7 / 8–15 / 16–23 / 24–30). UI derives everything (phase badges, progress bars, gallery grouping) from it. `useProgress` computes `currentDay` as the first uncompleted day — unlocking is intentionally NOT calendar-locked (de-frustration design); any day is always openable.

**Feedback rendering.** `src/lib/feedback.ts#parseFeedback` splits the model's free-text reply into three cards by locating the `【...】` section markers, tolerating drift (falls back to one card). If you change the prompt's section headings in `critique.ts`, update the marker lists here in lockstep.

## GitHub Pages specifics (easy to break)

- **Base path**: `vite.config.ts` sets `base: '/poke-canvas-trainer/'` (must match the repo name). The built `index.html`, manifest scope, and assets all live under that prefix. If the repo is renamed or moved to a custom domain / `<user>.github.io` root, update `base` to match (or `'/'`).
- **Routing**: uses `HashRouter` (`src/main.tsx`) so deep links work on GitHub Pages without server-side SPA fallback. Don't switch to `BrowserRouter` unless you add a `404.html` redirect shim.

## TypeScript project layout

Project references via `tsconfig.json` → app + node:
- `tsconfig.app.json` → `src/` (DOM libs, React JSX). `critique.ts` runs in the browser, so `fetch`/`Response`/`localStorage` come from the DOM lib here.
- `tsconfig.node.json` → `vite.config.ts` only (`vite/client` types).

## Deployment

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`): push to `main` → typecheck + build → `upload-pages-artifact` → `deploy-pages`. Requires repo **Settings → Pages → Source = GitHub Actions**. No secrets/env vars needed — each user supplies their own Anthropic key in the browser at runtime.
