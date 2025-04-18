
import { 
  Home, 
  ShoppingCart, 
  Truck, 
  Package, 
  Users, 
  CreditCard, 
  Settings,
  LogIn
} from 'lucide-react';
import { MenuItem } from '@/types/navigation';
import { UserRole } from '@/types/auth';
import { ROLE_HIERARCHY } from '@/config/permissions';

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: Home,
    permissions: ['customer_service']
  },
  {
    title: 'Authentication',
    path: '/auth',
    icon: LogIn,
    permissions: [], // No permissions needed for auth
    showInDevMode: false, // Don't show in dev mode
    showWhenAuthenticated: false // Don't show when authenticated
  },
  {
    title: 'Sales',
    path: '/sales',
    icon: ShoppingCart,
    permissions: ['customer_service'],
    children: [
      {
        title: 'Orders',
        path: '/sales/orders',
        permissions: ['customer_service']
      },
      {
        title: 'Order Templates',
        path: '/sales/order-templates',
        permissions: ['sales_manager']
      },
      {
        title: 'Invoices',
        path: '/sales/invoices',
        permissions: ['sales_manager']
      }
    ]
  },
  {
    title: 'Purchases',
    path: '/purchases',
    icon: Truck,
    permissions: ['warehouse_staff'],
    children: [
      {
        title: 'Orders',
        path: '/purchases/orders',
        permissions: ['warehouse_staff']
      },
      {
        title: 'Bills',
        path: '/purchases/bills',
        permissions: ['warehouse_staff']
      }
    ]
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: Package,
    permissions: ['warehouse_staff'],
    children: [
      {
        title: 'Items',
        path: '/inventory/items',
        permissions: ['warehouse_staff']
      }
    ]
  },
  {
    title: 'People',
    path: '/people',
    icon: Users,
    permissions: ['customer_service'],
    children: [
      {
        title: 'Customers',
        path: '/people/customers',
        permissions: ['customer_service']
      },
      {
        title: 'Vendors',
        path: '/people/vendors',
        permissions: ['warehouse_staff']
      },
      {
        title: 'Employees',
        path: '/people/employees',
        permissions: ['admin']
      },
      {
        title: 'Time Tracking',
        path: '/people/time-tracking',
        permissions: ['admin']
      }
    ]
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: CreditCard,
    permissions: ['sales_manager'],
    children: [
      {
        title: 'Accounts Receivable',
        path: '/payments/accounts-receivable',
        permissions: ['sales_manager']
      },
      {
        title: 'Accounts Payable',
        path: '/payments/accounts-payable',
        permissions: ['sales_manager']
      }
    ]
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    permissions: ['admin']
  }
];

// Function to get menu items filtered by role
export const getMenuItemsByRole = (role: UserRole) => {
  // Function to filter menu items based on role permissions
  const filterMenuItemsByRole = (items: MenuItem[], role: UserRole): MenuItem[] => {
    return items.filter(item => {
      // Check if the user has permission for this item
      const hasItemPermission = hasPermission(item.permissions, role);
      
      // If no permission, don't show this item
      if (!hasItemPermission) return false;
      
      // Filter children recursively
      const filteredChildren = item.children 
        ? filterMenuItemsByRole(item.children, role)
        : undefined;
        
      // Return the item with filtered children
      return {
        ...item,
        children: filteredChildren
      };
    });
  };

  return filterMenuItemsByRole(menuItems, role);
};

// Helper function to check role permissions
const hasPermission = (requiredRoles: UserRole[], userRole: UserRole): boolean => {
  if (requiredRoles.length === 0) return true; // No permissions required
  return requiredRoles.some(role => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[role]);
};
