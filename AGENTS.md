# AGENTS.md

## Project overview
- This repository is a Next.js 16 App Router app that renders a daily DAIS canteen menu.
- The UI is server-rendered from JSON files on disk. There is no database.
- Menu data is organized as one JSON file per month in `data/menus` using the filename format `MonthYYYY.json`.

## Stack
- Next.js 16
- React 19
- TypeScript with `strict` enabled
- ESLint via `eslint .`

## Useful commands
- `npm run dev` starts the local dev server.
- `npm run build` builds the app.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.

## Code layout
- `app/` contains the App Router entrypoints and global styles.
- `components/` contains presentational UI components.
- `lib/date-format.ts` contains ISO date validation, formatting, and date shifting helpers.
- `lib/menu-data.ts` contains file discovery, JSON loading, normalization, and adjacent-date navigation logic.
- `types/menu.ts` defines the raw and normalized menu types.
- `data/menus/` stores monthly menu JSON files and its local README documents the schema.

## Data conventions
- Each top-level key inside a month file must be an ISO date in `YYYY-MM-DD` format.
- The loader derives the month file name from the requested date, so filenames must remain in exact `MonthYYYY.json` format.
- Missing or malformed fields are normalized defensively to empty arrays or `null` values.
- Lunch fields are displayed in a fixed order defined in `lib/menu-data.ts`.

## Working rules
- Prefer preserving the existing server-rendered approach unless the task explicitly requires client-side behavior.
- When adding menu data, update or add files only under `data/menus/` unless the schema changes.
- Keep date handling in ISO format and route all date validation through `lib/date-format.ts`.
- Reuse existing component patterns before introducing new abstractions.
- Do not hardcode available months in code; the app already discovers them from the filesystem.

## Validation expectations
- After code changes, run `npm run lint` and `npm run typecheck` when possible.
- After data changes, verify that the target date resolves correctly and that previous/next navigation still works across month boundaries.

## Notes for future agents
- The repository may contain uncommitted local changes; inspect the worktree before editing and avoid reverting unrelated files.
- There is an extra root-level `April2026.json` file in the worktree, but the application reads from `data/menus/`.
