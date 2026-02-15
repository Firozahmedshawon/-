import React from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Star, Home, RotateCcw, ArrowRight } from 'lucide-react';

const QuizResult = ({ score, total, correct }) => {
  const navigate = useNavigate();
  const percentage = (correct / total) * 100;
  
  let stars = 0;
  if (percentage >= 90) stars = 3;
  else if (percentage >= 70) stars = 2;
  else if (percentage >= 50) stars = 1;

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-white">
      {stars === 3 && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="bg-white text-gray-800 p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-black mb-2">LEVEL COMPLETE!</h1>
        <p className="text-gray-500 mb-8 font-medium">You've mastered these questions.</p>

        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3].map(s => (
            <Star key={s} size={48} className={`${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Score</p>
            <p className="text-2xl font-black text-primary">{score}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Accuracy</p>
            <p className="text-2xl font-black text-primary">{Math.round(percentage)}%</p>
          </div>
        </div>

        <div className="space-y-4">
          {percentage >= 50 ? (
            <button onClick={() => navigate(-1)} className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg">
              <span>Next Level</span> <ArrowRight size={20} />
            </button>
          ) : (
            <p className="text-error font-bold mb-4 italic text-sm">You need 50% to pass this level!</p>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => window.location.reload()} className="py-4 bg-gray-100 rounded-2xl font-bold flex items-center justify-center space-x-2">
              <RotateCcw size={18} /> <span>Replay</span>
            </button>
            <button onClick={() => navigate('/')} className="py-4 bg-gray-100 rounded-2xl font-bold flex items-center justify-center space-x-2">
              <Home size={18} /> <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
