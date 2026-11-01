import { apiClient } from '../api/client';
import type { AnalyzeResponse, NoteName, Scale, Tuning } from '../types/music';

/** Thrown when the backend returns a non-2xx response or the request fails. */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface Result<T> {
  data?: T;
  error?: { error: string } | undefined;
  response: Response;
}

function unwrap<T>({ data, error, response }: Result<T>): T {
  if (data !== undefined) return data;
  throw new ApiError(error?.error ?? `Request failed with status ${response.status}`, response.status);
}

/** Scale catalogue (id, name, intervals). */
export async function getScales(signal?: AbortSignal): Promise<Scale[]> {
  const result = await apiClient.GET('/theory/scales', { signal });
  return unwrap(result).scales;
}

/** Tuning catalogue (id, name, open-string MIDI numbers). */
export async function getTunings(signal?: AbortSignal): Promise<Tuning[]> {
  const result = await apiClient.GET('/theory/tunings', { signal });
  return unwrap(result).tunings;
}

/** Chords and scales that contain all of the given notes. */
export async function analyzeNotes(notes: NoteName[], signal?: AbortSignal): Promise<AnalyzeResponse> {
  const result = await apiClient.POST('/theory/analyze', { body: { notes }, signal });
  return unwrap(result);
}
