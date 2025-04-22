
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  Package2,
  Truck,
  DollarSign,
  BarChart2,
  TrendingUp,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/layouts/MainLayout";

export const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-md">
            Welcome back, {user.first_name || 'User'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center pt-1 text-xs text-emerald-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>+15.3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <div className="flex items-center pt-1 text-xs text-emerald-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>+8.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="flex items-center pt-1 text-xs text-emerald-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
              <Package2 className="h-4 w-4 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <div className="flex items-center pt-1 text-xs text-red-500">
                <ArrowDown className="h-3 w-3 mr-1" />
                <span>-2.3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4 bg-white rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-brand-500" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="font-medium">#1234</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700">
                        Shipped
                      </span>
                    </TableCell>
                    <TableCell>$250.00</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="font-medium">#5678</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>$175.50</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="font-medium">#9012</TableCell>
                    <TableCell>Mike Johnson</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                        Processing
                      </span>
                    </TableCell>
                    <TableCell>$385.75</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-white rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <BarChart2 className="h-4 w-4 text-brand-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-brand-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New customer registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-brand-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-brand-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order shipped</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
