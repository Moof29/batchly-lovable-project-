
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerPortalAccess } from "@/hooks/people/useCustomerPortalAccess";
import { CustomerDetailHeader } from "@/components/people/CustomerDetailHeader";
import { CustomerContactCard } from "@/components/people/CustomerContactCard";
import { CustomerFinancialCard } from "@/components/people/CustomerFinancialCard";
import { CustomerBillingCard } from "@/components/people/CustomerBillingCard";
import { CustomerShippingCard } from "@/components/people/CustomerShippingCard";
import { CustomerMessagesCard } from "@/components/people/CustomerMessagesCard";
import { CustomerPaymentMethodsCard } from "@/components/people/CustomerPaymentMethodsCard";

export const CustomerDetail = () => {
  const { id } = useParams();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_profile")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const {
    hasAccess: portalAccess,
    isLoading: portalLoading,
    setAccess: setPortalAccess,
  } = useCustomerPortalAccess(id!);

  if (isLoading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-6">
      <CustomerDetailHeader
        displayName={customer.display_name}
        customerId={id!}
        portalAccess={portalAccess}
        portalLoading={portalLoading}
        setPortalAccess={setPortalAccess}
      />

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="billing">Billing & Shipping</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <CustomerContactCard customer={customer} />
          <CustomerFinancialCard customer={customer} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <CustomerBillingCard customer={customer} />
          <CustomerShippingCard customer={customer} />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <CustomerMessagesCard
            customerId={id!}
            organizationId={customer.organization_id}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <CustomerPaymentMethodsCard
            customerId={id!}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
