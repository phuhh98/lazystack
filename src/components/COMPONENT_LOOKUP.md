# Component Lookup Index

Purpose: quick reference for reusable custom components in this project.

When to use this file:

- Check here before building or refactoring a component.
- Prefer existing components and shared patterns before creating new ones.
- Update entries when props, behavior, ownership, or structure changes.

## App Shell Components

- `Header` (`src/components/Header.tsx`): top navigation shell with brand, route links, theme toggle, and decorative `BubbleCollisionVeil` background.
- `Footer` (`src/components/Footer.tsx`): global footer with copyright, social link, and decorative `BubbleCollisionVeil` background.
- `ThemeToggle` (`src/components/ThemeToggle.tsx`): animated light/dark toggle; uses persisted UI preference state and applies theme mode to `documentElement`.

## Animation Components

- `BubbleCollisionVeil` (`src/components/animations/BubbleCollisionVeil.tsx`): canvas-based decorative blob animation with physics-backed collision/merge simulation; supports tuning via props (`initBlobCount`, `opacity`, `overscan`, `speed`, `paused`, life bounds).
- `bubbleCollisionVeilSimulation` (`src/components/animations/bubbleCollisionVeilSimulation.ts`): simulation utilities for blob lifecycle, merge rules, and physics synchronization used by `BubbleCollisionVeil`.

## Basic Primitives

- `Button` (`src/components/basic/Button.tsx`): base clickable button with `primary`/`outline` variants and optional full-width mode.
- `Container` (`src/components/basic/Container.tsx`): layout primitive for flex/grid alignment, direction, wrapping, and semantic element selection.
- `Content` (`src/components/basic/Content.tsx`): constrained page-width content wrapper (`container mx-auto px-4`) with polymorphic element support.
- `ExternalLink` (`src/components/basic/ExternalLink.tsx`): external anchor wrapper with safe defaults (`target=_blank`, `rel=noopener noreferrer`) and optional icon styling mode.
- `IslandShell` (`src/components/basic/IslandShell.tsx`): reusable elevated panel/surface shell built on `Container`; consistent border/gradient/shadow treatment.
- `Typography` (`src/components/basic/Typography.tsx`): semantic text primitive with default typography classes by tag and polymorphic `as` support.

## Brand Icons

- `GithubIcon` (`src/components/brandIcons/GithubIcon.tsx`): Lucide-based custom GitHub glyph component.
- `XIcon` (`src/components/brandIcons/XIcon.tsx`): Lucide-based custom X/Twitter glyph component.

## Planning Poker Components

- `CardDeck` (`src/components/planning-poker/CardDeck.tsx`): estimate card picker; handles selected state and disabled voting state.
- `ChatDrawer` (`src/components/planning-poker/ChatDrawer.tsx`): drawer-based team chat with presets and unread handling.
- `Confetti` (`src/components/planning-poker/Confetti.tsx`): celebratory confetti/emoji overlay with timed auto-dismiss.
- `PlayerList` (`src/components/planning-poker/PlayerList.tsx`): participant roster with online/voting indicators and phase-aware rendering.
- `PokerHand` (`src/components/planning-poker/PokerHand.tsx`): raised-hand and recent-message presence panel for active session collaboration.
- `RightSidebar` (`src/components/planning-poker/RightSidebar.tsx`): multi-tab side panel for chat, hand actions, and timer controls.
- `SessionDashboard` (`src/components/planning-poker/SessionDashboard.tsx`): end-of-session summary view with completion stats and estimate editing.
- `StoryPresetPanel` (`src/components/planning-poker/StoryPresetPanel.tsx`): collapsible story backlog manager with add/remove/reorder actions.
- `VoteResults` (`src/components/planning-poker/VoteResults.tsx`): reveal-phase results, tally, average display, and moderator next-step actions.

## Related Hooks/Stores

- `useDocumentThemeMode` (`src/hooks/useDocumentThemeMode.ts`): observes document theme changes (`data-theme`) for reactive UI decisions.
- `useUiPreferencesStore` (`src/lib/stores/uiPreferencesStore.ts`): Zustand persisted UI preference store (currently theme mode).

## Maintenance Checklist

- If you add/rename/remove a component file in `src/components/**`, update this index.
- If props or core behavior changes significantly, update the corresponding summary line.
- If a component is replaced, preserve migration notes here until all call sites are updated.
