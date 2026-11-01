import type { DisplayMode, FretboardNote, Highlight, Note, NoteName, Scale, Tuning } from '../../types/music';

// ── Chromatic scale ─────────────────────────────────────────────────
const CHROMATIC_SHARPS: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLATS: NoteName[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const mod12 = (n: number) => ((n % 12) + 12) % 12;

// ── Note helpers ────────────────────────────────────────────────────

/** Chromatic index (0-11) of a note name; accepts sharps and flats. Returns -1 if unknown. */
export function noteNameToIndex(name: NoteName): number {
  const idx = CHROMATIC_SHARPS.indexOf(name);
  return idx !== -1 ? idx : CHROMATIC_FLATS.indexOf(name);
}

/** Note name at a chromatic index (wraps around 12), spelled per display mode. */
export function indexToNoteName(index: number, displayMode: DisplayMode = 'sharp'): NoteName {
  const i = mod12(index);
  return displayMode === 'flat' ? CHROMATIC_FLATS[i] : CHROMATIC_SHARPS[i];
}

/** Build a Note from a MIDI number (C4 = 60). */
export function midiToNote(midi: number, displayMode: DisplayMode = 'sharp'): Note {
  const chromaticPosition = mod12(midi);
  return { name: indexToNoteName(chromaticPosition, displayMode), octave: Math.floor(midi / 12) - 1, chromaticPosition };
}

// ── Scale helpers (driven by backend Scale.intervals) ───────────────

/** Chromatic indices (0-11) that belong to `scale` built on `root`. */
export function getScaleNoteIndices(root: NoteName, scale: Scale): Set<number> {
  const rootIndex = noteNameToIndex(root);
  return new Set(scale.intervals.map(i => mod12(rootIndex + i)));
}

/** Note names of `scale` built on `root`, starting from the root. */
export function getScaleNoteNames(root: NoteName, scale: Scale, displayMode: DisplayMode = 'sharp'): NoteName[] {
  const rootIndex = noteNameToIndex(root);
  return scale.intervals.map(i => indexToNoteName(rootIndex + i, displayMode));
}

/** Classify a chromatic position against the active root and scale. */
export function getHighlight(noteIndex: number, rootIndex: number, scaleIndices: Set<number>): Highlight {
  const n = mod12(noteIndex);
  if (n === mod12(rootIndex)) return 'root';
  if (scaleIndices.has(n)) return 'scale';
  return 'none';
}

// ── Fretboard generation ────────────────────────────────────────────

export interface FretboardOptions {
  root: NoteName;
  scale: Scale;
  tuning: Tuning;
  /** Highest fret to include (0 = open string is always included). */
  numFrets: number;
  displayMode?: DisplayMode;
}

/**
 * Build the fretboard as strings x frets, lowest string first (index 0), with each position
 * classified against the active scale.
 */
export function generateFretboardNotes({
  root,
  scale,
  tuning,
  numFrets,
  displayMode = 'sharp',
}: FretboardOptions): FretboardNote[][] {
  const rootIndex = noteNameToIndex(root);
  const scaleIndices = getScaleNoteIndices(root, scale);

  return tuning.midi.map((openMidi, stringIndex) => {
    const frets: FretboardNote[] = [];
    for (let fret = 0; fret <= numFrets; fret++) {
      const note = midiToNote(openMidi + fret, displayMode);
      frets.push({ stringIndex, fret, note, highlight: getHighlight(note.chromaticPosition, rootIndex, scaleIndices) });
    }
    return frets;
  });
}
