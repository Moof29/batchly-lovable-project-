
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthContextType, hasRolePermission } from '@/types/auth';
import { useDevMode } from './DevModeContext';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { isDevMode, devRole } = useDevMode();

  // Initialize user on component mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // When in development mode, use the devRole instead of getting from Supabase
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
          setLoading(false);
          return;
        }

        // Set up auth state listener for real authentication
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_OUT') {
              setUser(null);
            } else if (session?.user) {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching user profile:', error);
                return;
              }

              if (profile) {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  role: profile.role as UserRole,
                  avatar_url: profile.avatar_url,
                  organization_id: profile.organization_id
                });
              }
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: profile.first_name,
              last_name: profile.last_name,
              role: profile.role as UserRole,
              avatar_url: profile.avatar_url,
              organization_id: profile.organization_id
            });
          }
        }

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize user'));
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [isDevMode, devRole]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isDevMode) {
        const mockUser: User = {
          id: 'dev-user-id',
          email: email,
          first_name: 'Dev',
          last_name: 'User',
          role: devRole,
          organization_id: 'dev-org-id'
        };
        
        setUser(mockUser);
        toast({ title: 'Dev Mode Login', description: `Logged in as ${devRole}` });
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'customer_service') => {
    try {
      setLoading(true);
      
      if (isDevMode) {
        const mockUser: User = {
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
      setError(err instanceof Error ? err : new Error('Failed to sign up'));
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
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return hasRolePermission(user.role, requiredRole);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
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
