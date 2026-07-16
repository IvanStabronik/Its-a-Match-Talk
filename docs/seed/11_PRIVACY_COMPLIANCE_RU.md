# 11 — Privacy & Compliance (RU)

## Principles (как Cue)

1. **Скриншоты не покидают устройство**
2. **Текст переписки не сохраняется** на сервере
3. **Ответы не логируются** в analytics
4. **Минимум metadata** в `generation_log`

## 152-ФЗ (персональные данные)

| Data | Is PD? | Action |
|------|--------|--------|
| Anonymous user UUID | Borderline | Disclose in Privacy Policy |
| Email (v1.5 sign-in) | Yes | Consent + policy |
| Generation metadata | Low risk | Disclose |
| Conversation text | Not stored | State explicitly |
| Screenshot | Not transmitted | State explicitly |

### Required documents (before public release)

- [ ] **Политика конфиденциальности** (RU) — на сайте + в приложении
- [ ] **Пользовательское соглашение** (RU)
- [ ] **Согласие на обработку ПДн** (checkbox при первом запуске или в Privacy modal)
- [ ] Уведомление в **Роскомнадзор** — если собираешь email / идентифицируемые данные

### Data residency

| Scenario | Recommendation |
|----------|----------------|
| Anonymous only, EU Supabase | Acceptable for MVP; disclose in policy |
| Email sign-in, RU users | Consider RU-hosted DB or legal review |
| YandexGPT as AI provider | Data may transit through Yandex Cloud RU |

## GDPR (diaspora users in EU)

If marketing to EU Russian speakers:
- Right to erasure → `DELETE /me` Edge Function
- Data export — optional v2
- DPO not required for small apps, but privacy policy must cover GDPR basics

## Age gate

- **18+** on first launch (dating context)
- Store age rating: 17+ (iOS) / Mature 17+ (Android)

## Privacy modal (first launch, RU copy)

```
Конфиденциальность

• Скриншоты обрабатываются только на вашем устройстве
• Текст переписки не сохраняется на наших серверах
• Мы не продаём ваши данные

[Политика конфиденциальности]
[Продолжить]
```

## Delete all data

`DELETE /me`:
1. Delete `profiles` row
2. Delete `generation_log` rows
3. Delete Supabase auth user
4. Clear local AsyncStorage
5. Log out RevenueCat

## Analytics privacy

| Allowed | Forbidden |
|---------|-----------|
| `screen_viewed`, `generation_started` | Conversation text |
| `reply_copied` (variant only) | Reply text |
| `paywall_viewed`, `purchase_*` | Screenshot metadata |
| Crash reports (Sentry, no PII) | User identifiers in events |

## AI provider disclosure

Privacy Policy must state:
- Conversation text sent to AI provider for generation only
- Not used for model training (verify provider ToS)
- Provider name and jurisdiction

## App Store / Play Store

- Privacy nutrition labels (iOS): No data linked to user for conversation
- Google Play Data Safety: declare analytics, purchases, crash logs
