---
name: Conventional Commit From Context
description: 'Generate a conventional commit message from staged changes, then create the commit via tool call'
argument-hint: 'Optional context to prioritize (ticket, intent, selected diff, constraints)'
agent: agent
---

Generate a conventional commit proposal, then create the git commit.

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
- After drafting a legitimate message, create the commit from staged changes in the same run.
- Commit execution is mandatory once a legitimate message is prepared; do not stop at draft output.
- Prefer calling `mcp_gitkraken_git_add_or_commit` with `action: commit`; use the workspace root as directory.
- If the tool is unavailable or fails, fallback to `run_in_terminal` with `git commit` using the same title/details.
- If fallback commit fails, retry once with safe quoting, then report the short failure reason.
- Do not create an empty commit; if there are no staged changes, stop and report what is missing.

Quality Bar:

- Ensure title and details are fully consistent with the provided or inferred context.
- Do not invent behavior that is not supported by the diff/context.
- Prefer precision over generic wording.
- Validate legitimacy before committing:
  - type is from the allowed list
  - scope is present and specific
  - subject is concise and imperative
  - details align with staged changes

Output Behavior:

- Before committing, prepare output in this format:
  - `Title: <type>(<scope>): <subject>`
  - `Details:`
  - `- <key change 1>`
  - `- <key change 2>`
  - `- <key change 3>`
- Then execute the commit immediately.
- After commit attempt, append:
  - `Committed: yes`
  - `Commit Message Used: <type>(<scope>): <subject>`
- If committed, also append:
  - `Commit Hash: <short-hash>`
- If context is insufficient, return the best possible draft and add one short `Need:` line listing the single most useful missing detail.
- If commit cannot be created (for example no staged changes), append:
  - `Committed: no`
  - `Reason: <short reason>`

Reference Workspace Conventions:

- [.github/copilot-instructions.md](../copilot-instructions.md)
- [.github/instructions/prompt-authoring.instructions.md](../instructions/prompt-authoring.instructions.md)
