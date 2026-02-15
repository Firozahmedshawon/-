import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import McqView from '../components/quiz/McqView';
import ScrambleView from '../components/quiz/ScrambleView';
import WriteView from '../components/quiz/WriteView';
import QuizResult from '../components/quiz/QuizResult';
import QuizHeader from '../components/quiz/QuizHeader';

const QuizProvider = () => {
  const { setId, levelId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load 30 questions (10 MCQ, 10 Scramble, 10 Write)
  useEffect(() => {
    // In production, fetch from Firestore where setId and levelId match
    const mockQuestions = [
      ...Array(10).fill({ type: 'mcq', question: 'What is 5+5?', options: ['8','10','12','14'], correct: '10', points: 10 }),
      ...Array(10).fill({ type: 'scramble', question: 'Unscramble fruit:', correct: 'APPLE', hint: 'Red or Green', points: 10 }),
      ...Array(10).fill({ type: 'write', question: 'Capital of France?', correct: 'Paris', points: 10 })
    ];
    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const handleAnswer = (isCorrect, pointsEarned) => {
    if (isCorrect) {
      setScore(prev => prev + pointsEarned);
      setCorrectAnswers(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) return <div>Loading Quiz...</div>;
  if (isFinished) return <QuizResult score={score} total={questions.length} correct={correctAnswers} />;

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <QuizHeader 
        current={currentIndex + 1} 
        total={questions.length} 
        score={score} 
      />

      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl"
          >
            {currentQ.type === 'mcq' && <McqView data={currentQ} onNext={handleAnswer} />}
            {currentQ.type === 'scramble' && <ScrambleView data={currentQ} onNext={handleAnswer} />}
            {currentQ.type === 'write' && <WriteView data={currentQ} onNext={handleAnswer} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default QuizProvider;
