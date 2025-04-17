import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SalesLayout } from "./pages/sales/SalesLayout";
import { SalesOrderList } from "./pages/sales/SalesOrderList";
import { SalesOrderDetail } from "./pages/sales/SalesOrderDetail";
import { PurchasesLayout } from "./pages/purchases/PurchasesLayout";
import { PurchaseOrderList } from "./pages/purchases/PurchaseOrderList";
import { PurchaseOrderDetail } from "./pages/purchases/PurchaseOrderDetail";
import { InventoryLayout } from "./pages/inventory/InventoryLayout";
import { ItemList } from "./pages/inventory/ItemList";
import { ItemDetail } from "./pages/inventory/ItemDetail";

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
            <Route path="/sales" element={<SalesLayout />}>
              <Route path="orders" element={<SalesOrderList />} />
              <Route path="orders/:id" element={<SalesOrderDetail />} />
            </Route>
            
            {/* Purchases Module */}
            <Route path="/purchases" element={<PurchasesLayout />}>
              <Route path="orders" element={<PurchaseOrderList />} />
              <Route path="orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="bills" element={<div>Bills (Coming Soon)</div>} />
              <Route path="accounts-payable" element={<div>Accounts Payable (Coming Soon)</div>} />
            </Route>
            
            {/* Inventory Module */}
            <Route path="/inventory" element={<InventoryLayout />}>
              <Route path="items" element={<ItemList />} />
              <Route path="items/:id" element={<ItemDetail />} />
            </Route>
            
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
