import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Sales Module */}
            <Route path="/sales/*" element={<div>Sales Module (Coming Soon)</div>} />
            <Route path="/sales/orders" element={<div>Sales Orders (Coming Soon)</div>} />
            <Route path="/sales/order-templates" element={<div>Sales Order Templates (Coming Soon)</div>} />
            <Route path="/sales/invoices" element={<div>Invoices (Coming Soon)</div>} />
            <Route path="/sales/accounts-receivable" element={<div>Accounts Receivable (Coming Soon)</div>} />
            
            {/* Purchases Module */}
            <Route path="/purchases/*" element={<div>Purchases Module (Coming Soon)</div>} />
            <Route path="/purchases/orders" element={<div>Purchase Orders (Coming Soon)</div>} />
            <Route path="/purchases/bills" element={<div>Bills (Coming Soon)</div>} />
            
            {/* Inventory Module */}
            <Route path="/inventory/*" element={<div>Inventory Module (Coming Soon)</div>} />
            <Route path="/inventory/items" element={<div>Items (Coming Soon)</div>} />
            
            {/* People Module */}
            <Route path="/people/*" element={<div>People Module (Coming Soon)</div>} />
            <Route path="/people/customers" element={<div>Customers (Coming Soon)</div>} />
            <Route path="/people/vendors" element={<div>Vendors (Coming Soon)</div>} />
            <Route path="/people/employees" element={<div>Employees (Coming Soon)</div>} />
            <Route path="/people/time-tracking" element={<div>Time Tracking (Coming Soon)</div>} />
            
            {/* Payments Module */}
            <Route path="/payments/*" element={<div>Payments (Coming Soon)</div>} />
            
            {/* Settings Module */}
            <Route path="/settings/*" element={<div>Settings (Coming Soon)</div>} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
