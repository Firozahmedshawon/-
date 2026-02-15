import { db } from '../config/firebase';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';

export const updateUserPoints = async (userId, points) => {
  const userRef = doc(db, 'users', userId);
  return await updateDoc(userRef, {
    totalPoints: increment(points)
  });
};

export const createUserData = async (userId, data) => {
  return await setDoc(doc(db, 'users', userId), data);
};