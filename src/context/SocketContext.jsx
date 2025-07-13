import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApp } from './AppContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { updateScreen, updateAnalytics } = useApp();

  useEffect(() => {
    // Simulate WebSocket connection for real-time updates
    const mockSocket = {
      emit: (event, data) => {
        console.log('Socket emit:', event, data);
      },
      on: (event, callback) => {
        console.log('Socket listening for:', event);
      },
      disconnect: () => {
        console.log('Socket disconnected');
      }
    };

    setSocket(mockSocket);
    setIsConnected(true);

    // Simulate real-time screen status updates
    const statusInterval = setInterval(() => {
      const screens = ['1', '2', '3'];
      const randomScreen = screens[Math.floor(Math.random() * screens.length)];
      const statuses = ['online', 'offline', 'warning'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      updateScreen(randomScreen, {
        status: randomStatus,
        lastSeen: new Date().toISOString(),
        uptime: randomStatus === 'online' ? `${Math.floor(Math.random() * 100)}h ${Math.floor(Math.random() * 60)}m` : '0h 0m',
        temperature: randomStatus === 'online' ? `${Math.floor(Math.random() * 20) + 30}°C` : 'N/A'
      });
    }, 10000);

    return () => {
      clearInterval(statusInterval);
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, [updateScreen]);

  const value = {
    socket,
    isConnected,
    sendCommand: (screenId, command, data) => {
      if (socket) {
        socket.emit('screen-command', { screenId, command, data });
      }
    },
    sendContentUpdate: (screenId, contentId) => {
      if (socket) {
        socket.emit('content-update', { screenId, contentId });
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}