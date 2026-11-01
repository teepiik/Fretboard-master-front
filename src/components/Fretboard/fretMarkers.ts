/** Standard inlay positions on a guitar neck. */
export const SINGLE_DOT_FRETS = [3, 5, 7, 9, 15, 17, 19, 21];
export const DOUBLE_DOT_FRETS = [12, 24];

export type FretMarker = 'single' | 'double' | 'none';

export function hasFretMarker(fret: number): FretMarker {
  if (DOUBLE_DOT_FRETS.includes(fret)) return 'double';
  if (SINGLE_DOT_FRETS.includes(fret)) return 'single';
  return 'none';
}
