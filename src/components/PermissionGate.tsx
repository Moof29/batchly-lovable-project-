
import React, { useEffect, useState } from 'react';
import { usePermissions, PermissionAction, PermissionResource } from '@/hooks/usePermissions';
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
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  
  // Effect to check permissions
  useEffect(() => {
    let isMounted = true;
    
    const checkAccess = async () => {
      try {
        let permitted = false;
        
        if (isDevMode) {
          // Direct sync check for dev mode
          permitted = DEV_MODE_PERMISSIONS[devRole]?.[resource]?.includes(action) || false;
          console.log(`Dev mode permission check: ${devRole}.${resource}.${action} = ${permitted}`);
        } else {
          // Async check for normal mode
          permitted = await checkPermission(resource, action);
          console.log(`Normal permission check: ${resource}.${action} = ${permitted}`);
        }
        
        if (isMounted) {
          setHasPermission(permitted);
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Permission check error:', error);
        if (isMounted) {
          setHasPermission(false);
          setIsChecking(false);
        }
      }
    };
    
    checkAccess();
    
    return () => {
      isMounted = false;
    };
  }, [resource, action, isDevMode, devRole, checkPermission]);
  
  // Render early while checking
  if (isChecking) {
    return null;
  }
  
  // Render based on permissions
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
