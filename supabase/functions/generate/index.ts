import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ReplyVariant = 'Safe' | 'Playful' | 'Bold';

type Message = {
  speaker: 'me' | 'them' | 'unknown';
  text: string;
};

type GenerateBody = {
  messages: Message[];
  goal: string;
  tone: string;
  region: string;
  locale: string;
};

const MOCK_BY_LOCALE: Record<string, Record<ReplyVariant, { text: string; why: string }>> = {
  ru: {
    Safe: {
      text: 'Звучит интересно — расскажи чуть подробнее, что тебе в этом важно?',
      why: 'Открытый вопрос без давления.',
    },
    Playful: {
      text: 'Окей, ты умеешь держать интригу. Это случайность или суперсила? 😄',
      why: 'Лёгкий юмор без кринжа.',
    },
    Bold: {
      text: 'Мне нравится наш темп. Давай продолжим — что тебе интересно обсудить дальше?',
      why: 'Прямой интерес без навязчивости.',
    },
  },
  uk: {
    Safe: {
      text: 'Звучить цікаво — розкажеш трохи більше, що для тебе тут важливе?',
      why: 'Відкрите питання без тиску.',
    },
    Playful: {
      text: 'Окей, ти вмієш тримати інтригу. Це випадковість чи суперсила? 😄',
      why: 'Легкий гумор.',
    },
    Bold: {
      text: 'Мені подобається наш темп. Давай продовжимо — що цікаво обговорити далі?',
      why: 'Прямий інтерес.',
    },
  },
  pl: {
    Safe: {
      text: 'Brzmi ciekawie — opowiesz trochę więcej, co jest dla ciebie ważne?',
      why: 'Otwarte pytanie bez presji.',
    },
    Playful: {
      text: 'Okej, umiesz trzymać intrygę. Przypadek czy supermoc? 😄',
      why: 'Lekki humor.',
    },
    Bold: {
      text: 'Podoba mi się nasze tempo. Kontynuujmy — o czym chcesz pogadać dalej?',
      why: 'Bezpośrednie zainteresowanie.',
    },
  },
  en: {
    Safe: {
      text: 'That sounds interesting — what matters most to you about this?',
      why: 'Open question without pressure.',
    },
    Playful: {
      text: 'Okay, you know how to keep a hook. Accident or superpower? 😄',
      why: 'Light humor, no cringe.',
    },
    Bold: {
      text: 'I like our pace. Let\'s keep going — what do you want to talk about next?',
      why: 'Direct interest without neediness.',
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const started = Date.now();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'UNAUTHORIZED' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return json({ error: 'UNAUTHORIZED' }, 401);
    }

    const body = (await req.json()) as GenerateBody;
    if (!body?.messages?.length || !body.goal || !body.tone || !body.locale) {
      return json({ error: 'INVALID_REQUEST' }, 400);
    }

    const { data: reserved, error: reserveError } = await supabase.rpc('reserve_generation', {
      p_user_id: user.id,
    });

    if (reserveError) {
      console.error('reserve_generation failed', reserveError);
      return json({ error: 'RESERVE_FAILED' }, 500);
    }

    if (!reserved?.allowed) {
      return json({ error: reserved?.reason ?? 'USAGE_EXCEEDED' }, 403);
    }

    const logId = reserved.log_id as string;
    const useMock = (Deno.env.get('MOCK_AI_PROVIDER') ?? 'true') === 'true';
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    let replies;
    let detectedRegion = body.region === 'Auto' ? 'Diaspora-EU' : body.region;

    try {
      if (useMock || !openaiKey) {
        replies = buildMockReplies(body.locale);
      } else {
        const ai = await callOpenAI(openaiKey, body);
        replies = ai.replies;
        detectedRegion = ai.detectedRegion ?? detectedRegion;
      }

      await supabase.rpc('complete_generation', {
        p_user_id: user.id,
        p_log_id: logId,
        p_goal: body.goal,
        p_tone: body.tone,
        p_region: body.region,
        p_detected_region: detectedRegion,
        p_locale: body.locale,
        p_duration_ms: Date.now() - started,
        p_status: 'success',
      });

      return json({
        replies,
        detectedRegion,
        freeGenerationsUsed: reserved.free_generations_used,
      });
    } catch (err) {
      console.error('generation failed', err);
      await supabase.rpc('release_generation', {
        p_user_id: user.id,
        p_log_id: logId,
        p_status: 'quality_failure',
      });
      return json({ error: 'GENERATION_FAILED' }, 500);
    }
  } catch (err) {
    console.error(err);
    return json({ error: 'INTERNAL' }, 500);
  }
});

function buildMockReplies(locale: string) {
  const pack = MOCK_BY_LOCALE[locale] ?? MOCK_BY_LOCALE.en;
  return (['Safe', 'Playful', 'Bold'] as ReplyVariant[]).map((variant) => ({
    variant,
    text: pack[variant].text,
    whyThisWorks: pack[variant].why,
  }));
}

async function callOpenAI(apiKey: string, body: GenerateBody) {
  const conversation = body.messages
    .map((m) => {
      const label = m.speaker === 'me' ? 'Me' : m.speaker === 'them' ? 'Them' : '?';
      return `[${label}] ${m.text}`;
    })
    .join('\n');

  const system = `You are a dating/chat reply assistant for Its a Match Talk.
Generate exactly 3 reply variants: Safe, Playful, Bold.
Reply language MUST match locale "${body.locale}" (ru/uk/pl/en).
Goal: ${body.goal}. Tone preference: ${body.tone}. Region hint: ${body.region}.
Rules: max 300 chars each, max 3 emoji, no pickup-artist slang, no neediness, no love bombing.
Return ONLY JSON:
{"replies":[{"variant":"Safe","text":"...","whyThisWorks":"..."},{"variant":"Playful","text":"...","whyThisWorks":"..."},{"variant":"Bold","text":"...","whyThisWorks":"..."}],"detectedRegion":"..."}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Conversation:\n${conversation}` },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty OpenAI response');
  return JSON.parse(content);
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
