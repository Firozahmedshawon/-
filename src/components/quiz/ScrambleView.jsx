import React, { useState, useEffect } from 'react';

const ScrambleView = ({ data, onNext }) => {
  const [scrambled, setScrambled] = useState([]);
  const [answer, setAnswer] = useState([]);

  useEffect(() => {
    // Scramble the word on mount
    const chars = data.correct.split('').sort(() => Math.random() - 0.5);
    setScrambled(chars);
    setAnswer([]);
  }, [data]);

  const addLetter = (char, index) => {
    setAnswer([...answer, char]);
    setScrambled(scrambled.filter((_, i) => i !== index));
  };

  const removeLetter = (char, index) => {
    setScrambled([...scrambled, char]);
    setAnswer(answer.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
      <h2 className="text-xl font-bold text-gray-500 mb-2">{data.question}</h2>
      <p className="text-sm italic text-gray-400 mb-8">Hint: {data.hint}</p>

      {/* Answer Slots */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 min-h-[60px]">
        {answer.map((char, i) => (
          <button key={i} onClick={() => removeLetter(char, i)} className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xl">
            {char}
          </button>
        ))}
        {Array(data.correct.length - answer.length).fill(0).map((_, i) => (
          <div key={i} className="w-12 h-12 border-2 border-dashed border-gray-200 rounded-lg" />
        ))}
      </div>

      {/* Scrambled Pool */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {scrambled.map((char, i) => (
          <button key={i} onClick={() => addLetter(char, i)} className="w-12 h-12 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center font-bold text-xl hover:bg-gray-200">
            {char}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onNext(answer.join('') === data.correct, data.points)}
        className="w-full py-4 bg-main-gradient text-white rounded-xl font-bold"
      >
        Check Word
      </button>
    </div>
  );
};

export default ScrambleView;
