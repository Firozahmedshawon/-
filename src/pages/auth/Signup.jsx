import React, { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ১. Firebase Auth-এ ইউজার তৈরি
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ২. ইউজারের ডিসপ্লে নাম আপডেট করা
      await updateProfile(user, { displayName: name });

      // ৩. Firestore-এ ইউজারের ডাটাবেস প্রোফাইল তৈরি (ডিফল্ট ভ্যালু সহ)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        photoURL: "",
        totalPoints: 0,           // শুরুতে ০ পয়েন্ট
        completedLevels: 0,       // শুরুতে ০ লেভেল
        role: "user",             // ডিফল্ট রোল 'user'
        createdAt: serverTimestamp(),
        isBlocked: false
      });

      navigate('/'); // সফল হলে হোম পেজে নিয়ে যাবে
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("এই ইমেইলটি ইতিপূর্বে ব্যবহার করা হয়েছে।");
      } else {
        setError("একাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">নতুন একাউন্ট</h2>
          <p className="text-gray-500">কুইজ মাস্টার গেমে যোগ দিন</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* নাম ইনপুট */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="আপনার পুরো নাম"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* ইমেইল ইনপুট */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="ইমেইল এড্রেস"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* পাসওয়ার্ড ইনপুট */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95`}
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'একাউন্ট খুলুন'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          আগে থেকেই একাউন্ট আছে? <Link to="/login" className="text-green-600 font-bold">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
