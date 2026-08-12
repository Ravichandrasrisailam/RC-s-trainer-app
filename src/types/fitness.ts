export type NavigationTab = 'training' | 'home' | 'eat';

export type EquipmentType = 'Dumbbells' | 'Resistance Bands' | 'Bodyweight' | 'Barbell' | 'Cable Machine' | 'Kettlebell';

export interface MacroBreakdown {
  protein: number; // grams
  targetProtein: number;
  carbs: number; // grams
  targetCarbs: number;
  fats: number; // grams
  targetFats: number;
  fiber: number; // grams
  targetFiber: number;
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  authProvider?: 'phone' | 'google';
}

export interface UserGoals {
  name: string;
  programPhase: string;
  caloriesTarget: number;
  stepsTarget: number;
  sleepTargetMinutes: number; // e.g. 480 = 8h
  waterTargetMl: number; // e.g. 2500ml
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  selectedEquipment: EquipmentType[];
  rpeCap: number; // e.g. 8.5
}

export interface MuscleGroupStatus {
  id: string;
  name: string;
  recoveryPercentage: number; // 0 to 100
  status: 'Prime' | 'Ready' | 'Recovering' | 'Fatigued';
  lastTrained: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetMuscle: string;
  equipment: EquipmentType;
  suggestedWeightKg?: number;
  rpeTarget?: number;
  instructions?: string;
  rcTip?: string;
  vxsTip?: string;
  completedSets?: boolean[];
  loggedWeights?: number[];
  loggedReps?: number[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  durationMins: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  intensity: 1 | 2 | 3;
  category: 'Hypertrophy' | 'Strength' | 'Cardio' | 'Mobility' | 'RC AI Custom';
  exercisesCount: number;
  caloriesBurnEstimate: number;
  exercises: Exercise[];
  imagePlaceholderLetter: string;
  aiGenerated?: boolean;
}

export interface MealLogItem {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  timestamp: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface DayDietPlan {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  meals: {
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    title: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  }[];
  totalCalories: number;
  totalProtein: number;
}

export interface WeeklyDietPlan {
  goal: string;
  title: string;
  description: string;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  days: DayDietPlan[];
}

export interface ActivityLog {
  id: string;
  type: 'workout' | 'meal' | 'water' | 'sleep' | 'steps' | 'ai';
  description: string;
  value: string;
  time: string;
}

export interface AiGeneratorConfig {
  targetMuscles: string[];
  equipment: EquipmentType[];
  durationMins: number;
  intensityLevel: 'Hypertrophy' | 'Strength' | 'Endurance & Pump';
  includeRpeScaling: boolean;
}


