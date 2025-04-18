import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  DollarSign, 
  Settings,
  ShoppingCart,
  ChevronRight,
  Truck
} from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

const getMenuItemsByRole = (role: UserRole) => {
  const items = [];

  // Base items visible to all roles
  items.push({ 
    title: 'Dashboard', 
    icon: Home, 
    path: '/' 
  });

  // Admin has access to everything
  if (role === 'admin') {
    items.push(
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
      }
    );
  }

  // Sales Manager specific items
  if (role === 'sales_manager' || role === 'admin') {
    items.push(
      { 
        title: 'Sales', 
        icon: ShoppingCart, 
        path: '/sales',
        subModules: [
          { name: 'Orders', path: '/sales/orders' },
          { name: 'Invoices', path: '/sales/invoices' }
        ]
      },
      { 
        title: 'People', 
        icon: Users, 
        path: '/people',
        subModules: [
          { name: 'Customers', path: '/people/customers' }
        ]
      }
    );
  }

  // Warehouse Staff specific items
  if (role === 'warehouse_staff' || role === 'admin') {
    items.push(
      { 
        title: 'Inventory', 
        icon: Package, 
        path: '/inventory',
        subModules: [
          { name: 'Items', path: '/inventory/items' }
        ]
      },
      { 
        title: 'Purchases', 
        icon: DollarSign, 
        path: '/purchases',
        subModules: [
          { name: 'Orders', path: '/purchases/orders' }
        ]
      }
    );
  }

  // Delivery Driver specific items
  if (role === 'delivery_driver' || role === 'admin') {
    items.push(
      { 
        title: 'Deliveries', 
        icon: Truck, 
        path: '/deliveries',
        subModules: [
          { name: 'Routes', path: '/deliveries/routes' },
          { name: 'Schedule', path: '/deliveries/schedule' }
        ]
      }
    );
  }

  // Customer Service specific items
  if (role === 'customer_service' || role === 'admin') {
    items.push(
      { 
        title: 'People', 
        icon: Users, 
        path: '/people',
        subModules: [
          { name: 'Customers', path: '/people/customers' }
        ]
      },
      { 
        title: 'Sales', 
        icon: ShoppingCart, 
        path: '/sales',
        subModules: [
          { name: 'Orders', path: '/sales/orders' }
        ]
      }
    );
  }

  return items;
};

const STORAGE_KEY = 'batchly-sidebar-expanded';

export const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Get menu items based on user role
  const menuItems = user ? getMenuItemsByRole(user.role) : [];
  
  // Load expanded state from localStorage on mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem(STORAGE_KEY);
    if (savedExpanded) {
      try {
        const parsed = JSON.parse(savedExpanded);
        setExpandedItems(parsed);
      } catch (e) {
        console.error('Failed to parse saved sidebar state', e);
      }
    } else {
      // Auto-expand the current section based on the URL path
      const currentMainPath = '/' + location.pathname.split('/')[1];
      const currentModule = menuItems.find(item => item.path === currentMainPath);
      if (currentModule?.title) {
        setExpandedItems([currentModule.title]);
      }
    }
  }, [location.pathname, menuItems]);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedItems));
  }, [expandedItems]);
  
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
        
        // Auto-expand when navigating to a submodule page
        useEffect(() => {
          if (isActive && item.subModules && !isExpanded) {
            setExpandedItems(prev => [...prev, item.title]);
          }
        }, [location.pathname, isActive, item.title, isExpanded]);
        
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
                  const isSubActive = location.pathname === subModule.path || location.pathname.startsWith(subModule.path);
                  
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
