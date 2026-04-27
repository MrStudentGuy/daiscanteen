## 1. Goal
Build a server-rendered Next.js canteen menu app that reads monthly JSON files from disk, shows today's date at the top, lets users move to the previous/next day, and renders the selected day's breakfast, lunch, and evening snacks in a clean list-based UI.

## 2. Approach
Use the Next.js App Router so the page can fetch and transform JSON data on the server before rendering. Store each month as a separate JSON file under a dedicated data directory, then implement a server-side loader in `lib/` that resolves the requested day to the correct month file, parses the menu entry for that date, and returns a normalized view model for the page.

This approach matches your requirement to process JSON on the server and makes monthly updates operationally simple: dropping in a new file such as `May2026.json` and redeploying is sufficient because the loader will discover files dynamically instead of relying on hardcoded month logic.

## 3. File Changes
- **Create** `package.json`
  - Define the Next.js, React, TypeScript, lint, and dev/build/start scripts for the new app.
- **Create** `next.config.ts`
  - Keep configuration minimal unless server file access needs an explicit setting.
- **Create** `tsconfig.json`
  - Configure TypeScript for the Next.js App Router structure.
- **Create** `.gitignore`
  - Ignore `.next`, `node_modules`, and local environment artifacts.
- **Create** `app/layout.tsx`
  - Establish the root HTML structure and page metadata.
- **Create** `app/page.tsx`
  - Implement the main server component that resolves the selected date, loads the menu, and renders the full page.
- **Create** `app/globals.css`
  - Define the visual system, layout, navigation strip styling, card/list presentation, and responsive behavior.
- **Create** `lib/menu-data.ts`
  - Read available month files from `data/menus/`, derive the correct file for a date, parse JSON, and expose typed helpers for page rendering.
- **Create** `lib/date-format.ts`
  - Centralize date parsing, validation, display formatting, and previous/next date generation.
- **Create** `types/menu.ts`
  - Define TypeScript types for raw JSON input, normalized daily menu output, and section shapes.
- **Create** `components/date-strip.tsx`
  - Render the top navigation strip with the selected day, previous day link, and next day link.
- **Create** `components/menu-section.tsx`
  - Render reusable menu section blocks for breakfast, lunch, and snacks.
- **Create** `components/empty-state.tsx`
  - Show a controlled fallback when no menu exists for the selected date or month file.
- **Create** `data/menus/README.md`
  - Document the expected month file naming convention and JSON schema.
- **Create** `data/menus/May2026.json`
  - Add the first month data file using the provided schema and actual menu content when available.

## 4. Implementation Steps
### Task 1: Scaffold the Next.js app
1. Create `package.json`, `tsconfig.json`, `next.config.ts`, and `.gitignore` with a standard App Router TypeScript setup appropriate for a fresh Next.js project.
2. Create `app/layout.tsx` and `app/page.tsx` so the app can render from the server without client-side data fetching.
3. Create `app/globals.css` with the base tokens, typography, spacing, and responsive page shell.

### Task 2: Define the menu data contract
1. Create `types/menu.ts` to model the provided JSON structure exactly, including `breakfast.items`, `breakfast.accompaniments`, lunch keys such as `salad`, `healthy`, `vegetable`, `dal`, `rice`, `roti_puri_bread`, `fruit_dessert`, and `evening_snacks`.
2. Add normalized output types in `types/menu.ts` so the UI can consistently render nullable lunch fields and empty arrays without repeated conditionals.
3. Document the file naming pattern and schema expectations in `data/menus/README.md`, including examples such as `May2026.json` and date keys in `YYYY-MM-DD` format.

### Task 3: Implement server-side file discovery and parsing
1. Create `lib/menu-data.ts` to scan `data/menus/` for `.json` files on the server using Node filesystem APIs.
2. In `lib/menu-data.ts`, implement a resolver that maps a requested date such as `2026-05-14` to the month file for May 2026, parses the JSON, and returns the entry for that exact date.
3. In `lib/menu-data.ts`, add normalization helpers that convert missing or null values into a render-safe shape for the UI.
4. In `lib/menu-data.ts`, expose a helper that also reports whether adjacent dates exist in available data, so navigation can remain consistent even when a day or month is missing.

