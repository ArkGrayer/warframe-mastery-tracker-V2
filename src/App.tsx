import { useEffect } from "react";
import { onAuthStateChange } from "@/infrastructure/firebase/authService";
import { useUserStore } from "@/application/stores/userStore";
import { fetchItemsUseCase } from "@/application/useCases/fetchItemsUseCase";
import { syncUserProfileUseCase } from "@/application/useCases/syncUserProfileUseCase";
import AuthPage from "@/presentation/pages/AuthPage";
import Header from "@/presentation/components/layout/Header";
import Footer from "@/presentation/components/layout/Footer";
import ItemGrid from "@/presentation/components/items/ItemGrid";
import ProfileSetupModal from "@/presentation/components/profile/ProfileSetupModal";
import ScrollToTop from "@/presentation/components/layout/ScrollToTop";
import { LucideLoader2 } from "lucide-react";

function App() {
  const { firebaseUser, setFirebaseUser, isAuthLoading, setAuthLoading, profile } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setFirebaseUser(user);

      try {
        if (user) {
          await Promise.all([
            fetchItemsUseCase(),
            syncUserProfileUseCase(user.uid)
          ]);
        }
      } catch (error) {
        console.error("Erro durante a inicialização:", error);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setAuthLoading]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#08060e] font-nunito gap-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4cc9ff]/5 blur-[120px] rounded-full animate-pulse" />
        
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <LucideLoader2 className="w-16 h-16 text-[#4cc9ff] animate-spin" />
            <div className="absolute inset-0 bg-[#4cc9ff]/20 blur-xl rounded-full animate-pulse" />
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-[#f0e6d3] font-black uppercase tracking-[0.4em] text-sm animate-pulse">
              Conectando ao Santuário
            </p>
            <div className="h-1 w-32 bg-[#1e1a2e] rounded-full overflow-hidden">
              <div className="h-full bg-[#c8a96e] animate-progress-loading" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#08060e] text-[#f0e6d3] font-nunito flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ItemGrid />
        </div>
      </main>

      <Footer />

      <ScrollToTop />

      {profile?.nickname === "Tenno" && (
        <ProfileSetupModal />
      )}
    </div>
  );
}

export default App;
