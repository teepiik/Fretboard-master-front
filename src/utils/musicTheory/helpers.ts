import type { NoteName, Note, ScaleType } from '../../types/music';

// ── Chromatic scale ─────────────────────────────────────────────────
const CHROMATIC_SHARPS: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const CHROMATIC_FLATS: NoteName[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// ── Scale interval patterns (in semitones from root) ────────────────
const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  'natural minor': [0, 2, 3, 5, 7, 8, 10],
  'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
  'melodic minor': [0, 2, 3, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  'pentatonic major': [0, 2, 4, 7, 9],
  'pentatonic minor': [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
};

// ── Standard tuning (low E → high E) ───────────────────────────────
const STANDARD_TUNING_MIDI: number[] = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Convert a note name to its chromatic index (0–11).
 */
export function noteNameToIndex(name: NoteName): number {
  const idx = CHROMATIC_SHARPS.indexOf(name);
  if (idx !== -1) return idx;
  return CHROMATIC_FLATS.indexOf(name);
}

/**
 * Get the note name at a chromatic index using the preferred display mode.
 */
export function indexToNoteName(index: number, displayMode: 'sharp' | 'flat' | 'natural' = 'sharp'): NoteName {
  const i = ((index % 12) + 12) % 12;
  return displayMode === 'flat' ? CHROMATIC_FLATS[i] : CHROMATIC_SHARPS[i];
}

/**
 * Create a Note object from a MIDI-style number (C4 = 60).
 */
export function midiToNote(midi: number, displayMode: 'sharp' | 'flat' | 'natural' = 'sharp'): Note {
  const chromaticPosition = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = indexToNoteName(chromaticPosition, displayMode);
  return { name, octave, chromaticPosition, displayMode };
}

/**
 * Build a Note from a name + octave (convenience).
 */
export function createNote(name: NoteName, octave: number, displayMode: 'sharp' | 'flat' | 'natural' = 'sharp'): Note {
  return { name, octave, chromaticPosition: noteNameToIndex(name), displayMode };
}

/**
 * Get the note at a given fret on a string whose open note is `openMidi`.
 */
export function noteAtFret(openMidi: number, fret: number, displayMode: 'sharp' | 'flat' | 'natural' = 'sharp'): Note {
  return midiToNote(openMidi + fret, displayMode);
}

/**
 * Return the MIDI values for standard tuning (or a given tuning).
 */
export function getStandardTuningMidi(): number[] {
  return [...STANDARD_TUNING_MIDI];
}

// ── Scale helpers ───────────────────────────────────────────────────

/**
 * Given a root note name and a scale type, return the set of chromatic
 * indices (0–11) that belong to the scale.
 */
export function getScaleNoteIndices(root: NoteName, scaleType: ScaleType): Set<number> {
  const rootIndex = noteNameToIndex(root);
  const intervals = SCALE_INTERVALS[scaleType];
  if (!intervals) return new Set();
  return new Set(intervals.map(i => (rootIndex + i) % 12));
}

/**
 * Return the note names that make up a scale.
 */
export function getScaleNoteNames(
  root: NoteName,
  scaleType: ScaleType,
  displayMode: 'sharp' | 'flat' | 'natural' = 'sharp',
): NoteName[] {
  const rootIndex = noteNameToIndex(root);
  const intervals = SCALE_INTERVALS[scaleType];
  if (!intervals) return [];
  return intervals.map(i => indexToNoteName(rootIndex + i, displayMode));
}

/**
 * Determine the highlight type for a note given active scale context.
 */
export function getNoteHighlightType(
  noteIndex: number,
  rootIndex: number,
  scaleIndices: Set<number>,
): 'root' | 'scale' | 'none' {
  const n = ((noteIndex % 12) + 12) % 12;
  const r = ((rootIndex % 12) + 12) % 12;
  if (n === r) return 'root';
  if (scaleIndices.has(n)) return 'scale';
  return 'none';
}

// ── Fretboard generation ────────────────────────────────────────────

export interface FretboardNote {
  stringIndex: number; // 0 = lowest (low E), 5 = highest (high E)
  fret: number;
  note: Note;
  highlightType: 'root' | 'scale' | 'chord' | 'none';
}

/**
 * Generate a 2D array of fretboard notes (strings × frets) with highlight
 * info based on the active scale.
 */
export function generateFretboardNotes(
  rootNote: NoteName,
  scaleType: ScaleType,
  numFrets: number = 12,
  displayMode: 'sharp' | 'flat' | 'natural' = 'sharp',
  tuningMidi: number[] = STANDARD_TUNING_MIDI,
): FretboardNote[][] {
  const rootIndex = noteNameToIndex(rootNote);
  const scaleIndices = getScaleNoteIndices(rootNote, scaleType);

  return tuningMidi.map((openMidi, stringIndex) => {
    const frets: FretboardNote[] = [];
    for (let fret = 0; fret <= numFrets; fret++) {
      const note = noteAtFret(openMidi, fret, displayMode);
      const highlightType = getNoteHighlightType(note.chromaticPosition, rootIndex, scaleIndices);
      frets.push({ stringIndex, fret, note, highlightType });
    }
    return frets;
  });
}

// ── Fret marker positions (standard inlays) ────────────────────────
export const SINGLE_DOT_FRETS = [3, 5, 7, 9, 15, 17, 19, 21];
export const DOUBLE_DOT_FRETS = [12, 24];

export function hasFretMarker(fret: number): 'single' | 'double' | 'none' {
  if (DOUBLE_DOT_FRETS.includes(fret)) return 'double';
  if (SINGLE_DOT_FRETS.includes(fret)) return 'single';
  return 'none';
}
