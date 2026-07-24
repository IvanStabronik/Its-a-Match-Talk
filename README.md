# Its a Match Talk

**Relationship clarity analyzer** for dating chats: paste a conversation → see observable dynamics → get a next step and reply options.

Languages: русский · українська · polski · English  
Entity: JDG Ivan Stabronik (Poland)  
Stack: Expo 57 · Supabase · OpenAI EU

---

## Docs (start here)

| Doc | Purpose |
|-----|---------|
| [`docs/PRODUCT_DIRECTION.md`](docs/PRODUCT_DIRECTION.md) | What we build / kill |
| [`docs/requirements.md`](docs/requirements.md) | R0–R13 acceptance |
| [`docs/architecture.md`](docs/architecture.md) | Pipeline + trust boundary |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Ordered tasks |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Locked choices |
| [`docs/AGENT_TOOLKIT.md`](docs/AGENT_TOOLKIT.md) | How the coding agent works |
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) | Dashboard / deploy checklist |
| [`docs/seed/`](docs/seed/) | Historical Cue-era seed (OCR, privacy detail) |

---

## Quick start

```bash
npm install
npm start
npm test
npm run typecheck
```

Copy `.env.example` → `.env` for Supabase keys. Never commit `.env`.

---

## What’s in the repo today

- **P0:** Paste → Review → Analyze → Effort Balance (free) + gated premium insights
- **P1:** On-device compare, Settings + delete, upload scaffold, purchases stub
- **Next:** Real OCR engines, RevenueCat, finish Supabase deploy checklist

`docs/seed/` = historical Cue-era notes (OCR/privacy still useful).
---

## Repo

https://github.com/IvanStabronik/Its-a-Match-Talk.git
