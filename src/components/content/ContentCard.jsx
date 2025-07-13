import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

const { FiPlay, FiImage, FiGlobe, FiEdit3, FiTrash2, FiClock, FiHardDrive, FiTag } = FiIcons;

function ContentCard({ content, viewMode = 'grid' }) {
  const { deleteContent } = useApp();
  const [showPreview, setShowPreview] = useState(false);

  const typeIcons = {
    video: FiPlay,
    image: FiImage,
    webpage: FiGlobe
  };

  const typeColors = {
    video: 'text-red-400',
    image: 'text-green-400',
    webpage: 'text-blue-400'
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(content.id);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={content.thumbnail}
                alt={content.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <SafeIcon icon={typeIcons[content.type]} className={`text-xl ${typeColors[content.type]}`} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{content.name}</h3>
              <p className="text-sm text-slate-400 capitalize">{content.type}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <SafeIcon icon={FiClock} className="text-xs" />
                {content.duration}s
              </div>
            </div>
            <div className="text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <SafeIcon icon={FiHardDrive} className="text-xs" />
                {content.size}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {format(new Date(content.created), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <SafeIcon icon={FiPlay} className="text-white text-sm" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <SafeIcon icon={FiTrash2} className="text-white text-sm" />
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
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-all duration-200"
    >
      <div className="relative mb-4">
        <img
          src={content.thumbnail}
          alt={content.name}
          className="w-full h-32 rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowPreview(true)}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <SafeIcon icon={FiPlay} className="text-white text-xl" />
          </button>
        </div>
        <div className="absolute top-2 left-2">
          <div className={`p-2 bg-black/50 rounded-lg ${typeColors[content.type]}`}>
            <SafeIcon icon={typeIcons[content.type]} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white truncate">{content.name}</h3>
        
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiClock} className="text-xs" />
            {content.duration}s
          </div>
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiHardDrive} className="text-xs" />
            {content.size}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {content.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Created: {format(new Date(content.created), 'MMM d, yyyy')}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Preview
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ContentCard;