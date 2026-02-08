/**
 * Represents a musical note.
 */
export interface Note {
  // The note name (natural notes and sharps/flats)
  name: NoteName;

  // Octave number
  octave: number; // 0-10

  // Chromatic position (0-11, where C=0, C#=1, D=2, etc.)
  chromaticPosition: number;

  // Alternative names for enharmonic equivalents
  enharmonicNames: string[]; // ["C#", "Db"] for the same pitch

  // Display preference (sharp vs flat)
  displayMode: 'sharp' | 'flat' | 'natural';
}

/**
 * Standard note names including sharps and flats.
 */
export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

/**
 * Represents a musical scale or mode.
 */
export interface Scale {
  // Basic identification
  name: ScaleType;

  // Alternative names
  aliases: string[]; // ["Ionian"] for Major scale

  // Interval pattern from root note
  intervals: number[]; // [2, 2, 1, 2, 2, 2, 1] for major scale (semitones)

  // Scale degrees and their traditional names
  degrees: ScaleDegree[];

  // Mode information (if applicable)
  mode?: {
    parentScale: string;
    modeNumber: number; // 1-7 for traditional modes
    startingDegree: number;
  };

  // Common chord progressions in this scale
  commonProgressions: string[][]; // [["I", "V", "vi", "IV"], ["ii", "V", "I"]]

  // Characteristic intervals that define the scale
  characteristicIntervals: string[]; // ["major 7th", "tritone"] for lydian

  // Musical styles where this scale is commonly used
  genres: string[]; // ["jazz", "blues", "rock", "classical"]
}

/**
 * Represents a degree within a musical scale.
 */
interface ScaleDegree {
  degree: number; // 1-7 (or more for extended scales)
  name: string; // "root", "major second", "minor third", etc.
  abbreviation: string; // "R", "2", "b3", etc.
  intervalFromRoot: number; // Semitones from root
}

/**
 * Standard scale types and modes.
 */
export type ScaleType =
  | 'major'
  | 'natural minor'
  | 'harmonic minor'
  | 'melodic minor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'
  | 'pentatonic major'
  | 'pentatonic minor'
  | 'blues';

/**
 *  Represents a musical chord, including its quality, extensions, and common fingerings.
 */
export interface Chord {
  // Basic identification
  name: string; // "C", "Am", "G7", "Cmaj7", "F#dim"
  fullName: string; // "C Major", "A minor", "G Dominant 7th"

  // Chord quality and extensions
  root: Note;
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'major7' | 'minor7';
  extensions: string[]; // ["9", "11", "13"] for extended chords
  alterations: string[]; // ["b5", "#11"] for altered chords

  // Multiple fingering positions
  positions: ChordPosition[];

  // Chord tones and their functions
  chordTones: ChordTone[];

  // Common progressions this chord appears in
  commonProgressions: string[];

  // Difficulty level
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Barre chord information
  isBarreChord: boolean;
  barrePosition?: number; // Fret number where barre is applied
}

/**
 * Represents a specific fingering position for a chord on the guitar neck.
 */
interface ChordPosition {
  // Position name/identifier
  name: string; // "Open", "Barre 3rd fret", "Jazz voicing"

  // Starting fret for this position
  startFret: number;

  // Finger positions for each string (null = don't play, 0 = open)
  fingerPositions: (number | null)[]; // [3, 2, 0, 1, 0, 3] for G major open position

  // Which fingers to use (null = don't play, 0 = open)
  fingerNumbers: (number | null)[]; // [3, 2, 0, 1, 0, 4] corresponding to above

  // Muted strings
  mutedStrings: boolean[]; // [false, false, false, false, false, false]

  // Sound characteristics
  voicingType: 'open' | 'closed' | 'spread' | 'cluster';
}

/**
 *  Represents a single chord tone and its function within a chord.
 */
interface ChordTone {
  note: Note;
  intervalFromRoot: string; // "root", "major third", "perfect fifth", "minor seventh"
  degree: number; // 1, 3, 5, 7, 9, 11, 13
  function: 'root' | 'third' | 'fifth' | 'seventh' | 'extension' | 'tension';
}

/**
 *  Represents a guitar tuning configuration.
 */
export interface Tuning {
  // Tuning identification
  name: CommonTunings; // "Standard", "Drop D", "DADGAD", "Open G"

  // Alternative names
  aliases: string[]; // ["E Standard"] for standard tuning

  // Notes for each string (from lowest to highest pitch)
  stringNotes: Note[]; // [E2, A2, D3, G3, B3, E4] for standard tuning

  // Intervals between adjacent strings
  stringIntervals: number[]; // [5, 5, 5, 4, 5] semitones between strings

  // Common usage information
  genres: string[]; // ["rock", "metal", "folk"]

  // Common chord shapes that work well in this tuning
  favorableChords: string[];

  // Notable songs/artists that use this tuning
  famousUses: Array<{
    artist: string;
    song: string;
  }>;

  // Tuning instructions from standard tuning
  tuningSteps: Array<{
    stringNumber: number;
    direction: 'up' | 'down';
    semitones: number;
    targetNote: Note;
  }>;
}

/**
 * Standard tunings and popular alternate tunings for guitar.
 */
export type CommonTunings =
  | 'Standard'
  | 'Drop D'
  | 'DADGAD'
  | 'Open G'
  | 'Open D'
  | 'Open E'
  | 'Open A'
  | 'Open C'
  | 'Open F';
