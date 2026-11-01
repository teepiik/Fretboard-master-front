import { describe, it, expect } from 'vitest';
import { ApiError, getScales, getTunings } from './api';
import { fakeApiRequests, installFakeApi } from '../test/fakeApi';

describe('api', () => {
  it('fetches and unwraps the scales list', async () => {
    const scales = await getScales();
    expect(scales.map(s => s.id)).toContain('major');

    const [request] = fakeApiRequests();
    expect(new URL(request.url).pathname).toBe('/theory/scales');
    expect(request.method).toBe('GET');
  });

  it('fetches and unwraps the tunings list', async () => {
    const tunings = await getTunings();
    expect(tunings[0]).toMatchObject({ id: 'standard', midi: [40, 45, 50, 55, 59, 64] });
  });

  it('throws ApiError with the backend message and status', async () => {
    installFakeApi({ failWith: { status: 500, error: 'Internal server error' } });
    const err = await getScales().catch(e => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ message: 'Internal server error', status: 500 });
  });

  it('rejects when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getScales(controller.signal)).rejects.toThrow();
  });
});
