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
import { ItemDetailView } from "./pages/inventory/ItemDetail";
import { PeopleLayout } from "./pages/people/PeopleLayout";
import { CustomerList } from "./pages/people/CustomerList";
import { VendorList } from "./pages/people/VendorList";
import { EmployeeList } from "./pages/people/EmployeeList";
import { TimeTrackingList } from "./pages/people/TimeTrackingList";
import { PaymentsLayout } from "./pages/payments/PaymentsLayout";
import { AccountsReceivable } from "./pages/payments/AccountsReceivable";
import { AccountsPayable } from "./pages/payments/AccountsPayable";
import { SettingsLayout } from "./pages/settings/SettingsLayout";
import { GeneralSettings } from "./pages/settings/GeneralSettings";
import { BillList } from "./pages/purchases/BillList";
import { InvoiceList } from "./pages/sales/InvoiceList";

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
              <Route path="order-templates" element={<CustomerList />} />
              <Route path="invoices" element={<InvoiceList />} />
            </Route>
            
            {/* Purchases Module */}
            <Route path="/purchases" element={<PurchasesLayout />}>
              <Route path="orders" element={<PurchaseOrderList />} />
              <Route path="orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="bills" element={<BillList />} />
            </Route>
            
            {/* Inventory Module */}
            <Route path="/inventory" element={<InventoryLayout />}>
              <Route path="items" element={<ItemList />} />
              <Route path="items/:id" element={<ItemDetailView />} />
            </Route>
            
            {/* People Module */}
            <Route path="/people" element={<PeopleLayout />}>
              <Route path="customers" element={<CustomerList />} />
              <Route path="vendors" element={<VendorList />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="time-tracking" element={<TimeTrackingList />} />
            </Route>
            
            {/* Payments Module */}
            <Route path="/payments" element={<PaymentsLayout />}>
              <Route path="accounts-receivable" element={<AccountsReceivable />} />
              <Route path="accounts-payable" element={<AccountsPayable />} />
            </Route>
            
            {/* Settings Module */}
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<GeneralSettings />} />
            </Route>
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
