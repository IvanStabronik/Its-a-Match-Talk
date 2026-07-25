# Supabase setup — полный чеклист

**Проект:** Its-a-Match-Talk  
**URL:** `https://judqmuighjmawjgoiuqr.supabase.co`  
**Project ref:** `judqmuighjmawjgoiuqr`  
**Регион:** West EU (Ireland)

Пока шаги ниже не сделаны, приложение работает на **локальном mock** (Effort Balance / insights без сервера).

---

## 0. Что должно получиться в итоге

| Компонент | Зачем |
|-----------|--------|
| Anonymous Auth | Device-bound user + JWT для Edge Functions |
| SQL migration | `profiles`, `generation_log`, quota RPC |
| Edge `generate` | AI gateway (OpenAI или mock) |
| Edge `delete-me` | Удаление профиля / логов / auth user |
| Secrets | `OPENAI_API_KEY`, `MOCK_AI_PROVIDER`, service role для delete-me |

Локальный `.env` (уже есть, **не в git**):

```
EXPO_PUBLIC_SUPABASE_URL=https://judqmuighjmawjgoiuqr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable / anon>
SUPABASE_SERVICE_ROLE_KEY=<secret / service_role>   # только для CLI/secrets, не в Expo
OPENAI_API_KEY=sk-...
MOCK_AI_PROVIDER=false
```

---

## 1. Anonymous Auth (дашборд)

1. Открой [Supabase Dashboard](https://supabase.com/dashboard) → проект **Its-a-Match-Talk**.
2. Слева: **Authentication** (иконка человека).
3. Вкладка **Sign In / Providers** (или **Providers**).
4. Найди **Anonymous** → **Enable** → Save.

**Проверка:** Providers → Anonymous = Enabled.

Без этого `signInAnonymously()` в приложении падает → Edge не получит JWT.

---

## 2. SQL migration (дашборд)

1. Слева: **SQL Editor** → **New query**.
2. Открой локально файл:

   `supabase/migrations/20260716120000_initial.sql`

3. Скопируй **весь** файл → вставь в редактор → **Run**.

**Что создаётся:**

- таблицы `profiles`, `generation_log`
- RLS policies
- trigger `on_auth_user_created` → авто-профиль
- RPC: `reserve_generation`, `complete_generation`, `release_generation`

**Проверка:**

- **Table Editor** → видны `profiles` и `generation_log`
- **Database** → **Functions** → есть три `*_generation` функции

Если ошибка «already exists» — ок при повторном прогоне (`if not exists` / replace).  
Если ошибка про permissions — пришли текст ошибки.

---

## 3. CLI: login + link

В PowerShell из папки проекта:

```powershell
cd "D:\Its a Match Talk"

npx supabase login
```

Откроется браузер → Authorize.

```powershell
npx supabase link --project-ref judqmuighjmawjgoiuqr
```

Если спросит database password — это пароль БД, заданный при создании проекта  
(Dashboard → **Project Settings** → **Database** → reset password, если забыл).

**Проверка:**

```powershell
npx supabase projects list
```

Проект `judqmuighjmawjgoiuqr` должен быть linked.

---

## 4. Secrets (OpenAI + флаги)

Из той же папки (ключи подставь свои; не коммить):

```powershell
npx supabase secrets set OPENAI_API_KEY="sk-proj-..." MOCK_AI_PROVIDER=false
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` обычно **уже** доступны Edge Functions автоматически.  
Если `delete-me` ругается на service role — задай явно:

```powershell
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
```

**Проверка:**

```powershell
npx supabase secrets list
```

Должны быть видны имена секретов (не значения): `OPENAI_API_KEY`, `MOCK_AI_PROVIDER`, …

Временно без OpenAI:

```powershell
npx supabase secrets set MOCK_AI_PROVIDER=true
```

Тогда `generate` отдаёт mock-ответы на сервере.

---

## 5. Deploy Edge Functions

```powershell
npx supabase functions deploy generate
npx supabase functions deploy delete-me
```

**Проверка в дашборде:**

- Слева **Edge Functions**
- Есть `generate` и `delete-me`, статус Active / Deployed

**Проверка логов:** Edge Functions → `generate` → Logs (пустые до первого вызова — нормально).

---

## 6. Локальный `.env` приложения

Файл `D:\Its a Match Talk\.env` (gitignored):

| Переменная | Откуда |
|------------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | Dashboard home / Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Settings → **API Keys** → `anon` / `publishable` |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API Keys → `service_role` / `secret` (только для CLI, **не** в клиентский бандл) |
| `OPENAI_API_KEY` | OpenAI → для `secrets set`, не обязателен в Expo `.env` |
| `MOCK_AI_PROVIDER` | `false` когда OpenAI в secrets |

Перезапусти Expo после правки `.env`:

```powershell
npx expo start -c
```

---

## 7. Как понять, что всё живо

### A. Auth

В приложении после старта (или первого Analyze) в Dashboard:

**Authentication** → **Users** → появляется anonymous user.

### B. Quota / DB

После premium Analyze (Unlock for testing):

**Table Editor** → `profiles` → `free_generations_used` или monthly растёт  
`generation_log` → строки со `status = success` (**без** текста переписки).

### C. Edge

**Edge Functions** → `generate` → Logs → 200, не 401/500.

### D. Delete

Settings → Delete all data → user исчезает из Auth (если `delete-me` задеплоен + service role ок).

---

## 8. Типичные ошибки

| Симптом | Причина | Что сделать |
|---------|---------|-------------|
| `Anonymous sign-ins are disabled` | Шаг 1 | Enable Anonymous |
| `401 UNAUTHORIZED` на generate | Нет сессии / Anonymous off | Шаг 1 + перезапуск app |
| `404` Function not found | Не задеплоено | Шаг 5 |
| `reserve_generation` failed | SQL не прогнан | Шаг 2 |
| OpenAI 401 в логах | Плохой/старый key | `secrets set OPENAI_API_KEY=...` |
| App всё ещё «local mock» | `.env` без URL/key или Expo без `-c` | Шаг 6 |
| `delete-me` 500 | Нет service role у function | Явный `secrets set SUPABASE_SERVICE_ROLE_KEY` |

---

## 9. Порядок «сделал и забил» (коротко)

1. ☐ Anonymous Enable  
2. ☐ SQL Editor → весь `20260716120000_initial.sql` → Run  
3. ☐ `npx supabase login`  
4. ☐ `npx supabase link --project-ref judqmuighjmawjgoiuqr`  
5. ☐ `npx supabase secrets set OPENAI_API_KEY="..." MOCK_AI_PROVIDER=false`  
6. ☐ `npx supabase functions deploy generate`  
7. ☐ `npx supabase functions deploy delete-me`  
8. ☐ Проверить Users / Tables / Function logs  
9. ☐ `npx expo start -c` и прогнать Analyze  

Когда все ☐ закрыты — напиши «supabase готово» (или скинь скрин ошибки) — проверим клиентский path.
