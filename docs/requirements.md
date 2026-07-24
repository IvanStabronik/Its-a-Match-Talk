# Requirements — Relationship Clarity Analyzer

**Product:** Its a Match Talk  
**Supersedes for MVP focus:** reply-only framing in `docs/seed/05_REQUIREMENTS_OUTLINE.md`  
**Seed docs remain** useful for OCR, privacy, stack detail — this file is the source of truth for *what* we ship next.

---

## Actors

- **User** — 18+, dating / early relationship chat
- **System** — Expo app + Supabase Edge AI gateway

---

## R0 — Trust & safety language

- All insight copy must describe **observable chat patterns**, not inner feelings of the other person.
- Forbidden output labels: clinical / abuser / narcissist / “X% attachment type as diagnosis”.
- Attachment module (later): educational axes only, not a medical claim.
- Age gate 18+ remains.

## R1 — Ingest conversation

- Paste text (min 20 / max 5000 chars) — **P0**
- Screenshot + on-device OCR — **P1** (same as seed R1/R3)
- No persistent screenshot storage
- Conversation text not written to DB beyond request lifetime

## R2 — Speaker review

- Split into messages; assign Me / Them / Unknown
- User can toggle speaker before analysis
- Block analysis if fewer than 2 messages with assigned speakers (warning at 2–3)

## R3 — Effort Balance (FREE)

Deterministic (preferred) or hybrid metrics:

| Signal | Definition (v1) |
|--------|-----------------|
| Initiation share | Who sent after a gap ≥ X minutes |
| Volume share | Char / message count Me vs Them |
| Reply latency | Median gap before each side replies (if timestamps exist; else skip) |
| Question share | Messages containing `?` |

**Output:** simple balance view (e.g. Me 40% / Them 60% effort composite) + 1–2 plain-language bullets.  
**Must not** say “they don’t like you”.

## R4 — Interest trend (PAID)

- Direction of Them’s engagement over chat thirds (early / mid / late): up / flat / down
- Based on length, initiation, reply gaps when available
- Soft copy only

## R5 — Ghost Risk (PAID)

Risk band: Low / Medium / High from observable cues:

- Growing gaps before Them replies
- Shorter Them messages over time
- Unanswered Me openers
- Explicit delay / cancel language (keyword/LLM assist, flagged as “mentioned”, not proven)

## R6 — Hot/cold timeline (PAID)

- Segment chat into periods with relative “engagement” score
- Visual or list timeline; no medical framing

## R7 — Next step + 3 replies (PAID)

- One recommended next action (wait / clarify / propose meet / cool down / end politely)
- Exactly 3 reply variants: Calm / Playful / Bold (API: Safe / Playful / Bold)
- Anti-cringe + safety filters (seed R7/R8)
- Locales: RU, UK, PL, EN

## R8 — Re-analyze & compare (PAID, P1)

- User runs analysis again on a newer paste
- Optional compare: effort / ghost band vs previous run
- Store **only metadata** of prior scores (not chat text) if compare is enabled — or keep prior scores on-device only (decide in architecture)

## R9 — Red/green flag tracker (module, P2)

User-logged events, not AI accusations:

- Cancelled plans, disappearances, broken promises, initiative, conflicts, boundary respect
- Chronology UI; AI may summarize *user-entered* log, not invent events

## R10 — Attachment style (module, P3)

- Short quiz; anxiety / avoidance axes
- Triggers + boundary phrases + “don’t send 10 messages”
- Never primary store listing promise

## R11 — Privacy & delete

- Privacy modal first launch
- Auto-discard conversation after response
- Delete all data (`DELETE /me`)
- No chat/reply text in analytics or Sentry

## R12 — Monetization gates

- Free: ingest + review + Effort Balance (+ soft cap on analyses/day or lifetime — TBD)
- Paywall before R4–R7 detail
- Restore purchases when RevenueCat lands

## R13 — Platforms

- Android + iOS parity (Expo)
- Web out of scope v1

---

## Acceptance (MVP ship)

- [ ] Paste → review → Effort Balance on free path
- [ ] Paid path shows Ghost Risk + Interest trend + next step + 3 replies
- [ ] No forbidden diagnostic phrases in golden-set tests
- [ ] Conversation absent from DB tables and logs
- [ ] RU/UK/PL/EN UI strings for analyzer screens
