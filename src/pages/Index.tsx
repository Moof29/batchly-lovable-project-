
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogoIcon } from "@/components/LogoIcon";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <LogoIcon className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-gray-900">Batchly Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No recent sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No items to display</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No recent purchases</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
