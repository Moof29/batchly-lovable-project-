
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { ReactNode } from "react";

interface RoleBasedViewProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedView = ({
  allowedRoles,
  children,
  fallback = null,
}: RoleBasedViewProps) => {
  const { user, hasPermission } = useAuth();

  // Check if user has permission for any of the allowed roles
  const canAccess = allowedRoles.some(role => hasPermission(role));

  if (!user || !canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
