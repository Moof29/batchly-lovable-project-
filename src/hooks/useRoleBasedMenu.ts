
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { MenuItem } from '@/types/navigation';
import { 
  Home, 
  Package, 
  Users, 
  DollarSign, 
  Settings,
  ShoppingCart,
  Truck
} from 'lucide-react';

const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
  const items: MenuItem[] = [
    { 
      id: 'dashboard',
      title: 'Dashboard', 
      icon: Home, 
      path: '/' 
    }
  ];

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

  if (role === 'sales_manager') {
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

  if (role === 'warehouse_staff') {
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

  if (role === 'delivery_driver') {
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

  if (role === 'customer_service') {
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

export const useRoleBasedMenu = () => {
  const { user } = useAuth();
  return user ? getMenuItemsByRole(user.role) : [];
};
