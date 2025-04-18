
import { MainLayout } from "@/layouts/MainLayout";
import { Outlet, Link, useLocation } from "react-router-dom";

export const SalesLayout = () => {
  const location = useLocation();
  
  const subModules = [
    { name: "Orders", path: "/sales/orders" },
    { name: "Invoices", path: "/sales/invoices" },
    { name: "Order Templates", path: "/sales/order-templates" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-2">
          <nav className="flex overflow-x-auto space-x-2">
            {subModules.map((module) => {
              const isActive = location.pathname === module.path || 
                              (module.path !== '/sales' && location.pathname.startsWith(module.path));
              
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
        
        <Outlet />
      </div>
    </MainLayout>
  );
};
