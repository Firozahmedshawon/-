import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center space-x-4"
    >
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium body-font">{label}</p>
        <p className="text-2xl font-bold text-gray-800 heading-font">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;