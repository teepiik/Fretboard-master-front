import React, { useState } from 'react';
import Fretboard from '../components/Fretboard/Fretboard';
import type { NoteName, ScaleType } from '../types/music';

const ROOTS: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALE_TYPES: { value: ScaleType; label: string }[] = [
  { value: 'major', label: 'Major' },
  { value: 'natural minor', label: 'Natural Minor' },
  { value: 'harmonic minor', label: 'Harmonic Minor' },
  { value: 'melodic minor', label: 'Melodic Minor' },
  { value: 'dorian', label: 'Dorian' },
  { value: 'phrygian', label: 'Phrygian' },
  { value: 'lydian', label: 'Lydian' },
  { value: 'mixolydian', label: 'Mixolydian' },
  { value: 'locrian', label: 'Locrian' },
  { value: 'pentatonic major', label: 'Pentatonic Major' },
  { value: 'pentatonic minor', label: 'Pentatonic Minor' },
  { value: 'blues', label: 'Blues' },
];

const FretboardPage: React.FC = () => {
  const [rootNote, setRootNote] = useState<NoteName>('C');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [numFrets, setNumFrets] = useState(12);

  return (
    <div className="fretboard-page">
      {/* Page header */}
      <div className="page-header">
        <h1>Fretboard</h1>
      </div>

      <div className="fretboard-layout">
        {/* Controls sidebar */}
        <aside className="controls-sidebar">
          <div className="control-content">
            <div className="scales-panel">
              {/* Root note */}
              <div className="control-group">
                <label htmlFor="root-select">Root Note</label>
                <select id="root-select" value={rootNote} onChange={e => setRootNote(e.target.value as NoteName)}>
                  {ROOTS.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scale type */}
              <div className="control-group">
                <label htmlFor="scale-select">Scale</label>
                <select id="scale-select" value={scaleType} onChange={e => setScaleType(e.target.value as ScaleType)}>
                  {SCALE_TYPES.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of frets */}
              <div className="control-group">
                <label htmlFor="frets-select">Frets</label>
                <select id="frets-select" value={numFrets} onChange={e => setNumFrets(Number(e.target.value))}>
                  {[12, 22, 24].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show note names toggle */}
              <div className="control-group">
                <label>
                  Show note names
                  <input
                    type="checkbox"
                    checked={showNoteNames}
                    onChange={e => setShowNoteNames(e.target.checked)}
                  />{' '}
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main fretboard area */}
        <main className="fretboard-main">
          <div className="fretboard-container">
            <Fretboard rootNote={rootNote} scaleType={scaleType} numFrets={numFrets} showNoteNames={showNoteNames} />
          </div>

          {/* Info bar / legend */}
          <div className="fretboard-info">
            <div className="current-selection">
              <span className="current-selection-item">
                Root: <strong>{rootNote}</strong>
              </span>
              <span className="current-selection-item">
                Scale: <strong>{SCALE_TYPES.find(s => s.value === scaleType)?.label}</strong>
              </span>
            </div>
            <div className="legend">
              <span className="legend-item">
                <span className="legend-color root" /> Root
              </span>
              <span className="legend-item">
                <span className="legend-color scale" /> Scale note
              </span>
              <span className="legend-item">
                <span className="legend-color chord" /> Chord tone
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FretboardPage;
