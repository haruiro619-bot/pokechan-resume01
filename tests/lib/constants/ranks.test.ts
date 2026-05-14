import { describe, it, expect } from 'vitest';
import { RANKS, getStepsForTier } from '@/lib/constants/ranks';

describe('RANKS', () => {
  it('contains 5 tiers in correct order', () => {
    expect(RANKS.map(r => r.id)).toEqual([
      'monster', 'super', 'hyper', 'master', 'champion',
    ]);
  });

  it('non-champion tiers have steps Ⅳ→Ⅲ→Ⅱ→Ⅰ', () => {
    for (const id of ['monster', 'super', 'hyper', 'master'] as const) {
      expect(getStepsForTier(id)).toEqual(['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ']);
    }
  });

  it('champion has no step', () => {
    expect(getStepsForTier('champion')).toEqual([]);
  });
});
