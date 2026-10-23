import { describe, it, expect } from 'vitest';
import {
  noteNameToIndex,
  indexToNoteName,
  midiToNote,
  noteAtFret,
  getStandardTuningMidi,
  getScaleNoteNames,
  getScaleNoteIndices,
  getNoteHighlightType,
  generateFretboardNotes,
  hasFretMarker,
} from './helpers';

describe('note conversion', () => {
  it('maps note names to chromatic indices, including flats', () => {
    expect(noteNameToIndex('C')).toBe(0);
    expect(noteNameToIndex('C#')).toBe(1);
    expect(noteNameToIndex('Db')).toBe(1);
    expect(noteNameToIndex('B')).toBe(11);
  });

  it('maps indices back to names and wraps around 12', () => {
    expect(indexToNoteName(0)).toBe('C');
    expect(indexToNoteName(13)).toBe('C#');
    expect(indexToNoteName(-1)).toBe('B');
    expect(indexToNoteName(1, 'flat')).toBe('Db');
  });

  it('converts MIDI numbers to notes (C4 = 60)', () => {
    expect(midiToNote(60)).toMatchObject({ name: 'C', octave: 4, chromaticPosition: 0 });
    expect(midiToNote(40)).toMatchObject({ name: 'E', octave: 2 });
    expect(midiToNote(70, 'flat')).toMatchObject({ name: 'Bb', octave: 4 });
  });

  it('computes the note at a fret from the open string', () => {
    const lowE = getStandardTuningMidi()[0];
    expect(noteAtFret(lowE, 0).name).toBe('E');
    expect(noteAtFret(lowE, 5).name).toBe('A');
    expect(noteAtFret(lowE, 12)).toMatchObject({ name: 'E', octave: 3 });
  });

  it('returns standard tuning E A D G B E as a copy', () => {
    const tuning = getStandardTuningMidi();
    expect(tuning.map(m => midiToNote(m).name)).toEqual(['E', 'A', 'D', 'G', 'B', 'E']);
    tuning[0] = 0;
    expect(getStandardTuningMidi()[0]).toBe(40);
  });
});

describe('scales', () => {
  it('builds C major', () => {
    expect(getScaleNoteNames('C', 'major')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('builds A natural minor and E minor pentatonic', () => {
    expect(getScaleNoteNames('A', 'natural minor')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    expect(getScaleNoteNames('E', 'pentatonic minor')).toEqual(['E', 'G', 'A', 'B', 'D']);
  });

  it('respects flat display mode', () => {
    expect(getScaleNoteNames('F', 'major', 'flat')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
  });

  it('returns scale indices as a wrapped set', () => {
    expect([...getScaleNoteIndices('G', 'major')].sort((a, b) => a - b)).toEqual([0, 2, 4, 6, 7, 9, 11]);
  });

  it('classifies notes as root, scale, or none', () => {
    const cMajor = getScaleNoteIndices('C', 'major');
    expect(getNoteHighlightType(0, 0, cMajor)).toBe('root');
    expect(getNoteHighlightType(12, 0, cMajor)).toBe('root');
    expect(getNoteHighlightType(4, 0, cMajor)).toBe('scale');
    expect(getNoteHighlightType(1, 0, cMajor)).toBe('none');
  });
});

describe('generateFretboardNotes', () => {
  it('produces 6 strings with numFrets + 1 positions each', () => {
    const board = generateFretboardNotes('C', 'major', 12);
    expect(board).toHaveLength(6);
    board.forEach((s, i) => {
      expect(s).toHaveLength(13);
      expect(s[0].stringIndex).toBe(i);
    });
  });

  it('places open string notes correctly in standard tuning', () => {
    const board = generateFretboardNotes('C', 'major');
    expect(board.map(s => s[0].note.name)).toEqual(['E', 'A', 'D', 'G', 'B', 'E']);
  });

  it('highlights root and scale notes', () => {
    const board = generateFretboardNotes('A', 'pentatonic minor');
    const lowE = board[0];
    expect(lowE[5].highlightType).toBe('root'); // A on 5th fret
    expect(lowE[3].highlightType).toBe('scale'); // G
    expect(lowE[1].highlightType).toBe('none'); // F
  });
});

describe('hasFretMarker', () => {
  it('returns single, double, or none', () => {
    expect(hasFretMarker(3)).toBe('single');
    expect(hasFretMarker(12)).toBe('double');
    expect(hasFretMarker(24)).toBe('double');
    expect(hasFretMarker(1)).toBe('none');
  });
});
