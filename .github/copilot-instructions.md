# Project Guidelines

## Product Context

- This project is LazyStack, a personal productivity tools hub.
- Product direction: real-time collaboration tools that store minimal or no user data, favoring peer-to-peer sync.
- Current primary tool is Blind Poker for Scrum planning.
- Near-term priority: rework the theme system and refactor planning-poker components safely.
- Potential future area: personal blog features, while keeping the app lightweight.

## Architecture

- Stack: TanStack Start (SSR), React 19, file-based TanStack Router, Tailwind v4, TypeScript strict.
- Planning poker collaboration is peer-to-peer via Yjs + y-webrtc, with local persistence via y-indexeddb.
- Keep all Yjs and WebRTC orchestration inside src/hooks/usePlanningPoker.ts. Do not spread Yjs logic into UI components.
- Treat src/routeTree.gen.ts as generated; never hand-edit it.

## Build And Test

- Install: npm install
- Dev server: npm run dev
- Production build: npm run build
- Unit tests: npm run test
- Full test run (unit + Storybook): npm run test:all
- Lint only: npm run lint
- Format check only: npm run format
- Auto-fix formatting/linting: npm run check
- Type-check: npx tsc --noEmit
- Local WebRTC signaling server: npm run serve:signaling

## Conventions

- Follow the Blind Poker domain rules in .github/instructions/blind-poker.instructions.md when working in planning-poker areas.
- Follow coding conventions in .github/instructions/coding-conventions.instructions.md for TypeScript, component, styling, and testing patterns.

## SSR And Realtime Pitfalls

- Do not initialize browser-only realtime dependencies during SSR.
- For Yjs/y-webrtc/y-indexeddb, use dynamic import inside useEffect and guard for window availability.
- For local collaborative testing, ensure signaling is running and VITE_SIGNALING_URLS is configured as needed.

## Link, Do Not Duplicate

- Blind Poker domain conventions: .github/instructions/blind-poker.instructions.md
- Coding conventions: .github/instructions/coding-conventions.instructions.md
- App setup and generic framework usage: README.md
- Signaling env example: .env.example
- Theme tokens and shared styles: src/styles.css
- Realtime game state orchestration: src/hooks/usePlanningPoker.ts

## Working Style For Agents

- Prefer minimal, targeted changes that preserve existing public behavior.
- Before finalizing feature work on planning poker, run targeted tests first, then broader tests as needed.
- If behavior touches voting, reveal, moderation, reconnect, or dashboard summaries, add or update tests in src/tests/components/planning-poker/.
