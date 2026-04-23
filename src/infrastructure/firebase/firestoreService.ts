import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserProfile } from "../../domain/entities/UserProfile";

export class FirestoreService implements IUserRepository {
  private readonly collectionName = "users";

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.collectionName, uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile from Firestore:", error);
      return null;
    }
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, profile.uid);
      await setDoc(userRef, profile, { merge: true });
    } catch (error) {
      console.error("Error saving user profile to Firestore:", error);
      throw error;
    }
  }

  async updateMasteryData(uid: string, acquired: string[], mastered: string[]): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, uid);
      await updateDoc(userRef, {
        acquired,
        mastered
      });
    } catch (error) {
      console.error("Error updating mastery data in Firestore:", error);
      throw error;
    }
  }
}