### Task 4: Implement date handling and routing behavior
1. Create `lib/date-format.ts` to validate `YYYY-MM-DD` values, derive today’s date on the server, and format labels such as weekday, month name, and full human-readable date.
2. Update `app/page.tsx` to accept an optional search param such as `?date=2026-05-14`; if absent or invalid, default to the server’s current date.
3. In `app/page.tsx`, compute previous and next dates from the selected date and pass them to the top navigation strip.
4. Keep navigation link-driven rather than client-state-driven so server rendering remains the single source of truth and deep links for specific dates work immediately.

### Task 5: Build the UI components
1. Create `components/date-strip.tsx` to render the current selected date prominently at the top, with previous-day and next-day controls in a horizontal strip.
2. Create `components/menu-section.tsx` to render titled sections with list items, handling breakfast arrays, lunch key/value rows, and evening snack lists.
3. Create `components/empty-state.tsx` to handle cases where the selected day has no menu entry, showing a clear message while retaining date navigation.
4. Compose those components in `app/page.tsx` into a page structure with a header, navigation strip, and stacked menu cards.
5. Use `app/globals.css` to give the page a polished look: clear hierarchy for the selected date, a tactile date strip, visually separated meal sections, and responsive spacing for mobile and desktop.

### Task 6: Make monthly updates automatic on redeploy
1. Ensure `lib/menu-data.ts` discovers available month files dynamically from `data/menus/` instead of relying on a hardcoded list.
2. Make the month-to-file resolution depend only on file names and date parsing so adding `June2026.json`, `July2026.json`, and later files requires no code changes.
3. Document the operational flow in `data/menus/README.md`: add the next month JSON file, keep the schema unchanged, redeploy, and the new dates become available.

## 5. Acceptance Criteria
- Visiting the root page renders a server-generated view from `app/page.tsx` that defaults to the server’s current calendar date when no `date` query param is provided.
- The top of the page prominently displays the selected date in human-readable form and provides visible previous-day and next-day controls.
- Visiting a URL like `/?date=2026-05-14` loads the menu entry for `2026-05-14` from the correct month JSON file in `data/menus/` without client-side fetching.
- Breakfast renders `items` and `accompaniments` as separate lists when present.
- Lunch renders each defined field (`salad`, `healthy`, `vegetable`, `dal`, `rice`, `roti_puri_bread`, `fruit_dessert`) with empty or null values omitted or replaced by a deliberate fallback, not raw `null` text.
- Evening snacks render as a list and show a controlled empty state if the array is empty.
- If the selected date has no menu entry, the page still renders successfully with a “menu unavailable” style message rather than throwing an error.
- If a new month file matching the documented naming convention is added under `data/menus/` and the app is redeployed, dates in that month become loadable without any code changes.
- The layout remains usable on both mobile and desktop widths, with the date strip and menu sections readable without overflow.

## 6. Verification Steps
- Install dependencies and run the development server with the standard Next.js commands once implementation begins.
- Open the root route and verify it shows the server’s current date and a rendered menu or an unavailable-state message.
- Open at least three explicit URLs such as `/?date=2026-05-01`, `/?date=2026-05-15`, and `/?date=2026-05-31` to confirm correct day lookup within one month file.
- Open a date in another month after adding another JSON file, such as `/?date=2026-06-01`, to verify cross-month file resolution works.
- Test a date missing from the JSON to confirm the empty state renders and navigation still works.
- Test on a narrow mobile viewport and a desktop viewport to confirm the navigation strip and meal sections remain legible and aligned.

## 7. Risks & Mitigations
- **Risk:** Month file naming may be inconsistent (`May2026.json` vs `2026-05.json`), which would break dynamic resolution.
  - **Mitigation:** Define and document one canonical naming format in `data/menus/README.md`, and validate file names inside `lib/menu-data.ts` with a clear failure path.
- **Risk:** The provided JSON may contain schema drift across months, such as missing lunch keys or non-array snack values.
  - **Mitigation:** Add runtime validation and normalization in `lib/menu-data.ts` so malformed fields degrade safely instead of crashing the page.
- **Risk:** Server date defaults may differ from your deployment region if the host timezone changes.
  - **Mitigation:** Centralize date derivation in `lib/date-format.ts` so timezone behavior is explicit and easy to adjust if the deployment target needs a fixed zone.
- **Risk:** Adjacent-day navigation may lead to dates with no menu, especially at month boundaries or before a new month file is added.
  - **Mitigation:** Keep navigation date-based but pair it with a graceful empty state so the app remains predictable even when data is incomplete.