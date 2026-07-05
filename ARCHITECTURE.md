# Architecture

## Goal

Reduce EduForge module creation from 12 business days to under 2 hours by replacing engineering-dependent CMS work with a typed block builder.

## System Design

- `src/lib/types.ts`: portable module schema shared by editor, preview, and export.
- `src/lib/blockCatalog.ts`: single source of truth for the 12 supported block templates.
- `src/store/moduleStore.ts`: Zustand store for module state, selection, import/export, and 50-step history.
- `src/components/builder`: authoring surfaces including palette, canvas, inspector, preview, and JSON tools.
- `src/components/blocks`: learner-facing rendering of every block type.
- `src/lib/calculators.ts`: deterministic EMI, SIP, and compound-interest formulas with tests.
- `src/lib/review.ts`: simulated stakeholder review scoring.

## Accessibility

- Semantic landmarks and labelled regions.
- Keyboard sensor enabled for sortable lists.
- Visible focus states with high-contrast outlines.
- Inputs, textareas, and action buttons are labelled.
- Preview blocks use readable contrast and stable responsive dimensions.

## Backend Portability

The exported JSON contains module metadata and a flat ordered `blocks` array. Each block has `id`, `type`, `title`, `content`, and `metadata`, allowing backend services to validate, store, version, and render the module without UI-specific state.

## Performance

The canvas uses a normalized block list and focused updates. The review calculations are memoized in the UI. History is capped at 50 entries to prevent runaway memory growth during long authoring sessions.
