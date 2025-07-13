import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';

const { FiX, FiUpload, FiFile, FiCheck } = FiIcons;

function UploadModal({ onClose }) {
  const { addContent } = useApp();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'webpage',
      progress: 0,
      uploaded: false
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'text/html': ['.html']
    }
  });

  const handleUpload = async () => {
    setUploading(true);
    
    for (const fileData of files) {
      if (!fileData.uploaded) {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, progress } : f
          ));
        }

        // Add to content library
        const newContent = {
          id: Date.now().toString() + Math.random(),
          name: fileData.name.replace(/\.[^/.]+$/, ''),
          type: fileData.type,
          duration: fileData.type === 'video' ? 120 : 30,
          size: `${(fileData.size / 1024 / 1024).toFixed(1)} MB`,
          created: new Date().toISOString(),
          thumbnail: fileData.type === 'image' ? 
            URL.createObjectURL(fileData.file) : 
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
          url: URL.createObjectURL(fileData.file),
          tags: ['uploaded']
        };

        addContent(newContent);
        
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, uploaded: true } : f
        ));
      }
    }

    setUploading(false);
    setTimeout(onClose, 1000);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
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
            <h2 className="text-xl font-bold text-white">Upload Content</h2>
            <button
              onClick={onClose}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <input {...getInputProps()} />
              <SafeIcon icon={FiUpload} className="text-4xl text-slate-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-blue-400">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-slate-300 mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-slate-400">Supports: Images, Videos, HTML files</p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Files to Upload</h3>
                {files.map((fileData) => (
                  <div key={fileData.id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <SafeIcon icon={FiFile} className="text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{fileData.name}</p>
                          <p className="text-sm text-slate-400">
                            {(fileData.size / 1024 / 1024).toFixed(1)} MB • {fileData.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileData.uploaded ? (
                          <SafeIcon icon={FiCheck} className="text-green-400 text-xl" />
                        ) : (
                          <button
                            onClick={() => removeFile(fileData.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <SafeIcon icon={FiX} />
                          </button>
                        )}
                      </div>
                    </div>
                    {fileData.progress > 0 && (
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileData.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiUpload} />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default UploadModal;