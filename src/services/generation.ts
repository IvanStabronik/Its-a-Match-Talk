import { z } from 'zod';

import { REPLY_MAX_LENGTH } from '@/config/constants';
import { ensureAnonymousSession, getAccessToken } from '@/services/auth';
import { getMockReplies } from '@/services/mockProvider';
import { isSupabaseConfigured, supabase } from '@/services/supabase';
import type { AppLocale, GenerationRequest, GenerationResult, RegionId } from '@/types/domain';

export class UsageExceededError extends Error {
  constructor() {
    super('USAGE_EXCEEDED');
    this.name = 'UsageExceededError';
  }
}

const replySchema = z.object({
  variant: z.enum(['Safe', 'Playful', 'Bold']),
  text: z.string().min(1).max(REPLY_MAX_LENGTH),
  whyThisWorks: z.string().min(1).max(500),
});

const generationResultSchema = z.object({
  replies: z.array(replySchema).length(3),
  detectedRegion: z.string().optional(),
  freeGenerationsUsed: z.number().optional(),
});

export function buildGenerationRequest(
  request: Omit<GenerationRequest, 'locale'> & { locale: AppLocale },
): GenerationRequest {
  return {
    messages: request.messages,
    goal: request.goal,
    tone: request.tone,
    region: request.region,
    locale: request.locale,
  };
}

export async function generateRepliesFromRequest(
  request: GenerationRequest,
): Promise<GenerationResult & { freeGenerationsUsed?: number }> {
  if (isSupabaseConfigured) {
    try {
      return await generateViaEdgeFunction(request);
    } catch (error) {
      if (error instanceof UsageExceededError) throw error;
      console.warn('Edge generate failed, falling back to local mock', error);
    }
  }

  return generateLocalMock(request);
}

async function generateViaEdgeFunction(
  request: GenerationRequest,
): Promise<GenerationResult & { freeGenerationsUsed?: number }> {
  await ensureAnonymousSession();
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NO_SESSION');
  }

  const { data, error } = await supabase.functions.invoke('generate', {
    body: {
      messages: request.messages.map(({ speaker, text }) => ({ speaker, text })),
      goal: request.goal,
      tone: request.tone,
      region: request.region,
      locale: request.locale,
    },
  });

  if (error) {
    const message = error.message ?? '';
    if (message.includes('USAGE_EXCEEDED') || message.includes('403')) {
      throw new UsageExceededError();
    }
    throw error;
  }

  if (data?.error === 'USAGE_EXCEEDED') {
    throw new UsageExceededError();
  }
  if (data?.error) {
    throw new Error(String(data.error));
  }

  const parsed = generationResultSchema.parse(data);
  return {
    replies: parsed.replies,
    detectedRegion: (parsed.detectedRegion as RegionId | undefined) ?? undefined,
    freeGenerationsUsed: parsed.freeGenerationsUsed,
  };
}

async function generateLocalMock(
  request: GenerationRequest,
): Promise<GenerationResult & { freeGenerationsUsed?: number }> {
  await delay(800);
  const replies = getMockReplies(request);
  const result = {
    replies,
    detectedRegion: request.region === 'Auto' ? 'Diaspora-EU' : request.region,
  };
  return generationResultSchema.parse(result) as GenerationResult;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
