import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, auth, storage } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  User, Mail, Trophy, Star, Camera, Edit2, 
  Check, LogOut, ArrowLeft, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ১. নাম আপডেট করার ফাংশন
  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.displayName) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      // Firebase Auth আপডেট
      await updateProfile(auth.currentUser, { displayName: newName });
      
      // Firestore আপডেট
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName: newName });
      
      setIsEditing(false);
      alert("নাম সফলভাবে পরিবর্তন করা হয়েছে!");
    } catch (err) {
      console.error(err);
      alert("নাম পরিবর্তন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // ২. প্রোফাইল ছবি আপলোড করার ফাংশন
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const storageRef = ref(storage, `profile_pics/${user.uid}`);

    try {
      // Storage-এ আপলোড
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Auth এবং Firestore আপডেট
      await updateProfile(auth.currentUser, { photoURL });
      await updateDoc(doc(db, "users", user.uid), { photoURL });

      alert("প্রোফাইল ছবি আপডেট হয়েছে!");
    } catch (err) {
      console.error(err);
      alert("ছবি আপলোড করতে সমস্যা হয়েছে।");
    } finally {
      setImageLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("আপনি কি লগআউট করতে চান?")) {
      auth.signOut();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto font-sans pb-10">
      {/* হেডার */}
      <div className="bg-indigo-600 p-6 rounded-b-[40px] text-white relative shadow-lg">
        <button onClick={() => navigate(-1)} className="absolute left-6 top-8 p-2 bg-white/20 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-center text-xl font-bold mt-2">আমার প্রোফাইল</h1>

        {/* প্রোফাইল ইমেজ সেকশন */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-indigo-100 overflow-hidden flex items-center justify-center shadow-2xl">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={50} className="text-indigo-400" />
              )}
              {imageLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-amber-400 p-2 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={18} className="text-indigo-900" />
            </button>
            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
          
          <div className="mt-4 text-center">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 outline-none text-white text-lg font-bold text-center"
                  autoFocus
                />
                <button onClick={handleUpdateName} className="p-2 bg-green-500 rounded-lg">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h2 className="text-2xl font-black">{user?.displayName || 'ইউজার নাম'}</h2>
                <button onClick={() => setIsEditing(true)} className="p-1.5 bg-white/10 rounded-full">
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p className="text-indigo-100 text-sm mt-1">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* স্ট্যাটস কার্ডস */}
      <div className="px-6 -mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center">
          <Trophy className="text-amber-500 mb-2" size={30} />
          <p className="text-2xl font-black text-indigo-600">{user?.totalPoints || 0}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">মোট পয়েন্ট</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center">
          <Star className="text-emerald-500 mb-2" size={30} />
          <p className="text-2xl font-black text-indigo-600">{user?.completedLevels || 0}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">লেবেল পার</p>
        </div>
      </div>

      {/* সেটিংস লিস্ট */}
      <div className="p-6 space-y-4">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-2">একাউন্ট সেটিংস</h3>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => navigate('/leaderboard')}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50"
          >
            <div className="flex items-center gap-4 text-gray-700 font-bold">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Trophy size={20} /></div>
              লিডারবোর্ড দেখুন
            </div>
            <ArrowLeft className="rotate-180 text-gray-300" size={18} />
          </button>

          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-4 text-gray-700 font-bold">
              <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Mail size={20} /></div>
              ইমেইল পরিবর্তন করুন
            </div>
            <ArrowLeft className="rotate-180 text-gray-300" size={18} />
          </button>
        </div>

        {/* লগআউট বাটন */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-500 font-bold p-5 rounded-3xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
        >
          <LogOut size={20} /> লগআউট করুন
        </button>
      </div>

      {/* অ্যাপ ভার্সন */}
      <p className="text-center text-gray-300 text-xs font-medium mt-4">Version 1.0.0 • Quiz Master</p>
    </div>
  );
};

export default Profile;