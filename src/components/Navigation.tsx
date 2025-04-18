
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarMenu } from '@/components/ui/sidebar';
import { NavigationItem } from './navigation/NavigationItem';
import { useRoleBasedMenu } from '@/hooks/useRoleBasedMenu';

const STORAGE_KEY = 'batchly-sidebar-expanded';

export const Navigation = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const menuItems = useRoleBasedMenu();
  
  // Load expanded state from localStorage on mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem(STORAGE_KEY);
    if (savedExpanded) {
      try {
        const parsed = JSON.parse(savedExpanded);
        setExpandedItems(parsed);
      } catch (e) {
        console.error('Failed to parse saved sidebar state', e);
      }
    }
  }, []);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedItems));
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
