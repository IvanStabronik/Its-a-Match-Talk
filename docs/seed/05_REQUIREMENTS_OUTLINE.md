# 05 — Requirements Outline

Скелет spec-документа. При старте проекта расширить до полного `.kiro/specs/` или `docs/requirements.md` по образцу Cue.

---

## R1: Screenshot Upload

- Photo picker: JPEG, PNG, WebP (Android), HEIC (iOS)
- Max 20 MB
- On-device OCR only
- Fail → retry or paste manually
- No persistent screenshot storage

## R2: Manual Paste

- Text field до 5000 символов
- Min 20 символов после trim
- Split by line breaks → messages

## R3: OCR (Cross-Platform)

- **Android:** ML Kit on-device, languages `ru` (+ `en` fallback)
- **iOS:** Apple Vision on-device
- Timeout 15s
- Speaker assignment: left=Они, right=Я, ambiguous=Неизвестно
- Segmentation: spatial clustering (порт `cue-ocr/segmentation.ts`)

## R4: Conversation Review

- Editable bubbles
- Toggle Я / Они / (разрешить Неизвестно до proceed)
- Reorder messages
- Helper: «Больше контекста — лучше ответы»
- Warning if <2 messages (не блокировать)

## R5: Customize Reply

**Регионы (v1):**
- Авто
- RU-Moscow (столица, прямой тон)
- RU-Regions (регионы РФ)
- RU-Piter (СПб, ирония)
- UA (укр. лексика в ответах — опционально v1.1)
- KZ
- BY
- Diaspora-EU

**Цели (8):**
| ID | RU label |
|----|----------|
| keep-it-going | Продолжить разговор |
| flirt-lightly | Лёгкий флирт |
| ask-for-date | Пригласить на свидание |
| get-contact | Получить номер / соцсети |
| recover-awkward | Исправить неловкость |
| clarify-intent | Прояснить намерения |
| reply-politely | Ответить вежливо |
| end-respectfully | Завершить уважительно |

**Тоны (5):**
| ID | RU label |
|----|----------|
| soft | Мягкий |
| playful | Игривый |
| confident | Уверенный |
| direct | Прямой |
| bold | Смелый |

## R6: Generation

- Ровно 3 ответа: **Спокойный / Игривый / Смелый** (маппинг Safe/Playful/Bold)
- Max 300 символов каждый
- Max 3 emoji
- Timeout 20s client + server
- Loading messages RU: «Читаю контекст…», «Проверяю тон…», «Убираю кринж…»
- `reserve_generation` before AI call
- Release on safety_block / timeout / quality_failure

## R7: Anti-Cringe (RU)

Reject if:
- PUA / pick-up лексика («альфа», «сигма», «нейротип», «-frame»)
- Needy («ты мне так нужна», «почему не отвечаешь»)
- Love bombing
- Шаблоны из 2010-х («привет, как дела?» без контекста)
- Капслок, spam emoji
- Культурный mismatch для выбранного региона
- Прямой кальк с английского

## R8: Safety

- Block coercion, harassment, hate, body-shaming
- Harmful input → respectful alternative + safetyFlags
- Age gate 18+

## R9: Results

- 3 cards, copy button, «Почему это работает»
- Regenerate = new generation (usage check)
- Analytics: `reply_copied` без текста ответа

## R10: Paywall

- 3 free generations
- Monthly / Annual / Credits packs
- Fair-use cap 200/month for subscribers
- Restore purchases
- **Android:** Google Play Billing
- **iOS:** Apple IAP

## R11: Privacy

- Privacy modal first use
- Delete all data (DELETE /me)
- No conversation in logs/analytics
- Privacy Policy RU

## R12: Settings

- Reply language: RU (v1 only UI language RU)
- Restore purchases
- Delete data
- Contact support
- Google Sign In (Android) / Apple Sign In (iOS) — v1.5

## R13: Design (RU market)

- Accent: indigo (как Cue) или выбрать свой
- No PUA imagery
- Light mode default
- SafeArea on all screens
