import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';

const { FiX, FiMonitor, FiPlus } = FiIcons;

function AddScreenModal({ onClose }) {
  const { addScreen } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ipAddress: '',
    resolution: '1920x1080',
    orientation: 'landscape'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newScreen = {
      id: Date.now().toString(),
      ...formData,
      status: 'offline',
      lastSeen: new Date().toISOString(),
      currentContent: 'None',
      version: '1.2.3',
      uptime: '0h 0m',
      temperature: 'N/A',
      storageUsed: '0%'
    };

    addScreen(newScreen);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiPlus} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add New Screen</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Screen Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Main Lobby Display"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Building A - Lobby"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                IP Address *
              </label>
              <input
                type="text"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleChange}
                required
                pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 192.168.1.100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Resolution
                </label>
                <select
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1920x1080">1920x1080 (Full HD)</option>
                  <option value="1080x1920">1080x1920 (Portrait HD)</option>
                  <option value="3840x2160">3840x2160 (4K)</option>
                  <option value="2160x3840">2160x3840 (Portrait 4K)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Orientation
                </label>
                <select
                  name="orientation"
                  value={formData.orientation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
              >
                <SafeIcon icon={FiPlus} />
                Add Screen
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

export default AddScreenModal;