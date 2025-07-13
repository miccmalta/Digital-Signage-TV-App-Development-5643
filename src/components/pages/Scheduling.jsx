import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import ScheduleCard from '../scheduling/ScheduleCard';
import CreateScheduleModal from '../scheduling/CreateScheduleModal';

const { FiCalendar, FiPlus, FiFilter, FiClock } = FiIcons;

function Scheduling() {
  const { state } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredSchedules = state.schedules.filter(schedule => {
    if (filter === 'all') return true;
    // Add more filters as needed
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Scheduling</h1>
          <p className="text-slate-400">Create and manage content schedules for your screens</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
        >
          <SafeIcon icon={FiPlus} className="text-lg" />
          Create Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiCalendar} className="text-blue-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Active Schedules</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{state.schedules.length}</div>
          <p className="text-sm text-slate-400">Currently running</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiClock} className="text-green-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Total Playtime</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">24h</div>
          <p className="text-sm text-slate-400">Today</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <SafeIcon icon={FiFilter} className="text-purple-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Scheduled Content</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{state.content.length}</div>
          <p className="text-sm text-slate-400">Items in rotation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Schedules</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Schedules</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="grid gap-6">
          {filteredSchedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ScheduleCard schedule={schedule} />
            </motion.div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateScheduleModal onClose={() => setShowCreateModal(false)} />
      )}
    </motion.div>
  );
}

export default Scheduling;