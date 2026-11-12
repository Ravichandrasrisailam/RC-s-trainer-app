-- Profile enhancements: country, city, dietary preference, gym timing, equipment, injuries, medical notes
alter table public.profiles
  add column if not exists country varchar(100),
  add column if not exists city varchar(100),
  add column if not exists dietary_preference varchar(32) default 'NON_VEG',
  add column if not exists workout_timing varchar(32) default 'EVENING',
  add column if not exists equipment_access varchar(32) default 'FULL_GYM',
  add column if not exists injuries_or_conditions text,
  add column if not exists prescription_notes text,
  add column if not exists prescription_url text;

-- Add permissive check constraints if valid
alter table public.profiles
  drop constraint if exists profiles_dietary_preference_values,
  drop constraint if exists profiles_workout_timing_values,
  drop constraint if exists profiles_equipment_access_values;

alter table public.profiles
  add constraint profiles_dietary_preference_values
    check (dietary_preference is null or dietary_preference in ('NON_VEG', 'VEG', 'EGGETARIAN', 'VEGAN')) not valid,
  add constraint profiles_workout_timing_values
    check (workout_timing is null or workout_timing in ('MORNING', 'EVENING')) not valid,
  add constraint profiles_equipment_access_values
    check (equipment_access is null or equipment_access in ('FULL_GYM', 'DUMBBELLS_BANDS', 'BODYWEIGHT')) not valid;

