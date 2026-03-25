import React from 'react';
import Note from './Note';
import type { NoteState } from './Note';
import { hasFretMarker } from '../../utils/musicTheory/helpers';

interface FretProps {
  /** Fret position (0 = open / nut) */
  fretNumber: number;
  /** Note name at this position */
  noteName: string;
  /** Visual state of the note */
  noteState: NoteState;
  /** Whether to display note names */
  showNoteName: boolean;
  /** Whether this is the open-string (nut) column */
  isOpen: boolean;
  /** Click handler */
  onNoteClick?: () => void;
}

const Fret: React.FC<FretProps> = ({ fretNumber, noteName, noteState, showNoteName, isOpen, onNoteClick }) => {
  const marker = hasFretMarker(fretNumber);

  const classNames = ['fret', isOpen ? 'fret--open' : '', marker !== 'none' ? `fret--marker-${marker}` : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} data-fret={fretNumber}>
      {/* fret wire */}
      {!isOpen && <div className="fret__wire" />}

      {/* note circle */}
      <div className="fret__note-wrapper">
        <Note note={noteName} state={noteState} showName={showNoteName} onClick={onNoteClick} />
      </div>
    </div>
  );
};

export default Fret;
