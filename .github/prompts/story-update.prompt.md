---
name: Story Update From Context
description: 'Create or update a Storybook story file from selected code, provided file path, or current context with strict TypeScript correctness and exhaustive state coverage'
argument-hint: 'Optional: component path, desired story path, or special states to include'
agent: agent
---

Create or update a Storybook story file for a React/TypeScript component in this workspace.

Input Resolution Priority:

1. If I provide a component or story file path in my prompt, use that.
2. Else, use my current file/selection context.
3. Else, infer the most likely target from recent context and clearly state what you inferred.

Execution Requirements:

- If a story file exists for the target component, update it without breaking existing valid stories.
- If no story file exists, create one using this workspace's Storybook conventions.
- Place created stories under `src/stories/` (prefer `src/stories/components/...`) and mirror the component area when practical.
- Follow existing patterns in src/stories/components/\*\* and use import type where needed.
- Keep TypeScript fully correct under strict mode (verbatimModuleSyntax, noUnusedLocals, noUnusedParameters).
- Generate comprehensive stories that cover meaningful component states and edge cases.
- Exhaust practical cases for the component, including empty, typical, boundary, and interaction-relevant states when applicable.
- Keep stories deterministic and lightweight (no flaky timing or network dependence).
- Ensure semantic and accessibility coverage where applicable (labels, roles, aria relationships, keyboard-relevant states).
- For generic components, prefer props-driven accessibility inputs in stories (for example `label`, `ariaLabel`, `aria-describedby`) instead of hardcoded domain text.
- For domain-specific components, hardcoded domain labels/content are acceptable when they reflect real product behavior.

Theme Handling Rule:

- Do not create theme-toggle stories or theme-specific variant stories.
- Do not add switch/case branches for theme mode in stories.
- Assume Storybook theme switching is handled by the existing global UI controls.

Quality Bar:

- Use strong typed Storybook patterns (Meta and StoryObj typed to the component).
- Add minimal, useful story-level comments/doc blocks only when they clarify non-obvious state intent.
- Reuse existing local mocks/fixtures when available instead of duplicating data shapes.
- If router/provider context is required, add only the minimal decorator/provider setup needed.

Output Behavior:

- Implement the file edits directly.
- Then summarize: target component, files changed, states covered, and any assumptions made.
- If required context is missing, ask one concise follow-up question before editing.

Reference Workspace Conventions:

- [.github/copilot-instructions.md](../copilot-instructions.md)
- [.github/instructions/blind-poker.instructions.md](../instructions/blind-poker.instructions.md)
- [.github/instructions/coding-conventions.instructions.md](../instructions/coding-conventions.instructions.md)
- [.github/instructions/prompt-authoring.instructions.md](../instructions/prompt-authoring.instructions.md)
