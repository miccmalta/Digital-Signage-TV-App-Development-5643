import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';

const { FiBell, FiSearch, FiUser, FiWifi, FiWifiOff, FiRefreshCw } = FiIcons;

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Screen "Main Lobby" went offline', type: 'warning', time: '2 min ago' },
    { id: 2, message: 'Content "Daily Menu" updated successfully', type: 'success', time: '5 min ago' },
    { id: 3, message: 'New schedule created for Conference Room A', type: 'info', time: '10 min ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { state } = useApp();
  const { isConnected } = useSocket();

  const onlineScreens = state.screens.filter(screen => screen.status === 'online').length;
  const totalScreens = state.screens.length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SafeIcon
                icon={isConnected ? FiWifi : FiWifiOff}
                className={`text-xl ${isConnected ? 'text-green-400' : 'text-red-400'}`}
              />
              <span className="text-sm text-slate-300">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-slate-300">
              {onlineScreens}/{totalScreens} screens online
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiSearch} className="text-slate-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search screens, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <SafeIcon icon={FiBell} className="text-white text-xl" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50"
              >
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-slate-700 hover:bg-slate-700/50">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <SafeIcon icon={FiRefreshCw} className="text-white text-xl" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="text-white text-sm" />
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">Admin User</div>
              <div className="text-slate-400">Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;