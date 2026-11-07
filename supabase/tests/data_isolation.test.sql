begin;

create extension if not exists pgtap with schema extensions;
select extensions.plan(14);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) values
  ('60000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'rls-user-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb),
  ('60000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'rls-user-b@example.test', '', now(), '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

insert into public.profiles (
  id, email, name, height_cm, weight_kg, goal, activity_level,
  training_days_per_week, steps_target, protein_target_g, calories_target, has_onboarded
) values
  ('60000000-0000-4000-8000-000000000001', 'rls-user-a@example.test', 'RLS User A', 170, 70, 'FAT_LOSS', 'MODERATE', 3, 8000, 100, 2000, true),
  ('60000000-0000-4000-8000-000000000002', 'rls-user-b@example.test', 'RLS User B', 175, 75, 'MUSCLE_GAIN', 'LIGHT', 4, 9000, 120, 2400, true)
on conflict (id) do nothing;

insert into public.meal_logs (user_id, title, calories)
values
  ('60000000-0000-4000-8000-000000000001', 'RLS test meal A', 100),
  ('60000000-0000-4000-8000-000000000002', 'RLS test meal B', 200);
insert into public.step_logs (user_id, steps, log_date)
values
  ('60000000-0000-4000-8000-000000000001', 1000, current_date),
  ('60000000-0000-4000-8000-000000000002', 2000, current_date);
insert into public.weight_logs (user_id, weight_kg, logged_on)
values
  ('60000000-0000-4000-8000-000000000001', 70, current_date),
  ('60000000-0000-4000-8000-000000000002', 75, current_date);
insert into public.workout_completions (user_id, workout_id, workout_title)
values
  ('60000000-0000-4000-8000-000000000001', 'rls-a', 'RLS test workout A'),
  ('60000000-0000-4000-8000-000000000002', 'rls-b', 'RLS test workout B');
insert into public.workout_set_logs (user_id, workout_day, exercise_name, load_kg, reps)
values
  ('60000000-0000-4000-8000-000000000001', 'Test day', 'RLS test lift A', 10, 5),
  ('60000000-0000-4000-8000-000000000002', 'Test day', 'RLS test lift B', 20, 5);
insert into public.ai_workout_plans (user_id, training_days_per_week, profile_snapshot, plan)
values
  ('60000000-0000-4000-8000-000000000001', 3, '{}'::jsonb, '{"label":"RLS plan A","days":[]}'),
  ('60000000-0000-4000-8000-000000000002', 4, '{}'::jsonb, '{"label":"RLS plan B","days":[]}');
insert into public.ai_meal_plans (user_id, profile_snapshot, meal_plan)
values
  ('60000000-0000-4000-8000-000000000001', '{}'::jsonb, '{"label":"RLS meals A","meals":[]}'),
  ('60000000-0000-4000-8000-000000000002', '{}'::jsonb, '{"label":"RLS meals B","meals":[]}');

select extensions.has_column('public', 'profiles', 'target_weight_kg', 'profiles schema supports optional target weight');
select extensions.has_column('public', 'meal_logs', 'logged_at', 'meal logs have a persisted timestamp');
select extensions.has_column('public', 'step_logs', 'log_date', 'step logs have a per-day key');
select extensions.has_column('public', 'weight_logs', 'logged_on', 'weight logs have a local calendar date');
select extensions.has_column('public', 'workout_set_logs', 'workout_day', 'workout sets retain their day');

set local role authenticated;
select set_config('request.jwt.claim.sub', '60000000-0000-4000-8000-000000000001', true);

select extensions.is((select count(*)::integer from public.profiles), 1, 'profile reads are scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.meal_logs), 1, 'meal history is scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.step_logs), 1, 'step history is scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.weight_logs), 1, 'weight history is scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.workout_completions), 1, 'workout completions are scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.workout_set_logs), 1, 'workout set history is scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.ai_workout_plans), 1, 'cached workout plans are scoped to the signed-in user');
select extensions.is((select count(*)::integer from public.ai_meal_plans), 1, 'cached meal plans are scoped to the signed-in user');
select extensions.throws_ok(
  $$insert into public.meal_logs (user_id, title, calories)
    values ('60000000-0000-4000-8000-000000000002', 'Cross-account insert', 100)$$,
  '42501',
  null,
  'a signed-in user cannot insert a meal for another account'
);

select * from extensions.finish();
rollback;
