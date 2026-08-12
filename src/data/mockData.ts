import { UserGoals, MacroBreakdown, WorkoutPlan, MealLogItem, ActivityLog, MuscleGroupStatus } from '../types/fitness';

export const initialGoals: UserGoals = {
  name: 'Ravichandra',
  programPhase: 'RC Hypertrophy & Strength Phase 2',
  caloriesTarget: 2200,
  stepsTarget: 10000,
  sleepTargetMinutes: 480, // 8h
  waterTargetMl: 2500, // 2.5L
  weightKg: 72.5,
  targetWeightKg: 75.0,
  heightCm: 178,
  selectedEquipment: ['Dumbbells', 'Resistance Bands', 'Bodyweight'],
  rpeCap: 8.5,
};

export const initialMacros: MacroBreakdown = {
  protein: 128,
  targetProtein: 150,
  carbs: 185,
  targetCarbs: 230,
  fats: 52,
  targetFats: 65,
  fiber: 28,
  targetFiber: 35,
};

export const initialMuscleStatuses: MuscleGroupStatus[] = [
  { id: 'm1', name: 'Chest', recoveryPercentage: 92, status: 'Prime', lastTrained: '2 days ago' },
  { id: 'm2', name: 'Lats & Back', recoveryPercentage: 100, status: 'Prime', lastTrained: '3 days ago' },
  { id: 'm3', name: 'Shoulders / Delts', recoveryPercentage: 85, status: 'Ready', lastTrained: 'Yesterday' },
  { id: 'm4', name: 'Quadriceps', recoveryPercentage: 40, status: 'Fatigued', lastTrained: 'Yesterday' },
  { id: 'm5', name: 'Hamstrings & Glutes', recoveryPercentage: 65, status: 'Recovering', lastTrained: 'Yesterday' },
  { id: 'm6', name: 'Biceps & Triceps', recoveryPercentage: 95, status: 'Prime', lastTrained: '3 days ago' },
  { id: 'm7', name: 'Abs & Core', recoveryPercentage: 78, status: 'Ready', lastTrained: '2 days ago' },
];

export const sampleWorkouts: WorkoutPlan[] = [
  {
    id: 'w1',
    title: 'RC Upper Body Hypertrophy',
    durationMins: 45,
    level: 'Intermediate',
    intensity: 2,
    category: 'Hypertrophy',
    exercisesCount: 5,
    caloriesBurnEstimate: 420,
    imagePlaceholderLetter: 'RC',
    aiGenerated: false,
    exercises: [
      { id: 'e1', name: 'Incline Dumbbell Press', sets: 4, reps: '10-12 reps', targetMuscle: 'Upper Chest', equipment: 'Dumbbells', suggestedWeightKg: 26, rpeTarget: 8, instructions: 'Maintain slight arch in lower back, press up smoothly without locking elbows hard.', rcTip: 'RC Auto-Weight: Maintain RPE 8. If set 1 is easy (+2 reps), increase dumbbell weight by +2kg for set 2.' },
      { id: 'e2', name: 'Heavy Band Lat Pulldown', sets: 4, reps: '12 reps', targetMuscle: 'Lats & Back', equipment: 'Resistance Bands', suggestedWeightKg: 18, rpeTarget: 8.5, instructions: 'Drive elbows down towards hips, hold 1s squeeze at bottom.', rcTip: 'Focus on 2-second negative stretch on the way up.' },
      { id: 'e3', name: 'Seated Cable / Band Rows', sets: 3, reps: '12 reps', targetMuscle: 'Mid Back', equipment: 'Resistance Bands', suggestedWeightKg: 22, rpeTarget: 8, instructions: 'Keep spine upright, pull bar towards naval.', rcTip: 'Retract scapula before driving elbows back.' },
      { id: 'e4', name: 'Arnold Dumbbell Press', sets: 3, reps: '8-10 reps', targetMuscle: 'Deltoids', equipment: 'Dumbbells', suggestedWeightKg: 18, rpeTarget: 8, instructions: 'Rotate palms inward at bottom, press up and flare out overhead.', rcTip: 'RPE-capped loading prevents joint fatigue.' },
      { id: 'e5', name: 'Band Bicep Peak Curl', sets: 3, reps: '12-15 reps', targetMuscle: 'Biceps', equipment: 'Resistance Bands', suggestedWeightKg: 14, rpeTarget: 9, instructions: 'Keep elbows locked at sides, squeeze peak bicep contraction.', rcTip: 'Continuous tension band squeeze.' },
    ],
  },
  {
    id: 'w2',
    title: 'RC Lower Body Strength & Power',
    durationMins: 50,
    level: 'Advanced',
    intensity: 3,
    category: 'Strength',
    exercisesCount: 5,
    caloriesBurnEstimate: 510,
    imagePlaceholderLetter: 'RC',
    aiGenerated: false,
    exercises: [
      { id: 'e21', name: 'Goblet Squat (Dumbbell)', sets: 4, reps: '8-10 reps', targetMuscle: 'Quadriceps', equipment: 'Dumbbells', suggestedWeightKg: 32, rpeTarget: 8.5, instructions: 'Break at hips and knees simultaneously, descend past parallel.', rcTip: 'Deep knee travel over toes for quad bias.' },
      { id: 'e22', name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '8-10 reps', targetMuscle: 'Hamstrings & Glutes', equipment: 'Dumbbells', suggestedWeightKg: 28, rpeTarget: 8, instructions: 'Hinge at hips with flat back until deep hamstring stretch.', rcTip: 'Squeeze glutes hard at full lock.' },
      { id: 'e23', name: 'Bulgarian Split Squats', sets: 3, reps: '10 reps/leg', targetMuscle: 'Quads & Glutes', equipment: 'Bodyweight', suggestedWeightKg: 12, rpeTarget: 8.5, instructions: 'Lower rear knee to ground with controlled tempo.', rcTip: 'Stay upright to target quads or lean forward for glute bias.' },
      { id: 'e24', name: 'Band Standing Leg Curls', sets: 3, reps: '15 reps', targetMuscle: 'Hamstrings', equipment: 'Resistance Bands', suggestedWeightKg: 10, rpeTarget: 9, instructions: 'Anchor band low, curl heel towards glute with peak hold.', rcTip: '1-second peak contraction.' },
      { id: 'e25', name: 'Single-Leg Dumbbell Calf Raise', sets: 4, reps: '15 reps', targetMuscle: 'Calves', equipment: 'Dumbbells', suggestedWeightKg: 16, rpeTarget: 9, instructions: 'Pause at bottom stretch for 2 seconds before exploding up.', rcTip: 'Full ankle range of motion.' },
    ],
  },
  {
    id: 'w3',
    title: 'RC Band & Dumbbell Fat Loss Circuit',
    durationMins: 30,
    level: 'Intermediate',
    intensity: 3,
    category: 'Cardio',
    exercisesCount: 4,
    caloriesBurnEstimate: 380,
    imagePlaceholderLetter: 'RC',
    aiGenerated: false,
    exercises: [
      { id: 'e31', name: 'Dumbbell Thrusters', sets: 4, reps: '40 sec work / 20s rest', targetMuscle: 'Full Body & Heart Rate', equipment: 'Dumbbells', suggestedWeightKg: 14, rpeTarget: 8.5, instructions: 'Squat deep then press dumbbells explosive overhead.', rcTip: 'Pace breath during squat drive.' },
      { id: 'e32', name: 'Band Woodchoppers', sets: 4, reps: '15 reps/side', targetMuscle: 'Abs & Obliques', equipment: 'Resistance Bands', suggestedWeightKg: 12, rpeTarget: 8, instructions: 'Rotate torso sharply from high anchor across body to hip.', rcTip: 'Brace core through entire rotational arc.' },
      { id: 'e33', name: 'Floor Mountain Climbers', sets: 3, reps: '45 sec work', targetMuscle: 'Abs & Cardio', equipment: 'Bodyweight', suggestedWeightKg: 0, rpeTarget: 9, instructions: 'Keep hips low, drive knees rapidly to chest.', rcTip: 'Keep hands directly beneath shoulders.' },
      { id: 'e34', name: 'Ab Wheel / Band Rollouts', sets: 3, reps: '12 reps', targetMuscle: 'Core Stability', equipment: 'Bodyweight', suggestedWeightKg: 0, rpeTarget: 8.5, instructions: 'Keep abs hollow and tight, extend forward under full control.', rcTip: 'Avoid sagging at lower back.' },
    ],
  },
];

