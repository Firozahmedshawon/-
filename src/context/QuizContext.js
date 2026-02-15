import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState({
    setId: null,
    levelId: null,
    questions: [],
    score: 0,
    startTime: null
  });

  const resetQuiz = () => {
    setCurrentQuiz({ setId: null, levelId: null, questions: [], score: 0, startTime: null });
  };

  return (
    <QuizContext.Provider value={{ currentQuiz, setCurrentQuiz, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);