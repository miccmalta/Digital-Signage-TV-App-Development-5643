import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';

const { FiMonitor, FiWifi, FiWifiOff, FiAlertTriangle } = FiIcons;

function ScreenStatusGrid() {
  const { state } = useApp();

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  const statusIcons = {
    online: FiWifi,
    offline: FiWifiOff,
    warning: FiAlertTriangle
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Screen Status Overview</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-400">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-400">Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-400">Warning</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.screens.map((screen, index) => (
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiMonitor} className="text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 ${statusColors[screen.status]} rounded-full border-2 border-slate-700`}></div>
              </div>
              <SafeIcon icon={statusIcons[screen.status]} className={`text-lg ${
                screen.status === 'online' ? 'text-green-400' :
                screen.status === 'offline' ? 'text-red-400' : 'text-yellow-400'
              }`} />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm">{screen.name}</h3>
              <p className="text-xs text-slate-400">{screen.location}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Uptime:</span>
                <span className="text-white">{screen.uptime}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Temp:</span>
                <span className="text-white">{screen.temperature}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ScreenStatusGrid;