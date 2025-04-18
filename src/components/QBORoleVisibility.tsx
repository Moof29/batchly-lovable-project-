
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface QBORoleVisibilityProps {
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const QBORoleVisibility: React.FC<QBORoleVisibilityProps> = ({ 
  requiredRole = 'admin', 
  fallback = null,
  children 
}) => {
  const { user, hasPermission } = useAuth();
  
  // Role-specific access control for QBO features
  const canAccessQBOFeature = () => {
    if (!user) return false;
    
    // Admin has full access
    if (hasPermission('admin')) return true;
    
    // Role-specific conditional access
    switch (requiredRole) {
      case 'sales_manager':
        return hasPermission('sales_manager');
      case 'warehouse_staff':
        return hasPermission('warehouse_staff');
      case 'customer_service':
        return hasPermission('customer_service');
      default:
        return false;
    }
  };
  
  if (canAccessQBOFeature()) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
