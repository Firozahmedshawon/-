import React, { useState } from 'react';

const WriteView = ({ data, onNext }) => {
  const [input, setInput] = useState('');

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-8">{data.question}</h2>
      <input
        type="text"
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-4 text-xl border-b-4 border-gray-100 focus:border-primary outline-none transition-colors mb-12"
      />
      <button 
        onClick={() => onNext(input.toLowerCase().trim() === data.correct.toLowerCase(), data.points)}
        className="w-full py-4 bg-main-gradient text-white rounded-xl font-bold"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default WriteView;
