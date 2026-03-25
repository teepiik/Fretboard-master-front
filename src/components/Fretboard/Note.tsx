// Note Component
// Displays note names on fretboard
// Handles different visual states (root, scale tone, chord tone)
// Supports color coding and animations

import React from 'react';

export type NoteState = 'root' | 'scale' | 'chord' | 'none';

interface NoteProps {
  /** Display name of the note, e.g. "C#" */
  note: string;
  /** Visual state that determines color / styling */
  state: NoteState;
  /** Whether to render the note name label */
  showName: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

const Note: React.FC<NoteProps> = ({ note, state, showName, onClick }) => {
  if (state === 'none') return null;

  return (
    <div
      className={`note-circle note-circle--${state}`}
      title={note}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      {showName && <span className="note-circle__label">{note}</span>}
    </div>
  );
};

export default Note;
