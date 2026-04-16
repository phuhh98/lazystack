---
applyTo: 'src/**/*.ts,src/**/*.tsx'
description: 'Use when implementing or refactoring TypeScript/React code. Covers strict typing, component patterns, styling conventions, and semantic testing preferences.'
---

# Coding Conventions

## TypeScript

- Use `import type` for type-only imports.
- Keep code valid under strict TypeScript settings, including no unused locals/parameters.

## Component Design

- Prefer reusable, composable component APIs.
- For generic-ready components, prefer function declaration style like `function ComponentName(props: Props)`.
- Prefer declaration patterns that can be extended to `function ComponentName<T>(props: Props<T>)` without changing call sites.
- For generic components, avoid domain-specific hooks where possible.
- For use-case-specific components, using or creating focused hooks is allowed when it improves separation of concerns.
- Reuse `@base-ui/react` primitives before introducing custom interaction primitives.

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
