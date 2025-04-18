
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from './use-toast';

export const useDevAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { isDevMode, devRole } = useDevMode();

  useEffect(() => {
    // Clear existing timeouts to prevent multiple toasts
    const timeoutId = setTimeout(() => {
      if (isDevMode) {
        console.log('[useDevAuth] Creating mock user with role:', devRole);
        
        const mockUser: User = {
          id: 'dev-user-id',
          email: 'dev@example.com',
          first_name: 'Dev',
          last_name: 'User',
          role: devRole,
          organization_id: 'dev-org-id'
        };
        
        setUser(mockUser);
        
        toast({ 
          title: 'Dev Mode Active', 
          description: `Logged in as ${devRole.replace('_', ' ')}`,
          variant: 'default'
        });
      } else {
        console.log('[useDevAuth] Dev mode disabled, clearing mock user');
        setUser(null);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isDevMode, devRole]);

  return {
    user,
    setUser,
    isDevMode
  };
};
