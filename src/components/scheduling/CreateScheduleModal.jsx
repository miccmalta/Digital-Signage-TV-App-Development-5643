import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';

const { FiX, FiCalendar, FiPlus, FiTrash2 } = FiIcons;

function CreateScheduleModal({ onClose }) {
  const { state, addSchedule } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    screenId: '',
    startDate: '',
    endDate: '',
    timeSlots: []
  });

  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    contentId: '',
    days: []
  });

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const schedule = {
      id: Date.now().toString(),
      ...formData,
      timeSlots: formData.timeSlots.map((slot, index) => ({
        ...slot,
        id: (index + 1).toString()
      }))
    };

    addSchedule(schedule);
    onClose();
  };

  const addTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime && newSlot.contentId && newSlot.days.length > 0) {
      setFormData({
        ...formData,
        timeSlots: [...formData.timeSlots, { ...newSlot }]
      });
      setNewSlot({
        startTime: '',
        endTime: '',
        contentId: '',
        days: []
      });
    }
  };

  const removeTimeSlot = (index) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter((_, i) => i !== index)
    });
  };

  const toggleDay = (day) => {
    setNewSlot({
      ...newSlot,
      days: newSlot.days.includes(day)
        ? newSlot.days.filter(d => d !== day)
        : [...newSlot.days, day]
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Create New Schedule</h2>
            <button
              onClick={onClose}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Main Lobby Schedule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Screen *
                </label>
                <select
                  value={formData.screenId}
                  onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a screen</option>
                  {state.screens.map(screen => (
                    <option key={screen.id} value={screen.id}>
                      {screen.name} - {screen.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Time Slots</h3>
              
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-white mb-3">Add Time Slot</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newSlot.contentId}
                    onChange={(e) => setNewSlot({ ...newSlot, contentId: e.target.value })}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select content</option>
                    {state.content.map(content => (
                      <option key={content.id} value={content.id}>
                        {content.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days of Week</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          newSlot.days.includes(day)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} />
                  Add Time Slot
                </button>
              </div>

              {formData.timeSlots.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Scheduled Time Slots</h4>
                  {formData.timeSlots.map((slot, index) => {
                    const content = state.content.find(c => c.id === slot.contentId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-slate-300">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-slate-400">
                            {content?.name}
                          </div>
                          <div className="flex gap-1">
                            {slot.days.map(day => (
                              <span key={day} className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">
                                {day.slice(0, 3)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                <SafeIcon icon={FiCalendar} />
                Create Schedule
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CreateScheduleModal;