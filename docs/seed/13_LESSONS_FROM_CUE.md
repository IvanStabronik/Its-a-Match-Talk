# 13 — Lessons from Cue

Что перенести, что улучшить, чего избегать — по итогам разработки Cue.

---

## ✅ Перенести как есть (паттерны)

### 1. Spec-driven development
Cue использует `.kiro/specs/` с requirements, design, tasks. **Сделай то же** — экономит месяцы на «а что мы вообще строим».

### 2. `reserve_generation` RPC
Атомарная проверка квоты до AI call — защита от race conditions и abuse. Не вызывай AI до reservation.

### 3. Anti-cringe validator (deterministic)
AI + post-validation лучше, чем только prompt engineering. Порт `validator.ts`, добавь RU rules.

### 4. Decoupled `generation.ts`
`buildGenerationRequest()` + `generateRepliesFromRequest()` — stores не знают про API. Тестируется без React.

### 5. Mock AI provider
`MOCK_AI_PROVIDER=true` для CI и dev без API keys. Обязательно с первого дня.

### 6. Observability early
PostHog + Sentry с `__DEV__` / test skips. Не откладывай на «перед релизом».

### 7. Shared UI components
`Button`, `ErrorState` — мелочь, но экраны чище.

### 8. Maestro E2E
`paste-flow.yaml` — smoke test без OCR/device AI. Запускай в CI.

---

## ⚠️ Улучшить с первого дня

### 1. i18n вместо hardcoded strings
Cue — English hardcoded. **Новый проект:** `ru.json` с day 1, даже если только один язык.

### 2. Cross-platform OCR abstraction
Cue — iOS-only Vision module. **Новый:** interface + ML Kit Android с начала, не «добавим Android потом».

### 3. Android RevenueCat key
Cue v1 — только iOS key. **Новый:** оба ключа в `.env` с первого scaffold.

### 4. Google Sign In для Android
Cue — Apple Sign In only. Android users без identity migration — добавь Google в v1 или v1.5.

### 5. Expo Router
Cue — manual navigation. Router проще для deep links и store review.

---

## ❌ Избегать

### 1. «Android потом»
OCR, payments, auth — если не заложить abstraction, переделка ×2.

### 2. Хранение conversation text
Cue правильно не хранит. Не ослабляй ради «analytics» или «улучшения модели».

### 3. Слишком много регионов в v1
Cue — 6 US regions. Для RU хватит 4–5. UA/KZ/BY — v1.1 после feedback.

### 4. Production checklist в конце
Cue `PRODUCTION_READINESS_CHECKLIST.md` — 90% unchecked на паузе. Веди checklist **параллельно** разработке.

### 5. Зависимость от одного AI provider
Abstract `AiProvider` interface. Swap OpenAI ↔ YandexGPT без rewrite generate function.

---

## Cue metrics (reference)

| Metric | Cue state |
|--------|-----------|
| Tests | 1000 passing |
| Screens | 13 |
| Edge Functions | 4 (generate, delete-me, webhook, migrate-account) |
| Code readiness | ~75% |
| Store readiness | ~30% |
| Platform | iOS only |

**Цель нового проекта:** 75% code + **оба стора** в scaffold с week 1.

---

## Key files to study in Cue repo

```
D:\Cue\src\services\generation.ts
D:\Cue\supabase\functions\generate\index.ts
D:\Cue\supabase\functions\_shared\validator.ts
D:\Cue\modules\cue-ocr\src\segmentation.ts
D:\Cue\.kiro\specs\cue-dating-reply-assistant\
D:\Cue\docs\BACKLOG.md
```
