import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // অ্যানিমেশনের জন্য
import useSound from 'use-sound'; // সাউন্ডের জন্য
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { calculatePoints } from '../../utils/calculatePoints';
import { Timer, Zap, X, Trophy, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// সাব-কম্পোনেন্ট ইমপোর্ট
import ScrambleQuiz from '../../components/quiz/ScrambleQuiz';
import WriteQuiz from '../../components/quiz/WriteQuiz';

// সাউন্ড পাথমুহ (public/sounds/ ফোল্ডার থেকে সরাসরি)
const clickSnd = '/sounds/click.mp3';
const correctSnd = '/sounds/correct.mp3';
const wrongSnd = '/sounds/wrong.mp3';
const completeSnd = '/sounds/complete.mp3';

const QuizPage = () => {
  const { levelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // সাউন্ড হুকস
  const [playClick] = useSound(clickSnd);
  const [playCorrect] = useSound(correctSnd);
  const [playWrong] = useSound(wrongSnd);
  const [playComplete] = useSound(completeSnd);

  // স্টেটসমূহ
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' অথবা 'wrong'
  const [selectedId, setSelectedId] = useState(null);

  const timerRef = useRef(null);

  // ১. ফায়ারবেস থেকে ওই লেবেলের সব প্রশ্ন আনা
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, "questions"), where("levelId", "==", levelId));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // প্রশ্নের অর্ডার অনুযায়ী সাজানো
        setQuestions(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [levelId]);

  // ২. টাইমার কন্ট্রোল
  useEffect(() => {
    if (questions.length > 0 && !showResult && !isAnswered) {
      const currentQ = questions[currentIndex];
      setTimeLeft(currentQ.timeLimit || 30);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null, false); // সময় শেষ হলে অটোমেটিক ভুল উত্তর
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions, showResult, isAnswered]);

  // ৩. উত্তর চেক করার ফাংশন
  const handleAnswer = async (choiceId, isCorrect, usedHint = false) => {
    if (isAnswered) return; // একবার উত্তর দিলে আর কাজ করবে না
    
    setIsAnswered(true);
    setSelectedId(choiceId);
    clearInterval(timerRef.current);

    const currentQ = questions[currentIndex];
    
    if (isCorrect) {
      playCorrect(); // সঠিক উত্তরের সাউন্ড
      setFeedback('correct');
      const timeSpent = (currentQ.timeLimit || 30) - timeLeft;
      const earned = calculatePoints(currentQ.questionType, timeSpent, currentQ.timeLimit || 30, usedHint);
      setTotalScore(prev => prev + earned);
      setCorrectCount(prev => prev + 1);
    } else {
      playWrong(); // ভুল উত্তরের সাউন্ড
      setFeedback('wrong');
    }

    // ১.২ সেকেন্ড পর পরের প্রশ্ন অথবা রেজাল্ট
    setTimeout(() => {
      setFeedback(null);
      setIsAnswered(false);
      setSelectedId(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishQuiz();
      }
    }, 1200);
  };

  // ৪. কুইজ শেষ এবং ডাটাবেসে পয়েন্ট আপডেট
  const finishQuiz = async () => {
    playComplete(); // কুইজ শেষ হওয়ার সাউন্ড
    setShowResult(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        totalPoints: increment(totalScore),
        completedLevels: increment(1)
      });
    } catch (err) {
      console.error("Firebase Point Update Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
        <p className="text-gray-500 font-bold">কুইজ লোড হচ্ছে...</p>
      </div>
    );
  }

  // রেজাল্ট স্ক্রিন
  if (showResult) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-center text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white text-gray-800 p-10 rounded-[40px] shadow-2xl w-full max-w-sm"
        >
          <Trophy size={80} className="mx-auto text-amber-500 mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold mb-2">অভিনন্দন! 🎉</h2>
          <p className="text-gray-500 mb-6 uppercase tracking-widest text-xs font-bold">লেবেল সম্পন্ন</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-3xl">
              <p className="text-[10px] text-gray-400 font-bold">মোট পয়েন্ট</p>
              <p className="text-2xl font-black text-indigo-600">+{totalScore}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-3xl">
              <p className="text-[10px] text-gray-400 font-bold">সঠিক উত্তর</p>
              <p className="text-2xl font-black text-green-600">{correctCount}/{questions.length}</p>
            </div>
          </div>

          <button 
            onClick={() => { playClick(); navigate('/sets'); }} 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            হোমে ফিরুন <ChevronRight size={20}/>
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : 'bg-white'} p-5 max-w-md mx-auto flex flex-col overflow-hidden`}>
      
      {/* হেডার */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => { playClick(); navigate('/sets'); }} className="p-2 bg-gray-100 rounded-full text-gray-400">
          <X size={20} />
        </button>
        <div className={`flex items-center gap-2 font-black px-5 py-2 rounded-full border-2 transition-all 
          ${timeLeft <= 5 ? 'border-red-500 text-red-500 animate-pulse scale-110 shadow-lg' : 'border-amber-100 text-amber-500'}`}>
          <Timer size={18} /> {timeLeft}s
        </div>
        <div className="flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-full">
          <Zap size={16} fill="currentColor" /> {totalScore}
        </div>
      </div>

      {/* প্রগ্রেস বার */}
      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-8">
        <motion.div 
          className="bg-indigo-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>

      {/* কুইজ এরিয়া */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex-1"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-indigo-600 font-bold text-[10px] bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {currentQ?.questionType}
            </span>
            <span className="text-gray-400 text-xs font-bold tracking-tight">প্রশ্ন {currentIndex + 1}/{questions.length}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-10">
            {currentQ?.questionText}
          </h2>

          <div className="mt-4">
            {/* MCQ টাইপ প্রশ্ন */}
            {currentQ?.questionType === 'MCQ' && (
              <div className="grid grid-cols-1 gap-4">
                {currentQ.options.map((opt) => (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    key={opt.id}
                    disabled={isAnswered}
                    onClick={() => {
                      playClick();
                      handleAnswer(opt.id, opt.id === currentQ.correctAnswer);
                    }}
                    className={`w-full p-5 rounded-3xl border-2 text-left font-bold transition-all flex justify-between items-center
                      ${isAnswered && opt.id === currentQ.correctAnswer ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-100' : 
                        isAnswered && opt.id === selectedId ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-100' :
                        isAnswered ? 'border-gray-50 opacity-40' : 'border-gray-100 text-gray-700 hover:border-indigo-500 hover:bg-indigo-50'}`}
                  >
                    <span>{opt.text}</span>
                    {isAnswered && opt.id === currentQ.correctAnswer ? <CheckCircle2 size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-gray-100"></div>}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Scramble টাইপ প্রশ্ন */}
            {currentQ?.questionType === 'SCRAMBLE' && (
              <ScrambleQuiz 
                correctWord={currentQ.correctAnswer} 
                onAnswer={(isCorrect) => handleAnswer(null, isCorrect)} 
              />
            )}

            {/* Write টাইপ প্রশ্ন */}
            {currentQ?.questionType === 'WRITE' && (
              <WriteQuiz 
                correctAnswer={currentQ.correctAnswer} 
                hint={currentQ.hint}
                onAnswer={(isCorrect, usedHint) => handleAnswer(null, isCorrect, usedHint)} 
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ফিডব্যাক নোটিফিকেশন */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-4 rounded-full font-black shadow-2xl text-white z-50
              ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {feedback === 'correct' ? <CheckCircle2 size={24}/> : <AlertCircle size={24}/>}
            {feedback === 'correct' ? 'অসাধারণ!' : 'ভুল উত্তর!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;