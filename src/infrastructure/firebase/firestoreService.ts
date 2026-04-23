import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserProfile } from "../../domain/entities/UserProfile";

export class FirestoreService implements IUserRepository {
  private readonly collectionName = "users";

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, this.collectionName, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    return null;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const userDocRef = doc(db, this.collectionName, profile.uid);
    await setDoc(userDocRef, profile, { merge: true });
  }

  async updateMasteryData(uid: string, acquired: string[], mastered: string[]): Promise<void> {
    const userDocRef = doc(db, this.collectionName, uid);
    await updateDoc(userDocRef, {
      acquired,
      mastered
    });
  }
}
