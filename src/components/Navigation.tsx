
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
  SidebarMenuItem 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

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
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${isActive ? 'bg-gray-100 text-gray-900 font-medium' : ''}`}
              asChild
            >
              <Link to={item.path}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
