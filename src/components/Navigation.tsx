
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  DollarSign, 
  Settings,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const menuItems = [
  { 
    title: 'Dashboard', 
    icon: Home, 
    path: '/' 
  },
  { 
    title: 'Inventory', 
    icon: Package, 
    path: '/inventory',
    subModules: [
      { name: 'Items', path: '/inventory/items' }
    ]
  },
  { 
    title: 'People', 
    icon: Users, 
    path: '/people',
    subModules: [
      { name: 'Customers', path: '/people/customers' },
      { name: 'Vendors', path: '/people/vendors' },
      { name: 'Employees', path: '/people/employees' },
      { name: 'Time Tracking', path: '/people/time-tracking' }
    ]
  },
  { 
    title: 'Sales', 
    icon: ShoppingCart, 
    path: '/sales',
    subModules: [
      { name: 'Orders', path: '/sales/orders' },
      { name: 'Invoices', path: '/sales/invoices' },
      { name: 'Order Templates', path: '/sales/order-templates' }
    ]
  },
  { 
    title: 'Purchases', 
    icon: DollarSign, 
    path: '/purchases',
    subModules: [
      { name: 'Orders', path: '/purchases/orders' },
      { name: 'Bills', path: '/purchases/bills' }
    ]
  },
  { 
    title: 'Settings', 
    icon: Settings, 
    path: '/settings',
    subModules: [
      { name: 'General', path: '/settings' },
      { name: 'Users', path: '/settings/users' },
      { name: 'Company', path: '/settings/company' },
      { name: 'Billing', path: '/settings/billing' }
    ]
  },
];

export const Navigation = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };
  
  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path || 
                        (item.path !== '/' && location.pathname.startsWith(item.path));
        const isExpanded = expandedItems.includes(item.title);
        
        return (
          <SidebarMenuItem key={item.title}>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${isActive ? 'bg-gray-100 text-gray-900 font-medium' : ''}`}
              onClick={() => item.subModules ? toggleExpand(item.title) : undefined}
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
              <SidebarMenuSub>
                {item.subModules.map((subModule) => {
                  const isSubActive = location.pathname === subModule.path;
                  
                  return (
                    <SidebarMenuSubItem key={subModule.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start pl-8 ${isSubActive ? 'bg-gray-100 text-gray-900 font-medium' : ''}`}
                        asChild
                      >
                        <Link to={subModule.path}>
                          {subModule.name}
                        </Link>
                      </Button>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

