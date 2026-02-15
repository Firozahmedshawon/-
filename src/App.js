import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// পেজ ইমপোর্ট (ধরে নিচ্ছি আপনি ফাইলগুলো তৈরি করেছেন)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/user/Home';
import SetSelection from './pages/user/SetSelection';
import LevelSelection from './pages/user/LevelSelection';
import QuizPage from './pages/user/QuizPage';
import Dashboard from './pages/admin/Dashboard';
import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* পাবলিক রুট */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<div>Signup Page (To be made)</div>} />

          {/* ইউজার প্রটেক্টেড রুটস */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/sets" element={
            <ProtectedRoute>
              <SetSelection />
            </ProtectedRoute>
          } />

          <Route path="/levels/:setId" element={
            <ProtectedRoute>
              <LevelSelection />
            </ProtectedRoute>
          } />

          <Route path="/quiz/:levelId" element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } />

          {/* এডমিন প্রটেক্টেড রুট */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;