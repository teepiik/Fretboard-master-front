# Fretboard Master

Interactive guitar fretboard visualiser. Pick a root note and a scale, and see every matching note highlighted on the neck.

## Features

- 12 scales and modes (major, minor variants, church modes, pentatonics, blues)
- 12, 22 or 24 frets, root and scale notes colour coded, optional note names
- Horizontal neck on desktop, vertical neck on mobile (≤ 640px)
- Keyboard accessible, no backend required

## Tech stack

React 19 · TypeScript (strict) · Vite 8 · react-router 7 · plain CSS with design tokens · Vitest + React Testing Library

## Getting started

Requires Node 24 (see `.nvmrc`) and npm 10.

```sh
nvm use
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start the Vite dev server                |
| `npm run build`      | Type check (`tsc -b`) and production build to `dist/` |
| `npm run preview`    | Serve the production build locally       |
| `npm run lint`       | ESLint                                   |
| `npm test`           | Run the test suite once                  |
| `npm run test:watch` | Run tests in watch mode                  |

## Project structure

```
src/
  components/Fretboard/   Fretboard, GuitarString, Fret, Note
  components/Layout/      Layout, Header, Navigation
  pages/                  Home, FretboardPage, About, NotFound
  hooks/                  useMediaQuery / useBreakpoint
  styles/                 tokens.css (design tokens), breakpoints.ts, globals/, components/, pages/
  utils/musicTheory/      Note, scale and fretboard generation logic
  types/                  Shared TypeScript types
  test/                   Vitest setup and matchMedia mock
```

Styling is global CSS driven by custom properties in `src/styles/tokens.css`. Breakpoints (1024 / 768 / 640 / 480) are desktop-first and mirrored in `src/styles/breakpoints.ts` for runtime use.

## Testing

Tests live next to the code as `*.test.ts(x)` and run in jsdom with CSS disabled, so they assert behaviour and markup rather than layout. Query by role, label or text; use `@testing-library/user-event` for interaction. Viewport-dependent behaviour is tested with `setViewportWidth()` from `src/test/matchMedia.ts`.

Before opening a pull request make sure all of these pass:

```sh
npm run lint && npx tsc -b && npm test
```

## Contributing

- Follow `.prettierrc` (single quotes, trailing commas, 120 columns).
- Add a design token only when the value is reused.
- Commit messages: lowercase, imperative, no type prefix, e.g. `add vertical mobile fretboard view`.
- `AGENTS.md` and `.opencode/skills/` document conventions for AI coding agents.

## License

Private project; no license granted.
