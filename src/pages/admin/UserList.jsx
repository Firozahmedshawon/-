import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Search, User, ShieldAlert, CheckCircle, 
  ArrowLeft, Mail, Trophy, Calendar 
} from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ১. ফায়ারস্টোর থেকে সকল ইউজার ফেচ করা
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    } catch (err) {
      console.error("ইউজার লিস্ট আনতে সমস্যা:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ২. ইউজার ব্লক/আনব্লক করার ফাংশন
  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? "আনব্লক" : "ব্লক";
    if (window.confirm(`আপনি কি এই ইউজারকে ${action} করতে চান?`)) {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          isBlocked: !currentStatus
        });
        fetchUsers(); // লিস্ট রিফ্রেশ করা
        alert(`ইউজারকে সফলভাবে ${action} করা হয়েছে।`);
      } catch (err) {
        alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
      }
    }
  };

  // ৩. সার্চ ফিল্টার লজিক
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* হেডার */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')} 
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">ইউজার ম্যানেজমেন্ট 👥</h1>
          </div>
          <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
            মোট: {users.length} জন
          </div>
        </div>

        {/* সার্চ বার */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ইউজার লিস্ট */}
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">লোড হচ্ছে...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
              <div 
                key={u.id} 
                className={`bg-white p-5 rounded-3xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all
                  ${u.isBlocked ? 'border-red-100 opacity-75' : 'border-gray-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                    ${u.isBlocked ? 'bg-red-50 text-red-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    {u.photoURL ? (
                      <img src={u.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800">{u.displayName || 'অজানা ইউজার'}</h3>
                      {u.isBlocked && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">Blocked</span>
                      )}
                    </div>
                    <div className="flex flex-col text-xs text-gray-500 gap-1 mt-1">
                      <span className="flex items-center gap-1"><Mail size={12}/> {u.email}</span>
                      <span className="flex items-center gap-1"><Calendar size={12}/> জয়েন: {u.createdAt?.toDate().toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-center px-4">
                    <p className="text-lg font-black text-indigo-600">{u.totalPoints || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">পয়েন্ট</p>
                  </div>
                  
                  <button 
                    onClick={() => toggleUserStatus(u.id, u.isBlocked)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all
                      ${u.isBlocked 
                        ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                        : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                  >
                    {u.isBlocked ? <CheckCircle size={18}/> : <ShieldAlert size={18}/>}
                    {u.isBlocked ? 'আনব্লক' : 'ব্লক করুন'}
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">কোনো ইউজার পাওয়া যায়নি!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;