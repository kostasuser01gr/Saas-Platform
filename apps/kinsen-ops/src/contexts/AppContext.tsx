import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---

export type Role = 'admin' | 'manager' | 'staff' | 'washer';
export type Station = 'hq' | 'airport' | 'downtown';

interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

interface AppState {
  user: User;
  currentStation: Station;
  isKioskMode: boolean;
  notifications: number;
}

interface AppContextType extends AppState {
  setUser: (user: User) => void;
  setStation: (station: Station) => void;
  toggleKioskMode: () => void;
  hasPermission: (permission: string) => boolean;
}

// --- Mock Data ---

const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Morgan',
  role: 'admin',
  avatar: 'AM',
};

// --- Context ---

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [currentStation, setCurrentStation] = useState<Station>('hq');
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // RBAC Logic (Simplified)
  const hasPermission = (permission: string): boolean => {
    if (user.role === 'admin') return true;
    if (user.role === 'manager') return true; // Managers have most permissions
    if (user.role === 'washer' && permission.startsWith('washer:')) return true;
    if (user.role === 'staff' && !permission.includes('admin')) return true;
    return false;
  };

  const toggleKioskMode = () => setIsKioskMode(prev => !prev);
  const setStation = (s: Station) => setCurrentStation(s);

  return (
    <AppContext.Provider value={{
      user,
      currentStation,
      isKioskMode,
      notifications,
      setUser,
      setStation,
      toggleKioskMode,
      hasPermission
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
