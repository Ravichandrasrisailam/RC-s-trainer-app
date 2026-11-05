create table if not exists public.ai_meal_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_snapshot jsonb not null,
  meal_plan jsonb not null,
  generated_at timestamptz not null default now()
);
alter table public.ai_meal_plans enable row level security;
drop policy if exists "Users can read own AI meal plan" on public.ai_meal_plans;
create policy "Users can read own AI meal plan" on public.ai_meal_plans for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can insert own AI meal plan" on public.ai_meal_plans;
create policy "Users can insert own AI meal plan" on public.ai_meal_plans for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update own AI meal plan" on public.ai_meal_plans;
create policy "Users can update own AI meal plan" on public.ai_meal_plans for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);