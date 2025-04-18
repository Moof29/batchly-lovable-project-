
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from './use-toast';

export const useDevAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { isDevMode, devRole } = useDevMode();

  useEffect(() => {
    console.log('useDevAuth effect running', { isDevMode, devRole });
    
    if (isDevMode) {
      console.log('Creating mock user with role:', devRole);
      
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
      
      console.log('Dev mode user created:', mockUser);
    } else {
      console.log('Dev mode disabled, clearing mock user');
      setUser(null);
    }
  }, [isDevMode, devRole]);

  console.log('useDevAuth return value:', { user, isDevMode });
  
  return {
    user,
    setUser,
    isDevMode
  };
};
