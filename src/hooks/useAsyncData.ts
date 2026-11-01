import { useCallback, useEffect, useSyncExternalStore } from 'react';

export interface AsyncState<T> {
  /** Latest successful result for this key. */
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
  /** Re-run the request for the current key. */
  retry: () => void;
}

interface Entry {
  status: 'loading' | 'success' | 'error';
  data?: unknown;
  error?: Error;
  controller?: AbortController;
}

const entries = new Map<string, Entry>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Clear the in-memory response cache and abort in-flight requests. Intended for tests. */
export function clearApiCache(): void {
  entries.forEach(e => e.controller?.abort());
  entries.clear();
}

function start(key: string, fetcher: (signal: AbortSignal) => Promise<unknown>) {
  const controller = new AbortController();
  entries.set(key, { status: 'loading', controller });
  emit();

  fetcher(controller.signal).then(
    data => {
      if (controller.signal.aborted) return;
      entries.set(key, { status: 'success', data });
      emit();
    },
    (err: unknown) => {
      if (controller.signal.aborted) return;
      entries.set(key, { status: 'error', error: err instanceof Error ? err : new Error(String(err)) });
      emit();
    },
  );
}

/**
 * Run an abortable async fetcher for `key`, sharing results across components.
 *
 * Successful results are cached per key for the lifetime of the page. The `fetcher` is only
 * read when a request starts, so it can safely be an inline closure.
 */
export function useAsyncData<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>): AsyncState<T> {
  const entry = useSyncExternalStore(
    subscribe,
    () => entries.get(key),
    () => entries.get(key),
  );

  useEffect(() => {
    if (!entries.has(key)) start(key, fetcher);
    // Only re-run when the key changes; the fetcher identity is irrelevant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const retry = useCallback(() => start(key, fetcher), [key, fetcher]);

  return {
    data: entry?.status === 'success' ? (entry.data as T) : undefined,
    isLoading: !entry || entry.status === 'loading',
    error: entry?.status === 'error' ? entry.error : undefined,
    retry,
  };
}
