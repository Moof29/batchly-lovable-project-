
import { UserRole } from '@/types/auth';

// Role hierarchy for permission checks
// Higher number = higher privileges
export const ROLE_HIERARCHY: { [key in UserRole]: number } = {
  'admin': 100,
  'sales_manager': 80,
  'warehouse_staff': 60,
  'delivery_driver': 40,
  'customer_service': 20
};

export const hasRolePermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Permission types that are also defined in usePermissions.ts
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type PermissionResource = 
  | 'users' | 'customers' | 'vendors' | 'employees'
  | 'inventory' | 'items' | 'sales_orders' | 'purchase_orders'
  | 'invoices' | 'bills' | 'payments' | 'accounts'
  | 'time_tracking' | 'reports' | 'settings' | 'integrations';

// Define dev mode permissions based on roles
export const DEV_MODE_PERMISSIONS: Record<UserRole, Record<PermissionResource, PermissionAction[]>> = {
  admin: {
    users: ['create', 'read', 'update', 'delete', 'manage'],
    customers: ['create', 'read', 'update', 'delete', 'manage'],
    vendors: ['create', 'read', 'update', 'delete', 'manage'],
    employees: ['create', 'read', 'update', 'delete', 'manage'],
    inventory: ['create', 'read', 'update', 'delete', 'manage'],
    items: ['create', 'read', 'update', 'delete', 'manage'],
    sales_orders: ['create', 'read', 'update', 'delete', 'manage'],
    purchase_orders: ['create', 'read', 'update', 'delete', 'manage'],
    invoices: ['create', 'read', 'update', 'delete', 'manage'],
    bills: ['create', 'read', 'update', 'delete', 'manage'],
    payments: ['create', 'read', 'update', 'delete', 'manage'],
    accounts: ['create', 'read', 'update', 'delete', 'manage'],
    time_tracking: ['create', 'read', 'update', 'delete', 'manage'],
    reports: ['create', 'read', 'update', 'delete', 'manage'],
    settings: ['create', 'read', 'update', 'delete', 'manage'],
    integrations: ['create', 'read', 'update', 'delete', 'manage']
  },
  sales_manager: {
    users: ['read'],
    customers: ['create', 'read', 'update', 'manage'],
    vendors: ['read'],
    employees: ['read'],
    inventory: ['read'],
    items: ['read'],
    sales_orders: ['create', 'read', 'update', 'manage'],
    purchase_orders: ['read'],
    invoices: ['create', 'read', 'update', 'manage'],
    bills: ['read'],
    payments: ['create', 'read', 'update', 'manage'],
    accounts: ['read', 'update'],
    time_tracking: ['read'],
    reports: ['read'],
    settings: ['read'],
    integrations: ['read']
  },
  warehouse_staff: {
    users: [],
    customers: ['read'],
    vendors: ['read', 'create', 'update'],
    employees: [],
    inventory: ['create', 'read', 'update', 'manage'],
    items: ['create', 'read', 'update', 'manage'],
    sales_orders: ['read', 'update'],
    purchase_orders: ['create', 'read', 'update', 'manage'],
    invoices: ['read'],
    bills: ['read', 'create', 'update'],
    payments: ['read'],
    accounts: ['read'],
    time_tracking: ['read'],
    reports: ['read'],
    settings: [],
    integrations: []
  },
  delivery_driver: {
    users: [],
    customers: ['read'],
    vendors: ['read'],
    employees: [],
    inventory: ['read'],
    items: ['read'],
    sales_orders: ['read', 'update'],
    purchase_orders: ['read'],
    invoices: [],
    bills: [],
    payments: [],
    accounts: [],
    time_tracking: ['create', 'read', 'update'],
    reports: [],
    settings: [],
    integrations: []
  },
  customer_service: {
    users: [],
    customers: ['read', 'create', 'update'],
    vendors: [],
    employees: [],
    inventory: [],
    items: ['read'],
    sales_orders: ['read', 'create'],
    purchase_orders: [],
    invoices: ['read'],
    bills: [],
    payments: [],
    accounts: [],
    time_tracking: [],
    reports: [],
    settings: [],
    integrations: []
  }
};
