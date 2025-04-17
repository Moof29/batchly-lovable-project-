
import { FileText, Home, ShoppingCart, Package, Users, DollarSign, CreditCard, Briefcase, Clock, Settings, BarChart4, Receipt, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: BarChart4, path: "/" },
  { 
    title: "Sales", 
    icon: DollarSign, 
    path: "/sales",
    subItems: [
      { title: "Sales Orders", icon: FileText, path: "/sales/orders" },
      { title: "Sales Order Templates", icon: FileText, path: "/sales/order-templates" },
      { title: "Invoices", icon: FileText, path: "/sales/invoices" }
    ]
  },
  { 
    title: "Purchases", 
    icon: ShoppingCart, 
    path: "/purchases",
    subItems: [
      { title: "Purchase Orders", icon: FileText, path: "/purchases/orders" },
      { title: "Bills", icon: FileText, path: "/purchases/bills" }
    ]
  },
  { 
    title: "Inventory", 
    icon: Package, 
    path: "/inventory",
    subItems: [
      { title: "Items", icon: Package, path: "/inventory/items" }
    ]
  },
  { 
    title: "People", 
    icon: Users, 
    path: "/people",
    subItems: [
      { title: "Customers", icon: Users, path: "/people/customers" },
      { title: "Vendors", icon: Briefcase, path: "/people/vendors" },
      { title: "Employees", icon: Users, path: "/people/employees" },
      { title: "Time Tracking", icon: Clock, path: "/people/time-tracking" }
    ]
  },
  { 
    title: "Payments", 
    icon: CreditCard, 
    path: "/payments",
    subItems: [
      { title: "Accounts Receivable", icon: Receipt, path: "/payments/accounts-receivable" },
      { title: "Accounts Payable", icon: Wallet, path: "/payments/accounts-payable" }
    ]
  },
  { 
    title: "Settings", 
    icon: Settings, 
    path: "/settings" 
  },
];

export const NavigationMenu = () => {
  const location = useLocation();

  const renderMenuItem = (item: typeof menuItems[0], isSubItem = false) => {
    const isActive = location.pathname === item.path;
    const hasSubItems = 'subItems' in item && item.subItems?.length > 0;
    const isParentOfActive = hasSubItems && item.subItems?.some(subItem => location.pathname.startsWith(subItem.path));
    
    return (
      <div key={item.path}>
        <Link
          to={item.path}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            isActive || isParentOfActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-accent hover:text-accent-foreground"
          } ${isSubItem ? "ml-6" : ""}`}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.title}</span>
        </Link>
        
        {hasSubItems && item.subItems?.map((subItem) => 
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
