import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const ManageQuestions = () => {
  const [qType, setQType] = useState('MCQ');
  const [question, setQuestion] = useState('');
  const [ans, setAns] = useState('');
  const [levelId, setLevelId] = useState(''); // এখানে লেবেল আইডি বসবে

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "questions"), {
        questionText: question,
        questionType: qType,
        correctAnswer: ans,
        levelId: levelId,
        options: qType === 'MCQ' ? [
          {id: 'A', text: 'অপশন ১'}, // এখানে ডাইনামিক ইনপুট নিতে হবে
          {id: 'B', text: 'অপশন ২'},
          {id: 'C', text: 'অপশন ৩'},
          {id: 'D', text: 'অপশন ৪'}
        ] : null,
        points: 10,
        timeLimit: 30,
        createdAt: serverTimestamp()
      });
      alert("প্রশ্ন যোগ হয়েছে!");
      setQuestion(''); setAns('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-8">নতুন প্রশ্ন যোগ করুন</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">প্রশ্নের ধরণ</label>
          <select value={qType} onChange={(e) => setQType(e.target.value)} className="w-full border p-3 rounded-xl outline-none">
            <option value="MCQ">MCQ (বহুনির্বাচনী)</option>
            <option value="SCRAMBLE">SCRAMBLE (বর্ণ সাজানো)</option>
            <option value="WRITE">WRITE (লিখে উত্তর)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">প্রশ্নের শিরোনাম</label>
          <textarea className="w-full border p-3 rounded-xl outline-none" rows="3" 
            placeholder="প্রশ্নটি লিখুন..." value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">সঠিক উত্তর</label>
          <input type="text" className="w-full border p-3 rounded-xl outline-none" 
            placeholder="সঠিক উত্তরটি লিখুন" value={ans} onChange={(e) => setAns(e.target.value)} required />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg">
          ফায়ারবেসে সেভ করুন
        </button>
      </form>
    </div>
  );
};

export default ManageQuestions;