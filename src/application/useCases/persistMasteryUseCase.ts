import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { useUserStore } from "../stores/userStore";

export const persistMasteryUseCase = async () => {
  const { profile } = useUserStore.getState();
  if (!profile) return;

  const firestoreService = new FirestoreService();

  try {
    await firestoreService.updateMasteryData(
      profile.uid,
      profile.acquired,
      profile.mastered
    );
  } catch (error) {
    console.error("Error persisting mastery data:", error);
  }
};
