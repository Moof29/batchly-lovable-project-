
import { FileText, Home, ShoppingCart, Package, Users, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/" },
  { 
    title: "Sales", 
    icon: DollarSign, 
    path: "/sales",
    subItems: [
      { title: "Sales Orders", icon: FileText, path: "/sales/orders" },
      { title: "Invoices", icon: FileText, path: "/sales/invoices" }
    ]
  },
  { title: "Purchases", icon: ShoppingCart, path: "/purchases" },
  { title: "Inventory", icon: Package, path: "/inventory" },
  { title: "People", icon: Users, path: "/people" },
];

export const NavigationMenu = () => {
  const location = useLocation();

  const renderMenuItem = (item: typeof menuItems[0], isSubItem = false) => {
    const isActive = location.pathname === item.path;
    
    return (
      <div key={item.path}>
        <Link
          to={item.path}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-accent hover:text-accent-foreground"
          } ${isSubItem ? "ml-6" : ""}`}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.title}</span>
        </Link>
        
        {'subItems' in item && item.subItems?.map((subItem) => 
          renderMenuItem(subItem, true)
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 py-4">
      {menuItems.map((item) => renderMenuItem(item))}
    </div>
  );
};

