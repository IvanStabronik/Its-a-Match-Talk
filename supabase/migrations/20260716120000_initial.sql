-- Its a Match Talk — initial schema
-- Metadata only: never store conversation text or reply text

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  is_subscriber boolean not null default false,
  subscription_expires_at timestamptz,
  free_generations_used int not null default 0,
  monthly_generations_used int not null default 0,
  monthly_reset_at timestamptz
);

create table if not exists public.generation_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  goal text,
  tone text,
  region text,
  detected_region text,
  locale text,
  reply_count int not null default 3,
  duration_ms int,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint generation_log_status_check
    check (status in ('pending', 'success', 'safety_block', 'quality_failure', 'timeout', 'usage_exceeded'))
);

create index if not exists generation_log_user_id_idx on public.generation_log (user_id);
create index if not exists generation_log_created_at_idx on public.generation_log (created_at desc);

alter table public.profiles enable row level security;
alter table public.generation_log enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can read own generation_log"
  on public.generation_log for select
  using (auth.uid() = user_id);

-- Auto-create profile on signup / anonymous auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomic free/subscriber quota check before AI call
create or replace function public.reserve_generation(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_log_id uuid;
  v_free_limit int := 3;
  v_monthly_cap int := 200;
begin
  if p_user_id is null or p_user_id <> auth.uid() then
    return jsonb_build_object('allowed', false, 'reason', 'UNAUTHORIZED');
  end if;

  select * into v_profile from public.profiles where id = p_user_id for update;
  if not found then
    insert into public.profiles (id) values (p_user_id)
    returning * into v_profile;
  end if;

  -- Reset monthly counter if needed
  if v_profile.monthly_reset_at is null or v_profile.monthly_reset_at < date_trunc('month', now()) then
    update public.profiles
    set monthly_generations_used = 0,
        monthly_reset_at = date_trunc('month', now())
    where id = p_user_id
    returning * into v_profile;
  end if;

  if v_profile.is_subscriber
     and (v_profile.subscription_expires_at is null or v_profile.subscription_expires_at > now()) then
    if v_profile.monthly_generations_used >= v_monthly_cap then
      return jsonb_build_object('allowed', false, 'reason', 'USAGE_EXCEEDED');
    end if;
    update public.profiles
    set monthly_generations_used = monthly_generations_used + 1
    where id = p_user_id;
  else
    if v_profile.free_generations_used >= v_free_limit then
      return jsonb_build_object('allowed', false, 'reason', 'USAGE_EXCEEDED');
    end if;
    update public.profiles
    set free_generations_used = free_generations_used + 1
    where id = p_user_id;
  end if;

  insert into public.generation_log (user_id, status)
  values (p_user_id, 'pending')
  returning id into v_log_id;

  return jsonb_build_object(
    'allowed', true,
    'log_id', v_log_id,
    'free_generations_used', (
      select free_generations_used from public.profiles where id = p_user_id
    )
  );
end;
$$;

create or replace function public.complete_generation(
  p_user_id uuid,
  p_log_id uuid,
  p_goal text default null,
  p_tone text default null,
  p_region text default null,
  p_detected_region text default null,
  p_locale text default null,
  p_duration_ms int default null,
  p_status text default 'success'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null or p_user_id <> auth.uid() then
    return jsonb_build_object('ok', false, 'reason', 'UNAUTHORIZED');
  end if;

  update public.generation_log
  set
    goal = coalesce(p_goal, goal),
    tone = coalesce(p_tone, tone),
    region = coalesce(p_region, region),
    detected_region = coalesce(p_detected_region, detected_region),
    locale = coalesce(p_locale, locale),
    duration_ms = coalesce(p_duration_ms, duration_ms),
    status = coalesce(p_status, 'success'),
    reply_count = 3
  where id = p_log_id and user_id = p_user_id;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.release_generation(
  p_user_id uuid,
  p_log_id uuid,
  p_status text default 'quality_failure'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
begin
  if p_user_id is null or p_user_id <> auth.uid() then
    return jsonb_build_object('ok', false, 'reason', 'UNAUTHORIZED');
  end if;

  update public.generation_log
  set status = p_status
  where id = p_log_id and user_id = p_user_id;

  select * into v_profile from public.profiles where id = p_user_id for update;

  if v_profile.is_subscriber
     and (v_profile.subscription_expires_at is null or v_profile.subscription_expires_at > now()) then
    update public.profiles
    set monthly_generations_used = greatest(monthly_generations_used - 1, 0)
    where id = p_user_id;
  else
    update public.profiles
    set free_generations_used = greatest(free_generations_used - 1, 0)
    where id = p_user_id;
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.generation_log to authenticated;
grant execute on function public.reserve_generation(uuid) to authenticated;
grant execute on function public.complete_generation(uuid, uuid, text, text, text, text, text, int, text) to authenticated;
grant execute on function public.release_generation(uuid, uuid, text) to authenticated;
