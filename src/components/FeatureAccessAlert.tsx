
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDevMode } from '@/contexts/DevModeContext';

interface FeatureAccessAlertProps {
  feature: string;
  requiredRole: UserRole;
  description: string;
  children: React.ReactNode;
}

export const FeatureAccessAlert: React.FC<FeatureAccessAlertProps> = ({
  feature,
  requiredRole,
  description,
  children
}) => {
  const { user, hasPermission } = useAuth();
  const { isDevMode, devRole } = useDevMode();
  
  // Check if user has required permissions
  const hasAccess = hasPermission(requiredRole) || (isDevMode && requiredRole === devRole);
  
  if (!hasAccess) {
    return (
      <Alert variant="warning" className="mb-6">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Restricted: {feature}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{description}</p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-md flex items-center text-sm">
            <Info className="h-4 w-4 mr-2 text-yellow-600" />
            <span>
              This feature requires <span className="font-medium capitalize">{requiredRole.replace('_', ' ')}</span> permissions.
              {user && (
                <span className="block mt-1">
                  Your current role is <span className="font-medium capitalize">{isDevMode ? devRole.replace('_', ' ') : user.role.replace('_', ' ')}</span>.
                </span>
              )}
            </span>
          </div>
          
          {isDevMode && (
            <div className="mt-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/auth">Switch Demo Role</Link>
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  // If user has access, show the children components
  return <>{children}</>;
};
