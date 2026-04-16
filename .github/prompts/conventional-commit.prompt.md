---
name: Conventional Commit From Context
description: 'Generate a conventional commit message from staged git changes, or prefer user-selected context when provided'
argument-hint: 'Optional context to prioritize (ticket, intent, selected diff, constraints)'
agent: agent
---

Generate a conventional commit proposal.

Input Resolution Priority:

1. If the user provides explicit context (selected code, pasted diff, intent, ticket, or notes), use that first.
2. Else infer change intent from staged files.

Execution Requirements:

- Produce a commit in conventional format with a required scope.
- Title format must be: `<type>(<scope>): <subject>`
- Use a valid conventional type: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`, or `style`.
- Scope is mandatory and should be specific to the primary area changed.
- Subject must be concise, imperative, and lower-case start unless proper noun.
- If multiple areas changed, pick the dominant scope and reflect secondary effects in details.
- If there is a breaking change, include a `BREAKING CHANGE:` note.

Quality Bar:

- Ensure title and details are fully consistent with the provided or inferred context.
- Do not invent behavior that is not supported by the diff/context.
- Prefer precision over generic wording.

Output Behavior:

- Return output in this format:
  - `Title: <type>(<scope>): <subject>`
  - `Details:`
  - `- <key change 1>`
  - `- <key change 2>`
  - `- <key change 3>`
- If context is insufficient, return the best possible draft and add one short `Need:` line listing the single most useful missing detail.

Reference Workspace Conventions:

- [.github/copilot-instructions.md](../copilot-instructions.md)
- [.github/instructions/prompt-authoring.instructions.md](../instructions/prompt-authoring.instructions.md)
