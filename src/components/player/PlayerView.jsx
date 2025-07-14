import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import QRCode from 'react-qr-code';
import { parseRSSFeed, getYouTubeEmbedUrl, getYouTubeVideoId } from '../../utils/rssParser';

const { FiRss, FiPlus, FiYoutube, FiCode } = FiIcons;

function PlayerView() {
  const { state } = useApp();
  const { socket } = useSocket();
  const [currentContent, setCurrentContent] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenId, setScreenId] = useState('1');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newsItems, setNewsItems] = useState([]);
  const [currentRssIndex, setCurrentRssIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [rssItems, setRssItems] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load screen information
  useEffect(() => {
    const screen = state.screens.find(s => s.id === screenId);
    if (screen) {
      const content = state.content.find(c => c.name === screen.currentContent);
      setCurrentContent(content);
    }
  }, [state.screens, state.content, screenId]);

  // Auto-enter fullscreen
  useEffect(() => {
    const enterFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    };
    const timer = setTimeout(enterFullscreen, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load RSS feeds when layout changes
  useEffect(() => {
    const screen = state.screens.find(s => s.id === screenId);
    if (screen && screen.layout) {
      const { layout } = screen;
      
      // Load main column RSS feed
      if (layout.leftColumn.rssUrl && 
          (layout.leftColumn.contentType === 'rss' || layout.leftColumn.contentType === 'rssSlideshow')) {
        loadRSSFeed(layout.leftColumn.rssUrl);
      }
      
      // Load bottom bar RSS feed
      if (layout.bottomBar.enabled && layout.bottomBar.rssUrl) {
        loadBottomBarRSS(layout.bottomBar.rssUrl);
      }
    }
  }, [state.screens, screenId]);

  const loadRSSFeed = async (url) => {
    try {
      const items = await parseRSSFeed(url);
      setRssItems(items);
    } catch (error) {
      console.error('Failed to load RSS feed:', error);
      setRssItems([{
        title: "RSS Feed Error",
        description: "Unable to load RSS feed. Please check the URL and try again.",
        link: "#",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop",
        pubDate: new Date().toISOString()
      }]);
    }
  };

  const loadBottomBarRSS = async (url) => {
    try {
      const items = await parseRSSFeed(url);
      setNewsItems(items.map(item => item.title));
    } catch (error) {
      console.error('Failed to load bottom bar RSS feed:', error);
      setNewsItems([
        "Breaking: Technology stocks surge in early trading",
        "Weather Alert: Heavy rain expected this afternoon",
        "Sports Update: Local team advances to finals",
        "Traffic Advisory: Main street construction begins Monday"
      ]);
    }
  };

  // For slideshow transitions
  useEffect(() => {
    const screen = state.screens.find(s => s.id === screenId);
    if (screen && screen.layout) {
      const { layout } = screen;

      // Transition for RSS slideshow
      if (layout.leftColumn.contentType === 'rssSlideshow' || 
          layout.leftColumn.contentType === 'slideshow') {
        const transitionTime = layout.leftColumn.contentOptions?.transitionTime || 10;
        
        const interval = setInterval(() => {
          if (layout.leftColumn.contentType === 'rssSlideshow') {
            setCurrentRssIndex(prev => (prev + 1) % Math.max(rssItems.length, 1));
          } else if (layout.leftColumn.contentType === 'slideshow') {
            const images = layout.leftColumn.images || [];
            if (images.length > 0) {
              setSlideIndex(prev => (prev + 1) % images.length);
            }
          }
        }, transitionTime * 1000);
        
        return () => clearInterval(interval);
      }
    }
  }, [state.screens, screenId, rssItems.length]);

  const renderCustomLayout = (screen) => {
    const { layout } = screen;
    if (!layout) return renderDefaultContent();

    const renderLeftColumn = () => {
      const { leftColumn } = layout;
      
      if (leftColumn.contentType === 'rss') {
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <SafeIcon icon={FiRss} className="text-blue-400 text-2xl" />
              <h2 className="text-3xl font-bold" style={{ color: layout.textColor }}>Latest News</h2>
            </div>
            <div className="space-y-6">
              {rssItems.map((item, index) => (
                <div key={index} className="border-b border-gray-600 pb-4">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: layout.textColor }}>
                    {item.title}
                  </h3>
                  <p className="text-base opacity-80 leading-relaxed" style={{ color: layout.textColor }}>
                    {item.description}
                  </p>
                  <div className="text-sm opacity-60 mt-3" style={{ color: layout.textColor }}>
                    {new Date(item.pubDate).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      if (leftColumn.contentType === 'rssSlideshow' && rssItems.length > 0) {
        const currentRssItem = rssItems[currentRssIndex % rssItems.length];
        return (
          <div className="h-full relative bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
            
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000" 
              style={{ 
                backgroundImage: `url('${currentRssItem.image}')`,
                opacity: 0.7
              }}
            ></div>
            
            <div className="absolute inset-x-0 bottom-0 p-6 z-20">
              <div className="flex items-start justify-between">
                <div className="w-2/3">
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {currentRssItem.title}
                  </h2>
                  <p className="text-white/80">
                    {currentRssItem.description}
                  </p>
                </div>
                
                {leftColumn.contentOptions?.showQrCode && (
                  <div className="w-32 h-32 bg-white p-2 rounded">
                    <QRCode
                      size={112}
                      value={currentRssItem.link}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex mt-4 gap-2">
                {rssItems.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i === (currentRssIndex % rssItems.length) ? 'bg-white' : 'bg-white/30'}`}
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
        const videoId = getYouTubeVideoId(leftColumn.youtubeUrl);
        
        if (videoId) {
          const embedUrl = getYouTubeEmbedUrl(videoId, {
            autoplay: '1',
            mute: '1',
            controls: '0',
            loop: '1',
            rel: '0'
          });
          
          return (
            <div className="h-full w-full">
              <iframe 
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          );
        }
        
        return (
          <div className="h-full flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <SafeIcon icon={FiYoutube} className="text-red-500 text-5xl mb-3 mx-auto" />
              <p className="font-bold mb-2">Invalid YouTube URL</p>
              <p className="text-sm opacity-80">{leftColumn.youtubeUrl}</p>
            </div>
          </div>
        );
      }

      if (leftColumn.contentType === 'widget' && leftColumn.widgetCode) {
        return (
          <div className="h-full w-full">
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: leftColumn.widgetCode }}
            />
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
                <h2 className="text-4xl font-bold mb-6" style={{ color: layout.textColor }}>
                  {selectedContent.name}
                </h2>
                <p className="text-xl" style={{ color: layout.textColor }}>
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
            <SafeIcon icon={FiPlus} className="text-6xl mb-4 mx-auto" style={{ color: layout.textColor }} />
            <p className="text-xl" style={{ color: layout.textColor }}>No content selected</p>
          </div>
        </div>
      );
    };

    const renderRightSection = (sectionData, index) => {
      if (!sectionData || !sectionData.type) {
        return (
          <div className="h-full flex items-center justify-center border border-gray-600 rounded-lg">
            <div className="text-center opacity-50">
              <SafeIcon icon={FiPlus} className="text-3xl mb-2 mx-auto" style={{ color: layout.textColor }} />
              <p className="text-sm" style={{ color: layout.textColor }}>Section {index + 1}</p>
            </div>
          </div>
        );
      }

      if (sectionData.type === 'youtube' && sectionData.youtubeUrl) {
        const videoId = getYouTubeVideoId(sectionData.youtubeUrl);
        
        if (videoId) {
          const embedUrl = getYouTubeEmbedUrl(videoId, {
            autoplay: '1',
            mute: '1',
            controls: '0',
            loop: '1',
            rel: '0'
          });
          
          return (
            <div className="h-full border border-gray-600 rounded-lg overflow-hidden">
              <iframe 
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          );
        }
      }

      if (sectionData.type === 'widget' && sectionData.widgetCode) {
        return (
          <div className="h-full border border-gray-600 rounded-lg overflow-hidden">
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: sectionData.widgetCode }}
            />
          </div>
        );
      }

      // Add other section types here...
      return (
        <div className="h-full border border-gray-600 rounded-lg p-2">
          <div className="text-center opacity-50">
            <p className="text-sm" style={{ color: layout.textColor }}>
              {sectionData.type} content
            </p>
          </div>
        </div>
      );
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
          <div style={{ width: `${100 - layout.leftColumn.width}%` }} className="h-full p-4">
            {layout.bottomBar.enabled ? (
              <div
                style={{ height: `calc(100% - ${layout.bottomBar.height}px)` }}
                className="flex flex-col gap-4"
              >
                {Array(layout.rightColumn.sections).fill(null).map((_, index) => (
                  <div key={index} style={{ height: sectionHeight }}>
                    {renderRightSection(layout.rightColumn.content[index], index)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 h-full">
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
        {layout.bottomBar.enabled && newsItems.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-red-600 text-white flex items-center overflow-hidden"
            style={{ height: `${layout.bottomBar.height}px` }}
          >
            <div className="bg-red-700 px-6 h-full flex items-center">
              <span className="font-bold text-lg">BREAKING NEWS</span>
            </div>
            <div className="flex-1 h-full flex items-center">
              <motion.div
                className="whitespace-nowrap flex items-center gap-12"
                animate={{ x: [-100, -2000] }}
                transition={{
                  duration: newsItems.join(' • ').length / layout.bottomBar.scrollSpeed,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                {newsItems.map((item, index) => (
                  <span key={index} className="text-base">
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDefaultContent = () => {
    if (!currentContent) {
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">Digital Signage</div>
            <div className="text-2xl text-blue-200">Waiting for content...</div>
          </div>
        </div>
      );
    }

    switch (currentContent.type) {
      case 'image':
        return (
          <motion.img
            key={currentContent.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={currentContent.url}
            alt={currentContent.name}
            className="w-full h-full object-cover"
          />
        );
      case 'video':
        return (
          <motion.video
            key={currentContent.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={currentContent.url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        );
      case 'webpage':
        return (
          <motion.iframe
            key={currentContent.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={currentContent.url}
            className="w-full h-full border-none"
            title={currentContent.name}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{currentContent.name}</div>
              <div className="text-xl text-gray-300">Content type not supported</div>
            </div>
          </div>
        );
    }
  };

  const screen = state.screens.find(s => s.id === screenId);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {screen?.layout ? renderCustomLayout(screen) : renderDefaultContent()}
      </AnimatePresence>

      {/* Status indicator (hidden in fullscreen) */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2 text-white text-sm">
          Screen ID: {screenId} | Status: Online
        </div>
      )}

      {/* Emergency exit (press ESC key) */}
      <div className="absolute bottom-4 left-4 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-black/50 rounded-lg p-2 text-white text-xs">
          Press ESC to exit fullscreen
        </div>
      </div>
    </div>
  );
}

export default PlayerView;