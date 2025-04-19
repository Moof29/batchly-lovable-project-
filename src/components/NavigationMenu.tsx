
import { useAuth } from '@/contexts/AuthContext';
import { useDevMode } from '@/contexts/DevModeContext';
import { NavigationItem } from '@/components/navigation/NavigationItem';
import { useRoleBasedMenu } from '@/hooks/useRoleBasedMenu';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function NavigationMenu() {
  const { user, isAuthenticated } = useAuth();
  const { isDevMode, devRole } = useDevMode();
  const { filteredMenuItems } = useRoleBasedMenu();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Auto-expand the current section based on URL path
  useEffect(() => {
    if (filteredMenuItems && filteredMenuItems.length > 0) {
      const currentMainPath = '/' + location.pathname.split('/')[1];
      
      // Find the matching menu item for the current path
      const matchingItem = filteredMenuItems.find(item => 
        item.path === currentMainPath || 
        location.pathname.startsWith(item.path)
      );
      
      if (matchingItem && !expandedItems.includes(matchingItem.title)) {
        setExpandedItems(prev => [...prev, matchingItem.title]);
      }
    }
  }, [location.pathname, filteredMenuItems, expandedItems]);
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="space-y-1 py-2">
      {filteredMenuItems.filter(item => 
        // Show auth item only when not authenticated and not in dev mode
        (!isAuthenticated && !isDevMode) ? item.path === '/auth' : true
      ).map((item) => (
        <NavigationItem
          key={item.path}
          item={item}
          isActive={isActive(item.path)}
          expandedItems={expandedItems}
          onToggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
}
