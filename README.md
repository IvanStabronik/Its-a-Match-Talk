# Its a Match Talk

AI-помощник для переписки: загрузи чат или вставь текст → получи **3 живых ответа** без кринжа. Для знакомств и повседневного общения.

**Языки:** русский · українська · polski · English  
**Платформы:** Android + iOS (Expo)  
**Юрлицо:** JDG Ivan Stabronik (Poland)

---

## Быстрый старт

```bash
npm install
npm start          # Expo dev server
npm run android    # Android emulator
npm test           # Unit tests
npm run typecheck  # TypeScript
```

Скопируй `.env.example` → `.env` когда подключишь Supabase (Phase 1).

---

## Phase 0 (текущая)

Vertical slice **без OCR и платежей**:

```
Age Gate → Privacy → Welcome → Paste → Review → Customize → Generating → Results
```

Mock AI provider — 3 ответа на выбранном языке.

---

## Структура

| Путь | Назначение |
|------|------------|
| `app/` | Expo Router screens |
| `src/i18n/` | Локализация RU / UK / PL / EN |
| `src/services/` | Generation, conversation parsing |
| `src/stores/` | Zustand (settings, conversation) |
| `docs/seed/` | Исходная product documentation |
| `docs/DECISIONS.md` | Принятые решения |

---

## Roadmap

| Phase | Содержание |
|-------|------------|
| **0** ✅ | Paste + mock AI (сейчас) |
| **1** | Supabase + OpenAI EU Edge Function |
| **2** | OCR (ML Kit + Vision) |
| **3** | RevenueCat payments |
| **4** | Privacy Policy, store assets |
| **5** | App Store + Google Play submit |

Подробнее: `docs/seed/14_ROADMAP.md`

---

## Репозиторий

https://github.com/IvanStabronik/Its-a-Match-Talk.git
