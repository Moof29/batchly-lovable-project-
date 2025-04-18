
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  devRole: UserRole;
  setDevRole: (role: UserRole) => void;
  resetDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType>({
  isDevMode: false,
  toggleDevMode: () => {},
  devRole: 'admin',
  setDevRole: () => {},
  resetDevMode: () => {}
});

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(true);
  const [devRole, setDevRole] = useState<UserRole>('admin');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedDevMode = localStorage.getItem('batchly-dev-mode');
      const savedDevRole = localStorage.getItem('batchly-dev-role') as UserRole | null;

      if (savedDevMode !== null) {
        setIsDevMode(savedDevMode === 'true');
      } else {
        localStorage.setItem('batchly-dev-mode', 'true');
      }
      
      if (savedDevRole && ['admin', 'sales_manager', 'warehouse_staff', 'delivery_driver', 'customer_service'].includes(savedDevRole)) {
        setDevRole(savedDevRole as UserRole);
      } else {
        localStorage.setItem('batchly-dev-role', 'admin');
      }
    } catch (error) {
      console.error("Error loading dev mode settings:", error);
      setIsDevMode(true);
      setDevRole('admin');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('batchly-dev-mode', isDevMode.toString());
      localStorage.setItem('batchly-dev-role', devRole);
      
      console.log(`[DevModeContext] Dev Mode: ${isDevMode}, Role: ${devRole}`);
      
      toast({
        title: 'Dev Mode ' + (isDevMode ? 'Activated' : 'Deactivated'),
        description: `Current role: ${devRole.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error("Error saving dev mode settings:", error);
    }
  }, [isDevMode, devRole]);

  const toggleDevMode = () => {
    setIsDevMode(prev => !prev);
  };

  const resetDevMode = () => {
    setIsDevMode(true);
    setDevRole('admin');
    localStorage.setItem('batchly-dev-mode', 'true');
    localStorage.setItem('batchly-dev-role', 'admin');
    navigate('/');
    toast({
      title: 'Dev Mode Reset',
      description: 'Dev mode has been reset to admin role',
    });
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode, devRole, setDevRole, resetDevMode }}>
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
