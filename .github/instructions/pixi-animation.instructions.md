---
applyTo: 'src/**/*.tsx,src/**/*.ts'
description: 'Use when implementing visual animations or interactive canvas effects in the app UI.'
---

# PixiJS Animation Instructions

## Intent

- Use `pixi.js` as the default engine for animation-heavy UI work (particle effects, animated backgrounds, or canvas-driven interactions).
- Prefer PixiJS for non-trivial animation instead of introducing additional animation libraries.
- Use `matter-js` as the default 2D physics engine when animation work needs rigid-body or collision-based simulation.

## Usage Rules

- Keep PixiJS setup encapsulated in dedicated components or hooks; keep route/page components focused on composition.
- Keep Matter.js world/engine orchestration encapsulated in dedicated components or hooks; avoid scattering physics step logic across UI components.
- For SSR safety, initialize PixiJS only in browser execution paths (`useEffect`, browser guards, or client-only boundaries).
- Tear down PixiJS resources on unmount (`app.destroy(...)`, texture cleanup, and listener cleanup) to prevent memory leaks.
- Keep animation logic reusable and configurable via props.

## Styling And Theming

- Align animation colors and visual accents with semantic theme tokens from `src/styles.css`.
- Avoid hardcoded visual values when a semantic token is available.

## Performance

- Favor requestAnimationFrame-managed PixiJS loops and avoid unnecessary re-instantiation.
- Respect reduced-motion preferences for decorative animations when practical.

## Testing Guidance

- For Pixi-backed components, prioritize behavioral and accessibility tests around rendered fallback content, controls, and lifecycle behavior.
- Avoid brittle pixel-perfect assertions in unit tests.
