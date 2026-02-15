import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Trophy, Play, Share2, Settings, LogOut } from 'lucide-react';
import { auth } from '../../config/firebase';

const Home = () => {
  const { user } = useAuth(); // AuthContext থেকে ইউজারের রিয়েল ডাটা
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">কুইজ মাস্টার 🎮</h1>
        <button onClick={() => auth.signOut()} className="p-2 bg-white rounded-full shadow-sm text-red-500">
          <LogOut size={20} />
        </button>
      </div>

      {/* প্রোফাইল কার্ড - ডাইনামিক ডাটা */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.displayName || 'ইউজার'}</h2>
            <p className="text-indigo-100 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xs text-indigo-100">মোট পয়েন্ট</p>
            <p className="text-xl font-bold">{user?.totalPoints || 0}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xs text-indigo-100">লেবেল পার</p>
            <p className="text-xl font-bold">{user?.completedLevels || 0}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/sets')}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-lg mb-8 flex items-center justify-center gap-3 text-xl"
      >
        <Play fill="white" /> গেমস খেলুন
      </button>

      {/* পরিসংখ্যান */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" /> আমার অগ্রগতি
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>সফলতার হার</span>
            <span className="font-bold">৮৫%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[85%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;