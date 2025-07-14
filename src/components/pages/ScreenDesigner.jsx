import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { parseRSSFeed, getYouTubeVideoId, validateYouTubeUrl } from '../../utils/rssParser';

const { FiSave, FiEye, FiArrowLeft, FiPlus, FiTrash2, FiSettings, FiRss, FiLayout, FiMonitor, FiYoutube, FiImage, FiCode, FiSliders, FiLink, FiPlusCircle, FiAlertCircle, FiCheck } = FiIcons;

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
      youtubeUrl: '',
      widgetCode: '',
      images: [],
      contentOptions: {
        showQrCode: true,
        transitionTime: 10,
        autoPlay: true
      }
    },
    rightColumn: {
      width: 30,
      sections: 2,
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
  const [imageUrl, setImageUrl] = useState('');

  const [availableFeeds] = useState([
    { id: 'malta', name: 'Malta Today', url: 'https://www.maltatoday.com.mt/rss' },
    { id: 'news', name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml' },
    { id: 'tech', name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { id: 'sport', name: 'ESPN', url: 'https://www.espn.com/espn/rss/news' }
  ]);

  useEffect(() => {
    const foundScreen = state.screens.find(s => s.id === screenId);
    if (foundScreen) {
      setScreen(foundScreen);
      if (foundScreen.layout) {
        setLayout(foundScreen.layout);
        if (foundScreen.layout.leftColumn.images) {
          setCustomImages(foundScreen.layout.leftColumn.images);
        }
        if (foundScreen.layout.leftColumn.youtubeUrl) {
          setYoutubeUrl(foundScreen.layout.leftColumn.youtubeUrl);
        }
        if (foundScreen.layout.leftColumn.widgetCode) {
          setWidgetCode(foundScreen.layout.leftColumn.widgetCode);
        }
      }
    }
  }, [screenId, state.screens]);

  const handleSaveLayout = () => {
    if (screen) {
      const validatedLayout = { ...layout };
      updateScreen(screen.id, { layout: validatedLayout });
      alert('Layout salvato con successo!');
      navigate('/screens');
    }
  };

  const handleLayoutChange = (field, value) => {
    setLayout(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeftColumnChange = (field, value) => {
    setLayout(prev => ({
      ...prev,
      leftColumn: {
        ...prev.leftColumn,
        [field]: value
      }
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

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      const newImages = [...customImages, imageUrl.trim()];
      setCustomImages(newImages);
      handleLeftColumnChange('images', newImages);
      setImageUrl('');
    }
  };

  const removeCustomImage = (index) => {
    const newImages = customImages.filter((_, i) => i !== index);
    setCustomImages(newImages);
    handleLeftColumnChange('images', newImages);
  };

  const handleYoutubeUrlChange = (url) => {
    setYoutubeUrl(url);
    handleLeftColumnChange('youtubeUrl', url);
  };

  const handleWidgetCodeChange = (code) => {
    setWidgetCode(code);
    handleLeftColumnChange('widgetCode', code);
  };

  if (!screen) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-xl text-white mb-2">Schermo non trovato</div>
          <button
            onClick={() => navigate('/screens')}
            className="text-blue-400 hover:text-blue-300"
          >
            Torna agli Schermi
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
            <p className="text-slate-400">Crea layout personalizzati per il tuo display digitale</p>
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
            {previewMode ? 'Esci Anteprima' : 'Anteprima'}
          </button>
          <button
            onClick={handleSaveLayout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <SafeIcon icon={FiSave} />
            Salva Layout
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-2xl mb-2">Anteprima Layout</div>
              <div className="text-sm opacity-60">L'anteprima mostrerà i feed RSS reali e i video YouTube</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controlli Layout */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <SafeIcon icon={FiLayout} className="text-blue-400" />
                Impostazioni Layout
              </h3>

              {/* Colonna Sinistra */}
              <div className="space-y-4 mb-6">
                <h4 className="text-md font-medium text-slate-300">Colonna Sinistra (Contenuto Principale)</h4>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Larghezza</label>
                  <input
                    type="range"
                    min="50"
                    max="80"
                    value={layout.leftColumn.width}
                    onChange={(e) => handleLeftColumnChange('width', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-400">{layout.leftColumn.width}%</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipo di Contenuto</label>
                  <select
                    value={layout.leftColumn.contentType}
                    onChange={(e) => handleLeftColumnChange('contentType', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rss">Feed RSS</option>
                    <option value="rssSlideshow">Slideshow RSS con QR</option>
                    <option value="slideshow">Slideshow Immagini</option>
                    <option value="youtube">Video YouTube</option>
                    <option value="content">Contenuto Personalizzato</option>
                    <option value="widget">Codice Widget</option>
                  </select>
                </div>

                {/* RSS Feed */}
                {layout.leftColumn.contentType === 'rss' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Feed RSS</label>
                    <select
                      value={layout.leftColumn.rssUrl}
                      onChange={(e) => handleLeftColumnChange('rssUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleziona Feed RSS</option>
                      {availableFeeds.map(feed => (
                        <option key={feed.id} value={feed.url}>
                          {feed.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Slideshow Immagini */}
                {layout.leftColumn.contentType === 'slideshow' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Aggiungi Immagini</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="URL Immagine"
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <button
                          onClick={handleAddImage}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Immagini nel Slideshow ({customImages.length})
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
                            Nessuna immagine aggiunta
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* YouTube */}
                {layout.leftColumn.contentType === 'youtube' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">URL Video YouTube</label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Widget Code */}
                {layout.leftColumn.contentType === 'widget' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Codice Widget</label>
                    <textarea
                      value={widgetCode}
                      onChange={(e) => handleWidgetCodeChange(e.target.value)}
                      placeholder='<iframe width="560" height="315" src="..." frameborder="0" allowfullscreen></iframe>'
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    />
                  </div>
                )}

                {/* Contenuto Personalizzato */}
                {layout.leftColumn.contentType === 'content' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Seleziona Contenuto</label>
                    <select
                      value={layout.leftColumn.content?.id || ''}
                      onChange={(e) => {
                        const content = state.content.find(c => c.id === e.target.value);
                        handleLeftColumnChange('content', content);
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleziona Contenuto</option>
                      {state.content.map(content => (
                        <option key={content.id} value={content.id}>{content.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Colonna Destra */}
              <div className="space-y-4 mb-6">
                <h4 className="text-md font-medium text-slate-300">Colonna Destra (Sidebar)</h4>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Numero di Sezioni</label>
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
                    <option value={2}>2 Sezioni</option>
                    <option value={3}>3 Sezioni</option>
                  </select>
                </div>

                {Array(layout.rightColumn.sections).fill(null).map((_, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-white mb-3">Sezione {index + 1}</h5>
                    <div className="space-y-2">
                      <select
                        value={layout.rightColumn.content[index]?.type || ''}
                        onChange={(e) => handleRightColumnSectionChange(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                      >
                        <option value="">Seleziona Tipo</option>
                        <option value="content">Elemento Contenuto</option>
                        <option value="rss">Feed RSS</option>
                        <option value="youtube">Video YouTube</option>
                        <option value="widget">Widget Personalizzato</option>
                      </select>

                      {layout.rightColumn.content[index]?.type === 'content' && (
                        <select
                          value={layout.rightColumn.content[index]?.selectedContent?.id || ''}
                          onChange={(e) => addContentToSection(index, e.target.value)}
                          className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                        >
                          <option value="">Seleziona Contenuto</option>
                          {state.content.map(content => (
                            <option key={content.id} value={content.id}>{content.name}</option>
                          ))}
                        </select>
                      )}

                      {layout.rightColumn.content[index]?.type === 'youtube' && (
                        <input
                          type="text"
                          placeholder="URL YouTube"
                          value={layout.rightColumn.content[index]?.youtubeUrl || ''}
                          onChange={(e) => handleRightColumnSectionChange(index, 'youtubeUrl', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                        />
                      )}

                      {layout.rightColumn.content[index]?.type === 'widget' && (
                        <textarea
                          placeholder="Codice widget"
                          value={layout.rightColumn.content[index]?.widgetCode || ''}
                          onChange={(e) => handleRightColumnSectionChange(index, 'widgetCode', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm h-20"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impostazioni Stile */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Impostazioni Stile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Colore Sfondo</label>
                  <input
                    type="color"
                    value={layout.backgroundColor}
                    onChange={(e) => setLayout(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-10 rounded border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Colore Testo</label>
                  <input
                    type="color"
                    value={layout.textColor}
                    onChange={(e) => setLayout(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-full h-10 rounded border border-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Anteprima Live */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <SafeIcon icon={FiMonitor} className="text-blue-400" />
                  Anteprima Live
                </h3>
                <div className="text-sm text-slate-400">
                  {screen?.resolution} • {screen?.orientation}
                </div>
              </div>
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-2">Anteprima Layout</div>
                    <div className="text-sm opacity-60">
                      Tipo: {layout.leftColumn.contentType} | 
                      Sezioni: {layout.rightColumn.sections} | 
                      Immagini: {customImages.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ScreenDesigner;