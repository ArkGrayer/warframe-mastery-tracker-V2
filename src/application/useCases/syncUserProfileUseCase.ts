import { FirestoreService } from "@/infrastructure/firebase/firestoreService";
import { useUserStore } from "@/application/stores/userStore";

export const syncUserProfileUseCase = async (uid: string) => {
  const userStore = useUserStore.getState();
  const firestoreService = new FirestoreService();

  userStore.setAuthLoading(true);

  try {
    let profile = await firestoreService.getUserProfile(uid);

    if (!profile) {
      profile = {
        uid,
        nickname: "Tenno",
        glyph: "",
        acquired: [],
        mastered: [],
      };
      await firestoreService.saveUserProfile(profile);
    }

    userStore.setProfile(profile);
  } catch (error) {
    console.error("Error syncing user profile:", error);
  } finally {
    userStore.setAuthLoading(false);
  }
};
