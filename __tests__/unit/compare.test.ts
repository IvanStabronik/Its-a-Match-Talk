import { describe, expect, it } from 'vitest';

import { buildCompare, type AnalysisSnapshot } from '@/services/compare';

describe('buildCompare', () => {
  it('returns null without previous', () => {
    const current: AnalysisSnapshot = {
      at: '2026-07-25T00:00:00Z',
      mePercent: 60,
      themPercent: 40,
    };
    expect(buildCompare(null, current)).toBeNull();
  });

  it('computes effort delta and balance improvement', () => {
    const previous: AnalysisSnapshot = {
      at: '2026-07-20T00:00:00Z',
      mePercent: 80,
      themPercent: 20,
      ghostRisk: 'high',
      interestTrend: 'down',
    };
    const current: AnalysisSnapshot = {
      at: '2026-07-25T00:00:00Z',
      mePercent: 55,
      themPercent: 45,
      ghostRisk: 'medium',
      interestTrend: 'flat',
    };
    const compare = buildCompare(previous, current);
    expect(compare?.effortDelta).toBe(-25);
    expect(compare?.effortImproved).toBe(true);
    expect(compare?.ghostChanged).toBe(true);
    expect(compare?.interestChanged).toBe(true);
  });
});
