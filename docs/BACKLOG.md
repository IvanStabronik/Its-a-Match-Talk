# Backlog — Its a Match Talk

Ordered for shipping the **clarity analyzer**. Checkboxes are the task list.

Legend: `P0` now → `P1` next → `P2` modules → `P3` polish/store.

---

## Docs / process

- [x] `PRODUCT_DIRECTION.md` — analyzer priority
- [x] `requirements.md` — R0–R13
- [x] `architecture.md` — pipeline + trust boundary
- [x] `AGENT_TOOLKIT.md` — Odysseus-inspired agent practices
- [ ] Update `README.md` to point at new docs (not only reply seed)
- [ ] Mark `docs/seed/*` as historical / Cue-era where they conflict

---

## P0 — Analyzer vertical slice (code)

- [x] `src/services/metrics.ts` — Effort Balance signals + composite score
- [x] Unit tests for metrics (`__tests__/unit/metrics.test.ts`)
- [x] Results UI: Effort Balance free + locked paid blocks
- [x] Soften/remove mandatory Customize gate (Review → Analyze)
- [x] Client `analyze` path + local full insights when premium
- [x] Shared `validator`: banned diagnosis lexicon
- [x] Edge prompt: observable-only rules (redeploy needed)
- [x] Paywall stub unlocks premium for testing
- [ ] Finish Supabase setup: Anonymous Auth + SQL migration applied + `functions deploy` + secrets

---

## P1 — Depth + retention

- [ ] Interest trend + Ghost Risk + hot/cold in UI
- [ ] Next step card + 3 replies on paid path
- [ ] Re-analyze flow + on-device previous score compare
- [ ] OCR upload path (ML Kit / Vision) — reuse seed `07`
- [ ] `delete-me` Edge Function + Settings action
- [ ] Usage/entitlement sync ready for RevenueCat

---

## P2 — Flag tracker module

- [ ] Local event log (cancel, ghost, promise, initiative, conflict, boundary)
- [ ] Chronology screen
- [ ] Optional AI summary of *user-logged* events only

---

## P3 — Attachment module + store

- [ ] Short quiz + two-axis result (educational copy)
- [ ] Boundary phrase suggestions
- [ ] Privacy Policy / Terms URLs (PL entity)
- [ ] RevenueCat + store listings
- [ ] EAS production builds

---

## Explicitly not scheduled

- Rizz-check, aura, face rating, cheating/loyalty tests
- Color analysis inside this app
- Odysseus / local LLM as production backend

---

## Current code baseline (already done)

- [x] Expo Router shell + i18n RU/UK/PL/EN
- [x] Paste → Review → Customize → mock 3 replies
- [x] Diversified mock provider by goal
- [x] Supabase client + anon session helper
- [x] Edge `generate` scaffold + SQL migration in repo
- [x] Local `.env` with keys (gitignored)
