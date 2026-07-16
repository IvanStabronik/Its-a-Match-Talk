# 09 — Backend Outline (Supabase)

## Stack

- **Supabase** — Auth, Postgres, Edge Functions (Deno)
- Same pattern as Cue — минимальный backend, AI gateway only

## Database schema (порт из Cue migrations)

### `profiles`
```sql
id uuid PK references auth.users
created_at timestamptz
is_subscriber boolean default false
subscription_expires_at timestamptz
free_generations_used int default 0
monthly_generations_used int default 0
monthly_reset_at timestamptz
```

### `generation_log` (metadata only)
```sql
id uuid PK
user_id uuid FK
goal text
tone text
region text
detected_region text
reply_count int default 3
duration_ms int
status text -- success | safety_block | quality_failure | timeout
created_at timestamptz
-- NO conversation text, NO reply text
```

### RPC functions
- `reserve_generation(p_user_id)` → `{ allowed, reason }`
- `complete_generation(p_user_id, p_log_id, ...)`
- `release_generation(p_user_id, p_log_id)`

## Edge Functions

| Function | Method | Auth | Notes |
|----------|--------|------|-------|
| `generate` | POST | JWT | Main AI gateway |
| `delete-me` | DELETE | JWT | GDPR / 152-ФЗ delete |
| `revenuecat-webhook` | POST | Secret | Subscription sync |
| `migrate-account` | POST | JWT | v1.5 — anonymous → Google/Apple |

## Environment secrets

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
OPENAI_API_KEY          # or YANDEX_GPT_API_KEY
REVENUECAT_WEBHOOK_SECRET
MOCK_AI_PROVIDER=false
```

## Auth strategy

| v1 | v1.5 |
|----|------|
| Anonymous Supabase auth | + Google Sign In (Android) |
| Device-bound user id | + Apple Sign In (iOS) |
| RevenueCat links to anon uid | `migrate-account` preserves quota |

## Deployment

```bash
supabase link --project-ref <ref>
supabase db push
supabase functions deploy generate
supabase functions deploy delete-me
supabase functions deploy revenuecat-webhook
```

## CORS

Allow app origins only in production. Expo dev: `exp://` schemes.

## Monitoring

- Edge Function logs in Supabase Dashboard
- Sentry for function errors (optional wrapper)
- PostHog server-side events optional (prefer client-only for privacy)

## What NOT to store

- Screenshot bytes
- Full conversation text (beyond request RAM)
- Generated reply text in DB
- User email (until v1.5 sign-in)

## RU hosting note

Supabase regions: **eu-central-1** (Frankfurt) — acceptable for RU users latency-wise.
If 152-ФЗ requires RU data residency → evaluate Yandex Cloud + self-hosted Postgres later.
