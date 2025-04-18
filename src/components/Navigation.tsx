
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
    id: 'dashboard',
    title: 'Dashboard', 
    icon: Home, 
    path: '/' 
  });

  // Admin has access to everything
  if (role === 'admin') {
    items.push(
      { 
        id: 'inventory-admin',
        title: 'Inventory', 
        icon: Package, 
        path: '/inventory',
        subModules: [
          { id: 'items-admin', name: 'Items', path: '/inventory/items' }
        ]
      },
      { 
        id: 'people-admin',
        title: 'People', 
        icon: Users, 
        path: '/people',
        subModules: [
          { id: 'customers-admin', name: 'Customers', path: '/people/customers' },
          { id: 'vendors-admin', name: 'Vendors', path: '/people/vendors' },
          { id: 'employees-admin', name: 'Employees', path: '/people/employees' },
          { id: 'time-tracking-admin', name: 'Time Tracking', path: '/people/time-tracking' }
        ]
      },
      { 
        id: 'sales-admin',
        title: 'Sales', 
        icon: ShoppingCart, 
        path: '/sales',
        subModules: [
          { id: 'orders-admin', name: 'Orders', path: '/sales/orders' },
          { id: 'invoices-admin', name: 'Invoices', path: '/sales/invoices' },
          { id: 'order-templates-admin', name: 'Order Templates', path: '/sales/order-templates' }
        ]
      },
      { 
        id: 'purchases-admin',
        title: 'Purchases', 
        icon: DollarSign, 
        path: '/purchases',
        subModules: [
          { id: 'orders-purchases-admin', name: 'Orders', path: '/purchases/orders' },
          { id: 'bills-admin', name: 'Bills', path: '/purchases/bills' }
        ]
      },
      { 
        id: 'settings-admin',
        title: 'Settings', 
        icon: Settings, 
        path: '/settings',
        subModules: [
          { id: 'general-admin', name: 'General', path: '/settings' },
          { id: 'users-admin', name: 'Users', path: '/settings/users' },
          { id: 'company-admin', name: 'Company', path: '/settings/company' },
          { id: 'billing-admin', name: 'Billing', path: '/settings/billing' }
        ]
      }
    );
  }

  // Sales Manager specific items
  if (role === 'sales_manager' && role !== 'admin') {
    items.push(
      { 
        id: 'sales-manager',
        title: 'Sales', 
        icon: ShoppingCart, 
        path: '/sales',
        subModules: [
          { id: 'orders-sales', name: 'Orders', path: '/sales/orders' },
          { id: 'invoices-sales', name: 'Invoices', path: '/sales/invoices' }
        ]
      },
      { 
        id: 'people-sales',
        title: 'People', 
        icon: Users, 
        path: '/people',
        subModules: [
          { id: 'customers-sales', name: 'Customers', path: '/people/customers' }
        ]
      }
    );
  }

  // Warehouse Staff specific items
  if (role === 'warehouse_staff' && role !== 'admin') {
    items.push(
      { 
        id: 'inventory-warehouse',
        title: 'Inventory', 
        icon: Package, 
        path: '/inventory',
        subModules: [
          { id: 'items-warehouse', name: 'Items', path: '/inventory/items' }
        ]
      },
      { 
        id: 'purchases-warehouse',
        title: 'Purchases', 
        icon: DollarSign, 
        path: '/purchases',
        subModules: [
          { id: 'orders-purchases', name: 'Orders', path: '/purchases/orders' }
        ]
      }
    );
  }

  // Delivery Driver specific items
  if (role === 'delivery_driver' && role !== 'admin') {
    items.push(
      { 
        id: 'deliveries-driver',
        title: 'Deliveries', 
        icon: Truck, 
        path: '/deliveries',
        subModules: [
          { id: 'routes-driver', name: 'Routes', path: '/deliveries/routes' },
          { id: 'schedule-driver', name: 'Schedule', path: '/deliveries/schedule' }
        ]
      }
    );
  }

  // Customer Service specific items
  if (role === 'customer_service' && role !== 'admin') {
    items.push(
      { 
        id: 'people-cs',
        title: 'People', 
        icon: Users, 
        path: '/people',
        subModules: [
          { id: 'customers-cs', name: 'Customers', path: '/people/customers' }
        ]
      },
      { 
        id: 'sales-cs',
        title: 'Sales', 
        icon: ShoppingCart, 
        path: '/sales',
        subModules: [
          { id: 'orders-cs', name: 'Orders', path: '/sales/orders' }
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
  
  // Load expanded state from localStorage on mount and handle auto-expand
  useEffect(() => {
    const savedExpanded = localStorage.getItem(STORAGE_KEY);
    if (savedExpanded) {
      try {
        const parsed = JSON.parse(savedExpanded);
        setExpandedItems(parsed);
      } catch (e) {
        console.error('Failed to parse saved sidebar state', e);
      }
    }
  }, []);
  
  // Auto-expand the current section based on URL path changes
  useEffect(() => {
    const currentMainPath = '/' + location.pathname.split('/')[1];
    const currentModule = menuItems.find(item => item.path === currentMainPath);
    
    if (currentModule?.title && !expandedItems.includes(currentModule.title)) {
      setExpandedItems(prev => [...prev, currentModule.title]);
    }
  }, [location.pathname, menuItems, expandedItems]);

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
        
        return (
          <SidebarMenuItem key={item.id}>
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
                    <SidebarMenuSubItem key={subModule.id}>
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
