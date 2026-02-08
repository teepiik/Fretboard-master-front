import type { Chord, Note, Scale, Tuning } from './music';

/**
 * Represents a single fret on the guitar neck.
 */
export interface Fret {
  // Position on the neck (0 = open string, 1 = first fret, etc.)
  position: number; // 0-24 typically

  // The note at this fret position
  note: Note;

  // Visual state for highlighting
  isHighlighted: boolean;

  // Type of highlight (for different colors/styles)
  highlightType: 'root' | 'scaleNote' | 'chordTone' | 'interval' | 'none';

  // Display options
  showNoteName: boolean;
  showInterval: boolean;
  showFingerNumber: boolean;

  // Finger placement for chord shapes
  fingerNumber?: number; // 1-4 (index, middle, ring, pinky) or null for open

  // Whether this fret is muted in current chord/scale
  isMuted: boolean;

  // Visual styling properties
  color?: string;
  opacity?: number;

  // Interactive state
  isPressed: boolean;
  isHovered: boolean;
}

/**
 * Represents a single string on the guitar.
 */
export interface GuitarString {
  // String identification
  stringNumber: number; // 1-6 (1 = high E, 6 = low E)

  // Open string tuning
  openNote: Note; // The note when string is played open

  // All frets on this string
  frets: Fret[]; // Array of fret objects, typically 0-24
}

/**
 * Represents the entire fretboard state and configuration.
 */
export interface Fretboard {
  // All strings on the guitar
  strings: GuitarString[]; // Array of 6 strings (or more for extended range guitars)

  // Current tuning being used
  tuning: Tuning;

  // Display range
  startFret: number; // Usually 0 (open)
  endFret: number; // Usually 12, 15, or 24

  // Active scale/mode
  activeScale?: Scale;
  rootNote?: Note;

  // Active chord
  activeChord?: Chord;

  // Display preferences
  showNoteNames: boolean;
  showIntervals: boolean;
  showFingerNumbers: boolean;
  showFretNumbers: boolean;
  showStringNumbers: boolean;

  // Visual settings
  colorScheme: 'default' | 'colorBlind' | 'dark' | 'light';
  noteNamingConvention: 'sharps' | 'flats' | 'mixed';

  // Interactive state
  selectedNotes: Note[]; // Notes currently selected/highlighted
  hoveredFret?: { stringNumber: number; fretNumber: number };
}

// For fretboard position calculations
export interface FretPosition {
  stringNumber: number; // 1-6
  fretNumber: number; // 0-24
  note: Note;
}

// For visual styling and themes
export interface FretboardTheme {
  name: string; // TODO Type from DS tokens
  colors: {
    root: string;
    scaleNote: string;
    chordTone: string;
    fretboard: string;
    strings: string;
    fretMarkers: string;
  };
}
