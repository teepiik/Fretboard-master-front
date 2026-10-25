# Fretboard Master (frontend)

Guitar fretboard visualiser: pick a root note + scale, see highlighted notes on an interactive neck.

## Stack

- React 19, TypeScript (strict), Vite 8, `react-router` 7. No UI, state or CSS libraries.
- Styling: plain global CSS with custom-property design tokens, BEM-ish class names. See the `design-system` skill.
- Tests: Vitest + React Testing Library (jsdom, `css: false`). See the `testing` skill.
- Node `>=24` (`.nvmrc`), npm 10.

## Commands

```sh
npm run dev       # Vite dev server
npm run lint      # eslint .
npm run build     # tsc -b && vite build  (use `npx tsc -b` for typecheck only)
npm test          # vitest run
```

Before finishing any change: `npm run lint && npx tsc -b && npm test` must all pass.

## Layout

```
src/
  components/Fretboard/   Fretboard, GuitarString, Fret, Note   (fretboard-component skill)
  components/Layout/      Layout, Header, Navigation
  pages/                  Home, FretboardPage, About, NotFound
  hooks/                  useMediaQuery / useBreakpoint
  styles/                 tokens.css, breakpoints.ts, globals/, components/, pages/
  utils/musicTheory/      helpers.ts: notes, scales, fretboard generation   (music-theory skill)
  types/                  music.ts (used), fretboard.ts (aspirational, mostly unused)
  data/api.ts             stub; no backend yet
  test/                   setup.ts, matchMedia.ts mock
```

`src/index.css` imports every stylesheet in a fixed order (tokens -> globals -> components -> pages). New CSS files must be added there.

## Conventions

- Formatting follows `.prettierrc` (single quotes, trailing commas, 120 cols, `arrowParens: avoid`); there is no npm script, so match the existing style by hand.
- Components are `React.FC<Props>` with a documented props interface and `export default`.
- Tests sit next to the code as `*.test.ts(x)`; query by role/label/text.
- Only add a design token when it is reused in more than one place.
- Commit messages: lowercase, imperative, no type prefix, e.g. `add vitest + react testing library with basic test coverage`.
- Don't create docs/README files unless asked.
