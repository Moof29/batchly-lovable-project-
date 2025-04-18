
export type UserRole = 'admin' | 'sales_manager' | 'warehouse_staff' | 'delivery_driver' | 'customer_service';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  avatar_url?: string;
  organization_id?: string;
}

// Role hierarchy definition (highest to lowest)
export const ROLE_HIERARCHY: { [key in UserRole]: number } = {
  'admin': 100,
  'sales_manager': 80,
  'warehouse_staff': 60,
  'delivery_driver': 40,
  'customer_service': 20
};

// Permission checking helpers
export const hasRolePermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, role?: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
}
