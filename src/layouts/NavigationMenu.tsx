
import React from 'react';
import { LogoIcon } from '@/components/LogoIcon';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  Home, 
  Package, 
  Users, 
  DollarSign, 
  Settings, 
  ShoppingCart 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NavigationMenu = () => {
  const menuItems = [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Inventory', icon: Package, path: '/inventory' },
    { title: 'People', icon: Users, path: '/people' },
    { title: 'Sales', icon: ShoppingCart, path: '/sales' },
    { title: 'Purchases', icon: DollarSign, path: '/purchases' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <SidebarGroup className="border-b border-border/50 pb-4 mb-2">
        <div className="flex items-center space-x-3 px-4 pt-4 pb-2">
          <LogoIcon className="h-10 w-10" />
          <h2 className="text-xl font-bold text-foreground">Batchly</h2>
        </div>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="sr-only">Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.path}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
