import { vi } from 'vitest';
import type { Scale, Tuning } from '../types/music';

/**
 * Test double for the uxapi backend. Installs a `fetch` mock that serves the theory catalogue
 * with the same response shapes as the real API (see src/api/schema.d.ts).
 */

export const FAKE_SCALES: Scale[] = [
  { id: 'major', name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'natural-minor', name: 'Natural Minor (Aeolian)', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'minor-pentatonic', name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] },
];

export const FAKE_TUNINGS: Tuning[] = [
  { id: 'standard', name: 'Standard (E A D G B E)', midi: [40, 45, 50, 55, 59, 64] },
  { id: 'drop-d', name: 'Drop D (D A D G B E)', midi: [38, 45, 50, 55, 59, 64] },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export interface FakeApiOptions {
  /** Force every request to fail with this status and message. */
  failWith?: { status: number; error: string };
}

/** Replace global fetch with the fake backend. Returns the mock for call assertions. */
export function installFakeApi(options: FakeApiOptions = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(input, init);
    if (request.signal.aborted) throw new DOMException('The operation was aborted.', 'AbortError');
    const { pathname } = new URL(request.url);

    if (options.failWith) return jsonResponse({ error: options.failWith.error }, options.failWith.status);
    if (pathname === '/theory/scales') return jsonResponse({ scales: FAKE_SCALES });
    if (pathname === '/theory/tunings') return jsonResponse({ tunings: FAKE_TUNINGS });
    return jsonResponse({ error: 'Not found', path: pathname }, 404);
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** Requests captured by the current fake, oldest first. */
export function fakeApiRequests(): Request[] {
  return vi
    .mocked(fetch)
    .mock.calls.map(([input, init]) => (input instanceof Request ? input : new Request(input, init)));
}
