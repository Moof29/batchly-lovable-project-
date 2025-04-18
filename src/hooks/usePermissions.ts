
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type PermissionResource = 
  | 'users' | 'customers' | 'vendors' | 'employees'
  | 'inventory' | 'items' | 'sales_orders' | 'purchase_orders'
  | 'invoices' | 'bills' | 'payments' | 'accounts'
  | 'time_tracking' | 'reports' | 'settings' | 'integrations';

export const usePermissions = () => {
  const { user } = useAuth();

  const { data: rolePermissions } = useQuery({
    queryKey: ['rolePermissions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userPermissions } = useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const checkPermission = useCallback(
    async (resource: PermissionResource, action: PermissionAction): Promise<boolean> => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('user_has_permission', {
        p_user_id: user.id,
        p_resource: resource,
        p_action: action,
      });

      if (error) {
        console.error('Permission check error:', error);
        return false;
      }

      return data;
    },
    [user]
  );

  return {
    checkPermission,
    rolePermissions,
    userPermissions,
  };
};
