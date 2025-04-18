
import React from 'react';
import { usePermissions, PermissionAction, PermissionResource } from '@/hooks/usePermissions';
import { useQuery } from '@tanstack/react-query';

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

  const { data: hasPermission, isLoading } = useQuery({
    queryKey: ['permission', resource, action],
    queryFn: () => checkPermission(resource, action),
  });

  if (isLoading) return null;
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
