
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { menuItems } from '@/config/menuItems';
import { MenuItem } from '@/types/navigation';
import { NavigationItem } from '@/components/navigation/NavigationItem';
import { useRoleBasedMenu } from '@/hooks/useRoleBasedMenu';
import { useLocation } from 'react-router-dom';

export function NavigationMenu() {
  const { user, isAuthenticated } = useAuth();
  const { isDevMode, devRole } = useDevMode();
  const { filteredMenuItems } = useRoleBasedMenu();
  const location = useLocation();

  const shouldShowMenuItem = (item: MenuItem): boolean => {
    // Check if item should be hidden in dev mode
    if (isDevMode && item.showInDevMode === false) {
      return false;
    }
    
    // Check if item should be hidden when authenticated
    if (isAuthenticated && item.showWhenAuthenticated === false) {
      return false;
    }
    
    // If not authenticated and not in dev mode, only show auth page
    if (!isAuthenticated && !isDevMode) {
      return item.path === "/auth";
    }
    
    return true;
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="space-y-1 py-2">
      {filteredMenuItems.filter(shouldShowMenuItem).map((item) => (
        <NavigationItem
          key={item.path}
          item={item}
          isActive={isActive(item.path)}
        />
      ))}
    </div>
  );
}
