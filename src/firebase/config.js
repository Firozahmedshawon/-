import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBoPDBoOUFXTTHZQclCaynxGC280Cn_mTA",
  authDomain: "nodigyanapp.firebaseapp.com",
  projectId: "nodigyanapp",
  storageBucket: "nodigyanapp.firebasestorage.app",
  messagingSenderId: "160299924136",
  appId: "1:160299924136:web:b39869c6da9bd07d04a09d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();