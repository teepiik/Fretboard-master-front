import { describe, it, expect } from 'vitest';
import {
  noteNameToIndex,
  indexToNoteName,
  midiToNote,
  getScaleNoteNames,
  getScaleNoteIndices,
  getHighlight,
  generateFretboardNotes,
} from './fretboard';
import { STANDARD_TUNING, type Scale } from '../../types/music';

const MAJOR: Scale = { id: 'major', name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] };
const NATURAL_MINOR: Scale = { id: 'natural-minor', name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] };
const MINOR_PENT: Scale = { id: 'minor-pentatonic', name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] };

describe('note conversion', () => {
  it('maps note names to chromatic indices, including flats', () => {
    expect(noteNameToIndex('C')).toBe(0);
    expect(noteNameToIndex('Db')).toBe(1);
    expect(noteNameToIndex('B')).toBe(11);
  });

  it('maps indices back to names and wraps around 12', () => {
    expect(indexToNoteName(13)).toBe('C#');
    expect(indexToNoteName(-1)).toBe('B');
    expect(indexToNoteName(1, 'flat')).toBe('Db');
  });

  it('converts MIDI numbers to notes (C4 = 60)', () => {
    expect(midiToNote(60)).toEqual({ name: 'C', octave: 4, chromaticPosition: 0 });
    expect(midiToNote(40)).toMatchObject({ name: 'E', octave: 2 });
    expect(midiToNote(70, 'flat')).toMatchObject({ name: 'Bb', octave: 4 });
  });
});

describe('scales from backend intervals', () => {
  it('builds note names from a root and interval formula', () => {
    expect(getScaleNoteNames('C', MAJOR)).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    expect(getScaleNoteNames('A', NATURAL_MINOR)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    expect(getScaleNoteNames('F', MAJOR, 'flat')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
  });

  it('returns scale indices as a wrapped set', () => {
    expect([...getScaleNoteIndices('G', MAJOR)].sort((a, b) => a - b)).toEqual([0, 2, 4, 6, 7, 9, 11]);
  });

  it('classifies notes as root, scale, or none', () => {
    const cMajor = getScaleNoteIndices('C', MAJOR);
    expect(getHighlight(12, 0, cMajor)).toBe('root');
    expect(getHighlight(4, 0, cMajor)).toBe('scale');
    expect(getHighlight(1, 0, cMajor)).toBe('none');
  });
});

describe('generateFretboardNotes', () => {
  const base = { root: 'C' as const, scale: MAJOR, tuning: STANDARD_TUNING, numFrets: 12 };

  it('produces one row per tuning string with numFrets + 1 positions each', () => {
    const board = generateFretboardNotes(base);
    expect(board).toHaveLength(6);
    expect(board.every(s => s.length === 13)).toBe(true);
    expect(board.map(s => s[0].note.name)).toEqual(['E', 'A', 'D', 'G', 'B', 'E']);
  });

  it('highlights root and scale notes on the low E string', () => {
    const lowE = generateFretboardNotes(base)[0];
    expect(lowE[0]).toMatchObject({ stringIndex: 0, fret: 0, highlight: 'scale' });
    expect(lowE[2].highlight).toBe('none');
    expect(lowE[8]).toMatchObject({ note: { name: 'C', octave: 3 }, highlight: 'root' });
  });

  it('works for pentatonic scales and alternate tunings', () => {
    const dropD = { id: 'drop-d' as const, name: 'Drop D', midi: [38, 45, 50, 55, 59, 64] };
    const board = generateFretboardNotes({ ...base, root: 'A', scale: MINOR_PENT, tuning: dropD, numFrets: 5 });
    expect(board[0][0].note.name).toBe('D');
    expect(board[0][0].highlight).toBe('scale');
    expect(board[0][5].note.name).toBe('G');
  });
});
