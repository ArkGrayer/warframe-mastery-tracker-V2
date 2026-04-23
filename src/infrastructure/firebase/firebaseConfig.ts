import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVNQbTtV3C6ozcJovLwKMFxu8seGd_DYc",
  authDomain: "warframe-tracker-8426a.firebaseapp.com",
  projectId: "warframe-tracker-8426a",
  storageBucket: "warframe-tracker-8426a.firebasestorage.app",
  messagingSenderId: "755306154710",
  appId: "1:755306154710:web:7ce7e9b1088e26dd3fd777",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
