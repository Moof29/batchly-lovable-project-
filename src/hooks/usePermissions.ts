
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

  // Only fetch permissions from database when not in dev mode and user is logged in
  const shouldFetchPermissions = !isDevMode && !!user;

  const { data: rolePermissions } = useQuery({
    queryKey: ['rolePermissions', user?.id, isDevMode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: shouldFetchPermissions,
  });

  const { data: userPermissions } = useQuery({
    queryKey: ['userPermissions', user?.id, isDevMode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: shouldFetchPermissions,
  });

  // Synchronous function for dev mode checks
  const checkDevModePermission = useCallback((resource: PermissionResource, action: PermissionAction): boolean => {
    return DEV_MODE_PERMISSIONS[devRole]?.[resource]?.includes(action) || false;
  }, [devRole]);

  const checkPermission = useCallback(
    async (resource: PermissionResource, action: PermissionAction): Promise<boolean> => {
      // If in dev mode, use the mock permissions
      if (isDevMode) {
        return checkDevModePermission(resource, action);
      }
      
      // If no user, no permissions
      if (!user) return false;

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
    [user, isDevMode, devRole, checkDevModePermission]
  );

  return {
    checkPermission,
    checkDevModePermission,
    rolePermissions,
    userPermissions,
  };
};
