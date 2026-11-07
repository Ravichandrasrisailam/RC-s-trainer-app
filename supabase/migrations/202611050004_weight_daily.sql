alter table public.weight_logs
  add column if not exists logged_on date;

update public.weight_logs
set logged_on = (logged_at at time zone 'Asia/Kolkata')::date
where logged_on is null;

with ranked_weight_logs as (
  select id,
    row_number() over (
      partition by user_id, logged_on
      order by logged_at desc, id desc
    ) as row_rank
  from public.weight_logs
)
delete from public.weight_logs as weight_log
using ranked_weight_logs
where weight_log.id = ranked_weight_logs.id
  and ranked_weight_logs.row_rank > 1;

alter table public.weight_logs
  alter column logged_on set not null,
  add constraint weight_logs_user_id_logged_on_key unique (user_id, logged_on);

alter table public.profiles
  add column if not exists target_weight_kg numeric(5, 2);

alter table public.profiles
  alter column target_weight_kg drop default,
  alter column target_weight_kg drop not null;

update public.profiles
set target_weight_kg = null
where target_weight_kg = 70;

drop policy if exists weight_logs_update_own on public.weight_logs;
create policy weight_logs_update_own on public.weight_logs
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant update on public.weight_logs to authenticated;
