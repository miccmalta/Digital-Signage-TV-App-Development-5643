import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  screens: [
    {
      id: '1',
      name: 'Main Lobby Display',
      location: 'Building A - Lobby',
      status: 'online',
      resolution: '1920x1080',
      orientation: 'landscape',
      lastSeen: new Date().toISOString(),
      currentContent: 'Welcome Presentation',
      ipAddress: '192.168.1.100',
      version: '1.2.3',
      uptime: '24h 15m',
      temperature: '42°C',
      storageUsed: '65%'
    },
    {
      id: '2',
      name: 'Conference Room A',
      location: 'Building A - Floor 2',
      status: 'offline',
      resolution: '1920x1080',
      orientation: 'landscape',
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      currentContent: 'None',
      ipAddress: '192.168.1.101',
      version: '1.2.3',
      uptime: '0h 0m',
      temperature: 'N/A',
      storageUsed: '45%'
    },
    {
      id: '3',
      name: 'Cafeteria Menu Board',
      location: 'Building B - Cafeteria',
      status: 'online',
      resolution: '1080x1920',
      orientation: 'portrait',
      lastSeen: new Date().toISOString(),
      currentContent: 'Daily Menu',
      ipAddress: '192.168.1.102',
      version: '1.2.3',
      uptime: '72h 30m',
      temperature: '38°C',
      storageUsed: '82%'
    }
  ],
  content: [
    {
      id: '1',
      name: 'Welcome Presentation',
      type: 'video',
      duration: 120,
      size: '45.2 MB',
      created: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      tags: ['welcome', 'intro']
    },
    {
      id: '2',
      name: 'Daily Menu',
      type: 'image',
      duration: 30,
      size: '2.1 MB',
      created: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop',
      tags: ['menu', 'food']
    },
    {
      id: '3',
      name: 'Company News',
      type: 'webpage',
      duration: 60,
      size: '0.5 MB',
      created: new Date().toISOString(),
      thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&h=200&fit=crop',
      url: 'https://example.com/news',
      tags: ['news', 'company']
    }
  ],
  schedules: [
    {
      id: '1',
      name: 'Main Lobby Schedule',
      screenId: '1',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timeSlots: [
        {
          id: '1',
          startTime: '09:00',
          endTime: '12:00',
          contentId: '1',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        {
          id: '2',
          startTime: '12:00',
          endTime: '13:00',
          contentId: '2',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      ]
    }
  ],
  analytics: {
    totalScreens: 3,
    onlineScreens: 2,
    totalContent: 3,
    totalSchedules: 1,
    weeklyStats: [
      { day: 'Mon', uptime: 98, content: 12 },
      { day: 'Tue', uptime: 95, content: 15 },
      { day: 'Wed', uptime: 100, content: 18 },
      { day: 'Thu', uptime: 97, content: 14 },
      { day: 'Fri', uptime: 99, content: 16 },
      { day: 'Sat', uptime: 100, content: 8 },
      { day: 'Sun', uptime: 100, content: 6 }
    ]
  },
  settings: {
    theme: 'dark',
    autoRefresh: true,
    notifications: true,
    defaultContentDuration: 30,
    maxFileSize: 100,
    allowedFormats: ['jpg', 'png', 'mp4', 'gif', 'html']
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SCREEN':
      return {
        ...state,
        screens: state.screens.map(screen =>
          screen.id === action.payload.id
            ? { ...screen, ...action.payload.updates }
            : screen
        )
      };
    
    case 'ADD_SCREEN':
      return {
        ...state,
        screens: [...state.screens, action.payload]
      };
    
    case 'DELETE_SCREEN':
      return {
        ...state,
        screens: state.screens.filter(screen => screen.id !== action.payload)
      };
    
    case 'ADD_CONTENT':
      return {
        ...state,
        content: [...state.content, action.payload]
      };
    
    case 'DELETE_CONTENT':
      return {
        ...state,
        content: state.content.filter(content => content.id !== action.payload)
      };
    
    case 'ADD_SCHEDULE':
      return {
        ...state,
        schedules: [...state.schedules, action.payload]
      };
    
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.id === action.payload.id
            ? { ...schedule, ...action.payload.updates }
            : schedule
        )
      };
    
    case 'DELETE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on mount
    const savedState = localStorage.getItem('signage-app-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Merge with initial state to ensure all required fields exist
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsedState } });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem('signage-app-state', JSON.stringify(state));
  }, [state]);

  const value = {
    state,
    dispatch,
    // Helper functions
    updateScreen: (id, updates) => dispatch({ type: 'UPDATE_SCREEN', payload: { id, updates } }),
    addScreen: (screen) => dispatch({ type: 'ADD_SCREEN', payload: screen }),
    deleteScreen: (id) => dispatch({ type: 'DELETE_SCREEN', payload: id }),
    addContent: (content) => dispatch({ type: 'ADD_CONTENT', payload: content }),
    deleteContent: (id) => dispatch({ type: 'DELETE_CONTENT', payload: id }),
    addSchedule: (schedule) => dispatch({ type: 'ADD_SCHEDULE', payload: schedule }),
    updateSchedule: (id, updates) => dispatch({ type: 'UPDATE_SCHEDULE', payload: { id, updates } }),
    deleteSchedule: (id) => dispatch({ type: 'DELETE_SCHEDULE', payload: id }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    updateAnalytics: (analytics) => dispatch({ type: 'UPDATE_ANALYTICS', payload: analytics })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}