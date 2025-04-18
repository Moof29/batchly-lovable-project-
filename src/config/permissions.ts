
import { PermissionAction, PermissionResource } from '@/hooks/usePermissions';
import { UserRole } from '@/types/auth';

// Simplified permission mapping for Dev Mode
export const DEV_MODE_PERMISSIONS: Record<UserRole, Record<PermissionResource, PermissionAction[]>> = {
  admin: {
    // Admin has all permissions
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
    // Sales manager has limited permissions
    users: [],
    customers: ['create', 'read', 'update', 'manage'],
    vendors: ['read'],
    employees: ['read'],
    inventory: ['read'],
    items: ['read'],
    sales_orders: ['create', 'read', 'update', 'manage'],
    purchase_orders: ['read'],
    invoices: ['create', 'read', 'update', 'manage'],
    bills: ['read'],
    payments: ['create', 'read'],
    accounts: ['read'],
    time_tracking: ['read'],
    reports: ['read'],
    settings: [],
    integrations: []
  },
  warehouse_staff: {
    // Warehouse staff has inventory-focused permissions
    users: [],
    customers: ['read'],
    vendors: ['read'],
    employees: ['read'],
    inventory: ['create', 'read', 'update', 'manage'],
    items: ['create', 'read', 'update', 'manage'],
    sales_orders: ['read'],
    purchase_orders: ['create', 'read', 'update', 'manage'],
    invoices: ['read'],
    bills: ['read'],
    payments: [],
    accounts: [],
    time_tracking: ['create', 'read'],
    reports: ['read'],
    settings: [],
    integrations: []
  },
  delivery_driver: {
    // Delivery driver has delivery-focused permissions
    users: [],
    customers: ['read'],
    vendors: [],
    employees: [],
    inventory: [],
    items: ['read'],
    sales_orders: ['read', 'update'],
    purchase_orders: [],
    invoices: ['read'],
    bills: [],
    payments: [],
    accounts: [],
    time_tracking: ['create', 'read'],
    reports: [],
    settings: [],
    integrations: []
  },
  customer_service: {
    // Customer service has customer-focused permissions
    users: [],
    customers: ['read', 'update'],
    vendors: [],
    employees: [],
    inventory: [],
    items: ['read'],
    sales_orders: ['read'],
    purchase_orders: [],
    invoices: ['read'],
    bills: [],
    payments: ['read'],
    accounts: [],
    time_tracking: [],
    reports: [],
    settings: [],
    integrations: []
  }
};
