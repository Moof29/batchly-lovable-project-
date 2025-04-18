
import React, { createContext, useContext } from 'react';
import { UserRole, AuthContextType, hasRolePermission } from '@/types/auth';
import { useDevAuth } from '@/hooks/useDevAuth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useAuthMethods } from '@/hooks/useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: devUser, setUser: setDevUser, isDevMode } = useDevAuth();
  const { user: supabaseUser, setUser: setSupabaseUser, loading: supabaseLoading, error } = useSupabaseAuth();
  
  const user = isDevMode ? devUser : supabaseUser;
  const setUser = isDevMode ? setDevUser : setSupabaseUser;
  
  const { login, signup, logout, loading: methodsLoading } = useAuthMethods(setUser);

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
