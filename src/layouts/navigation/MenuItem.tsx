
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuItem as MenuItemType } from './MenuItems';

interface MenuItemProps {
  item: MenuItemType;
  isSubItem?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, isSubItem = false }) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

  return (
    <div className="relative my-1">
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Link
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-accent/50 hover:text-accent-foreground",
              !isCollapsed && "space-x-3",
              isSubItem && !isCollapsed && "ml-6 text-sm",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
            {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
      </Tooltip>
    </div>
  );
};
