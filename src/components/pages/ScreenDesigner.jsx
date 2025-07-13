import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';

const { 
  FiSave, FiEye, FiArrowLeft, FiPlus, FiTrash2, FiSettings, 
  FiRss, FiLayout, FiMonitor, FiYoutube, FiImage, FiCode, 
  FiSliders, FiLink, FiPlusCircle
} = FiIcons;

function ScreenDesigner() {
  const { screenId } = useParams();
  const navigate = useNavigate();
  const { state, updateScreen } = useApp();
  const [screen, setScreen] = useState(null);
  const [layout, setLayout] = useState({
    leftColumn: {
      width: 70,
      contentType: 'rss',
      content: null,
      rssUrl: '',
      customRssUrl: '',
      contentOptions: {
        showQrCode: true,
        transitionTime: 10,
        autoPlay: true
      }
    },
    rightColumn: {
      width: 30,
      sections: 2, // 2 or 3 sections
      content: []
    },
    bottomBar: {
      enabled: true,
      height: 80,
      contentType: 'rss',
      rssUrl: '',
      customRssUrl: '',
      scrollSpeed: 50
    },
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff'
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [customImages, setCustomImages] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [widgetCode, setWidgetCode] = useState('');
  const [showAddCustomRss, setShowAddCustomRss] = useState(false);
  const [newCustomRss, setNewCustomRss] = useState({ name: '', url: '' });
  
  const [availableFeeds, setAvailableFeeds] = useState([
    { id: 'news', name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml' },
    { id: 'tech', name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { id: 'sport', name: 'ESPN', url: 'https://www.espn.com/espn/rss/news' },
    { id: 'weather', name: 'Weather Updates', url: 'https://weather.com/rss' },
    { id: 'custom', name: 'Custom Feeds', url: 'custom', isHeader: true }
  ]);

  useEffect(() => {
    const foundScreen = state.screens.find(s => s.id === screenId);
    if (foundScreen) {
      setScreen(foundScreen);
      // Load existing layout if available
      if (foundScreen.layout) {
        setLayout(foundScreen.layout);
      }
    }
  }, [screenId, state.screens]);

  // Load custom feeds from localStorage
  useEffect(() => {
    const savedCustomFeeds = localStorage.getItem('customRssFeeds');
    if (savedCustomFeeds) {
      try {
        const customFeeds = JSON.parse(savedCustomFeeds);
        setAvailableFeeds(prev => [
          ...prev.filter(feed => !feed.isCustom),
          ...customFeeds.map(feed => ({ ...feed, isCustom: true }))
        ]);
      } catch (error) {
        console.error('Error loading custom RSS feeds:', error);
      }
    }
  }, []);

  const handleSaveLayout = () => {
    if (screen) {
      updateScreen(screen.id, { layout });
      navigate('/screens');
    }
  };

  const handleLayoutChange = (field, value) => {
    setLayout(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRightColumnSectionChange = (sectionIndex, field, value) => {
    setLayout(prev => {
      const newContent = [...prev.rightColumn.content];
      if (!newContent[sectionIndex]) {
        newContent[sectionIndex] = {};
      }
      newContent[sectionIndex] = {
        ...newContent[sectionIndex],
        [field]: value
      };
      return {
        ...prev,
        rightColumn: {
          ...prev.rightColumn,
          content: newContent
        }
      };
    });
  };

  const addContentToSection = (sectionIndex, contentId) => {
    const content = state.content.find(c => c.id === contentId);
    if (content) {
      handleRightColumnSectionChange(sectionIndex, 'selectedContent', content);
    }
  };

  const addCustomRss = () => {
    if (newCustomRss.name && newCustomRss.url) {
      const updatedFeeds = [
        ...availableFeeds,
        {
          id: `custom-${Date.now()}`,
          name: newCustomRss.name,
          url: newCustomRss.url,
          isCustom: true
        }
      ];
      
      setAvailableFeeds(updatedFeeds);
      
      // Save to localStorage
      const customFeeds = updatedFeeds.filter(feed => feed.isCustom);
      localStorage.setItem('customRssFeeds', JSON.stringify(customFeeds));
      
      setNewCustomRss({ name: '', url: '' });
      setShowAddCustomRss(false);
    }
  };

  const handleAddImage = (url) => {
    if (url) {
      setCustomImages([...customImages, url]);
    }
  };

  const removeCustomImage = (index) => {
    setCustomImages(customImages.filter((_, i) => i !== index));
  };

  const addCustomContentToSection = (sectionIndex, contentType, contentData) => {
    handleRightColumnSectionChange(sectionIndex, 'type', contentType);
    
    switch(contentType) {
      case 'slideshow':
        handleRightColumnSectionChange(sectionIndex, 'images', customImages);
        break;
      case 'youtube':
        handleRightColumnSectionChange(sectionIndex, 'youtubeUrl', youtubeUrl);
        break;
      case 'widget':
        handleRightColumnSectionChange(sectionIndex, 'widgetCode', widgetCode);
        break;
      case 'rssSlideshow':
        handleRightColumnSectionChange(sectionIndex, 'rssUrl', contentData.rssUrl);
        handleRightColumnSectionChange(sectionIndex, 'showQrCode', true);
        handleRightColumnSectionChange(sectionIndex, 'transitionTime', 10);
        break;
    }
  };

  const renderDesigner = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Layout Controls */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SafeIcon icon={FiLayout} className="text-blue-400" />
            Layout Settings
          </h3>

          {/* Left Column Settings */}
          <div className="space-y-4 mb-6">
            <h4 className="text-md font-medium text-slate-300">Left Column (Main Content)</h4>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Width</label>
              <input
                type="range"
                min="50"
                max="80"
                value={layout.leftColumn.width}
                onChange={(e) => handleLayoutChange('leftColumn', {
                  ...layout.leftColumn,
                  width: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{layout.leftColumn.width}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
              <select
                value={layout.leftColumn.contentType}
                onChange={(e) => handleLayoutChange('leftColumn', {
                  ...layout.leftColumn,
                  contentType: e.target.value
                })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rss">RSS Feed</option>
                <option value="rssSlideshow">RSS Slideshow with QR</option>
                <option value="slideshow">Image Slideshow</option>
                <option value="youtube">YouTube Video</option>
                <option value="content">Custom Content</option>
                <option value="widget">Widget Code</option>
              </select>
            </div>

            {layout.leftColumn.contentType === 'rss' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-300">RSS Feed</label>
                  <button 
                    onClick={() => setShowAddCustomRss(true)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlusCircle} className="inline mr-1" />
                    Add Custom Feed
                  </button>
                </div>
                <select
                  value={layout.leftColumn.rssUrl}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      handleLayoutChange('leftColumn', {
                        ...layout.leftColumn,
                        rssUrl: layout.leftColumn.customRssUrl || ''
                      });
                    } else {
                      handleLayoutChange('leftColumn', {
                        ...layout.leftColumn,
                        rssUrl: e.target.value
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select RSS Feed</option>
                  {availableFeeds.map(feed => (
                    feed.isHeader ? (
                      <option key={feed.id} disabled>------ {feed.name} ------</option>
                    ) : (
                      <option key={feed.id} value={feed.url}>
                        {feed.name} {feed.isCustom ? '(Custom)' : ''}
                      </option>
                    )
                  ))}
                </select>
                
                {layout.leftColumn.rssUrl && !availableFeeds.some(f => f.url === layout.leftColumn.rssUrl) && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Custom RSS URL</label>
                    <input
                      type="text"
                      value={layout.leftColumn.customRssUrl}
                      onChange={(e) => handleLayoutChange('leftColumn', {
                        ...layout.leftColumn,
                        customRssUrl: e.target.value
                      })}
                      placeholder="https://example.com/feed.xml"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {layout.leftColumn.contentType === 'rssSlideshow' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-300">RSS Feed</label>
                  <button 
                    onClick={() => setShowAddCustomRss(true)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlusCircle} className="inline mr-1" />
                    Add Custom Feed
                  </button>
                </div>
                <select
                  value={layout.leftColumn.rssUrl}
                  onChange={(e) => handleLayoutChange('leftColumn', {
                    ...layout.leftColumn,
                    rssUrl: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select RSS Feed</option>
                  {availableFeeds.map(feed => (
                    feed.isHeader ? (
                      <option key={feed.id} disabled>------ {feed.name} ------</option>
                    ) : (
                      <option key={feed.id} value={feed.url}>
                        {feed.name} {feed.isCustom ? '(Custom)' : ''}
                      </option>
                    )
                  ))}
                </select>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Show QR Code</label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={layout.leftColumn.contentOptions?.showQrCode} 
                        onChange={(e) => handleLayoutChange('leftColumn', {
                          ...layout.leftColumn,
                          contentOptions: {
                            ...layout.leftColumn.contentOptions,
                            showQrCode: e.target.checked
                          }
                        })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="ml-3 text-sm font-medium text-slate-300">Enable QR code links</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Transition Time (seconds)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={layout.leftColumn.contentOptions?.transitionTime || 10}
                    onChange={(e) => handleLayoutChange('leftColumn', {
                      ...layout.leftColumn,
                      contentOptions: {
                        ...layout.leftColumn.contentOptions,
                        transitionTime: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">
                    {layout.leftColumn.contentOptions?.transitionTime || 10} seconds
                  </span>
                </div>
              </div>
            )}

            {layout.leftColumn.contentType === 'slideshow' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Add Images to Slideshow</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={youtubeUrl} // Reusing this state for image URL
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        handleAddImage(youtubeUrl);
                        setYoutubeUrl('');
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Images in Slideshow ({customImages.length})
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {customImages.length > 0 ? (
                      customImages.map((img, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-700 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-600 rounded-md overflow-hidden">
                              <img 
                                src={img} 
                                alt={`Slideshow ${index}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/80?text=Error";
                                }}
                              />
                            </div>
                            <span className="text-xs text-slate-300 truncate w-40">
                              {img.substring(0, 30)}...
                            </span>
                          </div>
                          <button
                            onClick={() => removeCustomImage(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 text-center py-2">
                        No images added yet
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Transition Time (seconds)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={layout.leftColumn.contentOptions?.transitionTime || 10}
                    onChange={(e) => handleLayoutChange('leftColumn', {
                      ...layout.leftColumn,
                      contentOptions: {
                        ...layout.leftColumn.contentOptions,
                        transitionTime: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">
                    {layout.leftColumn.contentOptions?.transitionTime || 10} seconds
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Auto Play</label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={layout.leftColumn.contentOptions?.autoPlay} 
                        onChange={(e) => handleLayoutChange('leftColumn', {
                          ...layout.leftColumn,
                          contentOptions: {
                            ...layout.leftColumn.contentOptions,
                            autoPlay: e.target.checked
                          }
                        })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="ml-3 text-sm font-medium text-slate-300">Auto advance slides</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleLayoutChange('leftColumn', {
                    ...layout.leftColumn,
                    images: customImages
                  })}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} className="inline mr-2" />
                  Save Slideshow
                </button>
              </div>
            )}

            {layout.leftColumn.contentType === 'youtube' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">YouTube Video URL</label>
                <input
                  type="text"
                  value={layout.leftColumn.youtubeUrl || ''}
                  onChange={(e) => handleLayoutChange('leftColumn', {
                    ...layout.leftColumn,
                    youtubeUrl: e.target.value
                  })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Paste the full YouTube video URL
                </p>
              </div>
            )}

            {layout.leftColumn.contentType === 'widget' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Widget Embed Code</label>
                <textarea
                  value={layout.leftColumn.widgetCode || ''}
                  onChange={(e) => handleLayoutChange('leftColumn', {
                    ...layout.leftColumn,
                    widgetCode: e.target.value
                  })}
                  placeholder="<iframe src=... />"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                ></textarea>
                <p className="text-xs text-slate-400 mt-1">
                  Paste iframe or widget embed code
                </p>
              </div>
            )}

            {layout.leftColumn.contentType === 'content' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Content</label>
                <select
                  value={layout.leftColumn.content?.id || ''}
                  onChange={(e) => {
                    const content = state.content.find(c => c.id === e.target.value);
                    handleLayoutChange('leftColumn', {
                      ...layout.leftColumn,
                      content
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Content</option>
                  {state.content.map(content => (
                    <option key={content.id} value={content.id}>{content.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right Column Settings */}
          <div className="space-y-4 mb-6">
            <h4 className="text-md font-medium text-slate-300">Right Column (Sidebar)</h4>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Sections</label>
              <select
                value={layout.rightColumn.sections}
                onChange={(e) => {
                  const sections = parseInt(e.target.value);
                  handleLayoutChange('rightColumn', {
                    ...layout.rightColumn,
                    sections,
                    content: Array(sections).fill(null).map((_, i) => layout.rightColumn.content[i] || {})
                  });
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>2 Sections</option>
                <option value={3}>3 Sections</option>
              </select>
            </div>

            {Array(layout.rightColumn.sections).fill(null).map((_, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-white mb-3">Section {index + 1}</h5>
                <div className="space-y-2">
                  <select
                    value={layout.rightColumn.content[index]?.type || ''}
                    onChange={(e) => handleRightColumnSectionChange(index, 'type', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="content">Content Item</option>
                    <option value="rss">RSS Feed</option>
                    <option value="rssSlideshow">RSS Slideshow with QR</option>
                    <option value="slideshow">Image Slideshow</option>
                    <option value="youtube">YouTube Video</option>
                    <option value="weather">Weather Widget</option>
                    <option value="clock">Clock Widget</option>
                    <option value="widget">Custom Widget</option>
                  </select>

                  {layout.rightColumn.content[index]?.type === 'content' && (
                    <select
                      value={layout.rightColumn.content[index]?.selectedContent?.id || ''}
                      onChange={(e) => addContentToSection(index, e.target.value)}
                      className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    >
                      <option value="">Select Content</option>
                      {state.content.map(content => (
                        <option key={content.id} value={content.id}>{content.name}</option>
                      ))}
                    </select>
                  )}

                  {layout.rightColumn.content[index]?.type === 'rss' && (
                    <select
                      value={layout.rightColumn.content[index]?.rssUrl || ''}
                      onChange={(e) => handleRightColumnSectionChange(index, 'rssUrl', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    >
                      <option value="">Select RSS Feed</option>
                      {availableFeeds.map(feed => (
                        feed.isHeader ? (
                          <option key={feed.id} disabled>------ {feed.name} ------</option>
                        ) : (
                          <option key={feed.id} value={feed.url}>
                            {feed.name} {feed.isCustom ? '(Custom)' : ''}
                          </option>
                        )
                      ))}
                    </select>
                  )}

                  {layout.rightColumn.content[index]?.type === 'rssSlideshow' && (
                    <div className="space-y-2">
                      <select
                        value={layout.rightColumn.content[index]?.rssUrl || ''}
                        onChange={(e) => handleRightColumnSectionChange(index, 'rssUrl', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                      >
                        <option value="">Select RSS Feed</option>
                        {availableFeeds.map(feed => (
                          !feed.isHeader && (
                            <option key={feed.id} value={feed.url}>
                              {feed.name} {feed.isCustom ? '(Custom)' : ''}
                            </option>
                          )
                        ))}
                      </select>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`qrcode-${index}`}
                          checked={layout.rightColumn.content[index]?.showQrCode || false}
                          onChange={(e) => handleRightColumnSectionChange(index, 'showQrCode', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`qrcode-${index}`} className="text-xs text-slate-300">
                          Show QR code
                        </label>
                      </div>
                    </div>
                  )}

                  {layout.rightColumn.content[index]?.type === 'slideshow' && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={youtubeUrl} // Reusing for image URL
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                        />
                        <button
                          onClick={() => {
                            if (youtubeUrl) {
                              const currentImages = layout.rightColumn.content[index]?.images || [];
                              handleRightColumnSectionChange(index, 'images', [...currentImages, youtubeUrl]);
                              setYoutubeUrl('');
                            }
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded"
                        >
                          <SafeIcon icon={FiPlus} className="text-xs" />
                        </button>
                      </div>
                      
                      <div className="max-h-24 overflow-y-auto">
                        {layout.rightColumn.content[index]?.images && layout.rightColumn.content[index].images.length > 0 ? (
                          <div className="space-y-1">
                            {layout.rightColumn.content[index].images.map((img, imgIndex) => (
                              <div key={imgIndex} className="flex justify-between items-center text-xs text-slate-300">
                                <span className="truncate w-32">{img.substring(0, 20)}...</span>
                                <button
                                  onClick={() => {
                                    const newImages = layout.rightColumn.content[index].images.filter((_, i) => i !== imgIndex);
                                    handleRightColumnSectionChange(index, 'images', newImages);
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <SafeIcon icon={FiTrash2} className="text-xs" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 text-center py-1">
                            No images added
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {layout.rightColumn.content[index]?.type === 'youtube' && (
                    <input
                      type="text"
                      placeholder="YouTube URL"
                      value={layout.rightColumn.content[index]?.youtubeUrl || ''}
                      onChange={(e) => handleRightColumnSectionChange(index, 'youtubeUrl', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                  )}

                  {layout.rightColumn.content[index]?.type === 'widget' && (
                    <textarea
                      placeholder="Widget embed code"
                      value={layout.rightColumn.content[index]?.widgetCode || ''}
                      onChange={(e) => handleRightColumnSectionChange(index, 'widgetCode', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm h-20"
                    ></textarea>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-slate-300">Breaking News Bar</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={layout.bottomBar.enabled}
                  onChange={(e) => handleLayoutChange('bottomBar', {
                    ...layout.bottomBar,
                    enabled: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {layout.bottomBar.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Height</label>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={layout.bottomBar.height}
                    onChange={(e) => handleLayoutChange('bottomBar', {
                      ...layout.bottomBar,
                      height: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">{layout.bottomBar.height}px</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-300">RSS Feed</label>
                    <button 
                      onClick={() => setShowAddCustomRss(true)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlusCircle} className="inline mr-1" />
                      Add Custom Feed
                    </button>
                  </div>
                  <select
                    value={layout.bottomBar.rssUrl}
                    onChange={(e) => handleLayoutChange('bottomBar', {
                      ...layout.bottomBar,
                      rssUrl: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select RSS Feed</option>
                    {availableFeeds.map(feed => (
                      feed.isHeader ? (
                        <option key={feed.id} disabled>------ {feed.name} ------</option>
                      ) : (
                        <option key={feed.id} value={feed.url}>
                          {feed.name} {feed.isCustom ? '(Custom)' : ''}
                        </option>
                      )
                    ))}
                  </select>
                  
                  {layout.bottomBar.rssUrl && !availableFeeds.some(f => f.url === layout.bottomBar.rssUrl) && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Custom RSS URL</label>
                      <input
                        type="text"
                        value={layout.bottomBar.customRssUrl}
                        onChange={(e) => handleLayoutChange('bottomBar', {
                          ...layout.bottomBar,
                          customRssUrl: e.target.value
                        })}
                        placeholder="https://example.com/feed.xml"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Scroll Speed</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={layout.bottomBar.scrollSpeed}
                    onChange={(e) => handleLayoutChange('bottomBar', {
                      ...layout.bottomBar,
                      scrollSpeed: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">{layout.bottomBar.scrollSpeed}px/s</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Style Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Style Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Background Color</label>
              <input
                type="color"
                value={layout.backgroundColor}
                onChange={(e) => setLayout(prev => ({
                  ...prev,
                  backgroundColor: e.target.value
                }))}
                className="w-full h-10 rounded border border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
              <input
                type="color"
                value={layout.textColor}
                onChange={(e) => setLayout(prev => ({
                  ...prev,
                  textColor: e.target.value
                }))}
                className="w-full h-10 rounded border border-slate-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <SafeIcon icon={FiMonitor} className="text-blue-400" />
              Live Preview
            </h3>
            <div className="text-sm text-slate-400">
              {screen?.resolution} • {screen?.orientation}
            </div>
          </div>
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <LayoutPreview layout={layout} content={state.content} />
          </div>
        </div>
      </div>
    </div>
  );

  // Add Custom RSS Feed Modal
  const renderCustomRssModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Add Custom RSS Feed</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Feed Name</label>
            <input
              type="text"
              value={newCustomRss.name}
              onChange={(e) => setNewCustomRss({ ...newCustomRss, name: e.target.value })}
              placeholder="e.g., Company Blog"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Feed URL</label>
            <input
              type="text"
              value={newCustomRss.url}
              onChange={(e) => setNewCustomRss({ ...newCustomRss, url: e.target.value })}
              placeholder="https://example.com/rss.xml"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={addCustomRss}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Feed
            </button>
            <button
              onClick={() => setShowAddCustomRss(false)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!screen) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-xl text-white mb-2">Screen not found</div>
          <button
            onClick={() => navigate('/screens')}
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Screens
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/screens')}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Designer: {screen.name}</h1>
            <p className="text-slate-400">Create custom layouts for your digital display</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <SafeIcon icon={FiEye} />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          <button
            onClick={handleSaveLayout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <SafeIcon icon={FiSave} />
            Save Layout
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <LayoutPreview layout={layout} content={state.content} fullscreen />
        </div>
      ) : (
        renderDesigner()
      )}

      {showAddCustomRss && renderCustomRssModal()}
    </motion.div>
  );
}

// Layout Preview Component
function LayoutPreview({ layout, content, fullscreen = false }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newsItems] = useState([
    "Breaking: Technology stocks surge in early trading",
    "Weather Alert: Heavy rain expected this afternoon",
    "Sports Update: Local team advances to finals",
    "Traffic Advisory: Main street construction begins Monday"
  ]);
  const [currentRssIndex, setCurrentRssIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // For slideshow transitions
  useEffect(() => {
    if (layout.leftColumn.contentType === 'slideshow' || layout.leftColumn.contentType === 'rssSlideshow') {
      const transitionTime = layout.leftColumn.contentOptions?.transitionTime || 10;
      const interval = setInterval(() => {
        if (layout.leftColumn.contentType === 'slideshow') {
          const images = layout.leftColumn.images || [];
          if (images.length > 0) {
            setSlideIndex(prev => (prev + 1) % images.length);
          }
        } else if (layout.leftColumn.contentType === 'rssSlideshow') {
          setCurrentRssIndex(prev => prev + 1);
        }
      }, transitionTime * 1000);
      
      return () => clearInterval(interval);
    }
  }, [layout.leftColumn]);

  const renderLeftColumn = () => {
    const { leftColumn } = layout;

    if (leftColumn.contentType === 'rss') {
      return (
        <div className="h-full p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiRss} className="text-blue-400" />
            <h2 className="text-xl font-bold" style={{ color: layout.textColor }}>Latest News</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="border-b border-gray-600 pb-3">
                <h3 className="font-semibold mb-2" style={{ color: layout.textColor }}>
                  Sample News Headline {i}
                </h3>
                <p className="text-sm opacity-80" style={{ color: layout.textColor }}>
                  This is a sample news article description that would come from the RSS feed...
                </p>
                <div className="text-xs opacity-60 mt-2" style={{ color: layout.textColor }}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (leftColumn.contentType === 'rssSlideshow') {
      return (
        <div className="h-full relative bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
          
          {/* Background image */}
          <div className="absolute inset-0 bg-center bg-cover" 
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop')`,
                opacity: 0.7
              }}></div>
          
          <div className="absolute inset-x-0 bottom-0 p-6 z-20">
            <div className="flex items-start justify-between">
              <div className="w-2/3">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Breaking News Headline {currentRssIndex % 5 + 1}
                </h2>
                <p className="text-white/80">
                  This would be the content from your RSS feed displayed in a slideshow format with image backgrounds.
                </p>
              </div>
              
              {leftColumn.contentOptions?.showQrCode && (
                <div className="w-24 h-24 bg-white p-1 rounded">
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <div className="text-xs text-center text-black">QR Code</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex mt-4 gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i === (currentRssIndex % 5) ? 'bg-white' : 'bg-white/30'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (leftColumn.contentType === 'slideshow' && leftColumn.images && leftColumn.images.length > 0) {
      const currentImage = leftColumn.images[slideIndex % leftColumn.images.length];
      return (
        <div className="h-full flex items-center justify-center relative bg-slate-900">
          <img 
            src={currentImage} 
            alt={`Slide ${slideIndex}`} 
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x600?text=Image+Error";
            }}
          />
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {leftColumn.images.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === (slideIndex % leftColumn.images.length) ? 'bg-white' : 'bg-white/30'}`}
              ></div>
            ))}
          </div>
        </div>
      );
    }

    if (leftColumn.contentType === 'youtube' && leftColumn.youtubeUrl) {
      return (
        <div className="h-full flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <SafeIcon icon={FiYoutube} className="text-red-500 text-5xl mb-3 mx-auto" />
            <p className="font-bold mb-2">YouTube Video</p>
            <p className="text-sm opacity-80">{leftColumn.youtubeUrl}</p>
            <p className="text-xs mt-4 opacity-60">(YouTube embed would display here)</p>
          </div>
        </div>
      );
    }

    if (leftColumn.contentType === 'widget' && leftColumn.widgetCode) {
      return (
        <div className="h-full flex items-center justify-center bg-slate-800">
          <div className="text-center text-white">
            <SafeIcon icon={FiCode} className="text-blue-400 text-5xl mb-3 mx-auto" />
            <p className="font-bold mb-2">Custom Widget</p>
            <p className="text-xs mt-4 opacity-60 max-w-xs mx-auto">
              (Widget with code: {leftColumn.widgetCode.substring(0, 50)}...)
            </p>
          </div>
        </div>
      );
    }

    if (leftColumn.contentType === 'content' && leftColumn.content) {
      const selectedContent = leftColumn.content;
      return (
        <div className="h-full flex items-center justify-center">
          {selectedContent.type === 'image' ? (
            <img
              src={selectedContent.thumbnail}
              alt={selectedContent.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: layout.textColor }}>
                {selectedContent.name}
              </h2>
              <p style={{ color: layout.textColor }}>
                {selectedContent.type} content
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center opacity-50">
          <SafeIcon icon={FiPlus} className="text-4xl mb-2 mx-auto" style={{ color: layout.textColor }} />
          <p style={{ color: layout.textColor }}>Select content for main area</p>
        </div>
      </div>
    );
  };

  const renderRightSection = (sectionData, index) => {
    if (!sectionData) {
      return (
        <div className="h-full flex items-center justify-center border border-gray-600 rounded">
          <div className="text-center opacity-50">
            <SafeIcon icon={FiPlus} className="text-xl mb-1 mx-auto" style={{ color: layout.textColor }} />
            <p className="text-xs" style={{ color: layout.textColor }}>Section {index + 1}</p>
          </div>
        </div>
      );
    }

    if (sectionData.type === 'content' && sectionData.selectedContent) {
      return (
        <div className="h-full border border-gray-600 rounded p-2">
          <h4 className="text-sm font-semibold mb-2" style={{ color: layout.textColor }}>
            {sectionData.selectedContent.name}
          </h4>
          {sectionData.selectedContent.type === 'image' && (
            <img
              src={sectionData.selectedContent.thumbnail}
              alt={sectionData.selectedContent.name}
              className="w-full h-20 object-cover rounded"
            />
          )}
        </div>
      );
    }

    if (sectionData.type === 'rss') {
      return (
        <div className="h-full border border-gray-600 rounded p-2">
          <div className="flex items-center gap-1 mb-2">
            <SafeIcon icon={FiRss} className="text-xs text-blue-400" />
            <h4 className="text-xs font-semibold" style={{ color: layout.textColor }}>News</h4>
          </div>
          <div className="space-y-1">
            {[1, 2].map(i => (
              <div key={i} className="text-xs opacity-80" style={{ color: layout.textColor }}>
                Sample headline {i}...
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionData.type === 'rssSlideshow') {
      return (
        <div className="h-full border border-gray-600 rounded overflow-hidden relative bg-slate-800">
          <div className="absolute inset-0 bg-center bg-cover opacity-50" 
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&h=200&fit=crop')`
              }}>
          </div>
          <div className="absolute inset-0 p-2 flex flex-col z-10">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white mb-1">RSS News Item</h4>
                <p className="text-xs text-white/80 line-clamp-2">
                  RSS news content with background image and QR code
                </p>
              </div>
              {sectionData.showQrCode && (
                <div className="w-12 h-12 bg-white p-1 rounded flex items-center justify-center">
                  <span className="text-[8px] text-black">QR</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (sectionData.type === 'slideshow') {
      return (
        <div className="h-full border border-gray-600 rounded overflow-hidden">
          {sectionData.images && sectionData.images.length > 0 ? (
            <img 
              src={sectionData.images[0]} 
              alt="Slideshow preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=Image+Preview";
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-700">
              <span className="text-xs text-slate-400">Image slideshow</span>
            </div>
          )}
        </div>
      );
    }

    if (sectionData.type === 'youtube') {
      return (
        <div className="h-full border border-gray-600 rounded p-2 bg-slate-700 flex flex-col justify-center">
          <div className="text-center">
            <SafeIcon icon={FiYoutube} className="text-red-500 text-xl mb-1 mx-auto" />
            <div className="text-xs opacity-80 text-white">YouTube Video</div>
          </div>
        </div>
      );
    }

    if (sectionData.type === 'widget') {
      return (
        <div className="h-full border border-gray-600 rounded p-2 flex flex-col justify-center bg-slate-700">
          <div className="text-center">
            <SafeIcon icon={FiCode} className="text-blue-400 text-sm mb-1 mx-auto" />
            <div className="text-xs opacity-80 text-white">Custom Widget</div>
          </div>
        </div>
      );
    }

    if (sectionData.type === 'weather') {
      return (
        <div className="h-full border border-gray-600 rounded p-2">
          <h4 className="text-xs font-semibold mb-2" style={{ color: layout.textColor }}>Weather</h4>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: layout.textColor }}>72°F</div>
            <div className="text-xs opacity-80" style={{ color: layout.textColor }}>Sunny</div>
          </div>
        </div>
      );
    }

    if (sectionData.type === 'clock') {
      return (
        <div className="h-full border border-gray-600 rounded p-2 flex flex-col justify-center">
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: layout.textColor }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs opacity-80" style={{ color: layout.textColor }}>
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      );
    }

    return renderRightSection(null, index);
  };

  const sectionHeight = layout.rightColumn.sections === 2 ? '50%' : '33.333%';

  return (
    <div
      className="w-full h-full relative"
      style={{ backgroundColor: layout.backgroundColor }}
    >
      {/* Main Content Area */}
      <div className="flex h-full">
        {/* Left Column */}
        <div style={{ width: `${layout.leftColumn.width}%` }} className="h-full">
          {layout.bottomBar.enabled ? (
            <div style={{ height: `calc(100% - ${layout.bottomBar.height}px)` }}>
              {renderLeftColumn()}
            </div>
          ) : (
            renderLeftColumn()
          )}
        </div>

        {/* Right Column */}
        <div style={{ width: `${100 - layout.leftColumn.width}%` }} className="h-full p-2">
          {layout.bottomBar.enabled ? (
            <div
              style={{ height: `calc(100% - ${layout.bottomBar.height}px)` }}
              className="flex flex-col gap-2"
            >
              {Array(layout.rightColumn.sections).fill(null).map((_, index) => (
                <div key={index} style={{ height: sectionHeight }}>
                  {renderRightSection(layout.rightColumn.content[index], index)}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 h-full">
              {Array(layout.rightColumn.sections).fill(null).map((_, index) => (
                <div key={index} style={{ height: sectionHeight }}>
                  {renderRightSection(layout.rightColumn.content[index], index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Breaking News Bar */}
      {layout.bottomBar.enabled && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-red-600 text-white flex items-center overflow-hidden"
          style={{ height: `${layout.bottomBar.height}px` }}
        >
          <div className="bg-red-700 px-4 h-full flex items-center">
            <span className="font-bold text-sm">BREAKING NEWS</span>
          </div>
          <div className="flex-1 h-full flex items-center">
            <motion.div
              className="whitespace-nowrap flex items-center gap-8"
              animate={{ x: [-100, -2000] }}
              transition={{
                duration: newsItems.join(' • ').length / layout.bottomBar.scrollSpeed,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              {newsItems.map((item, index) => (
                <span key={index} className="text-sm">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScreenDesigner;