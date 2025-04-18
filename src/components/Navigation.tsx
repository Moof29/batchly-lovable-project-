
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  DollarSign, 
  Settings, 
  ShoppingCart 
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', icon: Home, path: '/' },
  { title: 'Inventory', icon: Package, path: '/inventory' },
  { title: 'People', icon: Users, path: '/people' },
  { title: 'Sales', icon: ShoppingCart, path: '/sales' },
  { title: 'Purchases', icon: DollarSign, path: '/purchases' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path || 
                         (item.path !== '/' && location.pathname.startsWith(item.path));
        
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link to={item.path}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
