create table if not exists public.ai_workout_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  training_days_per_week smallint not null check (training_days_per_week between 3 and 6),
  profile_snapshot jsonb not null,
  plan jsonb not null,
  generated_at timestamptz not null default now()
);
alter table public.ai_workout_plans enable row level security;
drop policy if exists "Users can read own AI workout plan" on public.ai_workout_plans;
create policy "Users can read own AI workout plan" on public.ai_workout_plans for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can insert own AI workout plan" on public.ai_workout_plans;
create policy "Users can insert own AI workout plan" on public.ai_workout_plans for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update own AI workout plan" on public.ai_workout_plans;
create policy "Users can update own AI workout plan" on public.ai_workout_plans for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
