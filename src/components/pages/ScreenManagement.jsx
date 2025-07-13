import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import ScreenCard from '../screens/ScreenCard';
import ScreenModal from '../screens/ScreenModal';
import AddScreenModal from '../screens/AddScreenModal';

const { FiPlus, FiFilter, FiGrid, FiList } = FiIcons;

function ScreenManagement() {
  const { state } = useApp();
  const { sendCommand } = useSocket();
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  const filteredScreens = state.screens.filter(screen => {
    if (filter === 'all') return true;
    return screen.status === filter;
  });

  const handleScreenAction = (screenId, action) => {
    sendCommand(screenId, action);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Screen Management</h1>
          <p className="text-slate-400">Monitor and control your digital displays</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
        >
          <SafeIcon icon={FiPlus} className="text-lg" />
          Add Screen
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Screens</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          <div className="text-sm text-slate-400">
            {filteredScreens.length} of {state.screens.length} screens
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SafeIcon icon={FiGrid} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SafeIcon icon={FiList} />
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      }`}>
        {filteredScreens.map((screen, index) => (
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ScreenCard
              screen={screen}
              onSelect={() => setSelectedScreen(screen)}
              onAction={handleScreenAction}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </div>

      {selectedScreen && (
        <ScreenModal
          screen={selectedScreen}
          onClose={() => setSelectedScreen(null)}
          onAction={handleScreenAction}
        />
      )}

      {showAddModal && (
        <AddScreenModal onClose={() => setShowAddModal(false)} />
      )}
    </motion.div>
  );
}

export default ScreenManagement;