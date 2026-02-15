import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ArrowLeft, Star, Lock } from 'lucide-react';

const LevelSelection = () => {
  const { setId } = useParams();
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      const q = query(
        collection(db, "levels"), 
        where("setId", "==", setId),
        orderBy("levelOrder", "asc")
      );
      const querySnapshot = await getDocs(q);
      setLevels(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchLevels();
  }, [setId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/sets')} className="p-2"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">লেবেল নির্বাচন করুন</h1>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {levels.map((level, index) => (
          <button
            key={level.id}
            onClick={() => navigate(`/quiz/${level.id}`)}
            className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center gap-1 border-b-4 border-indigo-100"
          >
            <span className="text-[10px] font-bold text-gray-400">L-{level.levelOrder}</span>
            <Star size={20} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-bold">0%</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;