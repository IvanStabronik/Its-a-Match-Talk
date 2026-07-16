# 02 — MVP Scope

## В scope v1.0

### Платформы
- [x] Android (приоритет #1 для RU аудитории)
- [x] iOS (паритет, не second-class)
- [ ] Web — **out of scope**

### User flow
1. Age gate 18+
2. Privacy modal (первый запуск)
3. Welcome
4. **Paste conversation** (обязательно в P0)
5. **Upload screenshot** + on-device OCR (P1 внутри MVP, но до store release)
6. Conversation reviewer (редакт, Я/Они, reorder)
7. Customize (регион, цель, тон)
8. Loading → 3 ответа
9. Copy + Regenerate
10. Paywall после 3 free generations
11. Settings (язык ответов RU, удалить данные, restore purchases)

### Backend
- Supabase Auth (anonymous)
- Edge Functions: `init-profile`, `generate`, `usage-status`, `sync-entitlements`, `revenuecat-webhook` (или аналог)
- Postgres: usage reservation, credit ledger, RLS

### AI
- Один провайдер (OpenAI или YandexGPT / GigaChat — решить в `15_OPEN_QUESTIONS.md`)
- Mock mode для разработки
- RU anti-cringe validator (детерминированный)
- Safety filter

### Монетизация v1
- Google Play Billing (Android)
- Apple IAP (iOS)
- RevenueCat **или** нативные SDK с единым backend sync
- RuStore — **фаза 2** (см. roadmap)

### Observability
- Sentry + PostHog (privacy scrubbing, как в Cue)

---

## Out of scope v1.0

| Фича | Когда |
|------|-------|
| RuStore IAP | Фаза 2 |
| Apple Sign In / Google Sign In | Фаза 1.5 (опционально в MVP) |
| Share extension | Post-launch |
| Saved replies UI | Post-launch |
| UI на украинском / казахском | v1.1+ |
| Cloud OCR fallback | Никогда в v1 (privacy) |
| Desktop (Windows/macOS) | Не планируется |
| Telegram Mini App | Отдельный эксперимент |

---

## Definition of Done для MVP release

- [ ] Paste flow работает end-to-end на Android + iOS
- [ ] OCR работает on-device на обеих платформах (≥75% success rate на тест-наборе)
- [ ] 3 free generations → paywall
- [ ] Sandbox purchase → generation enabled
- [ ] Нет conversation text в логах / analytics / Sentry
- [ ] Privacy Policy + Terms на русском, публичный URL
- [ ] 152-ФЗ: политика обработки ПДн (см. `11_PRIVACY_COMPLIANCE_RU.md`)
- [ ] Internal testing: 5+ человек на Android, 3+ на iOS

---

## P0 Vertical Slice (неделя 1–2 нового проекта)

Только paste, mock AI, без OCR, без платежей:

```
Age Gate → Privacy → Welcome → Paste → Reviewer → Customize → Loading → Results
```

Это копирует проверенный подход Cue и позволяет разрабатывать на Windows с `npm test` + Android emulator.
