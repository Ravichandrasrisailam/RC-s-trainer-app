# RC Trainer — End-to-End Project Handoff

**Status date:** 5 November 2026
**Repository:** `Ravichandrasrisailam/RC-s-trainer-app`
**Working branch:** `codex/fix-data-ai-gaps`
**Purpose:** Record what is implemented, what is deployed, what has been verified, and what must be completed before a Production frontend release.

## Executive status

The current intended product path is a static React frontend on Vercel that uses Supabase Auth, PostgreSQL, and an authenticated Supabase Edge Function. The Edge Function calls Cloudflare Workers AI using server-side secrets. The Java/Spring API is a separate, optional implementation; the active frontend does not call it.

**Do not treat the whole application as production-release-ready yet.** The current local frontend changes pass the focused tests and production build, and the Supabase database/function changes were applied to the Supabase project. However:

1. The Vercel Production site was last observed serving the older UI. The latest intended frontend has not been promoted to Production.
2. The current Preview is associated with PR #5 and its pushed branch commit. It does **not** contain the additional staged, unstaged, and untracked work currently in this local checkout.
3. The PR description reports successful AI-generation UAT on its Preview, but this review did not independently repeat all authenticated writes and reload-persistence flows.
4. The database migration was run through the Supabase Dashboard SQL editor. Confirm migration-history state and reconcile it with the checked-in migration files before relying on future automated `supabase db push` runs.
5. The standalone Spring API has not been deployed and is not part of the current Vercel/Supabase release path.

## Current release and repository state

