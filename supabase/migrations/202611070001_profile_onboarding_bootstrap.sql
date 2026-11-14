alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists height_cm numeric(5, 2),
  add column if not exists weight_kg numeric(5, 2),
  add column if not exists goal varchar(24),
  add column if not exists activity_level varchar(24),
  add column if not exists training_days_per_week smallint,
  add column if not exists protein_target_g numeric(6, 2),
  add column if not exists target_weight_kg numeric(5, 2),
  add column if not exists has_onboarded boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  alter column height_cm drop not null,
  alter column weight_kg drop not null,
  alter column goal drop not null,
  alter column activity_level drop not null,
  alter column training_days_per_week drop not null,
  alter column steps_target drop not null,
  alter column protein_target_g drop not null,
  alter column calories_target drop not null,
  alter column has_onboarded set default false;

alter table public.profiles
  drop constraint if exists profiles_height_cm_release_range,
  drop constraint if exists profiles_weight_kg_release_range,
  drop constraint if exists profiles_goal_release_values,
  drop constraint if exists profiles_activity_level_release_values,
  drop constraint if exists profiles_training_days_release_range,
  drop constraint if exists profiles_steps_target_release_range,
  drop constraint if exists profiles_protein_target_release_range,
  drop constraint if exists profiles_calories_target_release_range,
  drop constraint if exists profiles_target_weight_kg_release_range;

alter table public.profiles
  add constraint profiles_height_cm_release_range
    check (height_cm is null or height_cm between 100 and 230) not valid,
  add constraint profiles_weight_kg_release_range
    check (weight_kg is null or weight_kg between 30 and 300) not valid,
  add constraint profiles_goal_release_values
    check (goal is null or goal in ('WEIGHT_LOSS', 'FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION')) not valid,
  add constraint profiles_activity_level_release_values
    check (activity_level is null or activity_level in ('SEDENTARY', 'LIGHT', 'MODERATE', 'VERY_ACTIVE')) not valid,
  add constraint profiles_training_days_release_range
    check (training_days_per_week is null or training_days_per_week between 3 and 6) not valid,
  add constraint profiles_steps_target_release_range
    check (steps_target is null or steps_target between 1000 and 30000) not valid,
  add constraint profiles_protein_target_release_range
    check (protein_target_g is null or protein_target_g between 20 and 400) not valid,
  add constraint profiles_calories_target_release_range
    check (calories_target is null or calories_target between 500 and 10000) not valid,
  add constraint profiles_target_weight_kg_release_range
    check (target_weight_kg is null or target_weight_kg between 30 and 300) not valid;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
