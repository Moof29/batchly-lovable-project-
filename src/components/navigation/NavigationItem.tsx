
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MenuItem } from '@/types/navigation';
import { ChevronDown } from 'lucide-react';

interface NavigationItemProps {
  item: MenuItem;
  isActive: boolean;
  expandedItems?: string[];
  onToggleExpand?: (title: string) => void;
}

export function NavigationItem({ 
  item, 
  isActive,
  expandedItems = [],
  onToggleExpand
}: NavigationItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  // Use expandedItems prop if provided, otherwise use local state
  const isExpanded = expandedItems ? expandedItems.includes(item.title) : isOpen;

  const toggleSubmenu = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      if (onToggleExpand) {
        onToggleExpand(item.title);
      } else {
        setIsOpen(!isOpen);
      }
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={hasChildren ? '#' : item.path}
        onClick={toggleSubmenu}
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm rounded-md",
          {
            "bg-gray-100 text-gray-900": isActive && !hasChildren,
            "hover:bg-gray-100 hover:text-gray-900": !isActive || hasChildren,
          }
        )}
      >
        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
        <span className="flex-1">{item.title}</span>
        {hasChildren && (
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", {
              "transform rotate-180": isExpanded,
            })}
          />
        )}
      </Link>

      {hasChildren && isExpanded && (
        <div className="mt-1 pl-4 border-l border-gray-200 ml-3">
          {item.children?.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className={cn(
                "block px-3 py-2 text-sm rounded-md",
                {
                  "bg-gray-100 text-gray-900": isActive,
                  "hover:bg-gray-50 hover:text-gray-900": !isActive,
                }
              )}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
