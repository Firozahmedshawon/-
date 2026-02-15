import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, ArrowLeft, Crown, User as UserIcon } from 'lucide-react';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // টপ ২০ ইউজারকে পয়েন্ট অনুযায়ী সাজিয়ে আনা
        const q = query(
          collection(db, "users"),
          orderBy("totalPoints", "desc"),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          rank: index + 1,
          ...doc.data()
        }));
        setTopUsers(leaderboardData);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">লোড হচ্ছে...</div>;

  // টপ ৩ ইউজারকে আলাদা করা (পোডিয়ামের জন্য)
  const topThree = topUsers.slice(0, 3);
  const restUsers = topUsers.slice(3);

  return (
    <div className="min-h-screen bg-indigo-600 font-sans text-white">
      {/* হেডার */}
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold italic tracking-wide">সেরা খেলোয়াড় তালিকা 🏆</h1>
      </div>

      {/* পোডিয়াম সেকশন (Top 3) */}
      <div className="flex justify-center items-end gap-2 px-4 pt-10 pb-8">
        {/* ২য় স্থান */}
        {topThree[1] && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-300 bg-white/10 overflow-hidden flex items-center justify-center">
                {topThree[1].photoURL ? <img src={topThree[1].photoURL} alt="" /> : <UserIcon size={30} />}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-300 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full">2nd</div>
            </div>
            <p className="mt-3 text-xs font-bold truncate w-20 text-center">{topThree[1].displayName}</p>
            <p className="text-indigo-200 text-[10px]">{topThree[1].totalPoints} pts</p>
            <div className="h-16 w-16 bg-white/10 mt-2 rounded-t-xl"></div>
          </div>
        )}

        {/* ১ম স্থান (মাঝখানে) */}
        {topThree[0] && (
          <div className="flex flex-col items-center -mt-8">
            <Crown className="text-amber-400 mb-1 animate-bounce" fill="currentColor" size={28} />
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-white/10 overflow-hidden flex items-center justify-center scale-110 shadow-2xl">
                {topThree[0].photoURL ? <img src={topThree[0].photoURL} alt="" /> : <UserIcon size={40} />}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-indigo-900 text-xs font-black px-3 py-0.5 rounded-full shadow-lg">1st</div>
            </div>
            <p className="mt-4 font-black truncate w-24 text-center">{topThree[0].displayName}</p>
            <p className="text-amber-200 text-xs font-bold">{topThree[0].totalPoints} pts</p>
            <div className="h-24 w-20 bg-white/20 mt-2 rounded-t-2xl shadow-inner border-t border-white/20"></div>
          </div>
        )}

        {/* ৩য় স্থান */}
        {topThree[2] && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-orange-400 bg-white/10 overflow-hidden flex items-center justify-center">
                {topThree[2].photoURL ? <img src={topThree[2].photoURL} alt="" /> : <UserIcon size={30} />}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3rd</div>
            </div>
            <p className="mt-3 text-xs font-bold truncate w-20 text-center">{topThree[2].displayName}</p>
            <p className="text-indigo-200 text-[10px]">{topThree[2].totalPoints} pts</p>
            <div className="h-12 w-16 bg-white/5 mt-2 rounded-t-xl"></div>
          </div>
        )}
      </div>

      {/* বাকিদের তালিকা (List View) */}
      <div className="bg-white rounded-t-[40px] text-gray-800 p-6 min-h-[50vh] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="space-y-4 mb-20">
          {restUsers.map((u) => (
            <div 
              key={u.id} 
              className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${u.uid === currentUser?.uid ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-gray-50 border-gray-100'}`}
            >
              <span className="font-black text-gray-400 w-6">#{u.rank}</span>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 overflow-hidden">
                {u.photoURL ? <img src={u.photoURL} alt="" /> : <UserIcon size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{u.displayName}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{u.completedLevels || 0} লেবেল পার</p>
              </div>
              <div className="text-right">
                <p className="font-black text-indigo-600">{u.totalPoints}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">পয়েন্ট</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* স্টিকি বটম বার (নিজের র‍্যাংক দেখার জন্য) */}
      {currentUser && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] max-w-md mx-auto rounded-t-3xl">
          <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center font-bold italic">
                {topUsers.find(u => u.uid === currentUser.uid)?.rank || '-'}
              </div>
              <div>
                <p className="text-xs text-indigo-100">আপনার বর্তমান র‍্যাংক</p>
                <p className="font-bold">{currentUser.displayName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black">{currentUser.totalPoints}</p>
              <p className="text-[10px] opacity-70 font-bold">পয়েন্ট</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
