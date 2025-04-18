
import { Link } from 'react-router-dom';
import { SubModule } from '@/types/navigation';
import { Button } from '@/components/ui/button';
import { SidebarMenuSub, SidebarMenuSubItem } from '@/components/ui/sidebar';

interface NavigationSubmenuProps {
  subModules: SubModule[];
  isActive: (path: string) => boolean;
}

export const NavigationSubmenu = ({ subModules, isActive }: NavigationSubmenuProps) => {
  return (
    <SidebarMenuSub>
      {subModules.map((subModule) => (
        <SidebarMenuSubItem key={subModule.id}>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start pl-8 ${isActive(subModule.path) ? 'bg-gray-100 text-gray-900 font-medium' : ''}`}
            asChild
          >
            <Link to={subModule.path}>
              {subModule.name}
            </Link>
          </Button>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
};
