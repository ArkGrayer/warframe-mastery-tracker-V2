import { create } from "zustand";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/domain/entities/UserProfile";

interface UserState {
  profile: UserProfile | null;
  firebaseUser: User | null;
  isAuthLoading: boolean;
  setFirebaseUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  toggleAcquired: (uniqueName: string) => void;
  toggleMastered: (uniqueName: string) => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  firebaseUser: null,
  isAuthLoading: false,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setProfile: (profile) => set({ profile }),
  toggleAcquired: (uniqueName) => {
    const { profile } = get();
    if (!profile) return;

    const isAcquired = profile.acquired.includes(uniqueName);
    const newAcquired = isAcquired
      ? profile.acquired.filter((id) => id !== uniqueName)
      : [...profile.acquired, uniqueName];

    // If removed from acquired, it must also be removed from mastered
    const newMastered = isAcquired
      ? profile.mastered.filter((id) => id !== uniqueName)
      : profile.mastered;

    set({ profile: { ...profile, acquired: newAcquired, mastered: newMastered } });
  },
  toggleMastered: (uniqueName) => {
    const { profile } = get();
    if (!profile) return;

    const isMastered = profile.mastered.includes(uniqueName);
    const newMastered = isMastered
      ? profile.mastered.filter((id) => id !== uniqueName)
      : [...profile.mastered, uniqueName];

    // If mastered, it must also be acquired
    let newAcquired = [...profile.acquired];
    if (!isMastered && !newAcquired.includes(uniqueName)) {
      newAcquired.push(uniqueName);
    }

    set({ profile: { ...profile, acquired: newAcquired, mastered: newMastered } });
  },
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
}));
