import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, CheckCircle, Flame, Target, User, 
  LogOut, Settings, Play, BarChart2, Award,
  Send, Facebook, Instagram, Twitter
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data - would come from user profile in Firestore
  const stats = [
    { icon: Trophy, label: 'Total Points', value: user?.totalPoints || '2,450', color: 'bg-yellow-500' },
    { icon: CheckCircle, label: 'Levels Passed', value: `${user?.levelsPassed || '12'}/180`, color: 'bg-green-500' },
    { icon: Flame, label: 'Current Streak', value: '5 Days', color: 'bg-orange-500' },
    { icon: Target, label: 'Best Score', value: '980', color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-main-gradient rounded-lg flex items-center justify-center">
            <Award className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold heading-font bg-clip-text text-transparent bg-main-gradient">
            QuizMaster Pro
          </h1>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-primary border-opacity-20"
          >
            {user?.photoURL ? <img src={user.photoURL} alt="Profile" /> : <User size={20} className="text-gray-600" />}
          </button>

          {isProfileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
            >
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                <Settings size={16} /> <span>Profile Settings</span>
              </button>
              <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-error hover:bg-red-50 flex items-center space-x-2">
                <LogOut size={16} /> <span>Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 heading-font">
            Welcome back, {user?.username || 'Challenger'}! 👋
          </h2>
          <p className="text-gray-500">Ready to boost your knowledge today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-2 relative overflow-hidden group h-48 rounded-3xl bg-main-gradient p-8 text-white flex flex-col justify-center items-start shadow-xl shadow-indigo-200"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-2">Play Game</h3>
              <p className="text-indigo-100 opacity-90">Jump back into Set 1 - Level 13</p>
            </div>
            <Play size={80} className="absolute right-[-10px] bottom-[-10px] text-white opacity-20 group-hover:scale-110 transition-transform" />
            <div className="mt-4 bg-white text-primary px-6 py-2 rounded-full font-bold flex items-center space-x-2">
              <span>Start Now</span>
              <Play size={16} fill="currentColor" />
            </div>
          </motion.button>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ x: 5 }}
              className="flex-1 bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center space-x-4 shadow-sm hover:border-primary transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <BarChart2 />
              </div>
              <div className="text-left">
                <h4 className="font-bold">View Progress</h4>
                <p className="text-xs text-gray-500">Detailed performance stats</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ x: 5 }}
              className="flex-1 bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center space-x-4 shadow-sm hover:border-secondary transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <Trophy />
              </div>
              <div className="text-left">
                <h4 className="font-bold">Leaderboard</h4>
                <p className="text-xs text-gray-500">Top players this week</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Social Links Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">Join our community</p>
          <div className="flex justify-center space-x-6">
            {[
              { icon: Send, color: 'hover:bg-blue-500', label: 'Telegram' },
              { icon: Facebook, color: 'hover:bg-blue-700', label: 'Facebook' },
              { icon: Instagram, color: 'hover:bg-pink-600', label: 'Instagram' },
              { icon: Twitter, color: 'hover:bg-black', label: 'X' },
            ].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5 }}
                className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 transition-colors hover:text-white ${social.color}`}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;