
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';
import { useDevMode } from '@/contexts/DevModeContext';
import { UserRole } from '@/types/auth';
import { DEV_MODE_PERMISSIONS, PermissionAction, PermissionResource } from '@/config/permissions';

export type { PermissionAction, PermissionResource } from '@/config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const { isDevMode, devRole } = useDevMode();

  // Synchronous function for dev mode permissions check
  const checkDevModePermission = useCallback((resource: PermissionResource, action: PermissionAction): boolean => {
    if (!DEV_MODE_PERMISSIONS[devRole]) {
      console.warn(`No permissions defined for role: ${devRole}`);
      return false;
    }
    
    if (!DEV_MODE_PERMISSIONS[devRole][resource]) {
      console.warn(`No permissions defined for resource: ${resource} and role: ${devRole}`);
      return false;
    }
    
    const hasPermission = DEV_MODE_PERMISSIONS[devRole][resource].includes(action);
    console.log(`[DevMode] Permission check: ${devRole} - ${resource}.${action} = ${hasPermission}`);
    
    return hasPermission;
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
    [user, isDevMode, checkDevModePermission]
  );

  return {
    checkPermission,
    checkDevModePermission,
  };
};
