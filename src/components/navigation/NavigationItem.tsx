
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MenuItem } from '@/types/navigation';
import { Button } from '@/components/ui/button';
import { SidebarMenuItem } from '@/components/ui/sidebar';
import { NavigationSubmenu } from './NavigationSubmenu';

interface NavigationItemProps {
  item: MenuItem;
  isActive: (path: string) => boolean;
  expandedItems: string[];
  onToggleExpand: (title: string) => void;
}

export const NavigationItem = ({ 
  item, 
  isActive, 
  expandedItems, 
  onToggleExpand 
}: NavigationItemProps) => {
  const location = useLocation();
  const isExpanded = expandedItems.includes(item.title);
  const isCurrentActive = isActive(item.path);

  // Auto-expand current section on route changes
  useEffect(() => {
    if (location.pathname.startsWith(item.path) && item.path !== '/' && !isExpanded) {
      console.log(`[Navigation] Auto-expanding ${item.title} for path ${location.pathname}`);
      onToggleExpand(item.title);
    }
  }, [location.pathname, item.path, item.title, isExpanded, onToggleExpand]);

  return (
    <SidebarMenuItem key={item.id}>
      <Button 
        variant="ghost" 
        className={`w-full justify-start ${isCurrentActive ? 'bg-gray-100 text-gray-900 font-medium' : ''}`}
        onClick={() => item.subModules ? onToggleExpand(item.title) : undefined}
        asChild={!item.subModules}
      >
        {item.subModules ? (
          <div className="flex items-center w-full">
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        ) : (
          <Link to={item.path}>
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )}
      </Button>
      
      {item.subModules && isExpanded && (
        <NavigationSubmenu 
          subModules={item.subModules}
          isActive={isActive}
        />
      )}
    </SidebarMenuItem>
  );
};
