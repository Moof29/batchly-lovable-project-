
import React from 'react';
import { UserRole } from '@/types/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ShieldAlert, 
  ShieldCheck,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RestrictedFeatureAlertProps {
  title: string;
  description: string;
  requiredRole: UserRole;
  showSettingsButton?: boolean;
}

export const RestrictedFeatureAlert: React.FC<RestrictedFeatureAlertProps> = ({
  title,
  description,
  requiredRole,
  showSettingsButton = false
}) => {
  const renderRoleIcon = () => {
    switch (requiredRole) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <Alert variant="destructive" className="mb-6">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle className="flex items-center">
        {title}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p>{description}</p>
        <div className="mt-2 text-sm bg-red-50 border border-red-200 p-2 rounded-md flex items-center">
          <Info className="h-4 w-4 mr-2 text-red-500" />
          This feature requires <span className="mx-1 font-medium capitalize">{requiredRole.replace('_', ' ')}</span> permissions or higher.
        </div>
        
        {showSettingsButton && (
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <Link to="/settings">Go to Settings</Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
