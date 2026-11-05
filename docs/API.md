# API outline

All authenticated endpoints require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account and issue JWT |
| POST | `/api/auth/login` | Authenticate and issue JWT |
| GET / PUT | `/api/profile` | Read or update fitness profile |
| POST | `/api/nutrition/estimate` | Estimate a meal from text |
| GET / POST | `/api/nutrition/meals` | List and create meal logs |
| POST | `/api/progress/weight` | Record body weight |
| POST | `/api/progress/steps` | Record daily steps |

The first implementation intentionally keeps the REST surface small. Workout plan persistence,
event-history writes, daily summary aggregation, refresh-token rotation, password reset,
rate limiting and AI-provider integration should be completed before public production launch.
