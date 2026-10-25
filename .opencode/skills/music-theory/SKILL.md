---
name: music-theory
description: Use when working on music theory logic — notes, scales, modes, intervals, MIDI numbers, tuning, enharmonics, fret markers — in src/utils/musicTheory/helpers.ts or src/types/music.ts, or when adding a new scale type. Covers the helper API, conventions and the multi-file checklist for new scales.
---

# Music theory layer

Files: `src/utils/musicTheory/helpers.ts` (+ `helpers.test.ts`), `src/types/music.ts`.

Pure functions, no React. Test here first; these are the cheapest and most valuable tests in the project.

## Conventions

- Chromatic index: 0–11, C = 0. Normalise with `((n % 12) + 12) % 12`.
- MIDI: C4 = 60. Octave = `floor(midi / 12) - 1`.
- Standard tuning low -> high as MIDI: `[40, 45, 50, 55, 59, 64]` (E2 A2 D3 G3 B3 E4). Index 0 = low E.
- `displayMode: 'sharp' | 'flat' | 'natural'`; `'natural'` currently behaves like `'sharp'`.
- `NoteName` union includes both spellings (`'C#'` and `'Db'`); `noteNameToIndex` accepts either.
- Scale intervals are semitones from the root, root included, e.g. major `[0,2,4,5,7,9,11]`.

## Public API (helpers.ts)

| Function | Purpose |
|---|---|
| `noteNameToIndex(name)` | name -> 0–11 |
| `indexToNoteName(index, displayMode)` | 0–11 -> name |
| `midiToNote(midi, displayMode)` / `createNote(name, octave, displayMode)` | build a `Note` |
| `noteAtFret(openMidi, fret, displayMode)` | note on a string at a fret |
| `getStandardTuningMidi()` | copy of standard tuning |
| `getScaleNoteIndices(root, scaleType)` -> `Set<number>` | chromatic indices in scale |
| `getScaleNoteNames(root, scaleType, displayMode)` | note names in scale |
| `getNoteHighlightType(noteIndex, rootIndex, scaleIndices)` | `'root' \| 'scale' \| 'none'` |
| `generateFretboardNotes(root, scaleType, numFrets=12, displayMode, tuningMidi)` -> `FretboardNote[][]` | strings x frets, index 0 = low E, fret 0 = open |
| `hasFretMarker(fret)` | `'single'` (3,5,7,9,15,17,19,21) / `'double'` (12,24) / `'none'` |

`FretboardNote = { stringIndex, fret, note, highlightType: 'root'|'scale'|'chord'|'none' }`.

## Adding a scale — three places

1. `ScaleType` union in `src/types/music.ts`.
2. `SCALE_INTERVALS` in `helpers.ts` (TS will error until it is added).
3. `SCALE_TYPES` label list in `src/pages/FretboardPage.tsx`.
4. Add a case to `helpers.test.ts` (interval set and one `getScaleNoteNames` example).

## Not implemented yet

Chords, alternate tunings (API accepts `tuningMidi` but the UI doesn't), intervals/degree names. `types/music.ts` contains richer `Scale`, `Chord`, `Tuning` interfaces that are not yet used by the helpers; `src/data/api.ts` is an empty stub for a future backend.
