import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Play, RotateCcw, Star } from 'lucide-react';

const LevelCard = ({ levelNumber, stats, isUnlocked, onPlay }) => {
  const { stars = 0, score = 0, completed = false } = stats || {};

  // Helper to render stars
  const renderStars = () => {
    return (
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            size={16}
            className={`${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
      className={`relative h-40 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
        isUnlocked 
          ? 'bg-white shadow-md border-2 border-gray-50' 
          : 'bg-gray-100 opacity-70 cursor-not-allowed'
      }`}
    >
      <span className="absolute top-2 left-3 text-xs font-bold text-gray-400">
        LVL {levelNumber}
      </span>

      {isUnlocked ? (
        <>
          {renderStars()}
          <h4 className="text-lg font-bold text-gray-800 mb-3">
            {completed ? `${score} pts` : 'Ready'}
          </h4>
          
          <button
            onClick={() => onPlay(levelNumber)}
            className={`p-3 rounded-full shadow-lg transition-transform ${
              completed ? 'bg-white text-primary border border-primary' : 'bg-primary text-white'
            }`}
          >
            {completed ? <RotateCcw size={20} /> : <Play size={20} fill="currentColor" />}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <Lock size={20} className="text-gray-400" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase">Locked</span>
        </div>
      )}
    </motion.div>
  );
};

export default LevelCard;
