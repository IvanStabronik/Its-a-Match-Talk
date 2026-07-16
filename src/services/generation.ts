import { z } from 'zod';

import { REPLY_MAX_LENGTH } from '@/config/constants';
import { getMockReplies } from '@/services/mockProvider';
import type { AppLocale, GenerationRequest, GenerationResult } from '@/types/domain';

const replySchema = z.object({
  variant: z.enum(['Safe', 'Playful', 'Bold']),
  text: z.string().min(1).max(REPLY_MAX_LENGTH),
  whyThisWorks: z.string().min(1).max(500),
});

const generationResultSchema = z.object({
  replies: z.array(replySchema).length(3),
  detectedRegion: z.string().optional(),
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
): Promise<GenerationResult> {
  await delay(1200);

  const replies = getMockReplies(request);
  const result: GenerationResult = {
    replies,
    detectedRegion: request.region === 'Auto' ? 'Diaspora-EU' : request.region,
  };

  return generationResultSchema.parse(result) as GenerationResult;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
