---
applyTo: '.github/prompts/*.prompt.md'
description: 'Use when creating or updating reusable prompt files. Enforces consistent prompt structure, input resolution, output expectations, and workspace-aligned quality rules.'
---

# Prompt Authoring Instructions

## Purpose

- Use this file when creating or updating prompt files in `.github/prompts/`.
- Keep prompts single-task focused, reusable, and directly actionable.

## Required Structure

- Use this body section order for task prompts:
  - `Input Resolution Priority`
  - `Execution Requirements`
  - `Quality Bar`
  - `Output Behavior`
  - `Reference Workspace Conventions`
- Keep headings in Title Case and wording concise.

## Input Resolution Pattern

- Prefer explicit user-provided target path or intent first.
- Else use current file or selected context.
- Else infer most likely target and state the inference clearly.

## Execution Rules

- In update/create prompts, include both update-existing and create-if-missing behavior.
- Include destination folder guidance when relevant:
  - Stories: `src/stories/`
  - Unit tests: `src/tests/`
- Require TypeScript strict correctness when prompt outputs TypeScript.
- Preserve existing valid behavior unless the user asks for behavior changes.

## Quality Rules

- Prefer deterministic outputs.
- Reuse existing workspace patterns and fixtures.
- Avoid duplication of data shapes or helper utilities.
- Keep comments minimal and only for non-obvious intent.

## Output Rules

- Prompts should instruct the agent to implement edits directly when execution is requested.
- Prompts should instruct the agent to summarize files changed, cases covered, and assumptions.
- If context is insufficient, prompt should ask one concise follow-up question.

## Reference Linking

- Include these links in prompt files when relevant:
  - `.github/copilot-instructions.md`
  - `.github/instructions/blind-poker.instructions.md`
  - `.github/instructions/coding-conventions.instructions.md`
