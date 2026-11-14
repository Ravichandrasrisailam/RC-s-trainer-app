# Active application data contract

## Architecture

The React frontend uses Supabase Auth and Supabase PostgreSQL as the only active application
authentication and data path. It obtains the signed-in Supabase user and accesses their records
through the Supabase client. Row-level security is the database boundary; the client also filters
queries by the current user ID.

The Spring Boot API and its Flyway schema are a separate optional prototype. The frontend does not
call it, and its `app_user` / `workout_set_log` tables are not the source of truth for the deployed
web application. Do not write active frontend records to both systems.

## Supabase tables used by the frontend

| Table | Data | Access |
|---|---|---|
| `profiles` | Onboarding and fitness preferences | Authenticated user may read/write their own profile |
| `meal_logs` | Timestamped food and nutrition entries | Own rows only |
| `step_logs` | One step count per user and local calendar date | Own rows only |
| `weight_logs` | One weight entry per user and local calendar date | Own rows only |
| `workout_completions` | Completed workout records | Own rows only |
| `workout_set_logs` | Individual exercise sets and timestamps | Own rows only |
| `ai_meal_plans` | Cached personalized meal plan | Own row only |
| `ai_workout_plans` | Cached personalized workout plan | Own row only |

Schema and RLS are maintained in `supabase/migrations`. Run `supabase test db` against a local
Supabase stack to execute `supabase/tests/data_isolation.test.sql`.

## Edge Functions

| Function | Method | Purpose |
|---|---|---|
| `generate-plan` | `POST` | Authenticated meal estimates and personalized meal/workout plans |
| `delete-account` | `POST` | Verifies the caller's Supabase session and deletes that Auth account; associated Supabase rows cascade |

Both functions require JWT verification. `generate-plan` keeps Workers AI credentials server-side
and rate-limits generation. `delete-account` requires Supabase's server-side service-role/secret key;
never expose that key to the browser or a `VITE_` variable.

## Data lifecycle

The Profile screen exports the signed-in user's profile, activity logs, workout sets and cached
plans as JSON. Account deletion is permanent and requires the user to type `DELETE`; it removes
the Supabase Auth identity and rows with `ON DELETE CASCADE`. The optional Spring Boot prototype is
not linked to this account and is not included in the export or deletion operation.
