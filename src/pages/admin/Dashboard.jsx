import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, HelpCircle, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    { title: "সেট ম্যানেজমেন্ট", icon: <Layers />, path: "/admin/sets", count: "9", color: "bg-blue-500" },
    { title: "প্রশ্ন ম্যানেজমেন্ট", icon: <HelpCircle />, path: "/admin/questions", count: "180", color: "bg-purple-500" },
    { title: "ইউজার ম্যানেজমেন্ট", icon: <Users />, path: "/admin/users", count: "500+", color: "bg-green-500" },
    { title: "অ্যাপ সেটিংস", icon: <Settings />, path: "/admin/settings", count: "⚙️", color: "bg-gray-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar - ডেক্সটপের জন্য */}
      <div className="w-64 bg-indigo-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
          <LayoutDashboard /> এডমিন প্যানেল
        </h2>
        <nav className="space-y-4">
          {adminModules.map((m, i) => (
            <button key={i} onClick={() => navigate(m.path)} className="w-full text-left p-3 hover:bg-white/10 rounded-xl transition-all">
              {m.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ওভারভিউ স্ট্যাটস</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminModules.map((module, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <div className={`${module.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4`}>
                {module.icon}
              </div>
              <p className="text-gray-500 text-sm font-medium">{module.title}</p>
              <p className="text-2xl font-bold text-gray-800">{module.count}</p>
            </div>
          ))}
        </div>

        {/* কন্টেন্ট অ্যাকশন বাটন */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-700 mb-4">দ্রুত অ্যাকশন</h2>
          <div className="flex gap-4">
            <button onClick={() => navigate('/admin/sets')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              + নতুন সেট যোগ করুন
            </button>
            <button onClick={() => navigate('/admin/questions')} className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all">
              + নতুন প্রশ্ন যোগ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;