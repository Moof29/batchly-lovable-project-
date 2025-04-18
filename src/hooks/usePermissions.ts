
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDevMode } from '@/contexts/DevModeContext';
import { UserRole } from '@/types/auth';
import { DEV_MODE_PERMISSIONS } from '@/config/permissions';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type PermissionResource = 
  | 'users' | 'customers' | 'vendors' | 'employees'
  | 'inventory' | 'items' | 'sales_orders' | 'purchase_orders'
  | 'invoices' | 'bills' | 'payments' | 'accounts'
  | 'time_tracking' | 'reports' | 'settings' | 'integrations';

export const usePermissions = () => {
  const { user } = useAuth();
  const { isDevMode, devRole } = useDevMode();

  const { data: rolePermissions } = useQuery({
    queryKey: ['rolePermissions', user?.id],
    queryFn: async () => {
      // Skip database query in dev mode
      if (isDevMode) return [];
      
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !isDevMode,
  });

  const { data: userPermissions } = useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: async () => {
      // Skip database query in dev mode
      if (isDevMode) return [];
      
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !isDevMode,
  });

  const checkPermission = useCallback(
    async (resource: PermissionResource, action: PermissionAction): Promise<boolean> => {
      // If dev mode is active, use the mock permissions
      if (isDevMode) {
        return DEV_MODE_PERMISSIONS[devRole][resource]?.includes(action) || false;
      }
      
      // If no user, no permissions
      if (!user) return false;

      // For non-dev mode, use the database permission check
      try {
        const { data, error } = await supabase.rpc('user_has_permission', {
          p_user_id: user.id,
          p_resource: resource,
          p_action: action,
        });

        if (error) {
          console.error('Permission check error:', error);
          return false;
        }

        return !!data;
      } catch (error) {
        console.error('Permission check error:', error);
        return false;
      }
    },
    [user, isDevMode, devRole]
  );

  return {
    checkPermission,
    rolePermissions,
    userPermissions,
  };
};
