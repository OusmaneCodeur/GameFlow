'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Event, LiveScore, Notification, Transaction,
  mockUser, mockEvents, mockLiveScores, mockNotifications, mockTransactions 
} from './data';
import { Language, t as translateText } from './i18n';

interface AppState {
  user: User | null;
  events: Event[];
  liveScores: LiveScore[];
  notifications: Notification[];
  transactions: Transaction[];
  language: Language;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  toggleFavorite: (eventId: string) => void;
  markNotificationRead: (id: string) => void;
  addPoints: (points: number) => void;
  updatePreferences: (preferences: User['preferences']) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    events: [],
    liveScores: [],
    notifications: [],
    transactions: [],
    language: 'fr',
    isAuthenticated: false,
    isLoading: true,
    isOffline: false,
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('gameflow_user');
      const savedLanguage = localStorage.getItem('gameflow_language') as Language | null;
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const languageFromUser = parsedUser?.preferences?.language as Language | undefined;

      setState(prev => ({
        ...prev,
        user: parsedUser,
        events: mockEvents,
        liveScores: mockLiveScores,
        notifications: mockNotifications,
        transactions: mockTransactions,
        language: savedLanguage || languageFromUser || 'fr',
        isAuthenticated: !!savedUser,
        isLoading: false,
      }));
    }, 500);

    // Check online status
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setState(prev => ({ ...prev, isOffline: !navigator.onLine }));

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate live score updates
  useEffect(() => {
    if (!state.isAuthenticated) return;
    
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        liveScores: prev.liveScores.map(score => {
          if (score.status === 'live') {
            const shouldUpdate = Math.random() > 0.7;
            if (shouldUpdate) {
              const team = Math.random() > 0.5 ? 'team1' : 'team2';
              return {
                ...score,
                [team]: {
                  ...score[team],
                  score: score[team].score + 1,
                },
              };
            }
          }
          return score;
        }),
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const user = { ...mockUser, email };
      localStorage.setItem('gameflow_user', JSON.stringify(user));
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('gameflow_user');
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }));
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && phone && password) {
      const user = { ...mockUser, name, email, phone, points: 100, badges: mockUser.badges.map(b => ({ ...b, earned: false })) };
      localStorage.setItem('gameflow_user', JSON.stringify(user));
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
      return true;
    }
    return false;
  };

  const toggleFavorite = (eventId: string) => {
    if (!state.user) return;
    
    const favorites = state.user.favorites.includes(eventId)
      ? state.user.favorites.filter(id => id !== eventId)
      : [...state.user.favorites, eventId];
    
    const updatedUser = { ...state.user, favorites };
    localStorage.setItem('gameflow_user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const addPoints = (points: number) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, points: state.user.points + points };
    localStorage.setItem('gameflow_user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  const updatePreferences = (preferences: User['preferences']) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, preferences };
    localStorage.setItem('gameflow_user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  const setLanguage = (lang: Language) => {
    localStorage.setItem('gameflow_language', lang);
    setState(prev => ({ ...prev, language: lang }));

    if (!state.user) return;
    updatePreferences({ ...state.user.preferences, language: lang });
  };

  const t = (key: string) => translateText(state.language, key);

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      toggleFavorite,
      markNotificationRead,
      addPoints,
      updatePreferences,
      setLanguage,
      t,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
