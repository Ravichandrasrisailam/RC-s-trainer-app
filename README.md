# RC Trainer — Rebuild

Responsive fitness tracker with a React JavaScript client and Java 21 / Spring Boot 3 API.

## Stack
- Frontend: React 19, JavaScript/JSX, Vite, Recharts, Lucide
- Backend: Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA, Hibernate, Bean Validation
- Database: PostgreSQL, Flyway migrations
- Build/test: Maven, JUnit 5, Mockito
- Seed data: Python standard library only

## Run locally
1. Copy `.env.example` to `.env` and set values.
2. Start PostgreSQL: `docker compose up -d postgres`
3. Start API: `cd backend && mvn spring-boot:run`
4. Start web: `cd frontend && npm install && npm run dev`

Frontend defaults to `http://localhost:5173`; API defaults to `http://localhost:8080`.
Set `VITE_API_BASE_URL=http://localhost:8080/api`.

## Notes
- Meal estimates are estimates, not medical or laboratory measurements. Gemini is called by the Spring Boot service when `GEMINI_API_KEY` is configured. A small local food reference fallback is used when the provider is not configured or unavailable; it clearly labels estimates and does not infer portion sizes.
- Never commit real JWT secrets, database passwords, or Gemini API keys.
- The app uses a first-pass macro target calculation based on body weight and goal.
  Activity level and training frequency are now persisted in the fitness profile and are ready to drive generated plans.
- Steps are manually entered in this baseline. Health-platform integrations are a separate phase.

## Current application structure
- `frontend/src/pages`: dashboard, meals, workouts, progress, and profile screens.
- `frontend/src/components`: shared UI primitives used by all screens.
- `backend/src/main/resources/db/migration`: versioned PostgreSQL/Flyway schema changes.
- `V2__profile_training_preferences.sql` adds activity level and training days per week.

## AI and OAuth rollout
The backend remains the only place that should call an LLM. The next integration should add a provider-backed plan generation service that receives the persisted profile and returns validated meal/workout JSON before saving it. OAuth also needs the Supabase project URL/keys (or an OAuth provider client ID/secret) before it can be enabled safely in development and Vercel.
