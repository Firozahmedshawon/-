import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2 } from 'lucide-react';

const SetCard = ({ set, progress, isUnlocked, onPlay }) => {
  // Calculate completion percentage
  const completedLevels = progress?.levels 
    ? Object.values(progress.levels).filter(l => l.completed).length 
    : 0;
  const percentage = (completedLevels / 20) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isUnlocked ? { y: -10 } : {}}
      className={`relative overflow-hidden rounded-3xl p-6 h-64 flex flex-col justify-between transition-all duration-300 ${
        isUnlocked 
        ? 'bg-white shadow-xl border-b-4 border-primary' 
        : 'bg-gray-100 border-gray-200 grayscale'
      }`}
    >
      {/* Background Icon/Number Watermark */}
      <span className="absolute right-4 top-2 text-7xl font-black text-gray-200 opacity-50 pointer-events-none">
        {set.setNumber}
      </span>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-xl font-bold heading-font ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
            Set {set.setNumber}
          </h3>
          {!isUnlocked && <Lock className="text-gray-400" size={20} />}
          {percentage === 100 && <CheckCircle2 className="text-success" size={20} />}
        </div>
        <p className="text-sm text-gray-500 font-medium">{set.title || 'Knowledge Quest'}</p>
      </div>

      <div className="relative z-10 space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span className={isUnlocked ? 'text-primary' : 'text-gray-400'}>
              {completedLevels}/20 Levels
            </span>
            <span className="text-gray-400">{Math.round(percentage)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className={`h-full ${percentage === 100 ? 'bg-success' : 'bg-primary'}`}
            />
          </div>
        </div>

        {isUnlocked ? (
          <button
            onClick={() => onPlay(set.setNumber)}
            className="w-full py-3 bg-main-gradient text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-indigo-200"
          >
            <Play size={18} fill="currentColor" />
            <span>Play Now</span>
          </button>
        ) : (
          <div className="text-center py-3 text-xs font-bold text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
            Complete Set {set.setNumber - 1} to unlock
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SetCard;
