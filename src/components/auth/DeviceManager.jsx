import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';

const { FiPlus, FiTrash2, FiMonitor, FiKey, FiCopy, FiCheck } = FiIcons;

function DeviceManager() {
  const { state, addDevice, deleteDevice } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    location: '',
    code: ''
  });
  const [copiedCode, setCopiedCode] = useState('');

  const generateDeviceCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAddDevice = () => {
    const code = generateDeviceCode();
    const device = {
      id: Date.now().toString(),
      name: newDevice.name,
      location: newDevice.location,
      code: code,
      status: 'offline',
      lastSeen: null,
      createdAt: new Date().toISOString()
    };
    
    addDevice(device);
    setNewDevice({ name: '', location: '', code: '' });
    setShowAddModal(false);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Device Management</h2>
          <p className="text-slate-400">Manage TV device codes and access</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
        >
          <SafeIcon icon={FiPlus} />
          Add Device
        </button>
      </div>

      <div className="grid gap-4">
        {state.devices?.map(device => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiMonitor} className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                  <p className="text-sm text-slate-400">{device.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <SafeIcon icon={FiKey} className="text-blue-400" />
                    <span className="text-lg font-mono text-white">{device.code}</span>
                    <button
                      onClick={() => copyToClipboard(device.code)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <SafeIcon icon={copiedCode === device.code ? FiCheck : FiCopy} className="text-sm" />
                    </button>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    device.status === 'online' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-slate-600/20 text-slate-400'
                  }`}>
                    {device.status}
                  </div>
                </div>
                
                <button
                  onClick={() => deleteDevice(device.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-white mb-4">Add New Device</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Device Name</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Main Lobby TV"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Building A - Lobby"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddDevice}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Device
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DeviceManager;