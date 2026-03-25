import React from 'react';
import Fret from './Fret';
import type { FretboardNote } from '../../utils/musicTheory/helpers';

interface GuitarStringProps {
  /** 1-based string number (1 = high E, 6 = low E) */
  stringNumber: number;
  /** Array of fret data for this string (index 0 = open) */
  frets: FretboardNote[];
  /** Whether to show note names */
  showNoteNames: boolean;
  /** Callback when a note is clicked */
  onNoteClick?: (stringIndex: number, fret: number) => void;
}

/** Map string number to a thickness class (thicker strings = lower pitch). */
function stringThicknessClass(stringNumber: number): string {
  if (stringNumber >= 5) return 'guitar-string--thick';
  if (stringNumber >= 3) return 'guitar-string--medium';
  return 'guitar-string--thin';
}

const GuitarString: React.FC<GuitarStringProps> = ({ stringNumber, frets, showNoteNames, onNoteClick }) => {
  return (
    <div className={`guitar-string ${stringThicknessClass(stringNumber)}`} data-string={stringNumber}>
      {/* Visual string line running across all frets */}
      <div className="guitar-string__line" />

      {/* Frets */}
      <div className="guitar-string__frets">
        {frets.map(f => (
          <Fret
            key={f.fret}
            fretNumber={f.fret}
            noteName={f.note.name}
            noteState={f.highlightType}
            showNoteName={showNoteNames}
            isOpen={f.fret === 0}
            onNoteClick={() => onNoteClick?.(f.stringIndex, f.fret)}
          />
        ))}
      </div>
    </div>
  );
};

export default GuitarString;
