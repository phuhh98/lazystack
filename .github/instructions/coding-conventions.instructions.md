---
applyTo: 'src/**/*.ts,src/**/*.tsx'
description: 'Use when implementing or refactoring TypeScript/React code. Covers strict typing, component patterns, styling conventions, and semantic testing preferences.'
---

# Coding Conventions

## TypeScript

- Use `import type` for type-only imports.
- Keep code valid under strict TypeScript settings, including no unused locals/parameters.
- Prefer tsconfig path aliases (for example `@/components/...`) over relative imports that traverse more than one level upward (for example `../../` or deeper).
- Relative imports are acceptable for same-folder or one-level-up paths (`./` and `../`).

## Component Design

- Prefer reusable, composable component APIs.
- Before creating/updating/refactoring components, consult `src/components/COMPONENT_LOOKUP.md` to check reusable options first.
- If component props, ownership, behavior, or file structure changes, update `src/components/COMPONENT_LOOKUP.md` in the same task.
- Keep `src/components/COMPONENT_LOOKUP.md` concise: minimal but sufficient information for fast decision-making.
- For generic-ready components, prefer function declaration style like `function ComponentName(props: Props)`.
- Prefer declaration patterns that can be extended to `function ComponentName<T>(props: Props<T>)` without changing call sites.
- For custom components and primitives, default to `forwardRef` support unless there is a clear reason not to expose refs.
- For generic components, avoid domain-specific hooks where possible.
- For use-case-specific components, using or creating focused hooks is allowed when it improves separation of concerns.
- Reuse `@base-ui/react` primitives before introducing custom interaction primitives.

## State Management

- Use Zustand as the default library for shared client-side app state.
- Prefer lightweight, focused stores over monolithic global stores.
- Avoid adding alternative global state libraries unless explicitly required by the task.

## Styling

- Prefer Tailwind v4 utility classes aligned to project theme semantics.
- Prefer semantic themed naming when available.
- Avoid direct hardcoded `var(--token)` inline styling unless no semantic alternative exists.
- Keep styling aligned with shared theme tokens in `src/styles.css`.

## Testing Style

- Prefer semantic assertions first (role, label, text, aria, behavior).
- Avoid direct className assertions when semantic checks can validate behavior.
- Use class/style assertions only as a last resort.
- Avoid theme-mode-specific branch assertions unless behavior explicitly depends on theme.

## Boundaries

- Keep planning-poker realtime orchestration inside `src/hooks/usePlanningPoker.ts`.
- Do not hand-edit `src/routeTree.gen.ts`.