export const presetMealOptions: Omit<MealLogItem, 'id' | 'timestamp'>[] = [
  { title: 'RC High Protein Whey & Oats Bowl', calories: 420, protein: 45, carbs: 46, fats: 6, type: 'Breakfast' },
  { title: 'Grilled Chicken Breast, Rice & Asparagus', calories: 580, protein: 54, carbs: 62, fats: 10, type: 'Lunch' },
  { title: 'Avocado Egg White Toast & Salmon', calories: 390, protein: 28, carbs: 30, fats: 16, type: 'Breakfast' },
  { title: 'Lean Beef & Sweet Potato Power Plate', calories: 650, protein: 50, carbs: 58, fats: 20, type: 'Dinner' },
  { title: 'Greek Yogurt, Blueberries & Almond Flakes', calories: 270, protein: 26, carbs: 28, fats: 5, type: 'Snack' },
];

export const initialRecentActivities: ActivityLog[] = [
  { id: 'a1', type: 'workout', description: 'RC Upper Body Hypertrophy completed', value: '420 kcal burned', time: '08:15 AM' },
  { id: 'a2', type: 'meal', description: 'RC High Protein Whey & Oats Bowl logged', value: '+420 kcal', time: '09:00 AM' },
  { id: 'a3', type: 'water', description: 'Hydration logged', value: '+500 ml', time: '10:30 AM' },
  { id: 'a4', type: 'meal', description: 'Grilled Chicken Breast & Rice logged', value: '+580 kcal', time: '01:15 PM' },
];

export const initialWeeklyStats = [
  { day: 'Mon', calories: 2250, steps: 9400, sleepHours: 7.5, waterL: 2.4 },
  { day: 'Tue', calories: 2380, steps: 11200, sleepHours: 8.1, waterL: 2.8 },
  { day: 'Wed', calories: 1840, steps: 10432, sleepHours: 7.33, waterL: 1.8 },
  { day: 'Thu', calories: 2100, steps: 8900, sleepHours: 7.0, waterL: 2.2 },
  { day: 'Fri', calories: 2450, steps: 12100, sleepHours: 8.0, waterL: 2.5 },
  { day: 'Sat', calories: 2600, steps: 14500, sleepHours: 8.5, waterL: 3.0 },
  { day: 'Sun', calories: 1950, steps: 7800, sleepHours: 7.8, waterL: 2.1 },
];


