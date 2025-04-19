import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { menuItems } from '@/config/menuItems';
import { MenuItem } from '@/types/navigation';
import { UserRole } from '@/types/auth';
import { ROLE_HIERARCHY } from '@/config/permissions';

export const useRoleBasedMenu = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDevMode, devRole } = useDevMode();

  const hasPermission = (requiredRoles: UserRole[], userRole: UserRole): boolean => {
    if (requiredRoles.length === 0) return true; // No permissions required
    return requiredRoles.some(role => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[role]);
  };

  const filteredMenuItems = useMemo(() => {
    // Function to filter menu items based on role
    const filterMenuItemsByRole = (items: MenuItem[], role?: UserRole): MenuItem[] => {
      if (!role) {
        // If no role (not authenticated and not in dev mode), only show auth item
        return items.filter(item => item.path === '/auth');
      }
      
      return items.filter(item => {
        // Check if the user has permission for this item
        const hasItemPermission = hasPermission(item.permissions, role);
        
        // If no permission, don't show this item
        if (!hasItemPermission) return false;
        
        // Filter children recursively
        const filteredChildren = item.children 
          ? filterMenuItemsByRole(item.children, role)
          : [];
          
        // Return the item with filtered children
        return {
          ...item,
          children: filteredChildren
        };
      });
    };
    
    // Use either dev role or user role depending on dev mode
    const effectiveRole = isDevMode 
      ? devRole 
      : isAuthenticated && user 
        ? user.role 
        : undefined;
        
    // Special case: if not authenticated and not in dev mode, show auth item
    if (!isAuthenticated && !isDevMode) {
      return menuItems.filter(item => item.path === '/auth');
    }
    
    // Otherwise filter based on role
    return filterMenuItemsByRole(menuItems, effectiveRole);
    
  }, [isAuthenticated, isDevMode, devRole, user]);

  return { filteredMenuItems };
};
