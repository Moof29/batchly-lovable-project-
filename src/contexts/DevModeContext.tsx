
import { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from '@/types/auth';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

const DevModeContext = createContext<DevModeContextType | null>(null);

const DEV_MODE_KEY = 'batchly-dev-mode';
const DEV_ROLE_KEY = 'batchly-dev-role';

export const DevModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDevMode, setIsDevMode] = useState(() => {
    const saved = localStorage.getItem(DEV_MODE_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(DEV_ROLE_KEY);
    return (saved as UserRole) || 'admin';
  });

  useEffect(() => {
    localStorage.setItem(DEV_MODE_KEY, JSON.stringify(isDevMode));
  }, [isDevMode]);

  useEffect(() => {
    localStorage.setItem(DEV_ROLE_KEY, currentRole);
  }, [currentRole]);

  const toggleDevMode = () => setIsDevMode(prev => !prev);

  return (
    <DevModeContext.Provider value={{ 
      isDevMode, 
      toggleDevMode, 
      currentRole, 
      setCurrentRole 
    }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};
