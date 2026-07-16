# 04 — Architecture

## High-level

```mermaid
graph TB
    subgraph devices [Android + iOS]
        App[Expo App]
        OCR[OCR Provider]
        Store[Zustand Stores]
        RC[RevenueCat SDK]
    end

    subgraph supabase [Supabase]
        Auth[Auth Anonymous]
        GW[Edge Functions AI Gateway]
        DB[(Postgres)]
        WH[Payment Webhooks]
    end

    subgraph external [External]
        AI[AI Provider]
        PH[PostHog]
        SE[Sentry]
    end

    App --> OCR
    App --> Store
    App --> RC
    App -->|JWT| Auth
    App -->|POST /generate| GW
    GW --> Auth
    GW --> DB
    GW --> AI
    RC --> WH
    WH --> DB
    App --> PH
    App --> SE
```

## Генерация (sequence)

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant G as AI Gateway
    participant D as Postgres
    participant AI as AI Provider

    U->>A: Generate
    A->>G: POST /generate (messages, goal, tone, region)
    G->>G: Verify JWT
    G->>D: reserve_generation()
    alt USAGE_EXCEEDED
        G-->>A: 403
        A-->>U: Paywall
    else OK
        G->>G: sanitize + safety check
        G->>AI: structured prompt
        AI-->>G: 3 replies JSON
        G->>G: anti-cringe validate
        G->>D: complete_generation()
        G-->>A: success + replies
        A-->>U: Results screen
    end
```

## OCR abstraction (кроссплатформа)

```
src/ocr/
  types.ts              # OCRResult, OCRBlock, OCRError
  OcrProvider.ts          # interface
  segmentation.ts       # platform-agnostic clustering (порт из cue-ocr)
  providers/
    mlkit.android.ts    # ML Kit Text Recognition
    vision.ios.ts       # Apple Vision (порт cue-ocr)
    mock.ts             # dev + tests
  index.ts              # getOcrProvider(): Platform.select
```

**Правило:** скриншот никогда не отправляется на backend. Только extracted text в памяти приложения.

## Client layers (как Cue, но с `components/`)

```
screens/     # UI only
components/  # Button, Card, ErrorState
services/    # API, auth, purchases, ocr, analytics
stores/      # zustand
hooks/       # usePrivacyGate, etc.
types/       # domain + api contracts
config/      # region profiles RU, env
```

## Backend modules (портировать из Cue)

| Модуль Cue | Действие |
|------------|----------|
| `generate/index.ts` | Порт + RU prompts |
| `validator.ts` | RU banned phrases |
| `safety.ts` | RU patterns |
| `sanitizer.ts` | Без изменений |
| `usage reservation RPC` | Без изменений |
| `revenuecat-webhook` | Без изменений |
| `migrate-account` | Опционально v1.5 |
| `cue-ocr` native module | Split → Android ML Kit + iOS Vision |

## Privacy boundary

| Данные | Где живут |
|--------|-----------|
| Скриншот | Только RAM + temp file ≤15s on device |
| Conversation text | Client memory + request body → server RAM → discard |
| Replies | Client memory only |
| Metadata (goal, tone, region, duration) | `generation_log` table |

## Что не тащить из Cue as-is

- iOS-only `eas.json` profiles без Android
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` only → добавить Android key
- English-only UI strings hardcoded → `i18n` с первого дня (хотя бы `ru.json`)
- Apple Sign In only → Google Sign In для Android users
