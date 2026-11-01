import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { installMatchMedia, resetMatchMedia } from './matchMedia';
import { installFakeApi } from './fakeApi';
import { clearApiCache } from '../hooks/useAsyncData';

installMatchMedia();

beforeEach(() => {
  installFakeApi();
});

afterEach(() => {
  cleanup();
  resetMatchMedia();
  clearApiCache();
  vi.unstubAllGlobals();
});
