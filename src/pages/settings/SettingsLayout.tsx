
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export const SettingsLayout = () => {
  const location = useLocation();
  
  const subModules = [
    { name: "General", path: "/settings" },
    { name: "Users", path: "/settings/users" },
    { name: "Company", path: "/settings/company" },
    { name: "Integrations", path: "/settings/integrations" },
    { name: "Billing", path: "/settings/billing" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-2">
          <nav className="flex overflow-x-auto space-x-2">
            {subModules.map((module) => {
              const isActive = 
                (module.path === '/settings' && location.pathname === '/settings') || 
                (module.path !== '/settings' && location.pathname.startsWith(module.path));
              
              return (
                <Link
                  key={module.name}
                  to={module.path}
                  className={`px-4 py-2 whitespace-nowrap rounded-md font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {module.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
