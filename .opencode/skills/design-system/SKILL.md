---
name: design-system
description: Use when editing CSS, design tokens, colors, spacing, typography, breakpoints or responsive/mobile styles in this project (src/styles/**, tokens.css, breakpoints.ts, index.css). Covers token naming, the breakpoint sync rule, and how media queries should override tokens.
---

# Design system

All styling is plain global CSS. No CSS modules, preprocessors or CSS-in-JS.

## Files

- `src/styles/tokens.css` — single source of truth, all custom properties on `:root`.
- `src/styles/breakpoints.ts` — JS mirror of the `--bp-*` tokens + `mediaMaxWidth()`.
- `src/hooks/useMediaQuery.ts` — `useMediaQuery(query)`, `useBreakpoint('mobile' | 'tablet' | 'laptop')`.
- `src/styles/globals/` reset, base, layout. `components/` one file per component. `pages/` one per page.
- `src/index.css` imports everything in order tokens -> globals -> components -> pages. **Add new CSS files here or they are never loaded.**

## Token categories (names in tokens.css)

| Group | Examples |
|---|---|
| Palette | `--color-neutral-50..900`, `--color-blue-500/600/700`, `--color-green-500`, `--color-red-500`, `--color-golden-brown` |
| Semantic | `--color-primary(-hover)`, `--color-text(-muted)`, `--color-bg`, `--color-surface`, `--color-border(-hover)`, `--color-header-*`, `--color-nav-hover` |
| Music | `--color-root-note`, `--color-scale-note`, `--color-chord-tone`, `--color-fret-marker`, `--color-string`, `--color-fretboard` |
| Spacing (4px base) | `--space-0-5`, `--space-1..6`, `--space-8`, `--space-12`, `--space-16` |
| Layout | `--header-height`, `--max-content-width`, `--z-header` |
| Breakpoints | `--bp-mobile: 640px`, `--bp-tablet: 768px`, `--bp-laptop: 1024px` |
| Fretboard sizing | `--fret-size`, `--fret-nut-size`, `--fret-cross`, `--fret-number-size`, `--fret-nut-border`, `--fret-marker-dot`, `--note-size`, `--note-label-size`, `--touch-target-min` |
| Typography | `--font-sans/mono`, `--text-xs..5xl`, `--leading-*`, `--font-medium/semibold/bold` |
| Borders | `--border`, `--radius-sm/..xl/full` |
| Shadows / focus | `--shadow-sm..xl`, `--ring-width/offset/color` |
| Motion | `--duration`, `--ease`, `--transition-all/colors/shadow/transform` |

Rules:

- Use semantic tokens in components (`--color-text`), palette tokens only inside tokens.css.
- Only add a token when it is reused in more than one place. Use a literal otherwise.
- Colours in components always come from tokens; `rgba(255,255,255,.06)`-style overlays are the accepted exception.

## Breakpoints

- Desktop-first, `@media (max-width: Npx)`. Values: 1024 / 768 / 640 / 480.
- CSS media queries cannot read custom properties, so the literal px is written in each query. The canonical values are documented in `tokens.css` (`--bp-*`) and used at runtime from `breakpoints.ts`. **If you change one, change both.**
- `640px` is "mobile": `FretboardPage` applies `.fretboard-page--mobile` via `useBreakpoint('mobile')` and renders the fretboard vertically. Page-level mobile rules are scoped under that class.
- When a layout change needs JS (e.g. different props or markup), use `useBreakpoint`. When it is purely visual, use a media query.

## Component-token pattern

Size-heavy components (fretboard) read every dimension from component tokens. Breakpoints then override the tokens on the component root instead of re-declaring rules:

```css
.fret { flex: 0 0 var(--fret-size); }
@media (max-width: 768px) {
  .fretboard { --fret-size: 48px; --note-size: 22px; }
}
```

Follow this pattern for any new component that has to resize at breakpoints.

## Class naming

BEM-ish: `.block`, `.block__element`, `.block--modifier` (e.g. `.fretboard--vertical`, `.guitar-string--thick`). Page files use looser names (`.controls-sidebar`, `.legend-item`); keep consistent within a file.

## Checklist for a CSS change

1. Does the value already exist as a token? Use it.
2. Does the new file appear in `src/index.css`?
3. Did a breakpoint value change? Update `tokens.css` and `breakpoints.ts`.
4. CSS is not loaded in tests (`css: false`); verify visually with `npm run dev`.
