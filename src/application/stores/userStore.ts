import { create } from "zustand";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/domain/entities/UserProfile";

interface UserState {
  profile: UserProfile | null;
  firebaseUser: User | null;
  isAuthLoading: boolean;
  setFirebaseUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setAuthLoading: (loading: boolean) => void;
  toggleAcquired: (uniqueName: string) => void;
  toggleMastered: (uniqueName: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  firebaseUser: null,
  isAuthLoading: true,

  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setProfile: (profile) => set({ profile }),
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),

  toggleAcquired: (uniqueName) =>
    set((state) => {
      if (!state.profile) return state;

      const isAcquired = state.profile.acquired.includes(uniqueName);
      let newAcquired = isAcquired
        ? state.profile.acquired.filter((id) => id !== uniqueName)
        : [...state.profile.acquired, uniqueName];

      // If removed from acquired, must be removed from mastered too
      let newMastered = state.profile.mastered;
      if (isAcquired) {
        newMastered = state.profile.mastered.filter((id) => id !== uniqueName);
      }

      return {
        profile: {
          ...state.profile,
          acquired: newAcquired,
          mastered: newMastered,
        },
      };
    }),

  toggleMastered: (uniqueName) =>
    set((state) => {
      if (!state.profile) return state;

      const isMastered = state.profile.mastered.includes(uniqueName);
      let newMastered = isMastered
        ? state.profile.mastered.filter((id) => id !== uniqueName)
        : [...state.profile.mastered, uniqueName];

      // If added to mastered, must be added to acquired too
      let newAcquired = state.profile.acquired;
      if (!isMastered && !state.profile.acquired.includes(uniqueName)) {
        newAcquired = [...state.profile.acquired, uniqueName];
      }

      return {
        profile: {
          ...state.profile,
          acquired: newAcquired,
          mastered: newMastered,
        },
      };
    }),
}));
