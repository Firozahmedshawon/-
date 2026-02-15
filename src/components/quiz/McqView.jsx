import React, { useState } from 'react';

const McqView = ({ data, onNext }) => {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (!selected) return;
    const isCorrect = selected === data.correct;
    onNext(isCorrect, data.points);
    setSelected(null);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">{data.question}</h2>
      <div className="space-y-4">
        {data.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(opt)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all font-semibold ${
              selected === opt ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button 
        disabled={!selected}
        onClick={handleSubmit}
        className="w-full mt-8 py-4 bg-main-gradient text-white rounded-xl font-bold disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default McqView;
