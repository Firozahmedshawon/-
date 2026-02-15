import React, { useState, useEffect } from 'react';

const ScrambleQuiz = ({ correctWord, onAnswer }) => {
  const [shuffled, setShuffled] = useState([]);
  const [userGuess, setUserGuess] = useState([]);

  useEffect(() => {
    // শব্দটিকে বর্ণে ভাগ করে এলোমেলো (Shuffle) করা
    const letters = correctWord.split('').sort(() => Math.random() - 0.5);
    setShuffled(letters);
    setUserGuess([]);
  }, [correctWord]);

  const handleLetterClick = (letter, index) => {
    setUserGuess([...userGuess, letter]);
    setShuffled(shuffled.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setShuffled(correctWord.split('').sort(() => Math.random() - 0.5));
    setUserGuess([]);
  };

  const checkAnswer = () => {
    const isCorrect = userGuess.join('') === correctWord;
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* উত্তর দেয়ার জায়গা */}
      <div className="flex flex-wrap justify-center gap-2 min-h-[60px] p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        {userGuess.map((letter, i) => (
          <div key={i} className="w-10 h-12 flex items-center justify-center bg-indigo-600 text-white text-xl font-bold rounded-xl shadow-md transform transition-all">
            {letter}
          </div>
        ))}
      </div>

      {/* এলোমেলো বর্ণগুলো */}
      <div className="flex flex-wrap justify-center gap-3">
        {shuffled.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetterClick(letter, i)}
            className="w-12 h-14 flex items-center justify-center bg-white border-2 border-indigo-100 text-indigo-700 text-xl font-bold rounded-2xl shadow-sm hover:bg-indigo-50 active:scale-90 transition-all"
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mt-10">
        <button onClick={handleReset} className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl">রিসেট</button>
        <button 
          onClick={checkAnswer} 
          disabled={userGuess.length !== correctWord.length}
          className={`flex-1 py-4 font-bold rounded-2xl shadow-lg ${userGuess.length === correctWord.length ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'}`}
        >
          চেক করুন
        </button>
      </div>
    </div>
  );
};

export default ScrambleQuiz;
