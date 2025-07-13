import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const { FiX, FiMonitor, FiWifi, FiWifiOff, FiAlertTriangle, FiPlay, FiPause, FiRefreshCw, FiSettings, FiEdit3, FiTrash2 } = FiIcons;

function ScreenModal({ screen, onClose, onAction }) {
  const { updateScreen, deleteScreen } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: screen.name,
    location: screen.location,
    resolution: screen.resolution,
    orientation: screen.orientation
  });

  const statusColors = {
    online: 'text-green-400',
    offline: 'text-red-400',
    warning: 'text-yellow-400'
  };

  const statusIcons = {
    online: FiWifi,
    offline: FiWifiOff,
    warning: FiAlertTriangle
  };

  const handleSave = () => {
    updateScreen(screen.id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this screen?')) {
      deleteScreen(screen.id);
      onClose();
    }
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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiMonitor} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{screen.name}</h2>
                <p className="text-sm text-slate-400">{screen.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <SafeIcon icon={FiEdit3} className="text-white" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <SafeIcon icon={FiTrash2} className="text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <SafeIcon icon={statusIcons[screen.status]} className={`text-2xl ${statusColors[screen.status]}`} />
              <div>
                <div className="text-lg font-semibold text-white capitalize">{screen.status}</div>
                <div className="text-sm text-slate-400">
                  Last seen: {format(new Date(screen.lastSeen), 'PPpp')}
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Screen Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Resolution</label>
                    <select
                      value={editData.resolution}
                      onChange={(e) => setEditData({ ...editData, resolution: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1920x1080">1920x1080</option>
                      <option value="1080x1920">1080x1920</option>
                      <option value="3840x2160">3840x2160</option>
                      <option value="2160x3840">2160x3840</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Orientation</label>
                    <select
                      value={editData.orientation}
                      onChange={(e) => setEditData({ ...editData, orientation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Screen Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">IP Address:</span>
                        <span className="text-white">{screen.ipAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Resolution:</span>
                        <span className="text-white">{screen.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Orientation:</span>
                        <span className="text-white capitalize">{screen.orientation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Version:</span>
                        <span className="text-white">{screen.version}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Uptime:</span>
                        <span className="text-white">{screen.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Temperature:</span>
                        <span className="text-white">{screen.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Storage Used:</span>
                        <span className="text-white">{screen.storageUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Content:</span>
                        <span className="text-white">{screen.currentContent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-slate-700">
              <button
                onClick={() => onAction(screen.id, 'restart')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} />
                Restart
              </button>
              <button
                onClick={() => onAction(screen.id, screen.status === 'online' ? 'pause' : 'resume')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <SafeIcon icon={screen.status === 'online' ? FiPause : FiPlay} />
                {screen.status === 'online' ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={() => onAction(screen.id, 'screenshot')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiMonitor} />
                Take Screenshot
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ScreenModal;