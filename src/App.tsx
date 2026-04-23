import { useEffect } from "react";
import { onAuthStateChange } from "@/infrastructure/firebase/authService";
import { useUserStore } from "@/application/stores/userStore";
import { fetchItemsUseCase } from "@/application/useCases/fetchItemsUseCase";
import { syncUserProfileUseCase } from "@/application/useCases/syncUserProfileUseCase";
import AuthPage from "@/presentation/pages/AuthPage";
import Header from "@/presentation/components/layout/Header";
import TabBar from "@/presentation/components/layout/TabBar";
import ItemGrid from "@/presentation/components/items/ItemGrid";
import ProfileSetupModal from "@/presentation/components/profile/ProfileSetupModal";
import { LucideLoader2 } from "lucide-react";

function App() {
  const { firebaseUser, setFirebaseUser, isAuthLoading, profile } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setFirebaseUser(user);

      if (user) {
        // Parallel execution of initial data loading
        Promise.all([
          syncUserProfileUseCase(user.uid),
          fetchItemsUseCase()
        ]);
      }
    });

    return () => unsubscribe();
  }, [setFirebaseUser]);

  // 1. Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 font-nunito gap-4">
        <LucideLoader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          Conectando ao Santuário...
        </p>
      </div>
    );
  }

  // 2. Auth State
  if (!firebaseUser) {
    return <AuthPage />;
  }

  // 3. Main App Layout
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-nunito pb-20">
      <Header />
      
      <main className="pt-24">
        <TabBar />
        <div className="max-w-7xl mx-auto">
          <ItemGrid />
        </div>
      </main>

      {/* Show Profile Setup if it's a new user */}
      {profile?.nickname === "Tenno" && (
        <ProfileSetupModal />
      )}
    </div>
  );
}

export default App;
