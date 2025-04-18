
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  devRole: UserRole;
  setDevRole: (role: UserRole) => void;
}

const DevModeContext = createContext<DevModeContextType>({
  isDevMode: false,
  toggleDevMode: () => {},
  devRole: 'admin',
  setDevRole: () => {}
});

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(true); // Default to true for easy testing
  const [devRole, setDevRole] = useState<UserRole>('admin');

  // Load dev mode settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedDevMode = localStorage.getItem('batchly-dev-mode');
      const savedDevRole = localStorage.getItem('batchly-dev-role') as UserRole | null;

      if (savedDevMode !== null) {
        setIsDevMode(savedDevMode === 'true');
      } else {
        // If not found in localStorage, default to true and save it
        localStorage.setItem('batchly-dev-mode', 'true');
      }
      
      if (savedDevRole && ['admin', 'sales_manager', 'warehouse_staff', 'delivery_driver', 'customer_service'].includes(savedDevRole)) {
        setDevRole(savedDevRole as UserRole);
      } else {
        // If not found or invalid, default to admin and save it
        localStorage.setItem('batchly-dev-role', 'admin');
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
    try {
      localStorage.setItem('batchly-dev-mode', isDevMode.toString());
      localStorage.setItem('batchly-dev-role', devRole);
      
      if (isDevMode) {
        console.log(`[DevModeContext] Dev Mode is ${isDevMode ? 'on' : 'off'}, role: ${devRole}`);
        
        toast({
          title: 'Dev Mode ' + (isDevMode ? 'Activated' : 'Deactivated'),
          description: `Current role: ${devRole.replace('_', ' ')}`,
        });
      }
    } catch (error) {
      console.error("Error saving dev mode settings:", error);
    }
  }, [isDevMode, devRole]);

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
