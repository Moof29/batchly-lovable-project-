
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldX, User, Users, Package, ShoppingCart, Truck, Headset } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoleComparisonModal } from './RoleComparisonModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { useDevMode } from '@/contexts/DevModeContext';

interface DemoRoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryFeatures: string[];
  onLogin: (role: UserRole) => void;
  isLoading: boolean;
}

const DemoRoleCard: React.FC<DemoRoleCardProps> = ({
  role,
  title,
  description,
  icon,
  primaryFeatures,
  onLogin,
  isLoading
}) => {
  const getRoleHierarchyBadge = () => {
    switch (role) {
      case 'admin':
        return <div className="absolute top-3 right-3 bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Highest Access</div>;
      case 'sales_manager':
        return <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center"><Shield className="w-3 h-3 mr-1" /> High Access</div>;
      case 'warehouse_staff':
        return <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center"><Shield className="w-3 h-3 mr-1" /> Medium Access</div>;
      case 'delivery_driver':
        return <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center"><Shield className="w-3 h-3 mr-1" /> Limited Access</div>;
      case 'customer_service':
        return <div className="absolute top-3 right-3 bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center"><ShieldX className="w-3 h-3 mr-1" /> Basic Access</div>;
      default:
        return null;
    }
  };

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      {getRoleHierarchyBadge()}
      <CardHeader>
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-full bg-brand-50 mr-3">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="text-sm font-medium mb-2">Primary Features:</h4>
        <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
          {primaryFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onLogin(role)}
          disabled={isLoading}
        >
          Try {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const DemoAccountsSection: React.FC = () => {
  const [showRoleComparison, setShowRoleComparison] = useState(false);
  const { setDevRole, toggleDevMode } = useDevMode();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    
    // Set the dev role and enable dev mode
    setDevRole(role);
    toggleDevMode();
    
    toast({
      title: "Demo Mode Activated",
      description: `Logged in as ${role.replace('_', ' ')} role`,
    });
    
    // Simulate a brief loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Try Demo Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Experience Batchly with different roles and permissions
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowRoleComparison(true)}
        >
          Compare Roles
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DemoRoleCard
          role="admin"
          title="Administrator"
          description="Full system access with complete control over all features"
          icon={<ShieldCheck className="h-5 w-5 text-purple-600" />}
          primaryFeatures={[
            "Manage all users and roles",
            "Configure QuickBooks integration",
            "Access all modules and reports",
            "Manage company settings"
          ]}
          onLogin={handleDemoLogin}
          isLoading={isLoading}
        />
        
        <DemoRoleCard
          role="sales_manager"
          title="Sales Manager"
          description="Oversee sales operations and customer relationships"
          icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
          primaryFeatures={[
            "Manage orders and invoices",
            "View customer information",
            "Limited access to sales reports",
            "Cannot access QuickBooks settings"
          ]}
          onLogin={handleDemoLogin}
          isLoading={isLoading}
        />
        
        <DemoRoleCard
          role="warehouse_staff"
          title="Warehouse Staff"
          description="Manage inventory and purchase orders"
          icon={<Package className="h-5 w-5 text-green-600" />}
          primaryFeatures={[
            "Track inventory items",
            "Process purchase orders",
            "Limited inventory reporting",
            "Cannot access sales or customer data"
          ]}
          onLogin={handleDemoLogin}
          isLoading={isLoading}
        />
        
        <DemoRoleCard
          role="delivery_driver"
          title="Delivery Driver"
          description="Handle deliveries and routes"
          icon={<Truck className="h-5 w-5 text-yellow-600" />}
          primaryFeatures={[
            "View delivery schedules",
            "Access route information",
            "Update delivery status",
            "Limited customer contact info"
          ]}
          onLogin={handleDemoLogin}
          isLoading={isLoading}
        />
        
        <DemoRoleCard
          role="customer_service"
          title="Customer Service"
          description="Support customer needs and process returns"
          icon={<Headset className="h-5 w-5 text-gray-600" />}
          primaryFeatures={[
            "Access customer records",
            "View order statuses",
            "Process returns",
            "Cannot edit inventory or sales"
          ]}
          onLogin={handleDemoLogin}
          isLoading={isLoading}
        />
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Demo accounts use our development mode with pre-configured sample data.</p>
        <p>No actual data will be created or modified.</p>
      </div>
      
      <RoleComparisonModal
        open={showRoleComparison}
        onClose={() => setShowRoleComparison(false)}
      />
    </div>
  );
};
