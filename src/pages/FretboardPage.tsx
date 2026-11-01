import React, { useState } from 'react';
import Fretboard from '../components/Fretboard/Fretboard';
import { useBreakpoint } from '../hooks/useMediaQuery';
import { useScales } from '../hooks/useMusicData';
import { ROOT_NOTES, type NoteName, type ScaleId } from '../types/music';

const FRET_COUNTS = [12, 22, 24];

const FretboardPage: React.FC = () => {
  const [rootNote, setRootNote] = useState<NoteName>('C');
  const [scaleId, setScaleId] = useState<ScaleId>('major');
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [numFrets, setNumFrets] = useState(12);

  // Simplified mobile view: vertical neck, compact controls, legend only.
  const isMobile = useBreakpoint('mobile');

  // Scale definitions (intervals) come from the backend; the neck is computed locally.
  const scales = useScales();
  const scale = scales.data?.find(s => s.id === scaleId) ?? scales.data?.[0];

  return (
    <div className={isMobile ? 'fretboard-page fretboard-page--mobile' : 'fretboard-page'}>
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
                <select id="root-select" value={rootNote} onChange={e => setRootNote(e.target.value)}>
                  {ROOT_NOTES.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scale type */}
              <div className="control-group">
                <label htmlFor="scale-select">Scale</label>
                <select
                  id="scale-select"
                  value={scale?.id ?? scaleId}
                  disabled={!scales.data}
                  onChange={e => setScaleId(e.target.value as ScaleId)}
                >
                  {scales.data ? (
                    scales.data.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option value={scaleId}>{scales.isLoading ? 'Loading…' : 'Unavailable'}</option>
                  )}
                </select>
              </div>

              {/* Number of frets */}
              <div className="control-group">
                <label htmlFor="frets-select">Frets</label>
                <select id="frets-select" value={numFrets} onChange={e => setNumFrets(Number(e.target.value))}>
                  {FRET_COUNTS.map(n => (
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
            {scale ? (
              <Fretboard
                rootNote={rootNote}
                scale={scale}
                numFrets={numFrets}
                showNoteNames={showNoteNames}
                orientation={isMobile ? 'vertical' : 'horizontal'}
              />
            ) : scales.error ? (
              <div className="fretboard-status fretboard-status--error" role="alert">
                <p>Could not load scales: {scales.error.message}</p>
                <button type="button" onClick={scales.retry}>
                  Retry
                </button>
              </div>
            ) : (
              <p className="fretboard-status" role="status">
                Loading scales…
              </p>
            )}
          </div>

          {/* Info bar / legend */}
          <div className="fretboard-info">
            {!isMobile && (
              <div className="current-selection">
                <span className="current-selection-item">
                  Root: <strong>{rootNote}</strong>
                </span>
                <span className="current-selection-item">
                  Scale: <strong>{scale?.name ?? '—'}</strong>
                </span>
              </div>
            )}
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
