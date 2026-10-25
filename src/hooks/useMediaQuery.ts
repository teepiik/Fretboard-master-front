import { useCallback, useSyncExternalStore } from 'react';
import { mediaMaxWidth, type Breakpoint } from '../styles/breakpoints';

function canMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/** Returns whether the given CSS media query currently matches. SSR-safe (false on the server). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatchMedia()) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => (canMatchMedia() ? window.matchMedia(query).matches : false), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Returns true when the viewport is at or below the given design-system breakpoint. */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(mediaMaxWidth(bp));
}
