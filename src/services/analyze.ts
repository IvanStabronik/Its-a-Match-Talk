import { getMockReplies } from '@/services/mockProvider';
import {
  computeEffortBalance,
  computeGhostRisk,
  computeHotColdTimeline,
  computeInterestTrend,
  pickNextStepKeys,
} from '@/services/metrics';
import type { AnalysisInsights, AnalysisResult, GenerationRequest } from '@/types/domain';

/** Full local analyze: deterministic metrics + mock replies (no mind-reading copy). */
export function buildLocalAnalysis(request: GenerationRequest, includePaid: boolean): AnalysisResult {
  const effort = computeEffortBalance(request.messages);

  if (!includePaid) {
    return { effort };
  }

  const interestTrend = computeInterestTrend(request.messages);
  const ghostRisk = computeGhostRisk(request.messages);
  const timeline = computeHotColdTimeline(request.messages);
  const { nextStepKey, nextStepDetailKey } = pickNextStepKeys(ghostRisk, interestTrend, effort);
  const replies = getMockReplies(request);

  const paid: Omit<AnalysisInsights, 'effort'> = {
    interestTrend,
    ghostRisk,
    timeline,
    nextStepKey,
    nextStepDetailKey,
    replies,
  };

  return {
    effort,
    paid,
    detectedRegion: request.region === 'Auto' ? 'Diaspora-EU' : request.region,
  };
}
