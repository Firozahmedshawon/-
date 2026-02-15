import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase কনফিগারেশন অবজেক্ট
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);

// প্রয়োজনীয় সার্ভিসগুলো এক্সপোর্ট করা
export const auth = getAuth(app);           // অথেন্টিকেশন (Login/Signup)
export const db = getFirestore(app);         // ডাটাবেস (Firestore)
export const storage = getStorage(app);     // মিডিয়া স্টোরেজ (Images)

export default app;