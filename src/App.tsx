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
import { PeopleLayout } from "./pages/people/PeopleLayout";
import { CustomerList } from "./pages/people/CustomerList";
import { CustomerDetail } from "./pages/people/CustomerDetail";
import { VendorList } from "./pages/people/VendorList";
import { VendorDetail } from "./pages/people/VendorDetail";
import { EmployeeList } from "./pages/people/EmployeeList";
import { EmployeeDetail } from "./pages/people/EmployeeDetail";
import { TimeTrackingList } from "./pages/people/TimeTrackingList";
import { PaymentsLayout } from "./pages/payments/PaymentsLayout";
import { AccountsReceivable } from "./pages/payments/AccountsReceivable";
import { AccountsPayable } from "./pages/payments/AccountsPayable";
import { SettingsLayout } from "./pages/settings/SettingsLayout";
import { GeneralSettings } from "./pages/settings/GeneralSettings";
import { BillList } from "./pages/purchases/BillList";
import { InvoiceList } from "./pages/sales/InvoiceList";
import { BillDetail } from "./pages/purchases/BillDetail";
import { InvoiceDetail } from "./pages/sales/InvoiceDetail";
import { TimeEntryDetail } from "./pages/people/TimeEntryDetail";

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
              <Route path="invoices/:id" element={<InvoiceDetail />} />
            </Route>
            
            {/* Purchases Module */}
            <Route path="/purchases" element={<PurchasesLayout />}>
              <Route path="orders" element={<PurchaseOrderList />} />
              <Route path="orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="bills" element={<BillList />} />
              <Route path="bills/:id" element={<BillDetail />} />
            </Route>
            
            {/* Inventory Module */}
            <Route path="/inventory" element={<InventoryLayout />}>
              <Route path="items" element={<ItemList />} />
              <Route path="items/:id" element={<ItemDetail />} />
            </Route>
            
            {/* People Module */}
            <Route path="/people" element={<PeopleLayout />}>
              <Route path="customers" element={<CustomerList />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="vendors" element={<VendorList />} />
              <Route path="vendors/:id" element={<VendorDetail />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
              <Route path="time-tracking" element={<TimeTrackingList />} />
              <Route path="time-tracking/:id" element={<TimeEntryDetail />} />
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
