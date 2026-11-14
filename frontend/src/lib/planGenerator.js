/**
 * Scientific resistance training workout generator and macro-balanced meal plan generator.
 */

// ---------------------------------------------------------------------------
// 1. MACRO-BALANCED DAILY NUTRITION PLAN GENERATOR
// ---------------------------------------------------------------------------

export function generateDailyMealPlan(profile) {
  const calories = Number(profile.caloriesTarget) || 2000;
  const protein = Number(profile.proteinTargetG ?? profile.proteinTarget) || 130;
  const goal = profile.goal || "FAT_LOSS";
  const diet = profile.dietaryPreference || "NON_VEG";
  const timing = profile.workoutTiming || "EVENING";
  const goalLabel = goal.replaceAll("_", " ").toLowerCase();

  const isMorning = timing === "MORNING";
  let meals = [];

  if (isMorning) {
    const m1Cals = Math.round(calories * 0.10);
    const m2Cals = Math.round(calories * 0.25);
    const m3Cals = Math.round(calories * 0.32);
    const m4Cals = Math.round(calories * 0.12);
    const m5Cals = calories - m1Cals - m2Cals - m3Cals - m4Cals;

    const m1Prot = Math.round(protein * 0.08);
    const m2Prot = Math.round(protein * 0.30);
    const m3Prot = Math.round(protein * 0.32);
    const m4Prot = Math.round(protein * 0.10);
    const m5Prot = protein - m1Prot - m2Prot - m3Prot - m4Prot;

    meals = [
      {
        mealType: "Pre-Workout Fuel",
        time: "06:15 AM",
        name: "Banana with Black Coffee & Almonds",
        portion: "1 medium banana, 6 soaked almonds, black coffee",
        calories: m1Cals,
        protein: m1Prot,
        carbs: Math.round(m1Cals * 0.75 / 4),
        fats: Math.round(m1Cals * 0.15 / 9),
        fiber: 3,
        preparation: "Easily digestible carbohydrates for training energy. Hydrate with 300ml water."
      },
      {
        mealType: "Post-Workout Breakfast",
        time: "08:30 AM",
        name: diet === "VEG" || diet === "VEGAN"
          ? "Steamed Idlis with Vegetable Sambar & Spiced Tofu Scramble"
          : diet === "EGGETARIAN"
            ? "Steamed Idlis with Vegetable Sambar & 4 Egg White Bhurji"
            : "Steamed Idlis with Vegetable Sambar & 4 Egg White Omelette",
        portion: diet === "VEG" || diet === "VEGAN"
          ? "3 idlis (210g), 1 bowl vegetable sambar (150ml), 100g spiced tofu scramble"
          : "3 idlis (210g), 1 bowl vegetable sambar (150ml), 4 egg whites (140g)",
        calories: m2Cals,
        protein: m2Prot,
        carbs: Math.round(m2Cals * 0.50 / 4),
        fats: Math.round(m2Cals * 0.20 / 9),
        fiber: 6,
        preparation: "High-quality protein and complex carbs to replenish glycogen and support muscular recovery."
      },
      {
        mealType: "Main Lunch",
        time: "01:00 PM",
        name: diet === "NON_VEG"
          ? "Steamed Rice with Homestyle Chicken Curry, Dal & Cabbage Sabzi"
          : diet === "VEG"
            ? "Steamed Rice with Paneer Curry, Thick Dal & Green Beans"
            : diet === "VEGAN"
              ? "Steamed Rice with Soya Chunks Curry, Thick Dal & Green Beans"
              : "Steamed Rice with Egg Curry, Dal & Vegetable Sabzi",
        portion: diet === "NON_VEG"
          ? "1 cup cooked rice (150g), 150g lean chicken breast curry, 1 cup dal, 1 cup cabbage sabzi, 1 cup fresh curd/yogurt"
          : "1 cup cooked rice (150g), 130g paneer/tofu in mild gravy, 1 cup yellow dal, 1 cup mixed vegetables, 1 cup curd/yogurt",
        calories: m3Cals,
        protein: m3Prot,
        carbs: Math.round(m3Cals * 0.45 / 4),
        fats: Math.round(m3Cals * 0.25 / 9),
        fiber: 7,
        preparation: "Balanced complete plate with whole-food protein, complex grains, vegetables, and probiotics from curd."
      },
      {
        mealType: "Evening Snack",
        time: "05:00 PM",
        name: "Boiled Chickpea Salad with Cucumber & Green Tea",
        portion: "1 cup boiled chickpeas (150g) with cucumber, lemon juice and roasted cumin",
        calories: m4Cals,
        protein: m4Prot,
        carbs: Math.round(m4Cals * 0.60 / 4),
        fats: Math.round(m4Cals * 0.20 / 9),
        fiber: 8,
        preparation: "Sustained fiber and micronutrients to maintain steady energy levels through the evening."
      },
      {
        mealType: "Dinner",
        time: "08:15 PM",
        name: diet === "NON_VEG"
          ? "Whole Wheat Phulkas with Grilled Fish & Fresh Cucumber Salad"
          : diet === "VEG"
            ? "Whole Wheat Phulkas with Soya Chunks & Peas Masala with Cucumber Raita"
            : diet === "VEGAN"
              ? "Whole Wheat Phulkas with High-Protein Tofu & Spinach Sabzi"
              : "Whole Wheat Phulkas with Boiled Egg Curry & Mixed Green Salad",
        portion: diet === "NON_VEG"
          ? "2 phulkas (80g), 150g grilled fish fillet (Rohu/Salmon/Pomfret), fresh cucumber-tomato salad"
          : "2 phulkas (80g), 140g soya chunks or paneer in onion-tomato base, fresh cucumber salad with curd",
        calories: m5Cals,
        protein: m5Prot,
        carbs: Math.round(m5Cals * 0.45 / 4),
        fats: Math.round(m5Cals * 0.25 / 9),
        fiber: 6,
        preparation: "Controlled carbohydrate intake for easy nighttime digestion with high protein for overnight recovery."
      }
    ];
  } else {
    // Evening Workout: Breakfast, Lunch, Pre-Workout, Post-Workout Dinner, Night Drink
    const m1Cals = Math.round(calories * 0.24);
    const m2Cals = Math.round(calories * 0.32);
    const m3Cals = Math.round(calories * 0.12);
    const m4Cals = Math.round(calories * 0.26);
    const m5Cals = calories - m1Cals - m2Cals - m3Cals - m4Cals;

    const m1Prot = Math.round(protein * 0.25);
    const m2Prot = Math.round(protein * 0.32);
    const m3Prot = Math.round(protein * 0.08);
    const m4Prot = Math.round(protein * 0.30);
    const m5Prot = protein - m1Prot - m2Prot - m3Prot - m4Prot;

    meals = [
      {
        mealType: "Breakfast",
        time: "08:30 AM",
        name: diet === "NON_VEG" || diet === "EGGETARIAN"
          ? "Crispy Dosa with Vegetable Sambar & 3 Whole Egg Bhurji"
          : "Dosa with Vegetable Sambar & Spiced Paneer Bhurji",
        portion: diet === "NON_VEG" || diet === "EGGETARIAN"
          ? "2 dosas (140g), 1 bowl vegetable sambar (150ml), 3 egg scramble with onions and green chilies"
          : "2 dosas (140g), 1 bowl vegetable sambar (150ml), 100g crumbled paneer/tofu sauteed with turmeric",
        calories: m1Cals,
        protein: m1Prot,
        carbs: Math.round(m1Cals * 0.50 / 4),
        fats: Math.round(m1Cals * 0.25 / 9),
        fiber: 5,
        preparation: "Provides stable morning blood glucose and sustained energy."
      },
      {
        mealType: "Lunch",
        time: "01:00 PM",
        name: diet === "NON_VEG"
          ? "Steamed Rice with Chicken Curry, Dal & Mixed Vegetable Sabzi"
          : diet === "VEG"
            ? "Steamed Rice with Soya Chunks & Peas Curry, Dal & Beetroot Sabzi"
            : diet === "VEGAN"
              ? "Steamed Rice with Tofu & Soya Masala, Yellow Lentil Dal & Spinach Sabzi"
              : "Steamed Rice with Boiled Egg Curry, Dal & Vegetable Sabzi",
        portion: diet === "NON_VEG"
          ? "1 cup cooked rice (150g), 150g lean chicken breast curry, 1 cup yellow dal, 1 cup vegetable sabzi, 1 cup curd"
          : "1 cup cooked rice (150g), 130g meal maker soya chunks in tomato-onion base, 1 cup dal, 1 cup vegetables, 1 cup curd",
        calories: m2Cals,
        protein: m2Prot,
        carbs: Math.round(m2Cals * 0.45 / 4),
        fats: Math.round(m2Cals * 0.25 / 9),
        fiber: 7,
        preparation: "Complete balanced midday meal rich in protein, amino acids, and fiber."
      },
      {
        mealType: "Pre-Workout Fuel",
        time: "05:00 PM",
        name: "Banana with Peanut Butter Toast & Black Coffee",
        portion: "1 banana, 1 slice whole wheat bread with 1 tbsp peanut butter, black coffee",
        calories: m3Cals,
        protein: m3Prot,
        carbs: Math.round(m3Cals * 0.70 / 4),
        fats: Math.round(m3Cals * 0.20 / 9),
        fiber: 4,
        preparation: "Consume 60–90 minutes before your workout for peak lifting stamina."
      },
      {
        mealType: "Post-Workout Dinner",
        time: "08:15 PM",
        name: diet === "NON_VEG"
          ? "Whole Wheat Chapati with Fish or Prawns Curry & Fresh Greens"
          : diet === "VEG"
            ? "Whole Wheat Chapati with Paneer/Tofu Tikka Masala & Cucumber Raita"
            : diet === "VEGAN"
              ? "Whole Wheat Chapati with Soya & Chickpea Curry with Fresh Salad"
              : "Whole Wheat Chapati with 3-Egg Omelette & Fresh Salad",
        portion: diet === "NON_VEG"
          ? "2-3 chapatis (90g), 160g fish or prawns in tomato-onion gravy, bowl of greens with lemon"
          : "2-3 chapatis (90g), 140g paneer or tofu in light curry, cucumber salad with curd",
        calories: m4Cals,
        protein: m4Prot,
        carbs: Math.round(m4Cals * 0.45 / 4),
        fats: Math.round(m4Cals * 0.25 / 9),
        fiber: 6,
        preparation: "Rapidly restores muscle glycogen and delivers essential amino acids for tissue repair."
      },
      {
        mealType: "Recovery Drink",
        time: "10:00 PM",
        name: "Spiced Buttermilk or Warm Turmeric Milk",
        portion: "200ml spiced buttermilk (chaas/mor) with crushed ginger, or warm milk with turmeric",
        calories: m5Cals,
        protein: m5Prot,
        carbs: Math.round(m5Cals * 0.40 / 4),
        fats: Math.round(m5Cals * 0.30 / 9),
        fiber: 1,
        preparation: "Aids digestion and nighttime muscle protein synthesis."
      }
    ];
  }

  meals = meals.map(m => ({
    ...m,
    calories: Math.round(m.calories),
    protein: Math.round(m.protein),
    carbs: Math.round(m.carbs),
    fats: Math.round(m.fats),
    fiber: Math.round(m.fiber)
  }));

  const dietTitle = {
    VEG: "Vegetarian",
    NON_VEG: "Non-Vegetarian",
    EGGETARIAN: "Eggetarian",
    VEGAN: "Vegan"
  }[diet] || "Balanced";

  return {
    label: `Daily Nutrition Plan · ${dietTitle} (${goalLabel.toUpperCase()})`,
    meals
  };
}

