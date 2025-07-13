import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';

function StatsCard({ title, value, icon, color, trend }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20',
    red: 'bg-red-500/20'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${bgColorClasses[color]} flex items-center justify-center`}>
          <SafeIcon icon={icon} className="text-white text-xl" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div className="text-xs text-slate-400 mt-1">{trend}</div>
          )}
        </div>
      </div>
      <h3 className="text-slate-300 font-medium">{title}</h3>
    </motion.div>
  );
}

export default StatsCard;