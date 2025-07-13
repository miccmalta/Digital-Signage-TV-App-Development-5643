import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format } from 'date-fns';

const { FiActivity, FiMonitor, FiFolder, FiCalendar, FiAlertTriangle } = FiIcons;

function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'screen',
      icon: FiMonitor,
      title: 'Screen "Main Lobby" came online',
      time: new Date(Date.now() - 2 * 60 * 1000),
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'content',
      icon: FiFolder,
      title: 'New content "Daily Menu" uploaded',
      time: new Date(Date.now() - 5 * 60 * 1000),
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'schedule',
      icon: FiCalendar,
      title: 'Schedule updated for Conference Room A',
      time: new Date(Date.now() - 10 * 60 * 1000),
      color: 'text-purple-400'
    },
    {
      id: 4,
      type: 'warning',
      icon: FiAlertTriangle,
      title: 'High temperature detected on Screen 2',
      time: new Date(Date.now() - 15 * 60 * 1000),
      color: 'text-yellow-400'
    },
    {
      id: 5,
      type: 'screen',
      icon: FiMonitor,
      title: 'Screen "Cafeteria" went offline',
      time: new Date(Date.now() - 20 * 60 * 1000),
      color: 'text-red-400'
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <SafeIcon icon={FiActivity} className="text-blue-400 text-xl" />
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center ${activity.color}`}>
              <SafeIcon icon={activity.icon} className="text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{activity.title}</p>
              <p className="text-xs text-slate-400 mt-1">
                {format(activity.time, 'HH:mm')} • {format(activity.time, 'MMM d')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
}

export default RecentActivity;