// ---------------------------------------------------------------------------
// 2. SCIENTIFIC WEEKLY WORKOUT SCHEDULE GENERATOR
// ---------------------------------------------------------------------------

export function generateScientificWorkoutPlan(profile) {
  const daysCount = Number(profile.trainingDaysPerWeek) || 5;
  const equipment = profile.equipmentAccess === "BODYWEIGHT" ? "No Equipment" : "Gym";
  const injuries = (profile.injuriesOrConditions || "").toLowerCase();

  const hasKneeIssue = injuries.includes("knee") || injuries.includes("patella") || injuries.includes("meniscus");
  const hasShoulderIssue = injuries.includes("shoulder") || injuries.includes("rotator") || injuries.includes("impingement");
  const hasLowerBackIssue = injuries.includes("back") || injuries.includes("spine") || injuries.includes("disc") || injuries.includes("lumbar");

  // Define full weekly templates (Gym & No Equipment) mapped to days of week (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun)
  // Day splits based on trainingDaysPerWeek:
  // 3 Days: Mon=Full Body A, Wed=Full Body B, Fri=Full Body C
  // 4 Days: Mon=Upper A, Tue=Lower A, Thu=Upper B, Fri=Lower B
  // 5 Days: Mon=Push, Tue=Pull, Wed=Legs, Fri=Upper, Sat=Lower
  // 6 Days: Mon=Push A, Tue=Pull A, Wed=Legs A, Thu=Push B, Fri=Pull B, Sat=Legs B

  const routines = {
    Push: {
      name: "Push (Chest, Shoulders & Triceps)",
      focus: "Primary horizontal pressing and overhead mechanics with targeted tricep extension.",
      gymExercises: [
        {
          name: hasShoulderIssue ? "Incline Dumbbell Press (Neutral Grip)" : "Barbell Bench Press",
          muscle: "Chest", equipment: "Gym", sets: 3, repRange: "6-8"
        },
        {
          name: "Incline Dumbbell Bench Press",
          muscle: "Chest", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Cable Lateral Raise",
          muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15"
        },
        {
          name: "Seated Dumbbell Shoulder Press",
          muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Overhead Cable Triceps Extension",
          muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12"
        }
      ],
      bodyweightExercises: [
        {
          name: "Standard Push-ups",
          muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "12-15"
        },
        {
          name: "Decline Push-ups (Feet Elevated)",
          muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Pike Push-ups (Shoulders)",
          muscle: "Shoulders", equipment: "No Equipment", sets: 3, repRange: "8-10"
        },
        {
          name: "Chair / Bench Triceps Dips",
          muscle: "Arms", equipment: "No Equipment", sets: 3, repRange: "12-15"
        },
        {
          name: "Front Plank",
          muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "45-60 sec"
        }
      ]
    },
    Pull: {
      name: "Pull (Back & Biceps)",
      focus: "Vertical and horizontal pulling with stretch-mediated lat and bicep recruitment.",
      gymExercises: [
        {
          name: "Lat Pulldown (Neutral Grip)",
          muscle: "Back", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Chest-Supported T-Bar Row",
          muscle: "Back", equipment: "Gym", sets: 3, repRange: "6-8"
        },
        {
          name: "Seated Cable Row",
          muscle: "Back", equipment: "Gym", sets: 3, repRange: "10-12"
        },
        {
          name: "Face Pull with External Rotation",
          muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15"
        },
        {
          name: "Incline Dumbbell Bicep Curl",
          muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12"
        }
      ],
      bodyweightExercises: [
        {
          name: "Inverted Row (Under Sturdy Table)",
          muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "8-12"
        },
        {
          name: "Doorframe Towel Row",
          muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "12-15"
        },
        {
          name: "Prone Y-T-W Floor Raise",
          muscle: "Shoulders", equipment: "No Equipment", sets: 3, repRange: "12-15"
        },
        {
          name: "Doorframe Single-Arm Bicep Pull",
          muscle: "Arms", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Deadbug Core Stabilization",
          muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "12 per side"
        }
      ]
    },
    Legs: {
      name: "Legs (Quads, Hamstrings & Calves)",
      focus: "Quadriceps compound loading paired with knee-flexion hamstring work.",
      gymExercises: [
        {
          name: hasKneeIssue ? "Leg Press (Moderate Depth)" : "Barbell Back Squat",
          muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "6-8"
        },
        {
          name: hasLowerBackIssue ? "Seated Leg Curl" : "Romanian Deadlift (Barbell)",
          muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Leg Extension Machine",
          muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "10-12"
        },
        {
          name: "Seated Hamstring Curl",
          muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "10-12"
        },
        {
          name: "Standing Machine Calf Raise",
          muscle: "Calves & Core", equipment: "Gym", sets: 4, repRange: "10-12"
        }
      ],
      bodyweightExercises: [
        {
          name: "Bodyweight Bulgarian Split Squats",
          muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Single-Leg Romanian Deadlift",
          muscle: "Hamstrings", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Air Squats (Slow 3s Negative)",
          muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "15-20"
        },
        {
          name: "Towel Floor Sliding Leg Curl",
          muscle: "Hamstrings", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Single-Leg Standing Calf Raise (Stair)",
          muscle: "Calves & Core", equipment: "No Equipment", sets: 4, repRange: "15-20"
        }
      ]
    },
    Upper: {
      name: "Upper Body (Horizontal & Vertical Combo)",
      focus: "Upper body volume accumulation with shoulder and arm focus.",
      gymExercises: [
        {
          name: "Incline Dumbbell Bench Press",
          muscle: "Chest", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Lat Pulldown (Close Grip)",
          muscle: "Back", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Standing Dumbbell Lateral Raise",
          muscle: "Shoulders", equipment: "Gym", sets: 3, repRange: "12-15"
        },
        {
          name: "Dumbbell Hammer Curl",
          muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12"
        },
        {
          name: "Cable Triceps Pushdown",
          muscle: "Arms", equipment: "Gym", sets: 3, repRange: "10-12"
        }
      ],
      bodyweightExercises: [
        {
          name: "Deficit Push-ups (Hands Elevated on Books)",
          muscle: "Chest", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Inverted Row (Table/Door)",
          muscle: "Back", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Pike Push-ups",
          muscle: "Shoulders", equipment: "No Equipment", sets: 3, repRange: "8-10"
        },
        {
          name: "Close-Grip Push-ups (Triceps)",
          muscle: "Arms", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Hollow Body Hold",
          muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "30-45 sec"
        }
      ]
    },
    Lower: {
      name: "Lower Body (Glutes & Posterior Chain)",
      focus: "Hip hinge mastery and glute-hamstring overload.",
      gymExercises: [
        {
          name: "Barbell Hip Thrust",
          muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Bulgarian Split Squat (Dumbbells)",
          muscle: "Quads & Glutes", equipment: "Gym", sets: 3, repRange: "8-10"
        },
        {
          name: "Lying Hamstring Curl",
          muscle: "Hamstrings", equipment: "Gym", sets: 3, repRange: "10-12"
        },
        {
          name: "Seated Calf Raise",
          muscle: "Calves & Core", equipment: "Gym", sets: 4, repRange: "12-15"
        },
        {
          name: "Hanging Knee / Leg Raise",
          muscle: "Calves & Core", equipment: "Gym", sets: 3, repRange: "12-15"
        }
      ],
      bodyweightExercises: [
        {
          name: "Single-Leg Glute Bridge",
          muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "12-15"
        },
        {
          name: "Walking Lunges",
          muscle: "Quads & Glutes", equipment: "No Equipment", sets: 3, repRange: "12-15 per leg"
        },
        {
          name: "Single-Leg Romanian Deadlift",
          muscle: "Hamstrings", equipment: "No Equipment", sets: 3, repRange: "10-12"
        },
        {
          name: "Single-Leg Calf Raise on Step",
          muscle: "Calves & Core", equipment: "No Equipment", sets: 4, repRange: "15-20"
        },
        {
          name: "Front Plank",
          muscle: "Calves & Core", equipment: "No Equipment", sets: 3, repRange: "45-60 sec"
        }
      ]
    }
  };

  // Schedule calendar mapping for 7 days of the week (1=Mon ... 0=Sun)
  // Each day will have: dayOfWeek (0-6), dayName, isRestDay, routine (Push/Pull/Legs/Upper/Lower/Rest)
  let weeklyCalendar = [];

  if (daysCount === 3) {
    weeklyCalendar = [
      { dayIndex: 1, dayName: "Monday", routineKey: "Push", isRestDay: false },
      { dayIndex: 2, dayName: "Tuesday", routineKey: null, isRestDay: true },
      { dayIndex: 3, dayName: "Wednesday", routineKey: "Pull", isRestDay: false },
      { dayIndex: 4, dayName: "Thursday", routineKey: null, isRestDay: true },
      { dayIndex: 5, dayName: "Friday", routineKey: "Legs", isRestDay: false },
      { dayIndex: 6, dayName: "Saturday", routineKey: null, isRestDay: true },
      { dayIndex: 0, dayName: "Sunday", routineKey: null, isRestDay: true }
    ];
  } else if (daysCount === 4) {
    weeklyCalendar = [
      { dayIndex: 1, dayName: "Monday", routineKey: "Upper", isRestDay: false },
      { dayIndex: 2, dayName: "Tuesday", routineKey: "Lower", isRestDay: false },
      { dayIndex: 3, dayName: "Wednesday", routineKey: null, isRestDay: true },
      { dayIndex: 4, dayName: "Thursday", routineKey: "Upper", isRestDay: false },
      { dayIndex: 5, dayName: "Friday", routineKey: "Lower", isRestDay: false },
      { dayIndex: 6, dayName: "Saturday", routineKey: null, isRestDay: true },
      { dayIndex: 0, dayName: "Sunday", routineKey: null, isRestDay: true }
    ];
  } else if (daysCount === 5) {
    weeklyCalendar = [
      { dayIndex: 1, dayName: "Monday", routineKey: "Push", isRestDay: false },
      { dayIndex: 2, dayName: "Tuesday", routineKey: "Pull", isRestDay: false },
      { dayIndex: 3, dayName: "Wednesday", routineKey: "Legs", isRestDay: false },
      { dayIndex: 4, dayName: "Thursday", routineKey: null, isRestDay: true },
      { dayIndex: 5, dayName: "Friday", routineKey: "Upper", isRestDay: false },
      { dayIndex: 6, dayName: "Saturday", routineKey: "Lower", isRestDay: false },
      { dayIndex: 0, dayName: "Sunday", routineKey: null, isRestDay: true }
    ];
  } else {
    // 6 Days
    weeklyCalendar = [
      { dayIndex: 1, dayName: "Monday", routineKey: "Push", isRestDay: false },
      { dayIndex: 2, dayName: "Tuesday", routineKey: "Pull", isRestDay: false },
      { dayIndex: 3, dayName: "Wednesday", routineKey: "Legs", isRestDay: false },
      { dayIndex: 4, dayName: "Thursday", routineKey: "Push", isRestDay: false },
      { dayIndex: 5, dayName: "Friday", routineKey: "Pull", isRestDay: false },
      { dayIndex: 6, dayName: "Saturday", routineKey: "Legs", isRestDay: false },
      { dayIndex: 0, dayName: "Sunday", routineKey: null, isRestDay: true }
    ];
  }

  // Populate actual days for validation and storage (exactly daysCount days for compatibility)
  const trainingDaysOnly = weeklyCalendar.filter(d => !d.isRestDay);
  const days = trainingDaysOnly.slice(0, daysCount).map((d, index) => {
    const routine = routines[d.routineKey] || routines.Push;
    return {
      name: `${d.dayName} · ${routine.name}`,
      dayIndex: d.dayIndex,
      dayName: d.dayName,
      focus: routine.focus,
      exercises: equipment === "No Equipment" ? routine.bodyweightExercises : routine.gymExercises,
      gymExercises: routine.gymExercises,
      bodyweightExercises: routine.bodyweightExercises
    };
  });

  return {
    label: `${daysCount}-Day Training Split`,
    trainingDaysCount: daysCount,
    weeklyCalendar,
    days
  };
}

// Backward-compatibility aliases
export const generateSouthIndianMealPlan = generateDailyMealPlan;
export const generateJeffNippardWorkoutPlan = generateScientificWorkoutPlan;

