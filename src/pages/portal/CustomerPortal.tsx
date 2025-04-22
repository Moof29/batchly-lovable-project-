
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <CustomerPortalHeader onBack={handleBack} />
      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto bg-gray-50 pb-8 px-2 sm:px-4 md:px-8">
        <div className="flex flex-col gap-6 w-full mx-auto">
          <CustomerPortalWelcomeCard displayName={customer.display_name} />
          <div className="w-full">
            <div className="w-full flex flex-col">
              {/* Tabs navigation with prominent active indicator */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 md:mb-8 rounded-xl overflow-x-auto bg-gray-100 p-1">
                <button
                  aria-label="Profile Tab"
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center justify-center py-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 relative 
                    ${activeTab === "profile"
                      ? "bg-white shadow text-brand-500 ring-2 ring-brand-500"
                      : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <User className="h-4 w-4 mr-2" aria-hidden />
                  Profile
                  {activeTab === "profile" && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-1 rounded-xl"
                      style={{ background: "hsl(var(--brand-500))" }}
                    />
                  )}
                </button>
                <button
                  aria-label="Invoices Tab"
                  onClick={() => setActiveTab("invoices")}
                  className={`flex items-center justify-center py-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 relative 
                    ${activeTab === "invoices"
                      ? "bg-white shadow text-brand-500 ring-2 ring-brand-500"
                      : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <FileText className="h-4 w-4 mr-2" aria-hidden />
                  Invoices
                  {activeTab === "invoices" && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-1 rounded-xl"
                      style={{ background: "hsl(var(--brand-500))" }}
                    />
                  )}
                </button>
                <button
                  aria-label="Payments Tab"
                  onClick={() => setActiveTab("payments")}
                  className={`flex items-center justify-center py-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 relative 
                    ${activeTab === "payments"
                      ? "bg-white shadow text-brand-500 ring-2 ring-brand-500"
                      : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <CreditCard className="h-4 w-4 mr-2" aria-hidden />
                  Payments
                  {activeTab === "payments" && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-1 rounded-xl"
                      style={{ background: "hsl(var(--brand-500))" }}
                    />
                  )}
                </button>
                <button
                  aria-label="Messages Tab"
                  onClick={() => setActiveTab("messages")}
                  className={`flex items-center justify-center py-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 relative 
                    ${activeTab === "messages"
                      ? "bg-white shadow text-brand-500 ring-2 ring-brand-500"
                      : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" aria-hidden />
                  Messages
                  {activeTab === "messages" && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-1 rounded-xl"
                      style={{ background: "hsl(var(--brand-500))" }}
                    />
                  )}
                </button>
              </div>
              <div className="w-full">
                <div className={activeTab !== "profile" ? "hidden" : "block"}>
                  <div className="grid">
                    <CustomerPortalProfileCard customer={customer} />
                  </div>
                </div>
                <div className={activeTab !== "invoices" ? "hidden" : "block"}>
                  <div className="grid">
                    <CustomerPortalInvoicesTable
                      isLoading={isLoadingInvoices}
                      invoices={invoicesData?.invoices || []}
                    />
                  </div>
                </div>
                <div className={activeTab !== "payments" ? "hidden" : "block"}>
                  <div className="grid">
                    <CustomerPortalPaymentsCard
                      isLoading={isLoadingPayments}
                      paymentMethods={paymentMethods || []}
                    />
                  </div>
                </div>
                <div className={activeTab !== "messages" ? "hidden" : "block"}>
                  <div className="grid">
                    <CustomerPortalMessagesList
                      isLoading={isLoadingMessages}
                      messages={messages || []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerPortal;
