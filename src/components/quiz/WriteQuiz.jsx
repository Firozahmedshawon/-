import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

const WriteQuiz = ({ correctAnswer, hint, onAnswer }) => {
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // সঠিক উত্তরের সাথে মিলিয়ে দেখা (Case insensitive)
    const isCorrect = input.trim().toLowerCase() === correctAnswer.toLowerCase();
    onAnswer(isCorrect, showHint); // showHint পাঠানো হচ্ছে যাতে পেনাল্টি হিসেব করা যায়
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative">
        <input
          type="text"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="এখানে লিখুন..."
          className="w-full p-5 text-xl font-bold border-2 border-gray-100 rounded-3xl focus:border-indigo-500 outline-none transition-all text-center"
        />
      </div>

      {/* হিন্ট সেকশন */}
      {hint && (
        <div className="text-center">
          {!showHint ? (
            <button 
              onClick={() => setShowHint(true)}
              className="text-amber-500 text-sm font-bold flex items-center justify-center gap-1 mx-auto"
            >
              <Lightbulb size={16} /> হিন্ট দেখুন (-৫ পয়েন্ট)
            </button>
          ) : (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl text-sm italic border border-amber-100 animate-bounce">
              💡 {hint}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-indigo-700 transition-all active:scale-95 mt-4"
      >
        জমা দিন
      </button>
    </div>
  );
};

export default WriteQuiz;
