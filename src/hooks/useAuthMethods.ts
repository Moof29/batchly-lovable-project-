
import { useState } from 'react';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';
import { useDevMode } from '@/contexts/DevModeContext';

export const useAuthMethods = (setUser: (user: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { isDevMode } = useDevMode();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isDevMode) {
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'customer_service') => {
    try {
      setLoading(true);
      
      if (isDevMode) {
        const mockUser = {
          id: 'dev-user-id',
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: role,
          organization_id: 'dev-org-id'
        };
        
        setUser(mockUser);
        toast({ title: 'Dev Mode Signup', description: `Signed up as ${role}` });
        return;
      }
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast({ title: 'Success', description: 'Account created successfully. Check your email for verification.' });
      }
      
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      if (isDevMode) {
        setUser(null);
        toast({ title: 'Dev Mode Logout', description: 'Logged out successfully' });
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    loading
  };
};
