#!/usr/bin/env python3
"""Generate deterministic demo workout and food seed data using only Python stdlib."""
import csv
import hashlib
import json
import random
from pathlib import Path

OUT = Path(__file__).parent / "generated"
OUT.mkdir(exist_ok=True)
rng = random.Random(21)

exercises = [
    ("Barbell Bench Press", "Chest", "Barbell", 3, 6, 10),
    ("Lat Pulldown", "Back", "Cable", 3, 8, 12),
    ("Goblet Squat", "Quads", "Dumbbell", 3, 8, 12),
    ("Romanian Deadlift", "Hamstrings", "Barbell", 3, 8, 12),
    ("Dumbbell Shoulder Press", "Shoulders", "Dumbbell", 3, 8, 12),
    ("Cable Triceps Pushdown", "Triceps", "Cable", 2, 10, 15),
]
foods = [
    ("Boiled egg", 155, 13, 1.1, 11),
    ("Chicken breast, cooked", 165, 31, 0, 3.6),
    ("Cooked white rice", 130, 2.7, 28, 0.3),
    ("Oats", 389, 16.9, 66.3, 6.9),
    ("Paneer", 265, 18.3, 1.2, 20.8),
]

with (OUT / "exercise_seed.csv").open("w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "muscle_group", "equipment", "sets", "rep_min", "rep_max"])
    writer.writerows(exercises)

with (OUT / "food_seed.csv").open("w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "kcal_per_100g", "protein_g", "carbs_g", "fats_g"])
    writer.writerows(foods)

sample_log = []
for day in range(1, 8):
    sample_log.append({
        "day": day,
        "steps": rng.randint(4500, 11500),
        "weight_kg": round(75 + rng.uniform(-0.5, 0.5), 1),
        "protein_g": rng.randint(105, 165),
    })
payload = json.dumps(sample_log, indent=2).encode()
(OUT / "sample_progress.json").write_bytes(payload)
(OUT / "SHA256SUMS.txt").write_text(
    "\n".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}" for p in sorted(OUT.iterdir()) if p.is_file()) + "\n",
    encoding="utf-8",
)
print(f"Generated demo datasets in {OUT}")
