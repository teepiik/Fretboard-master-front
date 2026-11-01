---
name: music-theory
description: Use when working on music theory logic — notes, scales, intervals, MIDI numbers, tuning, enharmonics, fret markers — in src/utils/musicTheory/fretboard.ts, src/types/music.ts, the API client (src/api, src/data/api.ts) or when adding a new scale/tuning. Covers the split between backend catalogue and frontend fretboard maths, the helper API and the contract-change workflow.
---

# Music theory layer

## Split of responsibilities

- **Backend (`../Fretboard-master-uxapi`)** owns the *catalogue*: scale formulas (`GET /theory/scales`), tunings (`GET /theory/tunings`), chord/scale analysis (`POST /theory/analyze`). It publishes an OpenAPI spec (`openapi.json`, Swagger UI at `/docs`).
- **Frontend** owns the *fretboard maths*: given a `Scale` (intervals) and a `Tuning` (MIDI numbers) from the backend, `src/utils/musicTheory/fretboard.ts` computes which note sits on every string/fret and how it is highlighted. No network call is needed when root/scale/frets change.

Files: `src/utils/musicTheory/fretboard.ts` (+ test), `src/types/music.ts`, `src/api/{client.ts,schema.d.ts}`, `src/data/api.ts`, `src/hooks/{useAsyncData,useMusicData}.ts`, `src/components/Fretboard/fretMarkers.ts`.

## Types (`src/types/music.ts`)

From the generated spec (`components['schemas']`): `NoteName`, `ScaleId`, `TuningId`, `Scale`, `Tuning`, `AnalyzeResponse`, `DiatonicChord`.
Frontend-owned: `DisplayMode = 'sharp' | 'flat'`, `Highlight = 'root'|'scale'|'chord'|'none'`, `Note`, `FretboardNote`, `ROOT_NOTES`, `STANDARD_TUNING`.

Never import `components[...]` paths in components; add an alias in `types/music.ts` instead.

## Conventions

- Chromatic index: 0–11, C = 0. Normalise with `((n % 12) + 12) % 12`.
- MIDI: C4 = 60. Octave = `floor(midi / 12) - 1`.
- Tuning MIDI arrays are lowest string first; index 0 = low E in standard tuning `[40,45,50,55,59,64]`.
- Scale `intervals` are semitones from the root, root included, e.g. major `[0,2,4,5,7,9,11]`.
- Scale ids are kebab-case (`natural-minor`, `minor-pentatonic`); display names come from the backend.

## Public API (fretboard.ts)

| Function | Purpose |
|---|---|
| `noteNameToIndex(name)` | name -> 0–11 (sharps or flats) |
| `indexToNoteName(index, displayMode)` | 0–11 -> name |
| `midiToNote(midi, displayMode)` | build a `Note` |
| `getScaleNoteIndices(root, scale)` -> `Set<number>` | chromatic indices in scale |
| `getScaleNoteNames(root, scale, displayMode)` | note names in scale |
| `getHighlight(noteIndex, rootIndex, scaleIndices)` | `'root' \| 'scale' \| 'none'` |
| `generateFretboardNotes({ root, scale, tuning, numFrets, displayMode })` -> `FretboardNote[][]` | strings x frets, index 0 = lowest string, fret 0 = open |

`hasFretMarker(fret)` lives in `components/Fretboard/fretMarkers.ts` (UI concern).

## Data fetching

`src/data/api.ts` wraps the `openapi-fetch` client (`getScales`, `getTunings`, `analyzeNotes`) and throws `ApiError`. `useScales()` / `useTunings()` in `hooks/useMusicData.ts` cache per key via `useAsyncData` (external store, abortable, `retry()`).

Base URL: `VITE_API_BASE_URL` (default `http://localhost:4000`). Tests never hit the network — `src/test/fakeApi.ts` stubs `fetch` (installed in `setup.ts`).

## Adding a scale or tuning

1. Add the formula in the **backend** (`src/domain/scales/scales.ts` or `tunings/tunings.ts`), run `npm run openapi:export` there and commit `openapi.json`.
2. In the frontend run `npm run api:generate` (reads `../Fretboard-master-uxapi/openapi.json`, or `OPENAPI_SPEC=<url|path>`); commit `src/api/schema.d.ts`. `ScaleId`/`TuningId` unions update automatically.
3. Nothing else: the dropdown is populated from the API. Add to `FAKE_SCALES` in `src/test/fakeApi.ts` only if a test needs it.

## Not implemented yet

Tuning selector in the UI (`useTunings` exists, `Fretboard` accepts `tuning`), `displayMode` and `onNoteClick` wiring from the page, chord highlighting (`'chord'` state is styled but never produced), using `analyzeNotes` anywhere.
