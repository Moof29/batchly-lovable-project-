import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePortalInvoices } from "@/hooks/usePortalInvoices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CustomerPortalHeader from "./components/CustomerPortalHeader";
import CustomerPortalProfileTab from "./components/CustomerPortalProfileTab";
import CustomerPortalInvoicesTab from "./components/CustomerPortalInvoicesTab";
import CustomerPortalPaymentsTab from "./components/CustomerPortalPaymentsTab";
import CustomerPortalMessagesTab from "./components/CustomerPortalMessagesTab";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments" },
  { key: "messages", label: "Messages" },
];

export const CustomerPortal = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("asCustomer");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    enabled: !!customerId,
  });

  const { data: invoicesData, isLoading: isLoadingInvoices } = usePortalInvoices(customerId || undefined);

  const { data: paymentsData, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["portalPayments", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("payment_receipt")
        .select("*")
        .eq("customer_id", customerId)
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!customerId,
  });

  const { data: messages, isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
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
    enabled: !!customerId,
  });

  function handleBack() {
    navigate(-1);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageBody.trim() || !customerId || sending) return;
    setSending(true);
    try {
      await supabase.from("customer_messages").insert({
        customer_id: customerId,
        organization_id: customer?.organization_id,
        subject: "Customer Portal Message",
        message: messageBody,
        status: "unread",
      });
      setMessageBody("");
      refetchMessages?.();
    } catch (err) {
      // TODO: Show toast error
    }
    setSending(false);
  }

  const handleTabSelect = (tabKey: string) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
  };

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

  const filteredInvoices = invoicesData?.invoices?.filter(inv =>
    !invoiceSearch ||
    (inv.invoice_number && inv.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()))
  ) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerPortalHeader
        onBack={handleBack}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        tabs={TABS}
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
      />
      <main className="w-full max-w-4xl mx-auto px-2 sm:px-6 pb-12 flex flex-col gap-6 mt-0">
        {activeTab === "profile" && (
          <CustomerPortalProfileTab customer={customer} />
        )}

        {activeTab === "invoices" && (
          <CustomerPortalInvoicesTab
            invoiceSearch={invoiceSearch}
            setInvoiceSearch={setInvoiceSearch}
            isLoading={isLoadingInvoices}
            filteredInvoices={filteredInvoices}
          />
        )}

        {activeTab === "payments" && (
          <CustomerPortalPaymentsTab
            isLoading={isLoadingPayments}
            paymentsData={paymentsData || []}
          />
        )}

        {activeTab === "messages" && (
          <CustomerPortalMessagesTab
            isLoading={isLoadingMessages}
            messages={messages || []}
            messageBody={messageBody}
            setMessageBody={setMessageBody}
            sending={sending}
            handleSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
};

export default CustomerPortal;
