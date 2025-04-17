
import { FileText, ShoppingCart, Package, Users, DollarSign, CreditCard, Briefcase, Clock, Settings, BarChart4, Receipt, Wallet, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  { title: "Dashboard", icon: BarChart4, path: "/" },
  { 
    title: "Sales", 
    icon: DollarSign, 
    path: "/sales",
    subItems: [
      { title: "Sales Orders", icon: FileText, path: "/sales/orders" },
      { title: "Sales Order Templates", icon: FileText, path: "/sales/order-templates" },
      { title: "Invoices", icon: Receipt, path: "/sales/invoices" }
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
  const [openSections, setOpenSections] = useState<string[]>([]);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Identify which sections should be open based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find all parent sections that should be open
    const sectionsToOpen = menuItems
      .filter(item => {
        // Check if this is the current path
        if (currentPath === item.path) return true;
        
        // Check if this is a parent of the current path
        if (item.subItems && currentPath.startsWith(item.path + '/')) return true;
        
        // Check if any subitems match the current path
        if (item.subItems && item.subItems.some(subItem => currentPath === subItem.path)) return true;
        
        return false;
      })
      .map(item => item.title);
    
    if (sectionsToOpen.length > 0) {
      setOpenSections(sectionsToOpen);
    }
  }, [location.pathname]);
  
  const toggleSection = (title: string) => {
    setOpenSections(current => 
      current.includes(title) 
        ? current.filter(t => t !== title)
        : [...current, title]
    );
  };

  const renderMenuItem = (item: typeof menuItems[0], isSubItem = false) => {
    const isActive = location.pathname === item.path;
    const hasSubItems = 'subItems' in item && item.subItems?.length > 0;
    const isOpen = openSections.includes(item.title);
    const isParentOfActive = hasSubItems && item.subItems?.some(subItem => location.pathname === subItem.path || location.pathname.startsWith(subItem.path));

    if (hasSubItems) {
      return (
        <div key={item.path} className="relative">
          <Collapsible open={isOpen} onOpenChange={(isOpen) => {
            if (isOpen) {
              setOpenSections(prev => [...prev, item.title]);
            } else if (!isParentOfActive) {
              setOpenSections(prev => prev.filter(t => t !== item.title));
            }
          }}>
            <CollapsibleTrigger 
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                (isActive || isParentOfActive || isOpen)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent/50 hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center",
                    !isCollapsed && "space-x-3"
                  )}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
                  </div>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
              
              {!isCollapsed && (
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen ? "transform rotate-180" : ""
                  )} 
                />
              )}
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="mt-1">
                {item.subItems?.map((subItem) => renderMenuItem(subItem, true))}
              </CollapsibleContent>
            )}
            
            {/* When collapsed, show subitems in a column below the parent if open */}
            {isCollapsed && isOpen && (
              <div className="mt-1 flex flex-col items-center space-y-1">
                {item.subItems?.map((subItem) => {
                  const isSubItemActive = location.pathname === subItem.path;
                  return (
                    <Tooltip key={subItem.path} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Link
                          to={subItem.path}
                          className={cn(
                            "flex items-center justify-center p-2 rounded-lg h-8 w-8",
                            isSubItemActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent/50 hover:text-accent-foreground"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 flex-shrink-0" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{subItem.title}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </Collapsible>
        </div>
      );
    }

    return (
      <div key={item.path} className="relative">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent/50 hover:text-accent-foreground",
                !isCollapsed && "space-x-3",
                isSubItem && !isCollapsed && "ml-6",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
            </Link>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
        </Tooltip>
      </div>
    );
  };

  return (
    <nav className="space-y-1 py-2 px-2">
      {menuItems.map((item) => renderMenuItem(item))}
    </nav>
  );
};