| Area | Current status | Evidence / qualification |
|---|---|---|
| Frontend source | Updated locally | Profile-driven AI plan behavior and empty states are in the local working tree. |
| Local frontend checks | Passed | `npm test` reports 6 passing tests; `npm run build` succeeds. |
| Supabase schema | Applied to `inktrhlrcelzcqecpltt` | Dashboard verification found the app tables, target columns without defaults, numeric meal calories, and user-scoped policies. The project dashboard labels this project **Production**. |
| Supabase AI function | Deployed to `inktrhlrcelzcqecpltt` | Dashboard reported successful update; the deployed source was previously compared against the local function source. |
| Vercel Preview | Reachable | The Preview URL is [the PR branch Preview](https://rc-s-trainer-app-git-codex-fix-data-ai-gaps-rc-7e0c.vercel.app/). The signed-in dashboard was visible during this review. |
| PR #5 | Open, not merged | [Fix persistence and add personalized AI meal/workout plans](https://github.com/Ravichandrasrisailam/RC-s-trainer-app/pull/5) targets `main`. |
| GitHub checks | Incomplete evidence | The only check run returned for the PR head was “Vercel Preview Comments” (success). It is not evidence that the new frontend test/build workflow ran on the pushed PR commit. |
| Vercel Production frontend | Promotion pending | The Production domain was last observed serving the prior UI, including a preset workout screen and an “AI service is connected” placeholder message. |
| Java API | Not deployed; not used by current frontend | Its configuration and database are separate from the Supabase-backed Vercel app. |

### Local checkout warning

The local branch HEAD was `45741f8` (`Fix outdated AI setup message`), matching `origin/codex/fix-data-ai-gaps` when checked. There are additional staged/unstaged tracked changes and untracked files in the working tree. Therefore, the code currently tested locally is not necessarily the code in the pushed branch or the deployed Preview.

Before creating or pushing a release commit:

- Review `git status` and inspect the staged and unstaged diffs separately.
- Include the intended app, workflow, documentation, Supabase config, and migration changes.
- Keep the unrelated untracked `tools/maven/` directory out of the release unless its origin and purpose are confirmed.
- Push the reviewed changes to the PR branch, wait for a fresh Preview build, and test that exact build.

## Product architecture and runtime flow

```text
Browser
  └─ Vercel static React/Vite frontend
       ├─ Supabase Auth: signup, password sign-in, persisted session
       ├─ Supabase PostgREST/PostgreSQL: profile and user activity
       │    └─ Row-level security scopes records to auth.uid()
       └─ Supabase Edge Function: generate-plan (JWT required)
            ├─ validates the signed-in user and saved profile
            ├─ enforces per-user AI request limit
            └─ Cloudflare Workers AI (credentials remain server-side)

Separate, optional path:
Browser/client ─X─ Java 21 / Spring Boot REST API ── local PostgreSQL/Flyway
                   Not called by the current frontend
```

The frontend’s active data path is Supabase directly. Deploying the Spring API is not required for the currently intended Vercel app. Avoid running two competing account/data systems without first deciding which backend is authoritative.

## What is implemented

### Frontend

- React 19/Vite app with Overview, Meals, Workouts, Progress, and Profile screens.
- Email/password sign-up and sign-in using Supabase Auth; the Supabase client persists and refreshes the session.
- New profile values start blank rather than being populated with demo fitness values.
- Onboarding/profile validation requires user-entered height, weight, goal, activity level, training days, steps, protein, and calories.
- Meals and workouts use validated AI-generated plans; the current local code does not substitute sample plans when generation is unavailable.
- Meal and workout plans are cached per user in Supabase with a profile snapshot; a plan can be regenerated.
- Meal estimates are requested from the Edge Function and meal entries are persisted.
- Step, weight, and individual workout-set entries are persisted as user-owned records.
- Dashboard and progress displays use loaded activity and profile targets, with empty states where data is missing.
- Error messages are surfaced for profile loading/saving and AI/logging failures.

Primary frontend files: `frontend/src/App.jsx`, `frontend/src/api.js`, `frontend/src/data.js`, `frontend/src/lib/validation.js`, and `frontend/src/pages/`.

### Supabase schema and access control

Tracked migrations are:

- `supabase/migrations/202611050001_ai_workout_plans.sql`
- `supabase/migrations/202611050002_ai_meal_plans.sql`
- `supabase/migrations/202611050003_app_data_and_ai_limits.sql`

The app schema covers profiles, meal logs, daily steps, weight logs, workout completions, workout-set logs, cached AI plans, and AI-generation limits. RLS policies are intended to restrict app rows to the authenticated owner. The latest migration removes database defaults from user-entered profile fields while preserving existing rows.

Dashboard verification after the authorized migration reported:

- AI plan, activity, workout-set, and rate-limit tables were present.
- Required profile targets no longer had database defaults.
- Meal calories had a numeric type.
- User-scoped policies were present.
- Existing user data was not wiped.

**Important:** Removing a column default does not erase values already stored in existing profile rows. Any old sample/default-like values already persisted must be reviewed or corrected as user data; the migration did not delete them.

### AI service

`supabase/functions/generate-plan/index.ts` supports:

- `generate-workout`
- `generate-meals`
- `estimate-meal`

The function validates the caller’s Supabase session, reads the saved profile for the authenticated user, validates the provider response, and returns clear failure responses rather than substituting demo content. The Cloudflare account ID, API token, and optional model are Edge Function secrets; the token is not meant to be exposed in Vite/Vercel client variables. The user previously confirmed the Cloudflare token was rotated and the secret updated.

The migration limits authenticated AI requests to **5 per user per minute**. Cloudflare account-level quota can still be exhausted; AI generation then fails and the user must retry later. Generated nutrition is approximate and is not medical advice.

### Deployment configuration and documentation

- `vercel.json` builds the frontend and publishes `frontend/dist`.
- `.github/workflows/frontend-checks.yml` defines frontend `npm ci`, `npm test`, and `npm run build` checks for relevant PR/push changes.
- `.env.example` documents the frontend Supabase variables and local Java/PostgreSQL variables.
- `README.md` documents the frontend, optional API, AI secrets, data model, and deployment sequence.
- `supabase/config.toml` identifies the Supabase project/function configuration.

## Java/Spring API: separate and incomplete

The backend is a Spring Boot 3.4 / Java 21 REST application with JWT authentication, validation, JPA, Flyway migrations, and a local PostgreSQL compose service. Its documented endpoints include account registration/login, profile, meal estimate/logging, and weight/step progress.

This backend is **not wired to the active frontend**. The frontend calls Supabase and the `generate-plan` Edge Function instead. The backend has its own `app_user`/`fitness_profile` schema and JWT system, so its users and data are separate from Supabase Auth.

Known limitations from the source and `docs/API.md`:

- The API documentation says workout-plan persistence, event-history writes, daily summaries, refresh-token rotation, password reset, rate limiting, and AI-provider integration remain incomplete.
- The Java meal estimator has a small generic food-reference fallback and optional Gemini integration. This is different from the active Cloudflare Workers AI path and should not be mistaken for the shipped app’s AI implementation.
- No production hosting/database configuration for this API was verified.
- Backend tests were reported passing in an earlier project check, but they were not rerun while preparing this handoff.

If the Java service is intentionally out of scope, label it as a future/legacy component and do not deploy it as a hidden dependency. If it is intended to become active, reconcile auth, schema, profile fields, AI behavior, tests, and deployment before switching the frontend.

## Remaining gaps and release gates

### P0 — Must close before promoting the frontend

1. **Get the tested code into the release branch.** Review the local staged/unstaged changes, include the required migration/config files, exclude unrelated files, commit and push to PR #5, then wait for a fresh Preview deployment.
2. **Verify the fresh Preview is the expected build.** Confirm the profile-driven empty states and the current AI-generation flow are present; do not infer this from an older deployment or the PR title.
3. **Run authenticated UAT end to end on that exact Preview.** Use a dedicated test account and verify:
   - Sign-in, sign-up behavior with email confirmation enabled/disabled, sign-out, and session restoration.
   - First-time onboarding, profile save, profile reload, and required fields.
   - Meal and workout plan generation, plan cache reuse, regeneration, and user-visible failure/quota behavior.
   - Meal estimate/log, steps, weight, workout-set writes, and persistence after reload.
   - A second test account cannot read or modify the first account’s records (RLS isolation).
   - Mobile layout and navigation.
4. **Promote only after the Preview gates pass.** Confirm Vercel Production’s `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` point to the intended Supabase project. These are build-time variables; redeploy after changes. Keep Cloudflare credentials exclusively in Supabase Edge Function secrets.
5. **Reconcile Supabase migration tracking.** The database changes were applied through the dashboard SQL editor. Check `supabase_migrations.schema_migrations` against all three migration files and determine whether any are absent from migration history before running automated migration commands. Do not blindly reapply or mark migrations applied without verifying the actual schema and intended state.
6. **Create and rehearse a rollback path.** Record the Vercel rollback target and database/function rollback approach. Database rollback may require a forward corrective migration or backup restore; do not assume the DDL is automatically reversible.

### P1 — Required before a broad public launch

- Confirm Supabase Auth email-confirmation settings, allowed site URLs, redirect URLs, password policy, and production/Preview domain allowlists. The frontend currently has no visible password-reset flow; account recovery should be added or an operational recovery path documented.
- Verify that the Cloudflare token is scoped to the minimum Workers AI permissions and that its current value is only stored in Supabase secrets. Do not put credentials in this document, Vercel client environment variables, logs, or chat.
- Review monitoring and alerting for Edge Function failures, Supabase errors, Cloudflare quota, and Vercel build/deployment failures.
- Define account deletion, user-data export/retention, and support procedures. These product/operational flows were not verified in the app.
- Confirm AI response safety and quality with representative profiles, dietary constraints/allergies, and invalid/timeout/quota cases. Current input model does not expose a detailed allergy/dietary-preference flow.
- Confirm generated plan caching invalidates when every relevant profile input changes; the current snapshots include goal/activity/training schedule/body measurements, and meal plans also include protein/calorie targets.
- Confirm workout-set history requirements. The frontend writes workout sets, but this handoff verification did not establish a UI for reviewing prior sets or a full workout-completion flow.

### P2 — Operational and maintenance

- Ensure the PR’s frontend test/build workflow actually appears and passes on GitHub after the latest code is pushed. The last PR check query showed only the Vercel Preview Comments check.
- Decide whether to retain, finish, or formally de-scope the separate Spring API.
- Add automated integration/E2E coverage for Supabase auth, RLS, Edge Function behavior, and persistence; the current six frontend tests primarily cover local validation.
- Keep deployment instructions, migration history, and Preview/Production environment notes synchronized with actual dashboard settings.

## Verification record

| Check | Result | Scope |
|---|---|---|
| Frontend unit tests | Pass — 6 tests | Local working tree; `npm test` in `frontend/`. |
| Frontend production build | Pass | Local working tree; `npm run build` in `frontend/`. |
| `git diff --check` | Pass | Local working tree at the last check. |
| Supabase schema/policy verification | Reported pass | Project `inktrhlrcelzcqecpltt`; existing rows preserved. |
| Edge Function deployment | Reported successful | Supabase dashboard confirmed deployment. |
| Vercel Preview dashboard | Reachable and signed in | Dashboard view only in this handoff review; not a full CRUD/UAT run. |
| AI-generation UAT | Reported by PR description | PR #5 states meal/workout generation succeeded on its Preview after validation/retry fixes; independently repeat against a fresh Preview built from the current local changes. |
| Production frontend | Not approved | Last observed serving an older UI. |
| Authenticated CRUD/RLS isolation UAT | Not completed in this review | Complete using dedicated test accounts before promotion. |
| Java backend tests | Not rerun for this handoff | Earlier project context reported 3 tests passing. |

## Recommended next sequence

1. Review `git status`, staged diff, unstaged diff, and untracked files.
2. Reconcile Supabase migration history and confirm the current Production-labeled project remains the intended backend for this release.
3. Commit and push only the reviewed implementation and release documentation to PR #5.
4. Confirm the GitHub test/build workflow runs and the new Vercel Preview builds from that exact commit.
5. Run and record the authenticated UAT checklist above without using real user data as test data.
6. Fix any failures and repeat the Preview checks.
7. Obtain explicit Production-release approval, verify Production environment variables/secrets, deploy the frontend, and run a short post-deploy smoke test.
8. Keep the Java API out of the release unless separately approved and made production-ready.

## Key references

- [README.md](./README.md) — setup, AI configuration, and deployment guidance.
- [docs/API.md](./docs/API.md) — optional Java API routes and documented gaps.
- [frontend/src/App.jsx](./frontend/src/App.jsx) — app/session/profile/plan orchestration.
- [frontend/src/api.js](./frontend/src/api.js) — Supabase reads/writes and AI invocation.
- [frontend/src/lib/validation.js](./frontend/src/lib/validation.js) — profile and AI response validation.
- [frontend/test/validation.test.js](./frontend/test/validation.test.js) — current frontend unit tests.
- [supabase/migrations/](./supabase/migrations/) — Supabase schema and RLS migrations.
- [supabase/functions/generate-plan/index.ts](./supabase/functions/generate-plan/index.ts) — authenticated Cloudflare Workers AI function.
- [vercel.json](./vercel.json) — static frontend build/deploy configuration.
- [PR #5](https://github.com/Ravichandrasrisailam/RC-s-trainer-app/pull/5) — open implementation PR and its Preview.
