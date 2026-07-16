# 14 — Roadmap

## Phase 0: Bootstrap (Week 1)

- [ ] New repo from `12_FOLDER_STRUCTURE.md`
- [ ] Expo 56 + TypeScript + Expo Router
- [ ] Supabase project (eu-central-1)
- [ ] `.env` from `templates/.env.example`
- [ ] `ru.json` i18n skeleton
- [ ] Anonymous auth works
- [ ] Mock AI provider end-to-end

**Exit:** Paste flow → mock 3 RU replies on device (Android emulator OK).

---

## Phase 1: Core MVP (Weeks 2–4)

- [ ] All screens (Welcome → Results → Settings)
- [ ] Paste flow production-ready
- [ ] `generate` Edge Function with RU prompts
- [ ] `reserve_generation` + paywall at 3 free
- [ ] Region profiles RU (4 regions)
- [ ] Anti-cringe validator RU
- [ ] Privacy modal + age gate
- [ ] Unit tests ≥200

**Exit:** Real AI generation via paste on Android emulator.

---

## Phase 2: OCR (Weeks 5–6)

- [ ] ML Kit Android provider
- [ ] Vision iOS module (port cue-ocr)
- [ ] Segmentation shared logic
- [ ] Upload screen + review screen
- [ ] OCR test suite (fixtures)

**Exit:** Screenshot → review → generate on Android emulator + iOS device.

---

## Phase 3: Payments (Weeks 7–8)

- [ ] RevenueCat iOS + Android
- [ ] Paywall screen with dynamic prices
- [ ] Webhook → Supabase subscriber sync
- [ ] Sandbox purchase E2E both platforms

**Exit:** Purchase restores premium on both stores (sandbox).

---

## Phase 4: Polish & Compliance (Weeks 9–10)

- [ ] Privacy Policy RU (legal review)
- [ ] Terms of Service RU
- [ ] PostHog + Sentry production
- [ ] Maestro flows in CI
- [ ] Settings: delete data, restore purchases
- [ ] App icons, splash, store screenshots RU

**Exit:** Production readiness checklist ≥80%.

---

## Phase 5: Store Submit (Weeks 11–12)

- [ ] EAS Build production (iOS + Android)
- [ ] TestFlight internal + Google Play internal track
- [ ] Device QA: OCR on 5+ real devices each platform
- [ ] Store listings RU
- [ ] Submit for review

**Exit:** Live in App Store + Google Play (or internal beta).

---

## Phase 6: v1.1 (Post-launch)

- [ ] Google Sign In + Apple Sign In
- [ ] `migrate-account` for anon → auth
- [ ] UA / KZ / BY region profiles
- [ ] RuStore IAP (if needed)
- [ ] YandexGPT provider option
- [ ] User feedback → prompt tuning

---

## Milestones summary

| Milestone | Week | Platform |
|-----------|------|----------|
| Paste + mock AI | 1 | Android emulator |
| Real AI paste | 4 | Android emulator |
| OCR upload | 6 | Android + iOS device |
| Payments sandbox | 8 | Both |
| Store submit | 12 | Both |

---

## Team size assumption

**1 developer (ты)** — roadmap realistic at ~15–20h/week.
With 2 devs (mobile + backend) — compress Phase 1–3 by ~30%.
