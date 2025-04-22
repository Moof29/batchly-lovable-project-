
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePortalInvoices } from "@/hooks/usePortalInvoices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  // Customer profile
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

  // Invoices
  const { data: invoicesData, isLoading: isLoadingInvoices } = usePortalInvoices(customerId || undefined);

  // Payments table
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

  // Messages
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

  // Filter invoices by search
  const filteredInvoices = invoicesData?.invoices?.filter(inv =>
    !invoiceSearch ||
    (inv.invoice_number && inv.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()))
  ) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full bg-white shadow-md flex flex-col items-center px-4 py-4 border-b">
        <div className="flex items-center w-full max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            aria-label="Back to Admin"
            className="hover:bg-gray-100 rounded-full p-2 mr-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
            tabIndex={0}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="mx-auto text-2xl font-semibold text-gray-900 tracking-tight" style={{ letterSpacing: "-0.01em" }}>
            Customer Portal
          </h1>
        </div>
        {/* Tabs */}
        <div className="flex w-full max-w-4xl mx-auto mt-4 gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              aria-label={`${tab.label} Tab`}
              className={`flex-1 md:flex-initial text-center px-4 py-2 transition-colors font-medium rounded-t-md outline-none
                ${activeTab === tab.key
                  ? "bg-brand-500 text-white focus:ring-2 focus:ring-brand-500 shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-brand-500"
                }
              `}
              onClick={() => setActiveTab(tab.key)}
              tabIndex={0}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-2 sm:px-6 pb-12 flex flex-col gap-6 mt-0">
        {/* Welcome and Profile Tab */}
        {activeTab === "profile" && (
          <section className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Welcome, {customer.display_name}</h2>
              <p className="text-gray-600 mt-1">
                View and manage your account information, invoices, and messages.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-gray-500 font-medium uppercase mb-3">Contact Information</h3>
                  <div className="mb-2">
                    <span className="text-gray-900 font-semibold block">{customer.display_name}</span>
                    <span className="text-gray-900 block">{customer.email || <span className="text-gray-400">Not provided</span>}</span>
                    <span className="text-gray-900 block">{customer.phone || <span className="text-gray-400">Not provided</span>}</span>
                  </div>
                </div>
                {/* Billing Address */}
                <div>
                  <h3 className="text-gray-500 font-medium uppercase mb-3">Billing Address</h3>
                  {customer.billing_address_line1 ? (
                    <address className="not-italic text-gray-900 text-sm leading-relaxed">
                      {customer.billing_address_line1}<br />
                      {customer.billing_address_line2 && <>{customer.billing_address_line2}<br /></>}
                      {customer.billing_city}, {customer.billing_state} {customer.billing_postal_code}<br />
                      {customer.billing_country}
                    </address>
                  ) : (
                    <span className="text-gray-400">No billing address on file</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <section className="mt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-4 gap-4">
              <Input
                value={invoiceSearch}
                onChange={e => setInvoiceSearch(e.target.value)}
                placeholder="Search invoices…"
                className="w-full max-w-md bg-gray-50 border-gray-300"
                aria-label="Search invoices"
              />
            </div>
            <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">View</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingInvoices && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-6">Loading invoices...</td>
                    </tr>
                  )}
                  {!isLoadingInvoices && filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-6">You don't have any invoices yet.</td>
                    </tr>
                  )}
                  {filteredInvoices.map(inv => (
                    <tr className="hover:bg-gray-50 transition" key={inv.id}>
                      <td className="px-4 py-2">{inv.invoice_number || "-"}</td>
                      <td className="px-4 py-2">{inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : "-"}</td>
                      <td className="px-4 py-2">${Number(inv.total).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "draft"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant="outline" aria-label="View Invoice">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <section className="mt-8">
            <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Method</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Applied To</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingPayments && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 py-6">Loading payments...</td>
                    </tr>
                  )}
                  {!isLoadingPayments && (!paymentsData || paymentsData.length === 0) && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 py-6">No payment history found.</td>
                    </tr>
                  )}
                  {paymentsData && paymentsData.map(pm => (
                    <tr className="hover:bg-gray-50 transition" key={pm.id}>
                      <td className="px-4 py-2">{pm.payment_date ? new Date(pm.payment_date).toLocaleDateString() : "-"}</td>
                      <td className="px-4 py-2">{pm.payment_method || pm.payment_gateway || "-"}</td>
                      <td className="px-4 py-2">
                        {pm.total_amount !== undefined && pm.total_amount !== null ?
                          "$" + Number(pm.total_amount).toFixed(2) : "-"}
                      </td>
                      <td className="px-4 py-2">{pm.payment_number || pm.reference_number || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <section className="mt-8">
            <div className="bg-white shadow-lg rounded-xl p-6 max-h-96 overflow-auto mb-4">
              {isLoadingMessages ? (
                <p className="py-8 text-center text-gray-400">Loading messages...</p>
              ) : (messages && messages.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="flex flex-col items-start">
                      <div className="font-semibold text-gray-900">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                      </div>
                      <div className="rounded-xl bg-gray-100 px-4 py-2 my-1 text-gray-900 max-w-full whitespace-pre-line">
                        {msg.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {msg.status === "unread" &&
                          <span className="ml-2 text-blue-600 font-bold">● Unread</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-6 text-center">You don't have any messages.</p>
              ))}
            </div>
            <form className="w-full max-w-2xl mx-auto" onSubmit={handleSendMessage} autoComplete="off">
              <Textarea
                className="rounded-md border border-gray-300 p-2 w-full"
                rows={3}
                value={messageBody}
                onChange={e => setMessageBody(e.target.value)}
                placeholder="Type your message…"
                aria-label="Enter your message"
                disabled={sending}
                required
              />
              <Button
                type="submit"
                className="mt-2 bg-brand-500 hover:bg-brand-600 text-white rounded-md py-2 px-4 focus:ring-2 focus:ring-brand-500"
                aria-label="Send message"
                disabled={sending || !messageBody.trim()}
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default CustomerPortal;
