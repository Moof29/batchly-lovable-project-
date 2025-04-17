
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuItem as MenuItemType } from './MenuItems';
import { MenuItem } from './MenuItem';

interface MenuGroupProps {
  item: MenuItemType;
  isOpen: boolean;
  onToggle: () => void;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ item, isOpen, onToggle }) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const isActive = location.pathname === item.path;
  const isParentOfActive = item.subItems?.some(subItem => 
    location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`)
  );

  return (
    <div className="relative my-1">
      <Collapsible 
        open={isOpen} 
        onOpenChange={onToggle}
      >
        <CollapsibleTrigger 
          className={cn(
            "flex w-full items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
            (isActive || isParentOfActive || isOpen)
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-accent/50 hover:text-accent-foreground",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center",
                !isCollapsed && "space-x-3"
              )}>
                <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
                {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
              </div>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
          </Tooltip>
          
          {!isCollapsed && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "transform rotate-180" : ""
              )} 
            />
          )}
        </CollapsibleTrigger>

        {!isCollapsed && (
          <CollapsibleContent className="mt-1 space-y-1">
            {item.subItems?.map((subItem) => (
              <MenuItem key={subItem.path} item={subItem} isSubItem={true} />
            ))}
          </CollapsibleContent>
        )}
        
        {isCollapsed && isOpen && (
          <div className="mt-1 pt-1 pb-1 flex flex-col items-center space-y-1">
            {item.subItems?.map((subItem) => {
              const isSubItemActive = location.pathname === subItem.path || 
                                      location.pathname.startsWith(`${subItem.path}/`);
              return (
                <Tooltip key={subItem.path} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={subItem.path}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-lg h-8 w-8",
                        isSubItemActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-accent/50 hover:text-accent-foreground"
                      )}
                    >
                      <subItem.icon className="h-4 w-4 flex-shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{subItem.title}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </Collapsible>
    </div>
  );
};
