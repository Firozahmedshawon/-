import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trophy } from 'lucide-react';
import SetCard from '../components/SetCard';
import { useAuth } from '../context/AuthContext';

const Sets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 9 Sets Placeholder
  const setsData = Array.from({ length: 9 }, (_, i) => ({
    setNumber: i + 1,
    title: i === 0 ? "Beginner's Journey" : i === 1 ? "History Masters" : "Advanced Logic",
  }));

  // Unlock Logic Function
  const checkIsUnlocked = (setNum) => {
    if (setNum === 1) return true; // Set 1 is always open
    
    const previousSetKey = `set${setNum - 1}`;
    const previousSetProgress = user?.progress?.[previousSetKey];
    
    if (!previousSetProgress) return false;

    const completedInPrevious = previousSetProgress.levels 
      ? Object.values(previousSetProgress.levels).filter(l => l.completed).length 
      : 0;

    return completedInPrevious === 20; // Must be 100% complete
  };

  // Calculate Overall Progress
  const totalLevelsCompleted = user?.levelsPassed || 0;
  const overallPercentage = (totalLevelsCompleted / 180) * 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-bold heading-font">Choose Your Set</h2>
          <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            <Trophy size={16} className="text-yellow-600" />
            <span className="text-sm font-bold text-yellow-700">{user?.totalPoints || 0}</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {/* Overall Progress Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-10 border border-gray-100">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Overall Completion</p>
              <h3 className="text-2xl font-black text-primary">{Math.round(overallPercentage)}%</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium">{totalLevelsCompleted} of 180 levels</p>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallPercentage}%` }}
              className="h-full bg-main-gradient"
            />
          </div>
        </div>

        {/* 3x3 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {setsData.map((set, index) => (
            <SetCard 
              key={set.setNumber}
              set={set}
              isUnlocked={checkIsUnlocked(set.setNumber)}
              progress={user?.progress?.[`set${set.setNumber}`]}
              onPlay={(num) => navigate(`/sets/${num}/levels`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Sets;

