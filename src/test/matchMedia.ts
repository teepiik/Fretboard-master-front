/**
 * Minimal `window.matchMedia` mock for jsdom.
 *
 * Tests opt into a viewport with `setViewportWidth(px)`; `(max-width: Npx)` and
 * `(min-width: Npx)` queries are evaluated against it and registered listeners
 * are notified when the width changes. Everything else reports `matches: false`.
 */
import { act } from '@testing-library/react';

const DEFAULT_WIDTH = 1280;
let viewportWidth = DEFAULT_WIDTH;
const listeners = new Map<string, Set<() => void>>();

function evaluate(query: string): boolean {
  const max = /\(max-width:\s*(\d+(?:\.\d+)?)px\)/.exec(query);
  const min = /\(min-width:\s*(\d+(?:\.\d+)?)px\)/.exec(query);
  if (max && viewportWidth > Number(max[1])) return false;
  if (min && viewportWidth < Number(min[1])) return false;
  return Boolean(max || min);
}

export function installMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => {
      const set = listeners.get(query) ?? new Set<() => void>();
      listeners.set(query, set);
      const mql = {
        media: query,
        get matches() {
          return evaluate(query);
        },
        onchange: null,
        addEventListener: (_: 'change', cb: () => void) => set.add(cb),
        removeEventListener: (_: 'change', cb: () => void) => set.delete(cb),
        addListener: (cb: () => void) => set.add(cb),
        removeListener: (cb: () => void) => set.delete(cb),
        dispatchEvent: () => true,
      };
      return mql as unknown as MediaQueryList;
    },
  });
}

/** Set the simulated viewport width and notify media-query listeners. */
export function setViewportWidth(px: number): void {
  viewportWidth = px;
  act(() => {
    listeners.forEach(set => set.forEach(cb => cb()));
  });
}

export function resetMatchMedia(): void {
  viewportWidth = DEFAULT_WIDTH;
  listeners.clear();
}
