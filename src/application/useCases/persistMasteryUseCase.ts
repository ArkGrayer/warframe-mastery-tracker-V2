import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { useUserStore } from "@/application/stores/userStore";

export const persistMasteryUseCase = async () => {
  const { profile } = useUserStore.getState();
  
  if (!profile || !profile.uid) {
    console.warn("No active profile found to persist mastery.");
    return;
  }

  const firestoreService = new FirestoreService();

  try {
    await firestoreService.updateMasteryData(
      profile.uid,
      profile.acquired,
      profile.mastered
    );
    console.log(`[Firestore] Mastery successfully synced for ${profile.uid}`);
  } catch (error) {
    console.error("Failed to persist mastery data:", error);
  }
};
