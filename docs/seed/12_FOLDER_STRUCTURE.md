# 12 — Recommended Folder Structure

Стартовая структура нового репозитория (Expo SDK 56).

```
ripple-ru/                          # или своё имя
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .env.example
├── README.md
│
├── app/                            # Expo Router (рекомендуется) или src/screens/
│   ├── _layout.tsx
│   ├── index.tsx                   # Welcome
│   ├── upload.tsx
│   ├── paste.tsx
│   ├── review.tsx
│   ├── customize.tsx
│   ├── results.tsx
│   ├── paywall.tsx
│   └── settings.tsx
│
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorState.tsx
│   │   ├── MessageBubble.tsx
│   │   └── PrivacyModal.tsx
│   ├── config/
│   │   ├── regionProfiles.ru.ts   # из templates/
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── usePrivacyGate.ts
│   │   └── useGeneration.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   └── ru.json
│   ├── ocr/
│   │   ├── types.ts
│   │   ├── OcrProvider.ts
│   │   ├── segmentation.ts
│   │   ├── index.ts
│   │   └── providers/
│   │       ├── mlkit.android.ts
│   │       ├── vision.ios.ts
│   │       └── mock.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── generation.ts
│   │   ├── purchases.ts
│   │   ├── analytics.ts
│   │   └── errorMonitoring.ts
│   ├── stores/
│   │   ├── conversationStore.ts
│   │   ├── settingsStore.ts
│   │   └── usageStore.ts
│   └── types/
│       ├── api.ts
│       └── domain.ts
│
├── modules/
│   └── ripple-ocr/                 # Expo native module (iOS Vision)
│       ├── ios/
│       ├── android/                # optional if ML Kit via npm
│       └── src/
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 001_initial.sql
│   └── functions/
│       ├── generate/
│       │   └── index.ts
│       ├── delete-me/
│       │   └── index.ts
│       ├── revenuecat-webhook/
│       │   └── index.ts
│       └── _shared/
│           ├── aiPrompt.ru.ts
│           ├── validator.ts
│           ├── safety.ts
│           ├── sanitizer.ts
│           ├── regionDetection.ts
│           ├── schemas.ts
│           └── mockProvider.ru.ts
│
├── docs/
│   ├── BACKLOG.md
│   ├── PRODUCTION_READINESS.md
│   └── EAS_SUBMIT.md
│
├── .maestro/
│   └── flows/
│       ├── paste-flow.yaml
│       └── paywall-flow.yaml
│
└── __tests__/
    ├── unit/
    ├── integration/
    └── fixtures/
        └── conversations.ru.json
```

## Bootstrap commands

```bash
npx create-expo-app@latest ripple-ru --template blank-typescript
cd ripple-ru
npx expo install expo-router expo-image-picker @react-native-async-storage/async-storage
npm install zustand @supabase/supabase-js react-native-purchases posthog-react-native @sentry/react-native
npx supabase init
```

## Copy from Cue (selective)

| From Cue | To new project |
|----------|----------------|
| `src/services/generation.ts` | Adapt |
| `src/stores/*` | Adapt |
| `supabase/functions/_shared/*` | RU localize |
| `modules/cue-ocr/src/segmentation.ts` | `src/ocr/segmentation.ts` |
| `modules/cue-ocr/ios/*` | `modules/ripple-ocr/ios/` |
| `.maestro/flows/paste-flow.yaml` | RU strings |
| `vitest` setup + test patterns | Copy structure |

## Do NOT copy wholesale

- `app.json` iOS-only flags without Android config
- English hardcoded strings
- `regionProfiles.ts` US regions
- Cue branding assets
