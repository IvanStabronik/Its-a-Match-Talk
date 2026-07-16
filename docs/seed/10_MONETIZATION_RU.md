# 10 — Monetization (RU Market)

## Model (как Cue)

| Tier | Price (ориентир) | Limit |
|------|------------------|-------|
| Free | ₽0 | 3 generations lifetime |
| Monthly | ₽299–499/мес | 200 gens/month fair-use |
| Annual | ₽1999–2999/год | 200 gens/month |
| Credits 10 | ₽149 | 10 one-time |
| Credits 30 | ₽349 | 30 one-time |

Цены — placeholder. Проверить App Store / Play Store price tiers для RU.

## Payment stack

| Platform | SDK | Store |
|----------|-----|-------|
| iOS | RevenueCat + `react-native-purchases` | App Store |
| Android | RevenueCat + `react-native-purchases` | Google Play |

**RevenueCat** — один dashboard для обоих сторов, webhook → Supabase `profiles.is_subscriber`.

## Android-specific: RuStore (v2?)

| Option | When |
|--------|------|
| Google Play only | v1 — проще, RevenueCat ready |
| RuStore IAP | v2 — если целишься в RU без Play Store |

RuStore требует отдельную интеграцию — **не в MVP**.

## Paywall UX (RU copy)

```
Заголовок: «Больше ответов — меньше неловкости»
Подзаголовок: «3 бесплатных генерации. Дальше — подписка или пакет.»

[Месяц — ₽X/мес]
[Год — ₽Y/год] ← Best value badge
[10 ответов — ₽Z]

[Восстановить покупки]
```

## Fair-use policy

- 200 generations/month for subscribers (anti-abuse)
- Reset on billing cycle
- Show remaining count in Settings

## RevenueCat setup checklist

- [ ] Create RevenueCat project
- [ ] iOS: App Store Connect products
- [ ] Android: Google Play Console products
- [ ] Entitlement: `premium`
- [ ] Offerings: `default` with monthly, annual, credits
- [ ] Webhook URL → `revenuecat-webhook` Edge Function
- [ ] Sandbox testing: iOS Sandbox + Google Play test tracks

## Env vars

```
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxx
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxx
```

## Analytics events (no PII)

- `paywall_viewed`
- `purchase_started` (product_id only)
- `purchase_completed`
- `purchase_restored`
- `usage_limit_reached`

## Legal

- Terms of Service RU
- Refund policy per store rules
- Subscription auto-renew disclosure (обязательно для App Store / Play)
