import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlus, FiUpload, FiCalendar, FiSettings } = FiIcons;

function QuickActions() {
  const actions = [
    {
      icon: FiPlus,
      label: 'Add Screen',
      color: 'from-blue-500 to-blue-600',
      onClick: () => console.log('Add screen')
    },
    {
      icon: FiUpload,
      label: 'Upload Content',
      color: 'from-green-500 to-green-600',
      onClick: () => console.log('Upload content')
    },
    {
      icon: FiCalendar,
      label: 'Create Schedule',
      color: 'from-purple-500 to-purple-600',
      onClick: () => console.log('Create schedule')
    },
    {
      icon: FiSettings,
      label: 'Settings',
      color: 'from-gray-500 to-gray-600',
      onClick: () => console.log('Settings')
    }
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={action.onClick}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${action.color} text-white rounded-lg hover:shadow-lg transition-all duration-200`}
        >
          <SafeIcon icon={action.icon} className="text-lg" />
          <span className="hidden sm:inline">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default QuickActions;