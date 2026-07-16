# 03 — Tech Stack (рекомендация)

## Рекомендуемый стек: Expo SDK 56 + TypeScript

**Почему не Flutter / не bare RN:** команда уже знает паттерны Cue (Expo, Zustand, NativeWind, Supabase). Expo даёт **один codebase** для Android + iOS + EAS Build с Windows.

| Слой | Технология | Примечание |
|------|------------|------------|
| Client | **Expo SDK 56**, React Native, TypeScript | `newArchEnabled` — оценить стабильность на Android |
| Styling | **NativeWind** (Tailwind) | Как в Cue |
| State | **Zustand** | Проверен в Cue |
| Navigation | React Navigation native-stack | |
| Validation | **Zod** | Client + Edge Functions |
| Backend | **Supabase** (Postgres, Auth, Edge Functions) | Можно тот же паттерн что Cue |
| AI Gateway | Supabase Edge Functions (Deno) | Ключи только server-side |
| OCR Android | **@react-native-ml-kit/text-recognition** или Expo config plugin | On-device |
| OCR iOS | Apple Vision (Expo module, портировать логику из `cue-ocr`) | |
| OCR abstraction | `OcrProvider` interface | Одна точка входа, platform-specific impl |
| Payments | **RevenueCat** (Android + iOS) | Единый entitlement sync |
| RuStore (фаза 2) | RuStore Billing SDK + webhook | Отдельный adapter |
| Analytics | PostHog RN | privacy-first config |
| Errors | Sentry RN | scrubbing hooks |
| Tests | Vitest + fast-check | Как в Cue |
| E2E | **Maestro** | Кроссплатформенный |
| CI | GitHub Actions | typecheck + test |
| Build | **EAS Build** | Android APK/AAB + iOS IPA с Windows |

---

## Альтернативы (если откажешься от Expo)

| Стек | Плюсы | Минусы |
|------|-------|--------|
| Flutter | Сильный Android, один UI | Переписать всё с нуля, нет переиспользования Cue |
| Kotlin Multiplatform + Compose | Нативный Android | Два UI или долгий KMP |
| Capacitor + Web | Быстрый web | Плохой OCR, не для этого продукта |

**Вердикт:** Expo RN — оптимальный перенос опыта Cue на Android.

---

## AI Provider (выбрать одно для MVP)

| Провайдер | Плюсы для RU | Минусы |
|-----------|--------------|--------|
| **OpenAI gpt-4o** | Отличный русский, простая интеграция | Данные за рубежом, нужна политика |
| **YandexGPT** | Данные в РФ, 152-ФЗ проще | API, качество «живости» тестировать |
| **GigaChat (Сбер)** | РФ compliance | Лимиты, тон |
| **Anthropic** | Качество | Как OpenAI по compliance |

Рекомендация: **OpenAI для MVP** (скорость), параллельно оценить YandexGPT для production в РФ. См. `15_OPEN_QUESTIONS.md`.

---

## Dev environment (Windows-friendly)

```bash
# Обязательно
Node 20+, Android Studio (emulator), JDK 17

# Для iOS build без Mac
EAS Build (cloud)

# Локально на Windows
npm test                    # вся логика
npx expo run:android        # UI на эмуляторе
npx expo start              # dev client
```

---

## Версии (ориентир на старт — сверить с актуальным Expo docs)

- Expo SDK 56
- React Native 0.85+
- TypeScript 6.x
- Supabase JS 2.x
