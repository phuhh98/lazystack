# LazyStack

LazyStack is a personal productivity tools hub focused on realtime collaboration with minimal or no server-stored user data.

You could visit our site at [lazystack.onrender.com](https://lazystack.onrender.com/)

## Product Direction

- Realtime collaboration tools should prefer peer-to-peer sync.
- The current primary tool is Blind Poker for Scrum estimation.
- Current development focus is theme-system rework and planning-poker component refactoring.
- A lightweight personal blog area may be added in the future.

## Tech Stack

- TanStack Start (SSR) + React 19 + TanStack Router (file-based)
- Tailwind v4 + CSS variables in `src/styles.css`
- TypeScript strict mode
- Realtime sync: `yjs` + `y-webrtc` + `y-indexeddb`

## Quick Start

```bash
npm install
npm run dev
```

## Core Commands

```bash
npm run build            # production build
npm run test             # unit tests
npm run test:all         # unit + storybook tests
npm run lint             # eslint check
npm run check            # prettier write + eslint fix
npx tsc --noEmit         # type-check
npm run serve:signaling  # local y-webrtc signaling server
```

## Realtime Notes

- Keep Yjs/WebRTC orchestration in `src/hooks/usePlanningPoker.ts`.
- For local collaborative testing, run signaling locally and configure `VITE_SIGNALING_URLS` when needed.
- Do not hand-edit `src/routeTree.gen.ts` (generated file).

## Project References

- Workspace agent defaults: `.github/copilot-instructions.md`
- Blind Poker coding instructions: `.github/instructions/blind-poker.instructions.md`
- Signaling env template: `.env.example`

## Color Palette

[tint.dev palette](https://www.tints.dev/palette/v1:ZGFyay10ZWFsfDBkNTY2YXw3MDB8bHwwfDB8MHwxMDB8bX5iYW5hbmEtY3JlYW18ZmZlNTUzfDcwMHxsfDB8MHwwfDEwMHxtfmFtYmVyLWVhcnRofGQ1ODQwYXw3MDB8bHwwfDB8MHwxMDB8bX5ibG9vZC1yZWR8OTAwQjBEfDcwMHxsfDB8MHwwfDEwMHxtfnJpY2gtbWFob2dhbnl8NDkwMzA1fDcwMHxsfDB8MHwwfDEwMHxt)
