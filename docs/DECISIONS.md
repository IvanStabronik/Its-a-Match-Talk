# Decisions Log — Its a Match Talk

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-16 | **Product name:** Its a Match Talk | User choice |
| 2026-07-16 | **Languages:** RU, UK, PL, EN — all from day 1 | UI + AI replies follow selected locale |
| 2026-07-16 | **Audience:** Russian-speaking users worldwide, not RF-only | Diaspora-first; default region Auto → Diaspora-EU |
| 2026-07-16 | **Scope:** Dating-first, works for general messaging too | User intent: "супер круто помогать в переписке" |
| 2026-07-16 | **AI provider:** OpenAI EU | User choice; speed + quality for MVP |
| 2026-07-16 | **Legal entity:** JDG Ivan Stabronik (Poland) | User is based in Poland |
| 2026-07-16 | **Stack:** Expo SDK 57 + TypeScript + Expo Router + Zustand | Cue patterns, Windows-friendly |
| 2026-07-16 | **Backend:** New Supabase project (eu-central-1) | Isolated from Cue; EU latency OK |
| 2026-07-16 | **Free tier:** 3 lifetime generations | Cue-proven model |
| 2026-07-16 | **Bundle ID:** `com.ivanstabronik.itsamatchtalk` | Placeholder until App Store / Play setup |
| 2026-07-16 | **Repo:** https://github.com/IvanStabronik/Its-a-Match-Talk.git | User provided |
| 2026-07-16 | **P0 slice:** Paste → Review → Customize → Mock Generate → Results | OCR + payments in Phase 2–3 |

## Open (decide before store release)

- Final App Store / Play Store pricing tiers
- Privacy Policy URL (PL + RU + EN versions)
- Supabase project credentials (Phase 1)
- RevenueCat setup (Phase 3)
