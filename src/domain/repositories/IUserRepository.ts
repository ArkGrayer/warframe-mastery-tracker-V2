import type { UserProfile } from "../entities/UserProfile";

export interface IUserRepository {
  getUserProfile(uid: string): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<void>;
  updateMasteryData(uid: string, acquired: string[], mastered: string[]): Promise<void>;
}
