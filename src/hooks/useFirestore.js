import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useFirestore = (collectionName, orderField = 'createdAt') => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy(orderField, 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDocs(results);
    });

    return () => unsubscribe();
  }, [collectionName, orderField]);

  return { docs };
};