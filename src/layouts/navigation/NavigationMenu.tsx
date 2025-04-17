
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { menuItems } from './MenuItems';
import { MenuItem } from './MenuItem';
import { MenuGroup } from './MenuGroup';

export const NavigationMenu = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  // Identify which sections should be open based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    
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
  }, [location.pathname]);
  
  const toggleSection = (title: string) => {
    setOpenSections(current => 
      current.includes(title) 
        ? current.filter(t => t !== title)
        : [...current, title]
    );
  };

  return (
    <nav className="space-y-1 py-2 px-2">
      {menuItems.map((item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isOpen = openSections.includes(item.title);
        
        if (hasSubItems) {
          return (
            <MenuGroup 
              key={item.path} 
              item={item} 
              isOpen={isOpen} 
              onToggle={toggleSection} 
            />
          );
        }
        
        return <MenuItem key={item.path} item={item} />;
      })}
    </nav>
  );
};
