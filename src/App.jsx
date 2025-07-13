import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import ScreenManagement from './components/pages/ScreenManagement';
import ContentLibrary from './components/pages/ContentLibrary';
import Scheduling from './components/pages/Scheduling';
import Analytics from './components/pages/Analytics';
import Settings from './components/pages/Settings';
import ScreenDesigner from './components/pages/ScreenDesigner';
import PlayerView from './components/player/PlayerView';
import LoadingScreen from './components/common/LoadingScreen';

// Context
import { AppProvider } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';

// Styles
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('admin'); // 'admin' or 'player'

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Check if this is a player instance
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'player') {
      setCurrentView('player');
    }

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (currentView === 'player') {
    return (
      <AppProvider>
        <SocketProvider>
          <PlayerView />
        </SocketProvider>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <SocketProvider>
        <DndProvider backend={HTML5Backend}>
          <Router>
            <div className="app">
              <Sidebar />
              <div className="main-content">
                <Header />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={window.location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="page-container"
                  >
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/screens" element={<ScreenManagement />} />
                      <Route path="/screens/:screenId/design" element={<ScreenDesigner />} />
                      <Route path="/content" element={<ContentLibrary />} />
                      <Route path="/scheduling" element={<Scheduling />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Router>
        </DndProvider>
      </SocketProvider>
    </AppProvider>
  );
}

export default App;