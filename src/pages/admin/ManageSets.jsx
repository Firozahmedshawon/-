import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageSets = () => {
  const [sets, setSets] = useState([]);
  const [setName, setSetName] = useState('');
  const [order, setOrder] = useState('');
  const navigate = useNavigate();

  // সেটগুলো লোড করা
  const fetchSets = async () => {
    const querySnapshot = await getDocs(collection(db, "sets"));
    setSets(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchSets(); }, []);

  // নতুন সেট তৈরি
  const handleAddSet = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "sets"), {
        setName: setName,
        setOrder: parseInt(order),
        totalLevels: 20,
        isActive: true,
        createdAt: serverTimestamp()
      });
      setSetName(''); setOrder('');
      fetchSets();
      alert("সেট সফলভাবে যোগ হয়েছে!");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-indigo-600 font-bold">
        <ArrowLeft size={20}/> ড্যাশবোর্ড
      </button>

      <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">+ নতুন সেট যোগ করুন</h2>
        <form onSubmit={handleAddSet} className="flex gap-4">
          <input type="text" placeholder="সেটের নাম (উদা: বাংলাদেশ পরিচিতি)" className="flex-1 border p-3 rounded-xl outline-none" 
            value={setName} onChange={(e) => setSetName(e.target.value)} required />
          <input type="number" placeholder="অর্ডার (১-৯)" className="w-24 border p-3 rounded-xl outline-none" 
            value={order} onChange={(e) => setOrder(e.target.value)} required />
          <button type="submit" className="bg-indigo-600 text-white px-6 rounded-xl font-bold">যোগ করুন</button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">বর্তমান সেটসমূহ</h2>
        {sets.map(set => (
          <div key={set.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100">
            <div>
              <p className="font-bold text-lg text-gray-800">SET {set.setOrder} - {set.setName}</p>
              <p className="text-sm text-gray-500">মোট লেবেল: {set.totalLevels}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={20}/></button>
              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSets;