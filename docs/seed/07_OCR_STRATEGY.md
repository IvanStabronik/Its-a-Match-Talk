# 07 — OCR Strategy (Android + iOS)

## Принцип

**On-device only.** Скриншот не покидает устройство. Как в Cue, но с двумя native backends за общим интерфейсом.

## Platform matrix

| Platform | Engine | Package / Module |
|----------|--------|------------------|
| Android | Google ML Kit Text Recognition | `@react-native-ml-kit/text-recognition` |
| iOS | Apple Vision | Порт `modules/cue-ocr` из Cue |
| Dev/Test | Mock provider | Фиксированные blocks |
| Web | N/A | Paste only |

## Shared logic (порт из Cue)

Из `D:\Cue\modules\cue-ocr\src\segmentation.ts`:
- Clustering text blocks by vertical proximity → messages
- Speaker by horizontal position: `x < 0.5` → Them, `x > 0.5` → Me
- Timeout 15s
- Temp file cleanup after processing

## Android-specific notes

- ML Kit supports Cyrillic (`ru`)
- Test on: Samsung (One UI), Xiaomi (MIUI), Pixel (stock)
- Dark theme screenshots (Pure, Telegram dark) — отдельный тест-набор
- `expo-image-picker` works on Android
- Permissions: `READ_MEDIA_IMAGES` (Android 13+)

## iOS-specific notes

- Портировать `CueOcrModule.swift` в новый Expo module
- HEIC support
- Privacy: no photo upload to server

## OCR Provider interface

```typescript
interface OcrProvider {
  isAvailable(): boolean;
  recognizeText(imageUri: string, options?: { languages?: string[] }): Promise<OcrResult>;
}

// Factory
function createOcrProvider(): OcrProvider {
  if (Platform.OS === 'android') return new MlKitOcrProvider();
  if (Platform.OS === 'ios') return new VisionOcrProvider();
  return new MockOcrProvider();
}
```

## Fallback UX

```
OCR fail / timeout / no text
  → Alert: «Не удалось распознать текст»
  → [Попробовать снова] [Вставить вручную]
```

## Test plan (до release)

| # | Source | Android | iOS |
|---|--------|---------|-----|
| 1 | Tinder light | ✓ | ✓ |
| 2 | Bumble | ✓ | ✓ |
| 3 | Pure dark | ✓ | ✓ |
| 4 | Mamba | ✓ | ✓ |
| 5 | Telegram | ✓ | ✓ |
| 6 | Blurry / low res | ✓ | ✓ |
| 7 | Long screenshot | ✓ | ✓ |
| 8 | Cyrillic + emoji | ✓ | ✓ |

Target: **≥75%** usable extraction without manual fix of >50% messages.

## Windows development

- Android emulator: full OCR via ML Kit
- iOS OCR: только на Mac device или EAS + TestFlight
- Until iOS device: use **paste flow** + mock OCR tests
