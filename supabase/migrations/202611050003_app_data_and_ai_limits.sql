create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name varchar(161) not null,
  height_cm numeric(5, 2) not null check (height_cm between 100 and 230),
  weight_kg numeric(5, 2) not null check (weight_kg between 30 and 300),
  goal varchar(24) not null check (goal in ('WEIGHT_LOSS', 'FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION')),
  activity_level varchar(24) not null
    check (activity_level in ('SEDENTARY', 'LIGHT', 'MODERATE', 'VERY_ACTIVE')),
  training_days_per_week smallint not null check (training_days_per_week between 3 and 6),
  steps_target integer not null check (steps_target between 1000 and 30000),
  protein_target_g numeric(6, 2) not null check (protein_target_g between 20 and 400),
  calories_target integer not null check (calories_target between 500 and 10000),
  has_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles
  add column if not exists calories_target integer;
alter table public.profiles
  alter column activity_level drop default,
  alter column name drop default,
  alter column height_cm drop default,
  alter column weight_kg drop default,
  alter column goal drop default,
  alter column training_days_per_week drop default,
  alter column steps_target drop default,
  alter column protein_target_g drop default,
  alter column calories_target drop default;

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title varchar(180) not null,
  calories numeric(8, 2) not null check (calories >= 0),
  protein numeric(8, 2) not null default 0 check (protein >= 0),
  carbs numeric(8, 2) not null default 0 check (carbs >= 0),
  fats numeric(8, 2) not null default 0 check (fats >= 0),
  fiber numeric(8, 2) not null default 0 check (fiber >= 0),
  meal_type varchar(40) not null default 'Meal',
  logged_at timestamptz not null default now()
);
alter table public.meal_logs
  add column if not exists fiber numeric(8, 2) not null default 0;
alter table public.meal_logs
  alter column calories type numeric(8, 2) using calories::numeric(8, 2),
  alter column meal_type set default 'Meal';
create index if not exists meal_logs_user_logged_at_idx
  on public.meal_logs (user_id, logged_at desc);

create table if not exists public.step_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  steps integer not null check (steps between 0 and 100000),
  log_date date not null default current_date,
  unique (user_id, log_date)
);
create unique index if not exists step_logs_user_log_date_uidx
  on public.step_logs (user_id, log_date);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(5, 2) not null check (weight_kg between 30 and 300),
  logged_at timestamptz not null default now()
);
create index if not exists weight_logs_user_logged_at_idx
  on public.weight_logs (user_id, logged_at desc);

create table if not exists public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id varchar(120) not null,
  workout_title varchar(300) not null,
  calories_burned integer not null default 0 check (calories_burned >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.workout_set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_day varchar(80) not null,
  exercise_name varchar(120) not null,
  load_kg numeric(7, 2) not null check (load_kg between 0 and 1500),
  reps smallint not null check (reps between 1 and 100),
  logged_at timestamptz not null default now()
);
create index if not exists workout_set_logs_user_logged_at_idx
  on public.workout_set_logs (user_id, logged_at desc);

alter table public.profiles enable row level security;
alter table public.meal_logs enable row level security;
alter table public.step_logs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.workout_completions enable row level security;
alter table public.workout_set_logs enable row level security;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists meal_logs_select_own on public.meal_logs;
drop policy if exists meal_logs_insert_own on public.meal_logs;
drop policy if exists step_logs_select_own on public.step_logs;
drop policy if exists step_logs_insert_own on public.step_logs;
drop policy if exists step_logs_update_own on public.step_logs;
drop policy if exists weight_logs_select_own on public.weight_logs;
drop policy if exists weight_logs_insert_own on public.weight_logs;
drop policy if exists workout_completions_select_own on public.workout_completions;
drop policy if exists workout_completions_insert_own on public.workout_completions;
drop policy if exists workout_set_logs_select_own on public.workout_set_logs;
drop policy if exists workout_set_logs_insert_own on public.workout_set_logs;

create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy meal_logs_select_own on public.meal_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy meal_logs_insert_own on public.meal_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy step_logs_select_own on public.step_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy step_logs_insert_own on public.step_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy step_logs_update_own on public.step_logs
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy weight_logs_select_own on public.weight_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy weight_logs_insert_own on public.weight_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy workout_completions_select_own on public.workout_completions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy workout_completions_insert_own on public.workout_completions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy workout_set_logs_select_own on public.workout_set_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy workout_set_logs_insert_own on public.workout_set_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);

revoke all on public.profiles, public.meal_logs, public.step_logs, public.weight_logs,
  public.workout_completions, public.workout_set_logs, public.ai_workout_plans, public.ai_meal_plans from anon, public;
grant select, insert, update on public.profiles, public.meal_logs, public.step_logs,
  public.weight_logs, public.workout_completions, public.ai_workout_plans, public.ai_meal_plans
  to authenticated;
grant select, insert on public.workout_set_logs to authenticated;

create table if not exists public.ai_generation_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0)
);
alter table public.ai_generation_limits enable row level security;
revoke all on public.ai_generation_limits from anon, authenticated, public;
grant usage on schema public to authenticated;

create or replace function public.consume_ai_generation_slot()
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_request_count integer;
begin
  if auth.uid() is null then
    return false;
  end if;

  insert into public.ai_generation_limits as current_limit (user_id, window_started_at, request_count)
  values (auth.uid(), statement_timestamp(), 1)
  on conflict (user_id) do update
  set window_started_at = case
        when current_limit.window_started_at <= statement_timestamp() - interval '1 minute'
          then statement_timestamp()
        else current_limit.window_started_at
      end,
      request_count = case
        when current_limit.window_started_at <= statement_timestamp() - interval '1 minute'
          then 1
        else current_limit.request_count + 1
      end
  returning request_count into v_request_count;

  return v_request_count <= 5;
end;
$function$;

revoke all on function public.consume_ai_generation_slot() from public, anon;
grant execute on function public.consume_ai_generation_slot() to authenticated;
