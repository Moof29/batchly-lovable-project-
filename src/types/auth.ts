
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'sales_manager' | 'warehouse_staff' | 'delivery_driver' | 'customer_service' | 'customer';

export type Permission = 
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_roles'
  | 'configure_integrations'
  | 'manage_organization_settings'
  | 'view_customers'
  | 'manage_customers'
  | 'view_sales'
  | 'manage_sales'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_fulfillment'
  | 'manage_fulfillment'
  | 'view_deliveries'
  | 'manage_deliveries'
  | 'view_customer_service'
  | 'manage_customer_service'
  | 'view_reports'
  | 'export_data';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  organization_id: string | null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  permissions: Permission[];
  isLoading: boolean;
}
