import React, { useState } from 'react';
import { initialGoals, initialMacros, sampleWorkouts } from './data/mockData';
import { UserGoals, MacroBreakdown, WorkoutPlan, NavigationTab, MealLogItem, UserProfile } from './types/fitness';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { EatTab } from './components/EatTab';
import { TrainingTab } from './components/TrainingTab';
import { BottomNav } from './components/BottomNav';
import { ProfileTab } from './components/ProfileTab';
import { WorkoutModal } from './components/WorkoutModal';
import { LogMealModal } from './components/LogMealModal';
import { QuickLogModal } from './components/QuickLogModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import { CheckCircle2, Cpu, Maximize2 } from 'lucide-react';

export default function App() {
  // Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isLoggedIn: false,
    name: 'Ravichandra',
    phone: '+1 9876543210',
    email: 'srisailam.ravichandra3828@gmail.com',
  });

  // Active Bottom Tab State (default 'home', options: 'training' | 'home' | 'eat')
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Fitness & Meal Log State
  const [userGoals, setUserGoals] = useState<UserGoals>(initialGoals);
  const [macros, setMacros] = useState<MacroBreakdown>(initialMacros);
  const [steps, setSteps] = useState<number>(8420);
  const [weightKg, setWeightKg] = useState<number>(72.5);
  const [workoutsList] = useState<WorkoutPlan[]>(sampleWorkouts);

  // Initial logged meals for today
  const [loggedMeals, setLoggedMeals] = useState<MealLogItem[]>([
    {
      id: 'm1',
      title: 'Whey Protein & Oatmeal Bowl',
      calories: 420,
      protein: 42,
      carbs: 48,
      fats: 6,
      fiber: 8,
      timestamp: '08:30 AM',
      type: 'Breakfast',
    },
    {
      id: 'm2',
      title: 'Grilled Chicken & Rice Bowl',
      calories: 580,
      protein: 52,
      carbs: 62,
      fats: 10,
      fiber: 7,
      timestamp: '01:15 PM',
      type: 'Lunch',
    },
  ]);

  // Modals state
  const [selectedWorkoutModal, setSelectedWorkoutModal] = useState<WorkoutPlan | null>(null);
  const [isMealLogOpen, setIsMealLogOpen] = useState<boolean>(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Activity Log Handlers
  const handleAddSteps = (addedSteps = 1000) => {
    setSteps((prev) => prev + addedSteps);
    showToast(`Logged +${addedSteps.toLocaleString()} Steps`);
  };

  const handleLogWeight = (newWeight: number) => {
    setWeightKg(newWeight);
    setUserGoals((prev) => ({ ...prev, weightKg: newWeight }));
    showToast(`Logged Weight: ${newWeight} kg`);
  };

  const handleAddMeal = (meal: Omit<MealLogItem, 'id' | 'timestamp'>) => {
    const newMealItem: MealLogItem = {
      ...meal,
      id: `meal-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLoggedMeals((prev) => [newMealItem, ...prev]);

    // Update macros breakdown
    setMacros((prev) => ({
      ...prev,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fats: prev.fats + meal.fats,
      fiber: prev.fiber + (meal.fiber || 5),
    }));

    showToast(`Logged ${meal.title} (+${meal.calories} kcal)`);
  };

  const handleFinishWorkout = (_workoutId: string, caloriesBurned: number) => {
    setSelectedWorkoutModal(null);
    showToast(`Workout Completed! ~${caloriesBurned} kcal burned`);
  };

  // If user is not logged in, render the Login Screen
  if (!userProfile.isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-[#060608] text-zinc-200 flex items-center justify-center p-0 sm:p-6 relative overflow-x-hidden font-sans select-none">
        <div className="w-full max-w-md bg-[#0e0e11] sm:rounded-3xl border border-zinc-800/80 shadow-2xl overflow-hidden min-h-[100vh] sm:min-h-[730px]">
          <LoginScreen
            onLoginSuccess={(profile) => {
              setUserProfile(profile);
              setUserGoals((prev) => ({ ...prev, name: profile.name }));
              showToast(`Welcome back, ${profile.name}!`);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-[#060608] text-zinc-200 flex flex-col items-center justify-center p-0 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans select-none">
        {/* Offline Connection Banner */}
        <div className="w-full max-w-5xl mb-2 px-1">
          <OfflineBanner />
        </div>

        {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-600/90 text-white font-mono text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn border border-red-500/30">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className={`w-full flex items-center justify-center ${isExpandedView ? 'max-w-6xl' : 'max-w-5xl'}`}>
        {/* Responsive Container: Phone frame or expanded desktop view */}
        <div
          className={`bg-[#0e0e11] border-zinc-800/80 relative overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
            isExpandedView
              ? 'w-full max-w-4xl min-h-[750px] rounded-3xl border'
              : 'w-full sm:w-[390px] h-[100vh] sm:h-[730px] sm:rounded-[32px] sm:border'
          }`}
        >
          {/* App Header */}
          <Header
            userGoals={userGoals}
            userProfile={userProfile}
            onOpenQuickAdd={() => setIsQuickLogOpen(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onSignOut={() => {
              setUserProfile({ ...userProfile, isLoggedIn: false });
              showToast('Signed out successfully');
            }}
            isExpandedView={isExpandedView}
            onToggleExpandedView={() => setIsExpandedView(!isExpandedView)}
          />

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 no-scrollbar">
            {activeTab === 'home' && (
              <HomeTab
                userGoals={userGoals}
                macros={macros}
                loggedMeals={loggedMeals}
                todaysWorkout={workoutsList[0]}
                steps={steps}
                weightKg={weightKg}
                onOpenWorkoutModal={(workout) => setSelectedWorkoutModal(workout)}
                onOpenMealLog={() => setIsMealLogOpen(true)}
                onLogWeight={handleLogWeight}
                onAddSteps={handleAddSteps}
              />
            )}

            {activeTab === 'eat' && (
              <EatTab
                userGoals={userGoals}
                macros={macros}
                loggedMeals={loggedMeals}
                onAddMeal={handleAddMeal}
              />
            )}

            {activeTab === 'training' && (
              <TrainingTab
                userEquipment={userGoals.selectedEquipment}
                onStartWorkout={(workout) => setSelectedWorkoutModal(workout)}
                sampleWorkouts={workoutsList}
              />
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Side Branding Section (Desktop view) */}
        {!isExpandedView && (
          <div className="ml-10 hidden lg:block max-w-xs select-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-red-600/90 text-white font-bitcount font-normal flex items-center justify-center text-xs">
                RC
              </div>
              <h2 className="text-red-400 text-xs font-mono uppercase tracking-widest font-light">
                RC TRAINER PLATFORM
              </h2>
            </div>

            <h3 className="text-white text-xl font-bitcount font-normal leading-tight tracking-wide">
              Adaptive AI Fitness & Biometrics
            </h3>

            <p className="text-zinc-400 mt-2.5 leading-relaxed text-xs font-light">
              Thin, minimal, crisp design tailored for <span className="text-zinc-200 font-normal">{userProfile.name}</span>. Start workout sessions, track soft pastel macros, and calculate meal plans with AI.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('training')}
                className="bg-red-600/90 hover:bg-red-500 text-white font-bitcount font-normal px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Build Routine</span>
              </button>

              <button
                onClick={() => setIsExpandedView(true)}
                className="border border-zinc-800 text-zinc-300 hover:text-white font-mono font-light px-3.5 py-2 rounded-xl text-xs hover:bg-zinc-800/80 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Maximize2 className="w-3 h-3 text-red-400" />
                <span>Expand View</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedWorkoutModal && (
        <WorkoutModal
          workout={selectedWorkoutModal}
          onClose={() => setSelectedWorkoutModal(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {isMealLogOpen && (
        <LogMealModal
          onClose={() => setIsMealLogOpen(false)}
          onAddMeal={handleAddMeal}
        />
      )}

      {isQuickLogOpen && (
        <QuickLogModal
          onClose={() => setIsQuickLogOpen(false)}
          onAddWater={() => showToast('Logged +250ml Water')}
          onAddSteps={(s) => handleAddSteps(s)}
          onOpenMealLog={() => setIsMealLogOpen(true)}
        />
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e0e11] rounded-2xl border border-zinc-800/80 p-5 space-y-4">
            <ProfileTab
              user={userGoals}
              onUpdateUser={(updated) => {
                setUserGoals(updated);
                setShowProfileModal(false);
                showToast('Profile Saved');
              }}
            />
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-bitcount font-normal text-xs py-2.5 rounded-xl hover:bg-zinc-800 cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  </ErrorBoundary>
  );
}
