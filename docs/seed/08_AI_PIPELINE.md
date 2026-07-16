# 08 — AI Pipeline

## Flow (порт из Cue `generate`)

1. **Auth** — JWT from Supabase anonymous session
2. **Rate limit** — per user + IP (optional)
3. **`reserve_generation()`** — atomic quota check
4. **Sanitize** — trim, strip control chars, max lengths
5. **Safety check** — harmful input patterns (RU)
6. **Build prompt** — system + user with region profile injection
7. **AI call** — structured JSON output (3 replies)
8. **Validate** — schema + anti-cringe + length + emoji count
9. **`complete_generation()`** or **`release_generation()`** on failure
10. **Response** — `{ replies, whyThisWorks, safetyFlags? }`

## Prompt structure

```
SYSTEM:
  Ты помощник для ответов в переписке на русском.
  Генерируй ровно 3 варианта: Safe, Playful, Bold.
  Следуй региональному профилю: {regionProfile}
  Цель: {goalLabel}
  Тон: {toneLabel}
  Запрещено: {bannedPhrases}
  Max 300 символов, max 3 emoji на ответ.
  Ответ — только JSON.

USER:
  Переписка:
  [Они] ...
  [Я] ...
  ...
```

## Region auto-detection (RU)

Порт `regionDetection.ts` из Cue, адаптировать:

| Signal | Region hint |
|--------|-------------|
| «братан», «чувак», московский сленг | RU-Moscow |
| «блин», «короче», питерские отсылки | RU-Piter |
| Простой register, мало сленга | RU-Regions |
| Latin-heavy, diaspora markers | Diaspora-EU |

При `region: auto` — inject detected profile в prompt, вернуть `detectedRegion` в response.

## AI Provider options (RU market)

| Provider | Pros | Cons |
|----------|------|------|
| **OpenAI** (GPT-4o-mini) | Качество RU, structured output | Санкции / billing — нужен EU entity или proxy |
| **Anthropic** | Хороший RU | То же |
| **YandexGPT** | РФ-юрисдикция, рубли | API maturity, structured output |
| **GigaChat (Sber)** | РФ compliance | Enterprise onboarding |
| **Self-hosted** (Llama via Together) | Контроль | Ops cost |

**Рекомендация для старта:** OpenAI через EU billing (как Cue) или YandexGPT если нужна 100% РФ-инфра.

## Retry policy

- Max 3 retries on validation failure
- Exponential backoff 500ms → 1s → 2s
- After 3 fails → `QUALITY_FAILURE`, release reservation

## Mock mode

`MOCK_AI_PROVIDER=true` — deterministic RU replies for dev/CI (порт `mockProvider.ts` из Cue).

## Structured output schema

```json
{
  "replies": [
    { "variant": "Safe", "text": "...", "whyThisWorks": "..." },
    { "variant": "Playful", "text": "...", "whyThisWorks": "..." },
    { "variant": "Bold", "text": "...", "whyThisWorks": "..." }
  ],
  "detectedRegion": "RU-Moscow"
}
```

## Cost estimate (per generation)

| Model | ~tokens | Cost |
|-------|---------|------|
| GPT-4o-mini | ~1500 in + 400 out | ~$0.001 |
| YandexGPT Lite | similar | ~₽0.05 |

At 10k gens/month → ~$10–15 OpenAI or ~₽500 Yandex.

## Files to port from Cue

```
supabase/functions/generate/index.ts
supabase/functions/_shared/aiPrompt.ts      → aiPrompt.ru.ts
supabase/functions/_shared/validator.ts       → + RU rules
supabase/functions/_shared/safety.ts          → + RU patterns
supabase/functions/_shared/regionDetection.ts → RU regions
supabase/functions/_shared/schemas.ts
supabase/functions/_shared/mockProvider.ts    → RU mock replies
```
