# Fretboard Master

This is Fretboard Master frontend

## QA and testing

Quality checks run locally with:

```sh
npm run lint    # ESLint (TypeScript, React hooks, React refresh)
npm run build   # tsc type check + Vite production build
npm test        # Vitest, single run
npm run test:watch
```

Tests use [Vitest](https://vitest.dev) with [React Testing Library](https://testing-library.com/react) in a jsdom environment. Config lives in `vite.config.ts` (`test` block) and `src/test/setup.ts` (jest-dom matchers, automatic cleanup). Test files sit next to the code they cover as `*.test.ts(x)`.

What is covered, and the intent behind each layer:

- `src/utils/musicTheory/helpers.test.ts` – pure music theory logic (note/MIDI conversion, scale construction, fretboard generation, fret markers). Cheapest and most valuable tests; add here first when changing theory code.
- `src/components/Fretboard/Fretboard.test.tsx` – rendering of strings/frets, root/scale highlighting, note label toggle, click callback.
- `src/pages/FretboardPage.test.tsx` – user flow: changing root, scale, fret count and labels updates the board and summary.
- `src/App.test.tsx` – routing through `Layout` with a `MemoryRouter` (home, fretboard, about, 404, active nav state).

Guidelines:

- Query by role, label or text (what the user sees), not by implementation details. Use `data-*`/class selectors only for fretboard geometry where no accessible handle exists.
- Prefer `@testing-library/user-event` over `fireEvent`.
- Keep coverage focused on main behaviour rather than exhaustive; CSS is not loaded in tests, so visual checks belong in a browser (e.g. Playwright) if added later.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
