
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDevMode } from '@/contexts/DevModeContext';
import { ROLE_HIERARCHY, UserRole } from '@/types/auth';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type PermissionResource = 
  | 'users' | 'customers' | 'vendors' | 'employees'
  | 'inventory' | 'items' | 'sales_orders' | 'purchase_orders'
  | 'invoices' | 'bills' | 'payments' | 'accounts'
  | 'time_tracking' | 'reports' | 'settings' | 'integrations';

// Simplified permission mapping for Dev Mode
const DEV_MODE_PERMISSIONS: Record<UserRole, Record<PermissionResource, PermissionAction[]>> = {
  admin: {
    // Admin has all permissions
    users: ['create', 'read', 'update', 'delete', 'manage'],
    customers: ['create', 'read', 'update', 'delete', 'manage'],
    vendors: ['create', 'read', 'update', 'delete', 'manage'],
    employees: ['create', 'read', 'update', 'delete', 'manage'],
    inventory: ['create', 'read', 'update', 'delete', 'manage'],
    items: ['create', 'read', 'update', 'delete', 'manage'],
    sales_orders: ['create', 'read', 'update', 'delete', 'manage'],
    purchase_orders: ['create', 'read', 'update', 'delete', 'manage'],
    invoices: ['create', 'read', 'update', 'delete', 'manage'],
    bills: ['create', 'read', 'update', 'delete', 'manage'],
    payments: ['create', 'read', 'update', 'delete', 'manage'],
    accounts: ['create', 'read', 'update', 'delete', 'manage'],
    time_tracking: ['create', 'read', 'update', 'delete', 'manage'],
    reports: ['create', 'read', 'update', 'delete', 'manage'],
    settings: ['create', 'read', 'update', 'delete', 'manage'],
    integrations: ['create', 'read', 'update', 'delete', 'manage']
  },
  sales_manager: {
    // Sales manager has limited permissions
    users: [],
    customers: ['create', 'read', 'update', 'manage'],
    vendors: ['read'],
    employees: ['read'],
    inventory: ['read'],
    items: ['read'],
    sales_orders: ['create', 'read', 'update', 'manage'],
    purchase_orders: ['read'],
    invoices: ['create', 'read', 'update', 'manage'],
    bills: ['read'],
    payments: ['create', 'read'],
    accounts: ['read'],
    time_tracking: ['read'],
    reports: ['read'],
    settings: [],
    integrations: []
  },
  warehouse_staff: {
    // Warehouse staff has inventory-focused permissions
    users: [],
    customers: ['read'],
    vendors: ['read'],
    employees: ['read'],
    inventory: ['create', 'read', 'update', 'manage'],
    items: ['create', 'read', 'update', 'manage'],
    sales_orders: ['read'],
    purchase_orders: ['create', 'read', 'update', 'manage'],
    invoices: ['read'],
    bills: ['read'],
    payments: [],
    accounts: [],
    time_tracking: ['create', 'read'],
    reports: ['read'],
    settings: [],
    integrations: []
  },
  delivery_driver: {
    // Delivery driver has delivery-focused permissions
    users: [],
    customers: ['read'],
    vendors: [],
    employees: [],
    inventory: [],
    items: ['read'],
    sales_orders: ['read', 'update'],
    purchase_orders: [],
    invoices: ['read'],
    bills: [],
    payments: [],
    accounts: [],
    time_tracking: ['create', 'read'],
    reports: [],
    settings: [],
    integrations: []
  },
  customer_service: {
    // Customer service has customer-focused permissions
    users: [],
    customers: ['read', 'update'],
    vendors: [],
    employees: [],
    inventory: [],
    items: ['read'],
    sales_orders: ['read'],
    purchase_orders: [],
    invoices: ['read'],
    bills: [],
    payments: ['read'],
    accounts: [],
    time_tracking: [],
    reports: [],
    settings: [],
    integrations: []
  }
};

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
      if (!user) return false;

      // In dev mode, use the mock permissions instead of querying the database
      if (isDevMode) {
        const role = devRole;
        return DEV_MODE_PERMISSIONS[role][resource]?.includes(action) || false;
      }

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

        return data;
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
