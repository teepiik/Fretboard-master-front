/**
 * Breakpoint tokens (JS mirror of the `--bp-*` custom properties in tokens.css).
 *
 * CSS media queries cannot read custom properties, so the values live here for
 * runtime use and in tokens.css for documentation. Keep both in sync.
 */
export const breakpoints = {
  /** Phones. The fretboard switches to a vertical orientation at or below this width. */
  mobile: 640,
  tablet: 768,
  laptop: 1024,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** Build a desktop-first (`max-width`) media query string for a breakpoint. */
export function mediaMaxWidth(bp: Breakpoint): string {
  return `(max-width: ${breakpoints[bp]}px)`;
}
