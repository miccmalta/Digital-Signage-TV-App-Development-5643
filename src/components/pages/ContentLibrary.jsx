import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import ContentCard from '../content/ContentCard';
import UploadModal from '../content/UploadModal';

const { FiUpload, FiFilter, FiGrid, FiList, FiSearch } = FiIcons;

function ContentLibrary() {
  const { state } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = state.content.filter(content => {
    const matchesFilter = filter === 'all' || content.type === filter;
    const matchesSearch = content.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Library</h1>
          <p className="text-slate-400">Manage your digital signage content</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
        >
          <SafeIcon icon={FiUpload} className="text-lg" />
          Upload Content
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            />
          </div>

          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="webpage">Web Pages</option>
            </select>
          </div>

          <div className="text-sm text-slate-400">
            {filteredContent.length} of {state.content.length} items
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
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
      }`}>
        {filteredContent.map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ContentCard content={content} viewMode={viewMode} />
          </motion.div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="text-slate-600 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No content found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </motion.div>
  );
}

export default ContentLibrary;