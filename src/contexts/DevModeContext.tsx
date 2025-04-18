
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/auth';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  devRole: UserRole;
  setDevRole: (role: UserRole) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [devRole, setDevRole] = useState<UserRole>('admin');

  // Load dev mode settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedDevMode = localStorage.getItem('batchly-dev-mode');
      const savedDevRole = localStorage.getItem('batchly-dev-role') as UserRole | null;

      if (savedDevMode) {
        setIsDevMode(savedDevMode === 'true');
      }
      
      if (savedDevRole && ['admin', 'sales_manager', 'warehouse_staff', 'delivery_driver', 'customer_service'].includes(savedDevRole)) {
        setDevRole(savedDevRole);
      }
    } catch (error) {
      console.error("Error loading dev mode settings:", error);
      // Reset to defaults if there's an error
      localStorage.setItem('batchly-dev-mode', 'true');
      localStorage.setItem('batchly-dev-role', 'admin');
      setIsDevMode(true);
      setDevRole('admin');
    }
  }, []);

  // Save dev mode settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('batchly-dev-mode', isDevMode.toString());
  }, [isDevMode]);

  useEffect(() => {
    localStorage.setItem('batchly-dev-role', devRole);
  }, [devRole]);

  const toggleDevMode = () => {
    setIsDevMode(prevState => !prevState);
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode, devRole, setDevRole }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = (): DevModeContextType => {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};
