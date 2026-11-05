export const demoProfile = {
  firstName: "Ravi",
  lastName: "Chandra",
  age: 26,
  heightCm: 175,
  weightKg: 75,
  goal: "FAT_LOSS",
  activityLevel: "MODERATE",
  trainingDaysPerWeek: 3,
  stepTarget: 10000,
  proteinTarget: 150
};

export const workoutPlans = {
  3: { label: "3-day full body", days: ["Full Body A", "Full Body B", "Full Body C"], exercises: [
    { name: "Barbell Squat", muscle: "Quads", sets: 3, repRange: "6–10", equipment: "Barbell" },
    { name: "Bench Press", muscle: "Chest", sets: 3, repRange: "6–10", equipment: "Barbell" },
    { name: "Lat Pulldown", muscle: "Back", sets: 3, repRange: "8–12", equipment: "Cable" },
    { name: "Romanian Deadlift", muscle: "Hamstrings", sets: 3, repRange: "8–12", equipment: "Barbell" }
  ]},
  4: { label: "4-day upper / lower", days: ["Upper A", "Lower A", "Upper B", "Lower B"], exercises: [
    { name: "Bench Press", muscle: "Chest", sets: 4, repRange: "6–10", equipment: "Barbell" },
    { name: "Seated Cable Row", muscle: "Back", sets: 3, repRange: "8–12", equipment: "Cable" },
    { name: "Shoulder Press", muscle: "Shoulders", sets: 3, repRange: "8–12", equipment: "Dumbbell" },
    { name: "Lat Pulldown", muscle: "Back", sets: 3, repRange: "10–12", equipment: "Cable" }
  ]},
  5: { label: "5-day split", days: ["Push", "Pull", "Legs", "Upper", "Lower"], exercises: [
    { name: "Incline Dumbbell Press", muscle: "Chest", sets: 3, repRange: "8–12", equipment: "Dumbbell" },
    { name: "Lateral Raise", muscle: "Shoulders", sets: 3, repRange: "12–15", equipment: "Dumbbell" },
    { name: "Triceps Pushdown", muscle: "Triceps", sets: 3, repRange: "10–15", equipment: "Cable" },
    { name: "Overhead Press", muscle: "Shoulders", sets: 3, repRange: "6–10", equipment: "Barbell" }
  ]},
  6: { label: "6-day push / pull / legs", days: ["Push A", "Pull A", "Legs A", "Push B", "Pull B", "Legs B"], exercises: [
    { name: "Bench Press", muscle: "Chest", sets: 4, repRange: "6–8", equipment: "Barbell" },
    { name: "Incline Dumbbell Press", muscle: "Chest", sets: 3, repRange: "8–12", equipment: "Dumbbell" },
    { name: "Cable Fly", muscle: "Chest", sets: 3, repRange: "12–15", equipment: "Cable" },
    { name: "Triceps Extension", muscle: "Triceps", sets: 3, repRange: "10–12", equipment: "Cable" }
  ]}
};

export const initialMeals = [
  { id: "1", name: "Eggs and wholegrain toast", mealType: "Breakfast", calories: 390, protein: 27, carbs: 32, fats: 17, loggedAt: "08:20" },
  { id: "2", name: "Chicken and rice bowl", mealType: "Lunch", calories: 560, protein: 48, carbs: 62, fats: 12, loggedAt: "13:10" }
];
