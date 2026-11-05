# RC Trainer — Rebuild

Responsive fitness tracker with a React JavaScript client and a separate Java 21 / Spring Boot API.

## Stack
- Frontend: React 19, JavaScript/JSX, Vite, Recharts, Lucide
- Authentication and app data: Supabase Auth and PostgreSQL with row-level security
- AI generation: authenticated Supabase Edge Function backed by Cloudflare Workers AI (server-side secrets only)
- Optional API: Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA, Hibernate, Bean Validation
- Build/test: npm, Maven, JUnit 5, Mockito

## Run locally
1. Copy `.env.example` to `.env` and set the frontend's Supabase URL and publishable key.
2. Start the web app: `cd frontend && npm install && npm run dev`.
3. Optional Java API: start local PostgreSQL with `docker compose up -d postgres`, configure `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and a strong `JWT_SECRET`, then run `cd backend && mvn spring-boot:run`.

Frontend defaults to `http://localhost:5173`; optional API defaults to `http://localhost:8080`. The current web client uses Supabase directly and does not depend on the Java API.

## AI setup
Meal estimates and personalized meal/workout plans call the authenticated Supabase `generate-plan` Edge Function. Configure these as Supabase Edge Function secrets (never in Vite variables or Git):

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` (scope it to Workers AI only)
- Optional `CLOUDFLARE_AI_MODEL`; default is `@cf/meta/llama-3.1-8b-instruct`

Workers AI publishes a daily free allocation of 10,000 Neurons. Requests fail closed when the free allocation is exhausted; they do not automatically opt the account into a paid plan. Free allocation and supported models can change; verify current provider terms before launch. See [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) and [JSON mode documentation](https://developers.cloudflare.com/workers-ai/features/json-mode/).

Generated nutrition is approximate and not medical advice. The function derives personalization from the signed-in user's saved profile, validates the generated response, and keeps the provider token server-side.

## Data and deployment
- User-specific meal plans, workout plans, steps, weight, and activity records are persisted in Supabase and protected by row-level security.
- Vercel Preview should have `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` configured for Preview; production values remain separately scoped.
- Verify the signed-in flows in a Preview deployment before promoting or merging to Production.
- OAuth provider setup is managed in Supabase Authentication. Configure the provider's client credentials and allowed redirect URLs in Supabase; do not commit credentials.
- The separate Spring API still uses its local PostgreSQL/Flyway schema and is not the current frontend data path.

## Current application structure
- `frontend/src/pages`: dashboard, meals, workouts, progress, and profile screens.
- `frontend/src/components`: shared UI primitives used by all screens.
- `backend/src/main/resources/db/migration`: versioned PostgreSQL/Flyway schema changes.
