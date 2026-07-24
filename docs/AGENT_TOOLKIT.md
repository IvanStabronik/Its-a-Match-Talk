# Agent Toolkit — practices borrowed from Odysseus (not integrated)

Source: [odysseus-dev/odysseus](https://github.com/odysseus-dev/odysseus) — AGPL-3.0.  
**Do not copy their code into this repo.** Steal *methods of working*, not implementation.

## Why this file exists

Cursor/agents need a short playbook for Talk development. Odysseus is strong on:
threat boundaries, untrusted LLM input, small PRs, inventory-before-refactor, secret hygiene.

## 1. Trust boundary (map to Talk)

| Odysseus idea | Talk equivalent |
|---------------|-----------------|
| Explicit trust boundary doc | Chat text is **untrusted user content** entering the LLM |
| Prompt-injection wrapper for web/email/memory | Wrap conversation in user/data role; never put chat into system as instructions to “obey” |
| Untrusted ≠ system prompt | System prompt = product rules (no diagnoses, metrics definitions). User message = chat dump |
| Don’t claim agent “knows” private facts | UI: “по переписке видно…”, never “он тебя не любит на 87%” |
| Rotate keys if pasted in chats | Already burned once — prefer dedicated OpenAI key + rotate |

## 2. Spec before code

Odysseus pattern: inventory / threat model / roadmap **before** big slices.

For Talk we keep:

```
docs/PRODUCT_DIRECTION.md   # what we build / don’t
docs/requirements.md        # acceptance criteria
docs/architecture.md        # flows + boundaries
docs/BACKLOG.md             # ordered tasks
docs/DECISIONS.md           # locked choices
```

No feature without a requirement ID (R#) and backlog item.

## 3. Small vertical slices

From their CONTRIBUTING:

- One concern per change (no mix of refactor + feature + formatting)
- Say what was tested (or that it wasn’t)
- Prefer deterministic heuristics scored before LLM narrative

Talk application:

1. Deterministic metrics first (effort, initiative, gaps)
2. LLM explains + suggests replies second
3. UI never shows clinical labels

## 4. Security hygiene checklist (before every push)

Adapted from Odysseus SECURITY.md:

```bash
git status --short
git check-ignore -v .env
# never commit sk- / sb_secret_ / service role
```

Also: conversation text never in `generation_log`, analytics, or Sentry.

## 5. What from Odysseus we deliberately skip

- Docker AI workspace as product backend
- Local LLM cookbook
- Email/calendar/MCP servers in the mobile app
- AGPL code merges

## 6. Optional local use (human, not in CI)

If Ivan runs Odysseus locally: Deep Research / Compare for prompt bake-offs.  
Outputs → paste into `docs/` or fixtures — not as a runtime dependency.
