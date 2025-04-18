
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { useDevMode } from '@/contexts/DevModeContext';
import { toast } from './use-toast';

export const useDevAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { isDevMode, devRole } = useDevMode();

  useEffect(() => {
    if (isDevMode) {
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
        description: `Logged in as ${devRole}`,
        variant: 'default'
      });
    } else {
      setUser(null);
    }
  }, [isDevMode, devRole]);

  return {
    user,
    setUser,
    isDevMode
  };
};
