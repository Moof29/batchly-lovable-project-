
import { Home, FileText, ShoppingCart, Package, Users, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/" },
  { title: "Sales", icon: DollarSign, path: "/sales" },
  { title: "Purchases", icon: ShoppingCart, path: "/purchases" },
  { title: "Inventory", icon: Package, path: "/inventory" },
  { title: "Accounting", icon: FileText, path: "/accounting" },
  { title: "People", icon: Users, path: "/people" },
];

export const NavigationMenu = () => {
  const location = useLocation();

  return (
    <div className="space-y-2 py-4">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === item.path
              ? "bg-brand-500 text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
};
