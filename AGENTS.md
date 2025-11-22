# Repository Guidelines

## Project Structure & Module Organization
- Source in `src/` with three layers:
  - `src/app` (providers, routing, layouts)
  - `src/features/{home|reveillon}/{desktop|mobile|pages}` (feature code by platform)
  - `src/shared/{ui, hooks, lib, store, layout, modal, data}` (reusable primitives)
- Public assets: `public/`; build output: `dist/`; docs: `docs/`.
- Path aliases: `@/*`, `@app`, `@features`, `@shared` (see `vite.config.ts`). Example: `import { Button } from '@shared/ui/button'`.

## Build, Test, and Development Commands
- `npm run dev` — Start Vite at http://localhost:5173
- `npm run build` — Production build to `dist/` (code-splitting enabled)
- `npm run build:dev` — Development-mode build for debugging
- `npm run preview` — Serve built app locally
- `npm run lint` — Run ESLint on the repo
- `npm run test` — Run Vitest (jsdom)
- `npm run test:ui` — Open Vitest UI

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Prefer functional React components and hooks.
- Indentation: 2 spaces; LF line endings.
- Filenames: `features/*` components use `PascalCase.tsx`; shared primitives often lowercase (e.g., `shared/ui/button.tsx`).
- Linting: ESLint with TypeScript + React Hooks; unused caught by TS (ESLint unused-vars disabled).
- Styling: Tailwind CSS + shadcn/ui; co-locate variants/utilities (e.g., `button.variants.ts`).

## Testing Guidelines
- Framework: Vitest + Testing Library (jsdom). Setup: `src/setupTests.ts`.
- Test files colocated as `*.test.ts` / `*.test.tsx` next to source.
- Run with `npm run test` or `npm run test:ui`.
- Focus: feature pages, `src/shared/store`, routing, and critical UI states. Coverage not enforced yet (see `docs/TEST_COVERAGE_ANALYSIS.md`).

## Commit & Pull Request Guidelines
- Use Conventional Commits going forward: `feat(scope): summary`.
- Keep messages imperative, concise, and group related changes.
- PRs: include clear description, linked issue, and screenshots for UI changes. Note testing/impact.
- Ensure `npm run lint`, `npm run test` pass and the app builds (`npm run build`).

## Security & Configuration Tips
- Use `VITE_*` env vars in `.env`; do not commit secrets. Example: `VITE_GTM_ID=...` consumed via `vite.config.ts` defines.
- Prefer path aliases over long relative imports.

## Documentation & Agent Guides
- Start with `docs/` (architecture, components, state, testing, performance, playbooks).
- Context Engineering: read `docs/CONTEXT_ENGINEERING.md` for MCP workflows, canonical facts and validation checkpoints.
- Agents: follow anti-hallucination rules—verify claims or mark UNKNOWN→TODO; update docs when changing architecture or patterns.
