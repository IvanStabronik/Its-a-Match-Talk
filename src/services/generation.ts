import { z } from 'zod';

import { REPLY_MAX_LENGTH } from '@/config/constants';
import type { AppLocale, GenerationRequest, GenerationResult, Reply } from '@/types/domain';

const replySchema = z.object({
  variant: z.enum(['Safe', 'Playful', 'Bold']),
  text: z.string().min(1).max(REPLY_MAX_LENGTH),
  whyThisWorks: z.string().min(1).max(500),
});

const generationResultSchema = z.object({
  replies: z.array(replySchema).length(3),
  detectedRegion: z.string().optional(),
});

const MOCK_REPLIES: Record<AppLocale, Record<'Safe' | 'Playful' | 'Bold', { text: string; why: string }>> = {
  ru: {
    Safe: {
      text: 'Звучит интересно — расскажи подробнее, что тебе там больше всего зашло?',
      why: 'Открытый вопрос без давления, показывает искренний интерес.',
    },
    Playful: {
      text: 'Окей, это уже интригует. Ты всегда так умеешь заинтриговать или сегодня особенный режим? 😄',
      why: 'Лёгкий юмор и комплимент без пафоса.',
    },
    Bold: {
      text: 'Нравится твой вайб. Давай встретимся на кофе — когда тебе удобно на этой неделе?',
      why: 'Прямое приглашение с уважением к её времени.',
    },
  },
  uk: {
    Safe: {
      text: 'Звучить цікаво — розкажеш детальніше, що тобі там найбільше сподобалось?',
      why: 'Відкрите питання без тиску.',
    },
    Playful: {
      text: 'Окей, це вже інтригує. Ти завжди так вмієш заінтриговувати чи сьогодні особливий режим? 😄',
      why: 'Легкий гумор без пафосу.',
    },
    Bold: {
      text: 'Подобається твій вайб. Давай зустрінемось на каву — коли тобі зручно цього тижня?',
      why: 'Пряме запрошення з повагою до її часу.',
    },
  },
  pl: {
    Safe: {
      text: 'Brzmi ciekawie — opowiesz więcej, co ci się tam najbardziej spodobało?',
      why: 'Otwarte pytanie bez presji.',
    },
    Playful: {
      text: 'Okej, to już intryguje. Zawsze tak umiesz intrygować, czy dziś specjalny tryb? 😄',
      why: 'Lekki humor bez przesady.',
    },
    Bold: {
      text: 'Podoba mi się twój vibe. Spotkajmy się na kawę — kiedy masz czas w tym tygodniu?',
      why: 'Bezpośrednie zaproszenie z szacunkiem do jej czasu.',
    },
  },
  en: {
    Safe: {
      text: 'That sounds interesting — what did you enjoy most about it?',
      why: 'Open question without pressure, shows genuine interest.',
    },
    Playful: {
      text: 'Okay, now you have my attention. Do you always intrigue people like this, or is today special? 😄',
      why: 'Light humor and compliment without being over the top.',
    },
    Bold: {
      text: 'I like your vibe. Let\'s grab coffee — what day works for you this week?',
      why: 'Direct invite while respecting their schedule.',
    },
  },
};

function buildMockReplies(locale: AppLocale): Reply[] {
  const pack = MOCK_REPLIES[locale] ?? MOCK_REPLIES.en;
  return (['Safe', 'Playful', 'Bold'] as const).map((variant) => ({
    variant,
    text: pack[variant].text,
    whyThisWorks: pack[variant].why,
  }));
}

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

  const replies = buildMockReplies(request.locale);
  const result: GenerationResult = {
    replies,
    detectedRegion: request.region === 'Auto' ? 'Diaspora-EU' : request.region,
  };

  return generationResultSchema.parse(result) as GenerationResult;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
