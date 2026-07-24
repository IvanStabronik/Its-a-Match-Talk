import { buildLocalAnalysis } from '@/services/analyze';
import { ensureAnonymousSession } from '@/services/auth';
import { buildGenerationRequest } from '@/services/generation';
import { isSupabaseConfigured, supabase } from '@/services/supabase';
import { containsBannedDiagnosis } from '@/services/validator';
import type { AnalysisResult, AppLocale, GenerationRequest, GoalId, Message, RegionId, ToneId } from '@/types/domain';

export async function runAnalysis(input: {
  messages: Message[];
  goal: GoalId;
  tone: ToneId;
  region: RegionId;
  locale: AppLocale;
  includePaid: boolean;
}): Promise<AnalysisResult> {
  const request = buildGenerationRequest(input);

  // Free path: deterministic Effort Balance only — no network required
  if (!input.includePaid) {
    return buildLocalAnalysis(request, false);
  }

  if (isSupabaseConfigured) {
    try {
      const remote = await analyzeViaEdge(request);
      if (remote) return remote;
    } catch (error) {
      console.warn('Edge analyze failed, using local full analysis', error);
    }
  }

  return buildLocalAnalysis(request, true);
}

async function analyzeViaEdge(request: GenerationRequest): Promise<AnalysisResult | null> {
  await ensureAnonymousSession();
  const { data, error } = await supabase.functions.invoke('generate', {
    body: {
      mode: 'analyze',
      messages: request.messages.map(({ speaker, text }) => ({ speaker, text })),
      goal: request.goal,
      tone: request.tone,
      region: request.region,
      locale: request.locale,
    },
  });

  if (error || data?.error) {
    throw new Error(String(data?.error ?? error?.message ?? 'ANALYZE_FAILED'));
  }

  // Until Edge returns full schema, fall back to local paid pack + optional replies
  if (!data?.effort) {
    const local = buildLocalAnalysis(request, true);
    if (Array.isArray(data?.replies) && data.replies.length === 3) {
      const safe = data.replies.every(
        (r: { text?: string; whyThisWorks?: string }) =>
          !containsBannedDiagnosis(`${r.text ?? ''} ${r.whyThisWorks ?? ''}`),
      );
      if (safe && local.paid) {
        local.paid.replies = data.replies;
      }
    }
    return local;
  }

  return data as AnalysisResult;
}
