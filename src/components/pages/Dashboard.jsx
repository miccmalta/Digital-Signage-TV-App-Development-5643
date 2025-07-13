import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import StatsCard from '../common/StatsCard';
import ScreenStatusGrid from '../screens/ScreenStatusGrid';
import RecentActivity from '../common/RecentActivity';
import QuickActions from '../common/QuickActions';

const { FiMonitor, FiFolder, FiCalendar, FiActivity } = FiIcons;

function Dashboard() {
  const { state } = useApp();

  const onlineScreens = state.screens.filter(screen => screen.status === 'online').length;
  const offlineScreens = state.screens.filter(screen => screen.status === 'offline').length;
  const warningScreens = state.screens.filter(screen => screen.status === 'warning').length;

  const stats = [
    {
      title: 'Total Screens',
      value: state.screens.length,
      icon: FiMonitor,
      color: 'blue',
      trend: '+2 this week'
    },
    {
      title: 'Online Screens',
      value: onlineScreens,
      icon: FiActivity,
      color: 'green',
      trend: `${Math.round((onlineScreens / state.screens.length) * 100)}% uptime`
    },
    {
      title: 'Content Items',
      value: state.content.length,
      icon: FiFolder,
      color: 'purple',
      trend: '+5 this week'
    },
    {
      title: 'Active Schedules',
      value: state.schedules.length,
      icon: FiCalendar,
      color: 'orange',
      trend: 'All running'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Monitor and manage your digital signage network</p>
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScreenStatusGrid />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;