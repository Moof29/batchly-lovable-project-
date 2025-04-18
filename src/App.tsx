import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DevModeToggle } from "@/components/DevModeToggle";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./pages/auth/AuthPage";
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
import { IntegrationsSettingsPage } from "./pages/settings/IntegrationsSettingsPage";
import { BillList } from "./pages/purchases/BillList";
import { InvoiceList } from "./pages/sales/InvoiceList";
import { BillDetail } from "./pages/purchases/BillDetail";
import { InvoiceDetail } from "./pages/sales/InvoiceDetail";
import { TimeEntryDetail } from "./pages/people/TimeEntryDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DevModeProvider>
        <AuthProvider>
          <BrowserRouter>
            <SidebarProvider defaultOpen={true}>
              <Toaster />
              <Sonner />
              <DevModeToggle />
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  
                  <Route path="/sales" element={<SalesLayout />}>
                    <Route index element={<SalesOrderList />} />
                    <Route path="orders" element={<SalesOrderList />} />
                    <Route path="orders/:id" element={<SalesOrderDetail />} />
                    <Route path="order-templates" element={<CustomerList />} />
                    <Route path="invoices" element={<InvoiceList />} />
                    <Route path="invoices/:id" element={<InvoiceDetail />} />
                  </Route>
                  
                  <Route path="/purchases" element={<PurchasesLayout />}>
                    <Route index element={<PurchaseOrderList />} />
                    <Route path="orders" element={<PurchaseOrderList />} />
                    <Route path="orders/:id" element={<PurchaseOrderDetail />} />
                    <Route path="bills" element={<BillList />} />
                    <Route path="bills/:id" element={<BillDetail />} />
                  </Route>
                  
                  <Route path="/inventory" element={<InventoryLayout />}>
                    <Route index element={<ItemList />} />
                    <Route path="items" element={<ItemList />} />
                    <Route path="items/:id" element={<ItemDetail />} />
                  </Route>
                  
                  <Route path="/people" element={<PeopleLayout />}>
                    <Route index element={<CustomerList />} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="customers/:id" element={<CustomerDetail />} />
                    <Route path="vendors" element={<VendorList />} />
                    <Route path="vendors/:id" element={<VendorDetail />} />
                    <Route path="employees" element={<EmployeeList />} />
                    <Route path="employees/:id" element={<EmployeeDetail />} />
                    <Route path="time-tracking" element={<TimeTrackingList />} />
                    <Route path="time-tracking/:id" element={<TimeEntryDetail />} />
                  </Route>
                  
                  <Route path="/payments" element={<PaymentsLayout />}>
                    <Route index element={<AccountsReceivable />} />
                    <Route path="accounts-receivable" element={<AccountsReceivable />} />
                    <Route path="accounts-payable" element={<AccountsPayable />} />
                  </Route>
                  
                  <Route path="/settings" element={<SettingsLayout />}>
                    <Route index element={<ProtectedRoute requiredRole="admin" element={<GeneralSettings />} />} />
                    <Route path="integrations" element={<ProtectedRoute requiredRole="admin" element={<IntegrationsSettingsPage />} />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </BrowserRouter>
        </AuthProvider>
      </DevModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
