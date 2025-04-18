
import React, { createContext, useContext, useState } from 'react';
import { UserRole, AuthContextType, hasRolePermission } from '@/types/auth';
import { useDevMode } from '@/contexts/DevModeContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDevMode, devRole } = useDevMode();
  const [devUser, setDevUser] = useState<User | null>(null);
  const { user: supabaseUser, setUser: setSupabaseUser, loading: supabaseLoading, error } = useSupabaseAuth();
  const [methodsLoading, setMethodsLoading] = useState(false);
  
  // Create dev user when dev mode changes
  React.useEffect(() => {
    if (isDevMode) {
      console.log('[AuthContext] Creating mock user with role:', devRole);
      
      const mockUser: User = {
        id: 'dev-user-id',
        email: 'dev@example.com',
        first_name: 'Dev',
        last_name: 'User',
        role: devRole,
        organization_id: 'dev-org-id'
      };
      
      setDevUser(mockUser);
      
      toast({ 
        title: 'Dev Mode Active', 
        description: `Logged in as ${devRole.replace('_', ' ')}`,
        variant: 'default'
      });
    } else {
      console.log('[AuthContext] Dev mode disabled, clearing mock user');
      setDevUser(null);
    }
  }, [isDevMode, devRole]);
  
  const user = isDevMode ? devUser : supabaseUser;
  
  const login = async (email: string, password: string) => {
    try {
      setMethodsLoading(true);
      
      if (isDevMode) {
        return;
      }
      
      // Add Supabase login logic here
      
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setMethodsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'customer_service') => {
    try {
      setMethodsLoading(true);
      
      if (isDevMode) {
        const mockUser = {
          id: 'dev-user-id',
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: role,
          organization_id: 'dev-org-id'
        };
        
        setDevUser(mockUser);
        toast({ title: 'Dev Mode Signup', description: `Signed up as ${role}` });
        return;
      }
      
      // Add Supabase signup logic here
      
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setMethodsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setMethodsLoading(true);
      
      if (isDevMode) {
        setDevUser(null);
        toast({ title: 'Dev Mode Logout', description: 'Logged out successfully' });
        return;
      }
      
      // Add Supabase logout logic here
      
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    } finally {
      setMethodsLoading(false);
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return hasRolePermission(user.role, requiredRole);
  };

  const value: AuthContextType = {
    user,
    loading: supabaseLoading || methodsLoading,
    error,
    login,
    logout,
    signup,
    isAuthenticated: !!user || isDevMode,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
