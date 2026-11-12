/**
 * Exercise database for evidence-based resistance training.
 * Provides categorized movements for Gym (Full equipment) and No Equipment (Bodyweight).
 */

export const EXERCISE_DATABASE = [
  // CHEST
  { name: "Barbell Bench Press", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "6-8" },
  { name: "Incline Dumbbell Bench Press", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Flat Dumbbell Press", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Cable Chest Flye", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Machine Chest Press", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "8-12" },
  { name: "Pec Deck Machine", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Dips (Chest Lean)", muscle: "Chest", equipment: "Gym", sets: 3, repRange: "8-12" },
  { name: "Standard Push-up", muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "12-15" },
  { name: "Decline Push-up (Feet Elevated)", muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "10-12" },
  { name: "Incline Push-up (Hands Elevated)", muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "12-15" },
  { name: "Deficit Push-up (Deep Stretch)", muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "8-12" },
  { name: "Diamond Push-up", muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "10-12" },

  // BACK
  { name: "Lat Pulldown (Neutral Grip)", muscle: "Back", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Chest-Supported T-Bar Row", muscle: "Back", equipment: "Gym", sets: 3, repRange: "6-8" },
  { name: "Seated Cable Row", muscle: "Back", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Barbell Bent-Over Row", muscle: "Back", equipment: "Gym", sets: 3, repRange: "6-8" },
  { name: "Single-Arm Dumbbell Row", muscle: "Back", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Close-Grip Lat Pulldown", muscle: "Back", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Straight-Arm Cable Pulldown", muscle: "Back", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Inverted Row (Under Table / Sturdy Bar)", muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "8-12" },
  { name: "Doorframe Towel Row", muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "10-15" },
  { name: "Prone Back Extension (Superman)", muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "12-15" },
  { name: "Prone Y-T-W Floor Raise", muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "12-15" },

  // QUADRICEPS & GLUTES
  { name: "Barbell Back Squat", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "6-8" },
  { name: "Leg Press (45° Sled)", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Hack Squat Machine", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Goblet Squat (Dumbbell)", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Leg Extension Machine", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Bulgarian Split Squat (Dumbbells)", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Barbell Hip Thrust", muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Bodyweight Bulgarian Split Squat", muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "10-12" },
  { name: "Air Squats (Slow 3s Negative)", muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "15-20" },
  { name: "Walking Lunges", muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "12-15 per leg" },
  { name: "Step-ups (On Chair/Stool)", muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "10-12 per leg" },
  { name: "Single-Leg Glute Bridge", muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "12-15" },

  // HAMSTRINGS
  { name: "Romanian Deadlift (Barbell)", muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Dumbbell Romanian Deadlift", muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Seated Leg Curl", muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Lying Leg Curl", muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Single-Leg Romanian Deadlift (Bodyweight)", muscle: "Hamstrings", equipment: "No Equipment", sets: 3, repRange: "10-12" },
  { name: "Nordic Hamstring Curl (Assisted)", muscle: "Hamstrings", equipment: "No Equipment", sets: 3, repRange: "6-8" },
  { name: "Towel Floor Sliding Leg Curl", muscle: "Hamstrings", equipment: "No Equipment", sets: 3, repRange: "10-12" },

  // SHOULDERS
  { name: "Seated Dumbbell Shoulder Press", muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Standing Overhead Barbell Press", muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "6-8" },
  { name: "Cable Lateral Raise (Behind Back)", muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Dumbbell Lateral Raise", muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Face Pull with External Rotation", muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Reverse Pec Deck Flye", muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Pike Push-up (Floor)", muscle: "Shoulders", equipment: "No Equipment", sets: 3, repRange: "8-10" },
  { name: "Feet-Elevated Pike Push-up", muscle: "Shoulders", equipment: "No Equipment", sets: 3, repRange: "6-8" },
  { name: "Wall Walk Hold", muscle: "Shoulders", equipment: "No Equipment", sets: 3, repRange: "30-45 sec" },

  // ARMS
  { name: "Incline Dumbbell Bicep Curl", muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Barbell / EZ-Bar Bicep Curl", muscle: "Arms", equipment: "Gym", sets: 3, repRange: "8-10" },
  { name: "Dumbbell Hammer Curl", muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Triceps Cable Rope Pushdown", muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Overhead Cable Triceps Extension", muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Skull Crushers (EZ-Bar / DB)", muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12" },
  { name: "Bench / Chair Triceps Dips", muscle: "Arms", equipment: "No Equipment", sets: 3, repRange: "12-15" },
  { name: "Doorframe Single-Arm Bicep Curl", muscle: "Arms", equipment: "No Equipment", sets: 3, repRange: "10-12" },
  { name: "Close-Grip Push-up", muscle: "Arms", equipment: "No Equipment", sets: 3, repRange: "10-12" },

  // CALVES & CORE
  { name: "Standing Machine Calf Raise", muscle: "Calves & Core", equipment: "Gym", sets: 4, repRange: "10-12" },
  { name: "Seated Calf Raise", muscle: "Calves & Core", equipment: "Gym", sets: 4, repRange: "12-15" },
  { name: "Hanging Knee / Leg Raise", muscle: "Calves & Core", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Cable Woodchoppers", muscle: "Calves & Core", equipment: "Gym", sets: 3, repRange: "12-15" },
  { name: "Single-Leg Standing Calf Raise (Stair Step)", muscle: "Calves & Core", equipment: "No Equipment", sets: 4, repRange: "15-20" },
  { name: "Front Plank", muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "45-60 sec" },
  { name: "Hollow Body Hold", muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "30-45 sec" },
  { name: "Deadbug Core Stabilization", muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "12 per side" }
];

export function getAlternatives(currentExerciseName, muscleGroup, equipment = "Gym") {
  const normMuscle = (muscleGroup || "").toLowerCase();
  const eqTarget = equipment === "No Equipment" ? "No Equipment" : "Gym";

  const matches = EXERCISE_DATABASE.filter(ex => {
    if (ex.name.toLowerCase() === currentExerciseName.toLowerCase()) return false;
    if (ex.equipment !== eqTarget) return false;
    const exMuscle = ex.muscle.toLowerCase();
    return exMuscle.includes(normMuscle) || normMuscle.includes(exMuscle) || (normMuscle.includes("chest") && exMuscle.includes("chest")) || (normMuscle.includes("quad") && exMuscle.includes("quad")) || (normMuscle.includes("back") && exMuscle.includes("back")) || (normMuscle.includes("shoulder") && exMuscle.includes("shoulder")) || (normMuscle.includes("arm") && exMuscle.includes("arm")) || (normMuscle.includes("hamstring") && exMuscle.includes("hamstring"));
  });

  if (matches.length > 0) return matches;
  return EXERCISE_DATABASE.filter(ex => ex.equipment === eqTarget && ex.name.toLowerCase() !== currentExerciseName.toLowerCase()).slice(0, 6);
}

export function getAllMuscles() {
  return ["Chest", "Back", "Quads & Glutes", "Hamstrings", "Shoulders", "Arms", "Calves & Core"];
}

