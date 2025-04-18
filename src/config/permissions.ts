
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
