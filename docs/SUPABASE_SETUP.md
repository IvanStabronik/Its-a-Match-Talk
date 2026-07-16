# Phase 1 — Supabase setup checklist

Project: `Its-a-Match-Talk`  
URL: `https://judqmuighjmawjgoiuqr.supabase.co`  
Region: West EU (Ireland) ✅

## 1. Enable Anonymous Auth (required)

Dashboard → **Authentication** → **Sign In / Providers** → **Anonymous** → **Enable**

Without this, the app cannot create a device-bound user.

## 2. Apply database migration

Dashboard → **SQL Editor** → New query → paste contents of:

`supabase/migrations/20260716120000_initial.sql`

→ **Run**

Creates: `profiles`, `generation_log`, `reserve_generation`, `complete_generation`, `release_generation`.

## 3. Deploy Edge Function `generate`

```bash
npx supabase login
npx supabase link --project-ref judqmuighjmawjgoiuqr
npx supabase functions deploy generate
npx supabase secrets set MOCK_AI_PROVIDER=true
# Later, when you have OpenAI:
# npx supabase secrets set OPENAI_API_KEY=sk-... MOCK_AI_PROVIDER=false
```

## 4. Local app `.env` (already created, gitignored)

```
EXPO_PUBLIC_SUPABASE_URL=https://judqmuighjmawjgoiuqr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable>
```

Until steps 1–3 are done, the app **falls back to local mock AI**.

## Security note

Keys were shared in chat. Prefer rotating **secret** key in Dashboard → Project Settings → API Keys if this chat is shared.
