
import React from 'react';
import { usePermissions, PermissionAction, PermissionResource } from '@/hooks/usePermissions';
import { useQuery } from '@tanstack/react-query';
import { useDevMode } from '@/contexts/DevModeContext';
import { DEV_MODE_PERMISSIONS } from '@/config/permissions'; 

interface PermissionGateProps {
  resource: PermissionResource;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  resource,
  action,
  children,
  fallback = null,
}) => {
  const { checkPermission } = usePermissions();
  const { isDevMode, devRole } = useDevMode();

  const { data: hasPermission, isLoading } = useQuery({
    queryKey: ['permission', resource, action, isDevMode, devRole],
    queryFn: () => checkPermission(resource, action),
  });

  if (isLoading) return null;
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
