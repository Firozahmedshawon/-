import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Award } from 'lucide-react';
import LevelCard from '../components/LevelCard';
import { useAuth } from '../context/AuthContext';

const Levels = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get progress for this specific set
  const setProgress = user?.progress?.[`set${setId}`] || { levels: {} };
  const levelsData = Object.values(setProgress.levels);

  // Unlock Logic: Level 1 is always unlocked. 
  // Level N is unlocked if Level N-1 exists and is completed.
  const isLevelUnlocked = (num) => {
    if (num === 1) return true;
    const prevLevel = setProgress.levels[`level${num - 1}`];
    return prevLevel?.completed === true;
  };

  // Calculate stats for header
  const completedCount = levelsData.filter(l => l.completed).length;
  const totalStars = levelsData.reduce((acc, curr) => acc + (curr.stars || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/sets')} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold heading-font">Set {setId}</h2>
              <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                {completedCount}/20 Levels Completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-yellow-700">{totalStars}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        {/* Level Grid - 4x5 Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {Array.from({ length: 20 }, (_, i) => {
            const levelNum = i + 1;
            return (
              <LevelCard
                key={levelNum}
                levelNumber={levelNum}
                isUnlocked={isLevelUnlocked(levelNum)}
                stats={setProgress.levels[`level${levelNum}`]}
                onPlay={(lvl) => navigate(`/sets/${setId}/levels/${lvl}/quiz`)}
              />
            );
          })}
        </motion.div>

        {/* Legend / Info */}
        <div className="mt-12 p-6 bg-white rounded-3xl border border-dashed border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-primary">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Mastery Bonus</p>
              <p className="text-xs text-gray-500">Earn 3 stars on all levels to unlock special achievements!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Levels;
