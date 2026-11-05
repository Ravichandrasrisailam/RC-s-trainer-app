CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fitness_profile (
  user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  height_cm NUMERIC(5,2) NOT NULL CHECK (height_cm BETWEEN 100 AND 230),
  current_weight_kg NUMERIC(5,2) NOT NULL CHECK (current_weight_kg BETWEEN 30 AND 300),
  goal VARCHAR(24) NOT NULL CHECK (goal IN ('WEIGHT_LOSS','FAT_LOSS','MUSCLE_GAIN','RECOMPOSITION')),
  daily_step_target INTEGER NOT NULL DEFAULT 10000 CHECK (daily_step_target BETWEEN 1000 AND 30000),
  protein_target_g NUMERIC(6,2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE meal_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  meal_name VARCHAR(180) NOT NULL,
  meal_type VARCHAR(24) NOT NULL,
  calories NUMERIC(7,2) NOT NULL CHECK (calories >= 0),
  protein_g NUMERIC(7,2) NOT NULL CHECK (protein_g >= 0),
  carbs_g NUMERIC(7,2) NOT NULL CHECK (carbs_g >= 0),
  fats_g NUMERIC(7,2) NOT NULL CHECK (fats_g >= 0),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_meal_user_logged ON meal_log(user_id, logged_at);

CREATE TABLE body_weight_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg BETWEEN 30 AND 300),
  logged_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, logged_on)
);

CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER NOT NULL DEFAULT 0 CHECK (steps >= 0),
  UNIQUE(user_id, activity_date)
);

CREATE TABLE workout_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  days_per_week SMALLINT NOT NULL CHECK (days_per_week BETWEEN 3 AND 6),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workout_exercise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES workout_plan(id) ON DELETE CASCADE,
  day_name VARCHAR(80) NOT NULL,
  exercise_name VARCHAR(120) NOT NULL,
  muscle_group VARCHAR(60) NOT NULL,
  set_count SMALLINT NOT NULL CHECK (set_count BETWEEN 1 AND 10),
  rep_min SMALLINT NOT NULL,
  rep_max SMALLINT NOT NULL,
  sort_order SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE workout_set_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  exercise_name VARCHAR(120) NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL CHECK (weight_kg >= 0),
  reps SMALLINT NOT NULL CHECK (reps BETWEEN 1 AND 100),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  event_type VARCHAR(60) NOT NULL,
  entity_type VARCHAR(60) NOT NULL,
  entity_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_event_history_user_time ON event_history(user_id, occurred_at DESC);
