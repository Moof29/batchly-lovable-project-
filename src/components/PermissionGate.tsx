
import React, { useEffect, useState } from 'react';
import { usePermissions, PermissionAction, PermissionResource } from '@/hooks/usePermissions';
import { useDevMode } from '@/contexts/DevModeContext';

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
  const { checkPermission, checkDevModePermission } = usePermissions();
  const { isDevMode, devRole } = useDevMode();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  
  // Effect to check permissions
  useEffect(() => {
    let isMounted = true;
    
    const checkAccess = async () => {
      try {
        let permitted = false;
        
        if (isDevMode) {
          // Direct sync check for dev mode
          permitted = checkDevModePermission(resource, action);
          console.log(`[PermissionGate] Dev Mode: ${resource}.${action} = ${permitted} (role: ${devRole})`);
        } else {
          // Async check for normal mode
          permitted = await checkPermission(resource, action);
          console.log(`[PermissionGate] Normal Mode: ${resource}.${action} = ${permitted}`);
        }
        
        if (isMounted) {
          console.log(`[PermissionGate] ${resource}.${action} = ${permitted} (devMode: ${isDevMode}, role: ${devRole})`);
          setHasPermission(permitted);
        }
      } catch (error) {
        console.error('[PermissionGate] Error:', error);
        if (isMounted) {
          setHasPermission(false);
        }
      }
    };
    
    checkAccess();
    
    return () => {
      isMounted = false;
    };
  }, [resource, action, isDevMode, devRole, checkPermission, checkDevModePermission]);
  
  // Render based on permissions
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
