---
name: testing
description: Use when writing or fixing tests — Vitest, React Testing Library, *.test.ts(x) files, matchMedia/viewport mocking, test setup — or when `npm test` fails. Covers query conventions, the jsdom limitations and the viewport mock.
---

# Testing

Vitest + React Testing Library + jsdom. Config in `vite.config.ts` (`test` block: `globals: true`, `css: false`), setup in `src/test/setup.ts`.

```sh
npm test              # single run
npm run test:watch
npx vitest run src/pages/FretboardPage.test.tsx   # one file
```

## Where

Tests sit next to the code as `*.test.ts(x)`. Existing layers:

- `utils/musicTheory/helpers.test.ts` — pure logic. Add here first for theory changes.
- `components/Fretboard/Fretboard.test.tsx` — rendering, highlighting, orientation, click callback.
- `pages/FretboardPage.test.tsx` — user flows + mobile view.
- `App.test.tsx` — routing via `MemoryRouter` with the same route table as `App`.

## Conventions

- Import `describe/it/expect/vi` explicitly from `vitest` even though globals are on.
- Query by role / label / text (`getByRole('grid', { name: /guitar fretboard/i })`, `getByLabelText('Root Note')`). Use `data-string` / `data-fret` / class selectors only for fretboard geometry where no accessible handle exists.
- Prefer `userEvent.setup()` over `fireEvent`.
- Cover main behaviour, not exhaustive combos.
- `cleanup()` and the matchMedia reset run automatically `afterEach`.

## Limitations

- `css: false` — no stylesheet is loaded, so you cannot assert layout, media-query results or computed styles. Assert classes / `data-*` attributes instead (e.g. `data-orientation="vertical"`). Visual checks happen in the browser.
- jsdom has no `matchMedia`; the project installs a mock (below).

## Viewport / breakpoint mock

`src/test/matchMedia.ts` installs a `window.matchMedia` that evaluates `(max-width: Npx)` / `(min-width: Npx)` against a simulated width (default 1280) and notifies listeners on change.

```ts
import { breakpoints } from '../styles/breakpoints';
import { setViewportWidth } from '../test/matchMedia';

setViewportWidth(breakpoints.mobile);        // before or after render; wrapped in act()
expect(screen.getByRole('grid')).toHaveAttribute('data-orientation', 'vertical');
setViewportWidth(breakpoints.mobile + 1);    // back to horizontal
```

Width resets to 1280 after each test.

## Before finishing

`npm run lint && npx tsc -b && npm test` must all pass.
