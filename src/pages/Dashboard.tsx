
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBasedView } from "@/components/RoleBasedView";
import { 
  Users, 
  ShoppingCart, 
  FileJson, 
  Database,
  Package2, // Replaced 'Inventory' with 'Package2'
  Truck,
  MapPin,
  RotateCcw, // Replaced 'Return' with 'RotateCcw'
  Calendar
} from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user?.first_name}
        </h1>
        <span className="text-sm text-muted-foreground capitalize">
          Role: {user?.role.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admin Views */}
        <RoleBasedView allowedRoles={['admin']}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage user accounts, roles, and permissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <FileJson className="h-5 w-5" />
              <CardTitle>QuickBooks Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure and monitor QuickBooks sync settings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View system-wide reports and analytics
              </p>
            </CardContent>
          </Card>
        </RoleBasedView>

        {/* Sales Manager Views */}
        <RoleBasedView allowedRoles={['admin', 'sales_manager']}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <CardTitle>Sales Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View sales performance and manage orders
              </p>
            </CardContent>
          </Card>
        </RoleBasedView>

        {/* Warehouse Staff Views */}
        <RoleBasedView allowedRoles={['admin', 'warehouse_staff']}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Package2 className="h-5 w-5" />
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor stock levels and manage inventory
              </p>
            </CardContent>
          </Card>
        </RoleBasedView>

        {/* Delivery Driver Views */}
        <RoleBasedView allowedRoles={['admin', 'delivery_driver']}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Truck className="h-5 w-5" />
              <CardTitle>Delivery Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View delivery schedule and manage routes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Customer Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access delivery addresses and contact info
              </p>
            </CardContent>
          </Card>
        </RoleBasedView>

        {/* Customer Service Views */}
        <RoleBasedView allowedRoles={['admin', 'customer_service']}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              <CardTitle>Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Process customer returns and refunds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track and update customer order status
              </p>
            </CardContent>
          </Card>
        </RoleBasedView>
      </div>
    </div>
  );
};
