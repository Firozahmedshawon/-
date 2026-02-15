import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ১. অথেন্টিকেশন স্টেট পরিবর্তন মনিটর করা
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ২. ফায়ারস্টোর থেকে ইউজারের ডাটা আনা
        const userRef = doc(db, "users", currentUser.uid);
        
        // রিয়েল-টাইম লিসেনার (যাতে এডমিন ব্লক করার সাথে সাথেই ইউজার লগআউট হয়ে যায়)
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();

            // 🚫 ব্লক চেক লজিক
            if (userData.isBlocked) {
              // ইউজার ব্লকড থাকলে তাকে সাইন আউট করে দেওয়া
              signOut(auth).then(() => {
                setUser(null);
                alert("আপনার একাউন্টটি ব্লক করা হয়েছে। দয়া করে এডমিনের সাথে যোগাযোগ করুন। 01881052292");
              });
            } else {
              // ইউজার ব্লকড না থাকলে স্টেট আপডেট করা
              setUser({ ...currentUser, ...userData });
            }
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);