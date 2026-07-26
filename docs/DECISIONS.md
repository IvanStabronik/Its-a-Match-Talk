# Decisions Log — Its a Match Talk

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-16 | **Product name:** Its a Match Talk | User choice |
| 2026-07-16 | **Languages:** RU, UK, PL, EN — all from day 1 | UI + AI replies follow selected locale |
| 2026-07-16 | **Audience:** Russian-speaking users worldwide, not RF-only | Diaspora-first; default region Auto → Diaspora-EU |
| 2026-07-16 | **AI provider:** OpenAI EU | User choice; speed + quality for MVP |
| 2026-07-16 | **Legal entity:** JDG Ivan Stabronik (Poland) | User is based in Poland |
| 2026-07-16 | **Stack:** Expo SDK 57 + TypeScript + Expo Router + Zustand | Cue patterns, Windows-friendly |
| 2026-07-16 | **Backend:** New Supabase project (West EU / Ireland) | `judqmujghjmawjgoiuqr` (URL typo fixed 2026-07-26) |
| 2026-07-16 | **Bundle ID:** `com.ivanstabronik.itsamatchtalk` | Placeholder until store setup |
| 2026-07-16 | **Repo:** https://github.com/IvanStabronik/Its-a-Match-Talk.git | User provided |
| 2026-07-16 | **Auth v1:** Anonymous only | Device-bound; Google/Apple later |
| 2026-07-25 | **Core product:** Relationship clarity analyzer | Chat dynamics > reply generator alone |
| 2026-07-25 | **Free wedge:** Effort Balance | Recurring pain; replies are paid tail |
| 2026-07-25 | **Paid:** Interest trend, Ghost Risk, reciprocity, timeline, next step, 3 replies, re-analyze | Retention + subscription |
| 2026-07-25 | **Modules later:** Flag tracker (P2), Attachment quiz (P3) | Not separate apps |
| 2026-07-25 | **Out:** Rizz / aura / face rating / cheating tests | Brand + store + ethics risk |
| 2026-07-25 | **Color analysis:** Separate spare project | Not in Talk repo |
| 2026-07-25 | **Odysseus:** Agent toolkit patterns only — no code integration | AGPL + wrong product shape |
| 2026-07-25 | **Source of truth:** `docs/requirements.md` + `architecture.md` + `BACKLOG.md` | Seed docs = historical Cue-era |

## Open

- Exact free analysis quota (per day vs lifetime)
- Compare scores: on-device only vs metadata on server
- Privacy Policy URL
- RevenueCat + store prices
- Confirm Supabase Anonymous + migration + function deploy done on project
