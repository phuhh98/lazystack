# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server on port 3000
npm run build        # Production build
npm run check        # Prettier write + ESLint fix (use before committing)
npm run lint         # ESLint check only
npm run format       # Prettier check only
npm run storybook    # Storybook on port 6006
npm run test         # Vitest (browser mode via Playwright, runs Storybook interaction tests)
npm run signaling    # Local y-webrtc signaling server on ws://localhost:4444
npx tsc --noEmit     # Type-check (no typecheck script — use this directly)
```

## Architecture

**Stack:** TanStack Start (SSR) + React 19 + TanStack Router (file-based) + Tailwind v4 + TypeScript strict

**Routing:** File-based under `src/routes/`. Auto-generated `src/routeTree.gen.ts` — never edit manually. Four routes: `/`, `/about`, `/planning-poker/` (lobby), `/planning-poker/$roomId` (game room). Root layout in `__root.tsx` uses `shellComponent` pattern (SSR-aware).

**Planning Poker — P2P architecture (no backend):**
- All collaborative state lives in a Yjs `Doc` with named maps/arrays: `game` (`Y.Map`), `players` (`Y.Map`), `storyList` (`Y.Array`), `chat` (`Y.Array`)
- Synced peer-to-peer via `y-webrtc`, persisted locally via `y-indexeddb` (keyed `pp-room-{roomId}`)
- All Yjs/WebRTC init happens inside `useEffect` with `await import()` — SSR safe
- Signaling: `VITE_SIGNALING_URLS` env var → `ws://localhost:4444` (dev) → public fly.dev servers (prod)
- Player identity persisted in `localStorage` (`pp-player-id`, `pp-player-name`) → reconnects restore session
- Moderator ID stored in Yjs `game.moderatorId`; "Claim Moderator" appears when current moderator offline >30s
- All hook logic encapsulated in `src/hooks/usePlanningPoker.ts` — this is the only file that touches Yjs

**Game phases:** `lobby` → `voting` → `revealed` → `dashboard`

**Card deck:** `['1', '2', '3', '5', '8', '13', '21', '?', '☕']` — consensus rule: ☕ ignored, `?` breaks it, all numeric equal

**Theme system:** Three modes (light/dark/auto) stored in `localStorage`. Blocking inline script in `__root.tsx` (`THEME_INIT_SCRIPT`) prevents FOUC. Applied via `data-theme="dark"` on `<html>`. The game room route (`/planning-poker/:roomId`) gets `h-screen` on `<body>` and `overflow-hidden` on `<Container>` — detected via `useRouterState` regex in `__root.tsx`. All other pages scroll normally.

## Key Conventions

**CSS / Styling:**
- Tailwind v4 with `@tailwindcss/vite` plugin (not PostCSS — no `tailwind.config.js`)
- All theme tokens via CSS custom properties in `src/styles.css`: `var(--ink)`, `var(--primary)`, `var(--surface)`, `var(--border)`, etc. Use these in inline styles for anything that must respond to dark mode
- `cn()` utility at `src/lib/utils/styles.ts` (`clsx` + `tailwind-merge`)
- `.island-shell` class = frosted glass card; `.island-kicker` = uppercase section label; `.display-title` = Fraunces serif font

**Component patterns:**
- Headless UI: `@base-ui/react` — import as `import { Tooltip } from '@base-ui/react'` (not `@base-ui-components`)
- Icons: `lucide-react`
- No global state library — component state via hooks, shared state via Yjs
- Planning poker components that need Yjs state receive it as props from `$roomId.tsx`; they do not access `usePlanningPoker` directly

**TypeScript:**
- `verbatimModuleSyntax` is on — use `import type` for type-only imports
- Path alias `@/*` → `src/*`
- `noUnusedLocals` and `noUnusedParameters` are enforced

**Storybook:**
- Stories live alongside components (e.g. `PokerHand.stories.tsx`)
- `preview.ts` wraps all stories with `withThemeByDataAttribute` — stories render in both light and dark
- Player mock objects in stories must include all required `PlayerData` fields including `handRaised: boolean`

**Prettier:** `semi: false`, `singleQuote: true`, `trailingComma: 'all'`
