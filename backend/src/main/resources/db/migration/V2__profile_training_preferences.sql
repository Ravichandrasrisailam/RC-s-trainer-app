ALTER TABLE fitness_profile
  ADD COLUMN activity_level VARCHAR(24) NOT NULL DEFAULT 'MODERATE',
  ADD COLUMN training_days_per_week SMALLINT NOT NULL DEFAULT 3;

ALTER TABLE fitness_profile
  ADD CONSTRAINT chk_fitness_activity_level
    CHECK (activity_level IN ('SEDENTARY','LIGHT','MODERATE','VERY_ACTIVE')),
  ADD CONSTRAINT chk_fitness_training_days
    CHECK (training_days_per_week BETWEEN 3 AND 6);
