# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/` with three layers:
  - `src/app` (providers, routing, layouts)
  - `src/features/{home|reveillon}/{desktop|mobile|pages}` (feature code by platform)
  - `src/shared/{ui, hooks, lib, store, layout, modal, data}` (reusable building blocks)
- Public assets in `public/`; build output in `dist/`; docs in `docs/`.
- Path aliases: `@/*`, `@app`, `@features`, `@shared` (see `vite.config.ts`). Example: `import { Button } from '@shared/ui/button'`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server at `http://localhost:5173`.
- `npm run build`: Production build to `dist/` (code-splitting configured in `vite.config.ts`).
- `npm run build:dev`: Development-mode build for debugging.
- `npm run preview`: Serve built app for local verification.
- `npm run lint`: Run ESLint on the repo.
- `npm run test`: Run unit tests with Vitest (jsdom env).
- `npm run test:ui`: Open Vitest UI for interactive runs.

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Prefer functional React components and hooks.
- Indentation: 2 spaces; files use LF line endings.
- Filenames: components in `features/*` use `PascalCase.tsx`; shared primitives often lowercase (e.g., `shared/ui/button.tsx`).
- Linting: ESLint with TypeScript + React Hooks plugins (`eslint.config.js`). TS enforces unused checks via `tsconfig`; ESLint unused-vars rule is disabled.
- Styling: Tailwind CSS + shadcn/ui components; co-locate variants/utilities next to components (e.g., `button.variants.ts`).

## Testing Guidelines
- Framework: Vitest + Testing Library (`jsdom`). Setup at `src/setupTests.ts`.
- Test files: colocate as `*.test.ts`/`*.test.tsx` next to source (examples under `src/shared/*`).
- Run: `npm run test` or `npm run test:ui`. Aim to cover feature pages, store (`src/shared/store`), routing, and critical UI states. Coverage is not enforced yet; see `docs/TEST_COVERAGE_ANALYSIS.md` for priorities.

## Commit & Pull Request Guidelines
- Commits are currently short and informal; adopt Conventional Commits going forward: `feat(scope): summary`.
- Write imperative, concise messages and group related changes.
- PRs: include a clear description, linked issue, screenshots for UI changes, and notes on testing/impact. Ensure `npm run lint` and `npm run test` pass and app builds (`npm run build`).

## Security & Configuration Tips
- Configuration via `VITE_*` env vars in `.env`. Do not commit secrets. Example: `VITE_GTM_ID=...` used via defines in `vite.config.ts`.
- Prefer imports using path aliases over relative `../../` chains.

## Documentation & Agent Guides
- Start with `docs/`: architecture (`ARCHITECTURE_ATLAS.md`), components (`COMPONENT_REGISTRY.md`), state (`STATE_MANAGEMENT.md`), testing plan (`TEST_COVERAGE_ANALYSIS.md`), performance (`BUILD_PERFORMANCE.md`), playbooks (`DEVELOPMENT_PLAYBOOKS.md`).
- Agent protocols: see `CLAUDE.md` and `GEMINI.md`. Follow anti-hallucination rules—back claims with file:line or mark UNKNOWN → TODO; verify before changing.
- Keep docs current: when changing architecture or patterns, update the relevant doc alongside the code.
