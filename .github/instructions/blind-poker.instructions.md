---
applyTo: 'src/routes/planning-poker/**,src/components/planning-poker/**,src/hooks/usePlanningPoker.ts,src/tests/components/planning-poker/**,src/stories/components/planning-poker/**'
description: 'Use when working on Blind Poker realtime behavior, component boundaries, and planning-poker tests.'
---

# Blind Poker Instructions

## Product Intent

- Blind Poker is the current primary tool in LazyStack for Scrum planning.
- Preserve the product direction: realtime collaboration with minimal or no stored user data, favoring peer-to-peer sync.

## Core Architecture Rules

- Keep all Yjs and WebRTC orchestration inside `src/hooks/usePlanningPoker.ts`.
- Keep planning-poker UI components presentational when possible; pass shared state from route or hook boundaries.
- Do not hand-edit generated router output in `src/routeTree.gen.ts`.

## Realtime Init (SPA)

- This project is built as an SPA for planning-poker behavior; prefer explicit top-level imports for realtime dependencies.
- For `yjs`, `y-webrtc`, and `y-indexeddb`, use regular module imports instead of dynamic import.
- Keep realtime initialization side effects inside `useEffect` and preserve browser-only guards where needed.
- For local collaboration testing, run `npm run serve:signaling` and confirm `VITE_SIGNALING_URLS` behavior in `.env.example`.

## Game Domain Conventions

- Keep game phase flow consistent: `lobby -> voting -> revealed -> dashboard`.
- Preserve card deck behavior and consensus semantics used by current Blind Poker game logic.
- Treat moderation, reconnect behavior, reveal flow, and dashboard summaries as high-risk behavior changes.

## Implementation Conventions

- Use `import type` for type-only imports.
- Use CSS variables from `src/styles.css` for theme-aware styling updates.
- Use `@base-ui/react` for headless UI primitives and `lucide-react` for icons.

## Testing Expectations

- When changing voting, reveal, moderation, reconnect, or dashboard behavior, add or update tests under `src/tests/components/planning-poker/`.
- Run targeted planning-poker tests first, then broaden test coverage as needed.

## Reference Files

- Realtime state orchestration: `src/hooks/usePlanningPoker.ts`
- Theme tokens and shared styles: `src/styles.css`
- Planning poker room boundary: `src/routes/planning-poker/$roomId.tsx`
