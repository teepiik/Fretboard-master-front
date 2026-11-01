import { getScales, getTunings } from '../data/api';
import type { Scale, Tuning } from '../types/music';
import { useAsyncData, type AsyncState } from './useAsyncData';

/** Scale catalogue from the backend; fetched once per page load. */
export function useScales(): AsyncState<Scale[]> {
  return useAsyncData('scales', getScales);
}

/** Tuning catalogue from the backend; fetched once per page load. */
export function useTunings(): AsyncState<Tuning[]> {
  return useAsyncData('tunings', getTunings);
}
