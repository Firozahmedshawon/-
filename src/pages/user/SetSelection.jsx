import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SetSelection = () => {
  const [sets, setSets] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      const q = query(collection(db, "sets"), orderBy("setOrder", "asc"));
      const querySnapshot = await getDocs(q);
      const setsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSets(setsData);
    };
    fetchSets();
  }, []);

  // আনলক লজিক: প্রথম সেট ডিফল্ট আনলক, পরের গুলো আগের সেটের প্রগ্রেস অনুযায়ী
  const isUnlocked = (set, index) => {
    if (index === 0) return true;
    // এখানে আপনার প্রম্পট অনুযায়ী আগের সেটের ৭৫% কমপ্লিট লজিক চেক করতে হবে
    return user?.unlockedSets?.includes(set.id); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">সেট নির্বাচন করুন</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sets.map((set, index) => {
          const unlocked = isUnlocked(set, index);
          return (
            <button
              key={set.id}
              disabled={!unlocked}
              onClick={() => navigate(`/levels/${set.id}`)}
              className={`relative flex flex-col items-center p-4 rounded-3xl h-36 justify-between shadow-sm
                ${unlocked ? 'bg-white text-indigo-600' : 'bg-gray-200 text-gray-400 opacity-70'}`}
            >
              <div className="absolute top-2 right-2">
                {unlocked ? <Unlock size={14} /> : <Lock size={14} />}
              </div>
              <span className="font-bold text-sm mt-4">{set.setName}</span>
              <div className="text-[10px] text-gray-500">{set.totalLevels} লেবেল</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SetSelection;