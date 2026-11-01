/**
 * Music theory types for the frontend.
 *
 * Catalogue types (scales, tunings, note names, analysis) are derived from the backend OpenAPI
 * spec via the generated `src/api/schema.d.ts` (`npm run api:generate`). Fretboard geometry types
 * are owned by the frontend, which builds the neck from a scale's intervals and a tuning's MIDI
 * numbers.
 */
import type { components } from '../api/schema';

type Schemas = components['schemas'];

// ── From the API ────────────────────────────────────────────────────

/** A note name: natural with an optional single sharp or flat, e.g. "C", "F#", "Bb". */
export type NoteName = Schemas['NoteName'];

/** Stable identifier of a scale known to the backend, e.g. "major", "minor-pentatonic". */
export type ScaleId = Schemas['ScaleId'];

/** Stable identifier of a tuning known to the backend, e.g. "standard", "drop-d". */
export type TuningId = Schemas['TuningId'];

/** Scale catalogue entry: id, display name and semitone intervals from the root. */
export type Scale = Schemas['Scale'];

/** Tuning catalogue entry: id, display name and open-string MIDI numbers (lowest first). */
export type Tuning = Schemas['Tuning'];

/** Result of analysing a set of notes. */
export type AnalyzeResponse = Schemas['AnalyzeResponse'];
export type DiatonicChord = Schemas['DiatonicChord'];

// ── Frontend-owned ──────────────────────────────────────────────────

/** Whether accidentals are spelled as sharps or flats. */
export type DisplayMode = 'sharp' | 'flat';

/** How a fretboard position relates to the active scale. */
export type Highlight = 'root' | 'scale' | 'chord' | 'none';

/** A pitch at a specific octave. */
export interface Note {
  name: NoteName;
  /** Scientific pitch octave (C4 = middle C). */
  octave: number;
  /** 0 = C ... 11 = B */
  chromaticPosition: number;
}

/** One fret position on one string. */
export interface FretboardNote {
  /** 0 = lowest-pitched string. */
  stringIndex: number;
  fret: number;
  note: Note;
  highlight: Highlight;
}

/** The twelve chromatic roots offered in the UI (sharp spelling). */
export const ROOT_NOTES: readonly NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Standard tuning used until the tunings catalogue is wired into the UI. */
export const STANDARD_TUNING: Tuning = {
  id: 'standard',
  name: 'Standard (E A D G B E)',
  midi: [40, 45, 50, 55, 59, 64],
};
