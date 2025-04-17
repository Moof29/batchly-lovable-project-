
import React from 'react';
import { useLocation } from "react-router-dom";
import { menuItems } from './MenuItems';
import { MenuItem } from './MenuItem';
import { MenuGroup } from './MenuGroup';
import { useSidebarMenuState } from './useSidebarMenuState';

export const NavigationMenu = () => {
  const location = useLocation();
  const { openSections, toggleSection } = useSidebarMenuState(location.pathname);
  
  return (
    <nav className="space-y-2 py-2 px-2">
      {menuItems.map((item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isOpen = openSections.includes(item.title);
        
        if (hasSubItems) {
          return (
            <MenuGroup 
              key={item.path} 
              item={item} 
              isOpen={isOpen} 
              onToggle={() => toggleSection(item.title)} 
            />
          );
        }
        
        return <MenuItem key={item.path} item={item} />;
      })}
    </nav>
  );
};
