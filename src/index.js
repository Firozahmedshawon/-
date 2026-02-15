import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// স্টাইল ফাইল ইমপোর্ট
import './index.css';
import './styles/tailwind.css';

// কনটেক্সট প্রোভাইডার ইমপোর্ট (যাতে পুরো অ্যাপে ডাটা অ্যাক্সেস করা যায়)
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';

// রুট এলিমেন্ট তৈরি করা
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* AuthProvider: ইউজারের লগইন স্টেট ম্যানেজ করবে */}
    <AuthProvider>
      {/* QuizProvider: কুইজ গেমের প্রগ্রেস এবং স্কোর ম্যানেজ করবে */}
      <QuizProvider>
        {/* মূল অ্যাপ কম্পোনেন্ট */}
        <App />
      </QuizProvider>
    </AuthProvider>
  </React.StrictMode>
);

/**
 * নোট: 
 * ১. এখানে StrictMode ব্যবহার করা হয়েছে যা ডেভেলপমেন্টের সময় কোডের ভুল ধরতে সাহায্য করে।
 * ২. AuthProvider সবার উপরে রাখা হয়েছে কারণ কুইজ ডাটা বা অন্য সব কিছু ইউজারের লগইন স্ট্যাটাসের ওপর নির্ভর করে।
 */