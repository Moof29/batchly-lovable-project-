
import { useState, useEffect } from 'react';
import { menuItems } from './MenuItems';

export const useSidebarMenuState = (currentPath: string) => {
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  // Identify which sections should be open based on current path
  useEffect(() => {
    // Find all parent sections that should be open
    const sectionsToOpen = menuItems
      .filter(item => {
        // Check if this is the current path
        if (currentPath === item.path) return true;
        
        // Check if this is a parent of the current path
        if (item.subItems && currentPath.startsWith(item.path + '/')) return true;
        
        // Check if any subitems match the current path
        if (item.subItems && item.subItems.some(subItem => currentPath === subItem.path)) return true;
        
        return false;
      })
      .map(item => item.title);
    
    if (sectionsToOpen.length > 0) {
      setOpenSections(sectionsToOpen);
    }
  }, [currentPath]);
  
  const toggleSection = (title: string) => {
    setOpenSections(current => 
      current.includes(title) 
        ? current.filter(t => t !== title)
        : [...current, title]
    );
  };

  return { openSections, toggleSection };
};
