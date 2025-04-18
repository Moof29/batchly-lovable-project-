
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
  const { isDevMode } = useDevMode();
  const menuItems = useRoleBasedMenu();
  
  // Ensure there's at least one menu item in dev mode
  useEffect(() => {
    if (isDevMode && menuItems.length === 0) {
      console.warn('No menu items available - check role permissions');
      
      // Force navigation to dashboard if no menu items
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [isDevMode, menuItems.length, navigate, location.pathname]);
  
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
      console.error('Failed to parse saved sidebar state', e);
    }
  }, []);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedItems));
    } catch (e) {
      console.error('Failed to save sidebar state', e);
    }
  }, [expandedItems]);

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
  
  // Auto-expand the current section
  useEffect(() => {
    const currentMainPath = '/' + location.pathname.split('/')[1];
    const matchingItem = menuItems.find(item => item.path === currentMainPath);
    
    if (matchingItem && !expandedItems.includes(matchingItem.title)) {
      setExpandedItems(prev => [...prev, matchingItem.title]);
    }
  }, [location.pathname, menuItems, expandedItems]);
  
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
