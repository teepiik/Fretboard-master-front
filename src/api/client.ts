import createClient from 'openapi-fetch';
import type { paths } from './schema';

/** Base URL of the uxapi backend. Set VITE_API_BASE_URL in .env / CI. */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

/** Typed fetch client generated from the backend OpenAPI spec (src/api/schema.d.ts). */
export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  // Resolve fetch lazily so test doubles installed after module load are honoured.
  fetch: request => globalThis.fetch(request),
});
