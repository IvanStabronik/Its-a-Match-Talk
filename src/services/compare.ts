import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GhostBand, InterestTrend } from '@/types/domain';

const KEY = 'imt-analysis-snapshot';

export type AnalysisSnapshot = {
  at: string;
  mePercent: number;
  themPercent: number;
  ghostRisk?: GhostBand;
  interestTrend?: InterestTrend;
};

export type AnalysisCompare = {
  previous: AnalysisSnapshot;
  effortDelta: number;
  ghostChanged: boolean;
  interestChanged: boolean;
  effortImproved: boolean | null;
};

export async function loadPreviousSnapshot(): Promise<AnalysisSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalysisSnapshot;
  } catch {
    return null;
  }
}

export async function saveSnapshot(snapshot: AnalysisSnapshot): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(snapshot));
}

export async function clearSnapshot(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export function buildCompare(
  previous: AnalysisSnapshot | null,
  current: AnalysisSnapshot,
): AnalysisCompare | null {
  if (!previous) return null;
  const effortDelta = current.mePercent - previous.mePercent;
  const ghostChanged = Boolean(
    previous.ghostRisk && current.ghostRisk && previous.ghostRisk !== current.ghostRisk,
  );
  const interestChanged = Boolean(
    previous.interestTrend &&
      current.interestTrend &&
      previous.interestTrend !== current.interestTrend,
  );

  // Don't surface a noisy "0 pts" card when nothing meaningful changed
  if (effortDelta === 0 && !ghostChanged && !interestChanged) {
    return null;
  }

  return {
    previous,
    effortDelta,
    ghostChanged,
    interestChanged,
    effortImproved:
      effortDelta === 0 ? null : Math.abs(50 - current.mePercent) < Math.abs(50 - previous.mePercent),
  };
}
