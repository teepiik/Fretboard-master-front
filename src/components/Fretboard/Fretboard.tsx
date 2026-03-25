import React, { useMemo, useCallback } from 'react';
import GuitarString from './GuitarString';
import { generateFretboardNotes, hasFretMarker } from '../../utils/musicTheory/helpers';
import type { NoteName, ScaleType } from '../../types/music';

interface FretboardProps {
  /** Root note for the active scale */
  rootNote: NoteName;
  /** Active scale type */
  scaleType: ScaleType;
  /** Number of frets to display (default 12) */
  numFrets?: number;
  /** Whether to show note name labels */
  showNoteNames?: boolean;
  /** Sharp / flat display preference */
  displayMode?: 'sharp' | 'flat' | 'natural';
  /** Callback when a fret is clicked */
  onNoteClick?: (stringIndex: number, fret: number) => void;
}

const Fretboard: React.FC<FretboardProps> = ({
  rootNote,
  scaleType,
  numFrets = 12,
  showNoteNames = true,
  displayMode = 'sharp',
  onNoteClick,
}) => {
  // Generate all fretboard notes (memoised so it only recalculates when inputs change)
  const fretboardData = useMemo(
    () => generateFretboardNotes(rootNote, scaleType, numFrets, displayMode),
    [rootNote, scaleType, numFrets, displayMode],
  );

  // Strings are stored low→high (index 0 = low E). Reverse so high E is on top.
  const stringsTopDown = useMemo(() => [...fretboardData].reverse(), [fretboardData]);

  const handleNoteClick = useCallback(
    (stringIndex: number, fret: number) => {
      onNoteClick?.(stringIndex, fret);
    },
    [onNoteClick],
  );

  // Build fret number labels
  const fretNumbers = useMemo(() => {
    const nums: number[] = [];
    for (let i = 0; i <= numFrets; i++) nums.push(i);
    return nums;
  }, [numFrets]);

  return (
    <div className="fretboard" role="grid" aria-label="Guitar fretboard">
      {/* Fret numbers row */}
      <div className="fretboard__fret-numbers" role="row">
        {fretNumbers.map(n => {
          const marker = hasFretMarker(n);
          return (
            <div
              key={n}
              className={`fretboard__fret-number ${n === 0 ? 'fretboard__fret-number--open' : ''}`}
              role="columnheader"
            >
              {n > 0 && <span>{n}</span>}
              {marker === 'single' && <span className="fretboard__dot" />}
              {marker === 'double' && (
                <>
                  <span className="fretboard__dot" />
                  <span className="fretboard__dot" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Strings (high E on top → low E on bottom) */}
      <div className="fretboard__strings">
        {stringsTopDown.map((stringFrets, i) => {
          // stringNumber: 1 = high E … 6 = low E
          const stringNumber = i + 1;
          return (
            <GuitarString
              key={stringNumber}
              stringNumber={stringNumber}
              frets={stringFrets}
              showNoteNames={showNoteNames}
              onNoteClick={handleNoteClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Fretboard;
