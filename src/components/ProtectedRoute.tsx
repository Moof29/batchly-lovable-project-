import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useDevMode } from "@/contexts/DevModeContext";
import React from "react";

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  element?: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, element }) => {
  const { isAuthenticated, loading, user, hasPermission } = useAuth();
  const { isDevMode } = useDevMode();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-2 text-xl font-medium">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated && !isDevMode) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If role check is required and user doesn't have permission
  if (requiredRole && !hasPermission(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have the required permissions to access this page.
          {user && (
            <span className="block mt-2">
              Your current role <span className="font-medium">{user.role}</span> doesn't have access to this area.
            </span>
          )}
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This feature requires {requiredRole} permissions or higher.
              </p>
            </div>
          </div>
        </div>
        <Navigate to="/" replace />
      </div>
    );
  }

  // Otherwise, render the protected content
  // If element prop is provided, render that instead of the Outlet
  return element ? element : <Outlet />;
};
