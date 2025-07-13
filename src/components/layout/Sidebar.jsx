import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiMonitor, FiFolder, FiCalendar, FiBarChart3, FiSettings, FiMenu, FiX } = FiIcons;

const menuItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/screens', icon: FiMonitor, label: 'Screens' },
  { path: '/content', icon: FiFolder, label: 'Content' },
  { path: '/scheduling', icon: FiCalendar, label: 'Scheduling' },
  { path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
  { path: '/settings', icon: FiSettings, label: 'Settings' }
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-280'
        }`}
        style={{ width: isCollapsed ? '80px' : '280px' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiMonitor} className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">Signage Manager</span>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <SafeIcon icon={isCollapsed ? FiMenu : FiX} className="text-white text-xl" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <SafeIcon
                      icon={item.icon}
                      className={`text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                    />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className={`bg-slate-800 rounded-lg p-4 border border-slate-600 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">System Status</span>
            </div>
            <div className="text-xs text-slate-400">
              <div>3 screens online</div>
              <div>Last sync: 2 min ago</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;