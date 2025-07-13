import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format } from 'date-fns';

const { FiMonitor, FiWifi, FiWifiOff, FiAlertTriangle, FiPlay, FiPause, FiRefreshCw, FiSettings, FiEdit3, FiLayout } = FiIcons;

function ScreenCard({ screen, onSelect, onAction, viewMode = 'grid' }) {
  const navigate = useNavigate();
  
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

  const handleDesignClick = (e) => {
    e.stopPropagation();
    navigate(`/screens/${screen.id}/design`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200"
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiMonitor} className="text-white text-xl" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 ${statusColors[screen.status]} rounded-full border-2 border-slate-800`}></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{screen.name}</h3>
              <p className="text-sm text-slate-400">{screen.location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-sm text-slate-400">
              <div>IP: {screen.ipAddress}</div>
              <div>Resolution: {screen.resolution}</div>
            </div>
            <div className="text-sm text-slate-400">
              <div>Uptime: {screen.uptime}</div>
              <div>Temperature: {screen.temperature}</div>
            </div>
            <div className="text-sm text-slate-400">
              <div>Storage: {screen.storageUsed}</div>
              <div>Version: {screen.version}</div>
            </div>
            <div className="flex items-center gap-2">
              <SafeIcon
                icon={statusIcons[screen.status]}
                className={`text-lg ${
                  screen.status === 'online' ? 'text-green-400' :
                  screen.status === 'offline' ? 'text-red-400' : 'text-yellow-400'
                }`}
              />
              <span className="text-sm font-medium capitalize text-white">{screen.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDesignClick}
                className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                title="Design Layout"
              >
                <SafeIcon icon={FiLayout} className="text-white text-sm" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-all duration-200"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiMonitor} className="text-white text-2xl" />
          </div>
          <div className={`absolute -top-2 -right-2 w-6 h-6 ${statusColors[screen.status]} rounded-full border-2 border-slate-800 flex items-center justify-center`}>
            <SafeIcon icon={statusIcons[screen.status]} className="text-white text-xs" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDesignClick}
            className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            title="Design Layout"
          >
            <SafeIcon icon={FiLayout} className="text-white text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(screen.id, 'restart');
            }}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="text-white text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(screen.id, screen.status === 'online' ? 'pause' : 'resume');
            }}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <SafeIcon icon={screen.status === 'online' ? FiPause : FiPlay} className="text-white text-sm" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{screen.name}</h3>
        <p className="text-sm text-slate-400">{screen.location}</p>
        
        <div className="flex items-center gap-2 text-sm">
          <SafeIcon
            icon={statusIcons[screen.status]}
            className={`${
              screen.status === 'online' ? 'text-green-400' :
              screen.status === 'offline' ? 'text-red-400' : 'text-yellow-400'
            }`}
          />
          <span className="font-medium capitalize text-white">{screen.status}</span>
        </div>
        
        <div className="space-y-1 text-sm text-slate-400">
          <div>Resolution: {screen.resolution}</div>
          <div>Uptime: {screen.uptime}</div>
          <div>Temperature: {screen.temperature}</div>
          <div>Storage: {screen.storageUsed}</div>
        </div>
        
        <div className="pt-2 border-t border-slate-700">
          <div className="text-sm text-slate-400">
            <div>Current: {screen.currentContent}</div>
            <div>Last seen: {format(new Date(screen.lastSeen), 'HH:mm')}</div>
          </div>
        </div>
        
        {screen.layout && (
          <div className="pt-2 border-t border-slate-700">
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <SafeIcon icon={FiLayout} className="text-xs" />
              <span>Custom layout configured</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ScreenCard;