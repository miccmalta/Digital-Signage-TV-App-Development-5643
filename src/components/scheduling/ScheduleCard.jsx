import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const { FiCalendar, FiMonitor, FiClock, FiEdit3, FiTrash2, FiPlay, FiPause } = FiIcons;

function ScheduleCard({ schedule }) {
  const { state, deleteSchedule } = useApp();
  
  const screen = state.screens.find(s => s.id === schedule.screenId);
  const isActive = new Date(schedule.startDate) <= new Date() && new Date() <= new Date(schedule.endDate);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(schedule.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiCalendar} className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{schedule.name}</h3>
            <p className="text-sm text-slate-400">{screen?.name || 'Unknown Screen'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/20 text-slate-400'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
          <button
            onClick={() => {/* Edit schedule */}}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <SafeIcon icon={FiEdit3} className="text-white text-sm" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="text-white text-sm" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <SafeIcon icon={FiMonitor} className="text-xs" />
            <span>Screen: {screen?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <SafeIcon icon={FiClock} className="text-xs" />
            <span>Duration: {format(new Date(schedule.startDate), 'MMM d')} - {format(new Date(schedule.endDate), 'MMM d')}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-slate-400">
            Time Slots: {schedule.timeSlots.length}
          </div>
          <div className="text-sm text-slate-400">
            Content Items: {schedule.timeSlots.length}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Time Slots</h4>
        <div className="space-y-1">
          {schedule.timeSlots.map((slot, index) => {
            const content = state.content.find(c => c.id === slot.contentId);
            return (
              <div key={slot.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-300">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className="text-sm text-slate-400">
                    {content?.name || 'Unknown Content'}
                  </div>
                </div>
                <div className="flex gap-1">
                  {slot.days.map((day) => (
                    <span key={day} className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded capitalize">
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default ScheduleCard;