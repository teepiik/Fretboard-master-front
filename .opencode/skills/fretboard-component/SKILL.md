---
name: fretboard-component
description: Use when changing the fretboard UI — Fretboard, GuitarString, Fret or Note components, FretboardPage, fretboard.css, orientation (horizontal/vertical), strings, frets, note circles, fret markers. Covers DOM structure, string index conventions and the test hooks that must be preserved.
---

# Fretboard component

Files: `src/components/Fretboard/{Fretboard,GuitarString,Fret,Note}.tsx`, `src/styles/components/fretboard.css`, `src/pages/FretboardPage.tsx`, `src/styles/pages/fretboard-page.css`.

Pure DOM + flexbox, no SVG/canvas. Data comes from `generateFretboardNotes()` (see `music-theory` skill).

## DOM structure

```
div.fretboard[.fretboard--vertical]  role=grid  aria-label="Guitar fretboard"  data-orientation
  div.fretboard__fret-numbers  role=row
    div.fretboard__fret-number[--open]  role=columnheader   (0..numFrets; span number + .fretboard__dot markers)
  div.fretboard__strings
    div.guitar-string.guitar-string--thin|medium|thick  data-string=1..6
      div.guitar-string__line
      div.guitar-string__frets
        div.fret[.fret--open][.fret--marker-single|double]  data-fret=N
          div.fret__wire            (not on open fret)
          div.fret__note-wrapper
            div.note-circle.note-circle--root|scale|chord  role=button  (null when state is 'none')
              span.note-circle__label
```

The DOM is identical in both orientations; `orientation` only toggles the `fretboard--vertical` class and layout is CSS-only.

## Two string conventions — do not mix them

| Where | Name | Meaning |
|---|---|---|
| Data (`FretboardNote.stringIndex`, `onNoteClick(stringIndex, fret)`) | `stringIndex` | 0 = low E ... 5 = high E |
| DOM (`data-string`, `GuitarString.stringNumber`) | `stringNumber` | 1 = high E ... 6 = low E |

`Fretboard` reverses the data array so high E renders first (top row horizontally). Vertically, `.fretboard__strings` uses `row-reverse` so low E is on the left (chord-diagram convention).

## Props

`Fretboard`: `rootNote`, `scaleType`, `numFrets=12`, `showNoteNames=true`, `displayMode='sharp'|'flat'|'natural'`, `onNoteClick?(stringIndex, fret)`, `orientation='horizontal'|'vertical'`.

`FretboardPage` owns state (`rootNote`, `scaleType`, `showNoteNames`, `numFrets` of 12|22|24) and picks orientation with `useBreakpoint('mobile')`. On mobile it adds `.fretboard-page--mobile` and drops the Root/Scale summary; the legend stays. `displayMode` and `onNoteClick` are not yet wired from the page.

## Styling

All dimensions come from the `--fret-*` / `--note-*` tokens; breakpoints override tokens only (see `design-system` skill). Nut width, string-line offset and fret width are all derived from `--fret-nut-size` / `--fret-size`, so never hard-code those px values in a rule.

## Test hooks (tests depend on these — keep them)

`role="grid"` + `aria-label`, `role="columnheader"` (count = numFrets + 1), `.guitar-string`, `.guitar-string--thin/--thick`, `data-string`, `data-fret`, `.note-circle`, `.note-circle--root/--scale`, `.note-circle__label`, `data-orientation`; page labels "Root Note", "Scale", "Frets", /show note names/i, heading "Fretboard", text "Root:"/"Scale:"/"Scale note".

## Notes

- `src/types/fretboard.ts` (`Fret`, `GuitarString`, `Fretboard` interfaces) is aspirational and not used by the components; don't import it expecting it to match the runtime shape. Runtime type is `FretboardNote` in `helpers.ts`.
- `fretboard-page.css` has scaffolding for unimplemented UI (`.control-tabs`, `.chords-panel`, `.settings-panel`, `.toggle-controls-btn`). Reuse rather than duplicate if you implement those.
- Chord highlighting (`'chord'` state, `--color-chord-tone`) is styled but never produced by the data layer yet.
