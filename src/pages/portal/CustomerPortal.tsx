
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, FileText, CreditCard, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePortalInvoices } from "@/hooks/usePortalInvoices";

export const CustomerPortal = () => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("asCustomer");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch customer data
  const { data: customer, isLoading } = useQuery({
    queryKey: ["portalCustomer", customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      const { data, error } = await supabase
        .from("customer_profile")
        .select("*, organization_id")
        .eq("id", customerId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!customerId
  });

  const { data: invoicesData, isLoading: isLoadingInvoices } = usePortalInvoices(customerId || undefined);

  // Fetch customer payment methods
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
  
  // Fetch customer messages
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading Portal...</h1>
          <Button variant="outline" onClick={handleBack}>Return</Button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Customer Not Found</h1>
          <p className="mb-4 text-gray-600">Unable to load customer portal data.</p>
          <Button variant="outline" onClick={handleBack}>Return</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-2xl font-semibold">Customer Portal</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {customer.display_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            View and manage your account information, invoices, and messages.
          </p>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Contact Information</h3>
                  <div className="mt-2 space-y-2">
                    <div><span className="font-medium">Name:</span> {customer.display_name}</div>
                    <div><span className="font-medium">Email:</span> {customer.email || "Not provided"}</div>
                    <div><span className="font-medium">Phone:</span> {customer.phone || "Not provided"}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Billing Address</h3>
                  <div className="mt-2">
                    {customer.billing_address_line1 ? (
                      <address className="not-italic">
                        {customer.billing_address_line1}<br />
                        {customer.billing_address_line2 && <>{customer.billing_address_line2}<br /></>}
                        {customer.billing_city}, {customer.billing_state} {customer.billing_postal_code}<br />
                        {customer.billing_country}
                      </address>
                    ) : (
                      <p className="text-gray-500">No billing address on file</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvoices ? (
                <p>Loading invoices...</p>
              ) : invoicesData?.invoices?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Invoice #</th>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">Amount</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesData.invoices.map((invoice: any) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{invoice.invoice_number || "-"}</td>
                          <td className="py-2 px-4">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                          <td className="py-2 px-4">${invoice.total.toFixed(2)}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">You don't have any invoices yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingPayments ? (
                  <p>Loading payment methods...</p>
                ) : paymentMethods && paymentMethods.length > 0 ? (
                  <div className="space-y-2">
                    {paymentMethods.map((pm: any) => (
                      <div key={pm.id} className="rounded border p-2 flex items-center justify-between bg-gray-50">
                        <div>
                          <div className="font-medium">
                            {pm.card_brand} ending in {pm.last_four}
                            {pm.is_default && <span className="ml-2 text-brand-500 font-bold">(Default)</span>}
                          </div>
                          <div className="text-xs text-gray-500">
                            Exp: {pm.expiry_month}/{pm.expiry_year} &mdash; {pm.billing_name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">You don't have any payment methods on file.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4 max-h-60 overflow-auto">
                    {messages.map((msg: any) => (
                      <div key={msg.id} className="rounded border p-2 bg-gray-50">
                        <div className="font-semibold">{msg.subject}</div>
                        <div className="text-sm whitespace-pre-line">{msg.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleString()}
                          {msg.status === 'unread' && <span className="ml-2 text-blue-600 font-bold">● Unread</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">You don't have any messages.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPortal;
