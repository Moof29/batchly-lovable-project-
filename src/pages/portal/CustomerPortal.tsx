import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, FileText, CreditCard, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePortalInvoices } from "@/hooks/usePortalInvoices";
import CustomerPortalHeader from "./CustomerPortalHeader";
import CustomerPortalWelcomeCard from "./CustomerPortalWelcomeCard";
import CustomerPortalProfileCard from "./CustomerPortalProfileCard";
import CustomerPortalInvoicesTable from "./CustomerPortalInvoicesTable";
import CustomerPortalPaymentsCard from "./CustomerPortalPaymentsCard";
import CustomerPortalMessagesList from "./CustomerPortalMessagesList";

export const CustomerPortal = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("asCustomer");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: customer, isLoading } = useQuery({
    queryKey: ["portalCustomer", customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const { data, error } = await supabase
        .from("customer_profile")
        .select("*, organization_id")
        .eq("id", customerId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!customerId
  });

  const { data: invoicesData, isLoading: isLoadingInvoices } = usePortalInvoices(customerId || undefined);

  const { data: paymentMethods, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["portalPaymentMethods", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("customer_payment_methods")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!customerId
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["portalMessages", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("customer_messages")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!customerId
  });

  function handleBack() {
    navigate(-1);
  }

  if (isLoading || !customerId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading Portal...</h1>
          <Button variant="outline" onClick={handleBack}>Return</Button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Customer Not Found</h1>
          <p className="mb-4 text-gray-600">Unable to load customer portal data.</p>
          <Button variant="outline" onClick={handleBack}>Return</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerPortalHeader onBack={handleBack} />

      <main className="flex-1 w-full px-0 sm:px-4 py-4 md:py-8">
        <div className="w-full h-full flex flex-col gap-6">
          {/* Welcome Card */}
          <CustomerPortalWelcomeCard displayName={customer.display_name} />
          {/* Portal Tabs */}
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 rounded-md overflow-x-auto bg-gray-100">
                <TabsTrigger value="profile" className="flex items-center justify-center py-2">
                  <User className="h-4 w-4 mr-2" aria-hidden />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center justify-center py-2">
                  <FileText className="h-4 w-4 mr-2" aria-hidden />
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center justify-center py-2">
                  <CreditCard className="h-4 w-4 mr-2" aria-hidden />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center justify-center py-2">
                  <MessageSquare className="h-4 w-4 mr-2" aria-hidden />
                  Messages
                </TabsTrigger>
              </TabsList>
              <div className="w-full">
                <TabsContent value="profile" className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomerPortalProfileCard customer={customer} />
                  </div>
                </TabsContent>
                <TabsContent value="invoices" className="w-full">
                  <CustomerPortalInvoicesTable
                    isLoading={isLoadingInvoices}
                    invoices={invoicesData?.invoices || []}
                  />
                </TabsContent>
                <TabsContent value="payments" className="w-full">
                  <CustomerPortalPaymentsCard
                    isLoading={isLoadingPayments}
                    paymentMethods={paymentMethods || []}
                  />
                </TabsContent>
                <TabsContent value="messages" className="w-full">
                  <CustomerPortalMessagesList
                    isLoading={isLoadingMessages}
                    messages={messages || []}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerPortal;
