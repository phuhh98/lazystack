---
name: Unit Test Update From Context
description: 'Create or update unit tests from selected code, provided file path, or current context with strict TypeScript correctness and exhaustive case coverage'
argument-hint: 'Optional: target component/hook path, desired test path, or special cases to include'
agent: agent
---

Create or update unit tests for a React/TypeScript target in this workspace.

Input Resolution Priority:

1. If I provide a target source or test file path, use that.
2. Else, use my current file/selection context.
3. Else, infer the most likely target from recent context and clearly state what you inferred.

Execution Requirements:

- If a matching test file exists, update it without breaking valid existing coverage.
- If no matching test file exists, create one in `src/tests/` and mirror the source area structure when practical.
- Follow current workspace testing patterns (Vitest + Testing Library) and naming conventions.
- Keep TypeScript fully correct under strict mode (verbatimModuleSyntax, noUnusedLocals, noUnusedParameters).
- Cover practical and exhaustive cases: empty/default, typical, boundary, invalid/error-like, and interaction-relevant paths as applicable.
- Include behavior-focused assertions that validate user-visible outcomes and component/hook contracts.
- After creating or updating tests for a component change, run the relevant unit tests and ensure they pass.
- If tests fail for expected behavior, update tests and/or implementation assertions so the suite reflects intended behavior, then re-run until passing.

Theme And Style Assertions Policy:

- Ignore theme-based test branches and theme-mode switch cases.
- Avoid direct assertions on specific className values when a semantic assertion is possible.
- Prefer semantic checks first (role, label, text, state, aria, behavior).
- Only assert classes/styles as a last resort when behavior cannot be validated semantically.

Quality Bar:

- Keep tests deterministic and isolated (no flaky timing, no network dependence unless explicitly mocked).
- Add concise arrange/act/assert structure where it improves readability.
- Reuse existing fixtures/mocks/helpers when available; do not duplicate types or data shapes unnecessarily.
- Avoid over-mocking behavior that can be tested through rendered output.

Output Behavior:

- Implement file edits directly.
- Run relevant test commands when possible and report pass/fail status with key failures fixed.
- Then summarize: target covered, files changed, scenarios added/updated, and assumptions made.
- If required context is missing, ask one concise follow-up question before editing.

Reference Workspace Conventions:

- [.github/copilot-instructions.md](../copilot-instructions.md)
- [.github/instructions/blind-poker.instructions.md](../instructions/blind-poker.instructions.md)
- [.github/instructions/coding-conventions.instructions.md](../instructions/coding-conventions.instructions.md)
- [.github/instructions/prompt-authoring.instructions.md](../instructions/prompt-authoring.instructions.md)
