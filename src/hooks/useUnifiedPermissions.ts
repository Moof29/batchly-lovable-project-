
import { usePermissions, PermissionAction, PermissionResource } from './usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { useCallback } from 'react';

export interface PermissionCheck {
  isLoading: boolean;
  hasPermission: boolean;
}

/**
 * Enhanced permission hook that provides unified permission checking for both
 * QBO and Customer Portal features while handling loading states
 */
export const useUnifiedPermissions = () => {
  const { checkPermission, checkDevModePermission } = usePermissions();
  const { user } = useAuth();
  const { isDevMode, devRole } = useDevMode();
  
  // Check a single permission with loading state
  const checkSinglePermission = useCallback(
    async (resource: PermissionResource, action: PermissionAction): Promise<PermissionCheck> => {
      if (!user && !isDevMode) {
        return { isLoading: false, hasPermission: false };
      }

      try {
        const permitted = isDevMode
          ? checkDevModePermission(resource, action)
          : await checkPermission(resource, action);

        return {
          isLoading: false,
          hasPermission: permitted
        };
      } catch (error) {
        console.error('Permission check error:', error);
        return {
          isLoading: false,
          hasPermission: false
        };
      }
    },
    [user, isDevMode, checkPermission, checkDevModePermission, devRole]
  );
  
  // Check if user has ALL of the specified permissions
  const checkAllPermissions = useCallback(
    async (permissions: Array<{ resource: PermissionResource; action: PermissionAction }>): Promise<PermissionCheck> => {
      if (!user && !isDevMode) {
        return { isLoading: false, hasPermission: false };
      }

      try {
        const results = await Promise.all(
          permissions.map(async ({ resource, action }) => {
            const permitted = isDevMode
              ? checkDevModePermission(resource, action)
              : await checkPermission(resource, action);
            return permitted;
          })
        );

        return {
          isLoading: false,
          hasPermission: results.every(Boolean)
        };
      } catch (error) {
        console.error('Multiple permissions check error:', error);
        return {
          isLoading: false,
          hasPermission: false
        };
      }
    },
    [user, isDevMode, checkPermission, checkDevModePermission, devRole]
  );
  
  // Check if user has ANY of the specified permissions
  const checkAnyPermission = useCallback(
    async (permissions: Array<{ resource: PermissionResource; action: PermissionAction }>): Promise<PermissionCheck> => {
      if (!user && !isDevMode) {
        return { isLoading: false, hasPermission: false };
      }

      try {
        const results = await Promise.all(
          permissions.map(async ({ resource, action }) => {
            const permitted = isDevMode
              ? checkDevModePermission(resource, action)
              : await checkPermission(resource, action);
            return permitted;
          })
        );

        return {
          isLoading: false,
          hasPermission: results.some(Boolean)
        };
      } catch (error) {
        console.error('Any permissions check error:', error);
        return {
          isLoading: false,
          hasPermission: false
        };
      }
    },
    [user, isDevMode, checkPermission, checkDevModePermission, devRole]
  );
  
  // Specialized permission checks for QBO features
  const qbo = {
    canManage: useCallback(
      () => checkSinglePermission('integrations', 'manage'),
      [checkSinglePermission]
    ),
    canView: useCallback(
      () => checkSinglePermission('integrations', 'read'),
      [checkSinglePermission]
    ),
    canSync: useCallback(
      () => checkSinglePermission('integrations', 'update'),
      [checkSinglePermission]
    ),
    canConfigure: useCallback(
      () => checkSinglePermission('settings', 'update'),
      [checkSinglePermission]
    )
  };
  
  // Specialized permission checks for Portal features
  const portal = {
    canManage: useCallback(
      () => checkSinglePermission('customers', 'manage'),
      [checkSinglePermission]
    ),
    canView: useCallback(
      () => checkSinglePermission('customers', 'read'),
      [checkSinglePermission]
    ),
    canCreate: useCallback(
      () => checkSinglePermission('customers', 'create'),
      [checkSinglePermission]
    ),
    canGrantAccess: useCallback(
      () => checkAllPermissions([
        { resource: 'customers', action: 'update' },
        { resource: 'settings', action: 'update' }
      ]),
      [checkAllPermissions]
    )
  };

  return {
    checkPermission: checkSinglePermission,
    checkAllPermissions,
    checkAnyPermission,
    qbo,
    portal
  };
};
