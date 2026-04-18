---
name: Component Update From Context
description: 'Create, update, or refactor a React/TypeScript component from selected code, provided file path, or current context while following workspace component conventions'
argument-hint: 'Optional: target component path, create/update/refactor intent, and behavior constraints'
agent: agent
---

Create, update, or suggest a refactor for a React/TypeScript component in this workspace according to the user intent.

Input Resolution Priority:

1. If I provide a component file path or explicit target, use that.
2. Else, use my current file/selection context.
3. Else, infer the most likely target from recent context and clearly state what you inferred.

Execution Requirements:

- Respect user intent: create a new component, update an existing component, or provide a concrete refactor implementation.
- Before creating/updating/refactoring components, consult `src/components/COMPONENT_LOOKUP.md` to identify reusable custom components and avoid duplication.
- If component behavior, props, ownership, or file structure changes, update `src/components/COMPONENT_LOOKUP.md` in the same task.
- Reuse preexisting Base UI primitives from `@base-ui/react` where practical before introducing custom interaction primitives.
- Use Tailwind utility classes and project theme semantics aligned with `src/styles.css` and Tailwind v4 conventions.
- Prefer semantic theme token usage (for example utility tokens like `text-ink`, `bg-bg-surface`, `border-border`) when available.
- Avoid explicit hardcoded theme variable usage in component code (for example direct `var(--token)` inline style references) unless no semantic option exists.
- Keep TypeScript fully correct under strict mode (verbatimModuleSyntax, noUnusedLocals, noUnusedParameters).
- Before manually fixing lint issues, run `eslint --fix` on changed files to auto-resolve all fixable issues first, then handle remaining issues manually.
- For generic-ready components, prefer function declaration style `function ComponentName(props: Props)`.
- Prefer declaration patterns that can be extended to `function ComponentName<T>(props: Props<T>)` without changing call sites.
- If the component is generic/reusable, avoid domain-specific hooks and keep logic minimal.
- If the component is use-case specific, using or creating appropriate hooks is allowed when it improves separation of concerns.
- Keep behavior stable unless the user explicitly requests behavior changes.

Quality Bar:

- Prefer composable props and clear component contracts over implicit coupling.
- Reuse existing shared component patterns and file structure in `src/components/**`.
- Add concise comments only where logic is non-obvious.
- Preserve accessibility and semantic HTML patterns.

Output Behavior:

- Implement file edits directly when creating/updating/refactoring is requested.
- If the user asks for suggestions only, provide a concrete refactor plan with precise file targets.
- Then summarize: target component, files changed, what was created/updated/refactored, and assumptions made.
- After completion, recommend invoking:
  - `/story-update` to create/update stories in `src/stories/`
  - `/unit-test-update` to create/update tests in `src/tests/`
- If required context is missing, ask one concise follow-up question before editing.

Reference Workspace Conventions:

- [.github/copilot-instructions.md](../copilot-instructions.md)
- [.github/instructions/blind-poker.instructions.md](../instructions/blind-poker.instructions.md)
- [.github/instructions/coding-conventions.instructions.md](../instructions/coding-conventions.instructions.md)
- [.github/instructions/prompt-authoring.instructions.md](../instructions/prompt-authoring.instructions.md)
- [src/components/COMPONENT_LOOKUP.md](../../src/components/COMPONENT_LOOKUP.md)
