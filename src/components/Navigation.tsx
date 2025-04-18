
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarMenu } from '@/components/ui/sidebar';
import { NavigationItem } from './navigation/NavigationItem';
import { useRoleBasedMenu } from '@/hooks/useRoleBasedMenu';
import { useDevMode } from '@/contexts/DevModeContext';

const STORAGE_KEY = 'batchly-sidebar-expanded';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isDevMode, devRole } = useDevMode();
  const menuItems = useRoleBasedMenu();
  
  console.log('[Navigation] Rendering with:', { 
    isDevMode, 
    devRole, 
    menuItemsCount: menuItems?.length || 0,
    currentPath: location.pathname,
    expandedItems
  });
  
  // Auto-expand the current section based on the URL path
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const currentMainPath = '/' + location.pathname.split('/')[1];
      
      // Find the matching menu item for the current path
      const matchingItem = menuItems.find(item => 
        item.path === currentMainPath || 
        location.pathname.startsWith(item.path)
      );
      
      if (matchingItem && !expandedItems.includes(matchingItem.title)) {
        console.log(`[Navigation] Auto-expanding ${matchingItem.title} based on URL path`);
        setExpandedItems(prev => [...prev, matchingItem.title]);
      }
    }
  }, [location.pathname, menuItems]);
  
  // Load expanded state from localStorage on mount
  useEffect(() => {
    try {
      const savedExpanded = localStorage.getItem(STORAGE_KEY);
      if (savedExpanded) {
        const parsed = JSON.parse(savedExpanded);
        if (Array.isArray(parsed)) {
          setExpandedItems(parsed);
        }
      }
    } catch (e) {
      console.error('[Navigation] Failed to parse saved sidebar state', e);
    }
  }, []);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedItems));
    } catch (e) {
      console.error('[Navigation] Failed to save sidebar state', e);
    }
  }, [expandedItems]);

  const isActive = (path: string): boolean => {
    console.log(`[Navigation] Checking if ${path} is active for current path ${location.pathname}`);
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const toggleExpand = (title: string) => {
    console.log(`[Navigation] Toggling expansion for ${title}`);
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };
  
  // Default to dashboard if no menu items are available
  useEffect(() => {
    if (isDevMode && (!menuItems || menuItems.length === 0) && location.pathname !== '/') {
      console.warn('[Navigation] No menu items available for this role - redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [isDevMode, menuItems, navigate, location.pathname]);
  
  if (!menuItems || menuItems.length === 0) {
    return (
      <SidebarMenu>
        <div className="p-4 text-sm text-gray-500">
          No menu items available. Please check permissions.
        </div>
      </SidebarMenu>
    );
  }
  
  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={isActive}
          expandedItems={expandedItems}
          onToggleExpand={toggleExpand}
        />
      ))}
    </SidebarMenu>
  );
};
