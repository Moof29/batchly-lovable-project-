import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useCustomerPortalAccess } from "@/hooks/people/useCustomerPortalAccess";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {customer.display_name}
          </h1>
          <div className="flex items-center gap-2">
            <Switch
              checked={portalAccess}
              disabled={portalLoading}
              onCheckedChange={setPortalAccess}
              aria-label="Toggle portal access"
            />
            <span className="text-sm">
              Portal Access
            </span>
          </div>
        </div>
        {portalAccess && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate(`/portal?asCustomer=${id}`);
            }}
            aria-label="View as Customer"
          >
            View as Customer
          </Button>
        )}
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="billing">Billing & Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="text-sm">{customer.company_name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm">{customer.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm">{customer.phone || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                  <dd className="text-sm">{customer.mobile || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="text-sm">{customer.website || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Balance</dt>
                  <dd className="text-sm">${customer.balance?.toFixed(2) || "0.00"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Credit Limit</dt>
                  <dd className="text-sm">
                    ${customer.credit_limit?.toFixed(2) || "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Terms</dt>
                  <dd className="text-sm">{customer.payment_terms || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tax Exempt</dt>
                  <dd className="text-sm">{customer.tax_exempt ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="text-sm">
                    {customer.billing_address_line1}
                    {customer.billing_address_line2 && (
                      <>
                        <br />
                        {customer.billing_address_line2}
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="text-sm">{customer.billing_city || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="text-sm">{customer.billing_state || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd className="text-sm">{customer.billing_postal_code || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="text-sm">{customer.billing_country || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="text-sm">
                    {customer.shipping_address_line1}
                    {customer.shipping_address_line2 && (
                      <>
                        <br />
                        {customer.shipping_address_line2}
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="text-sm">{customer.shipping_city || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="text-sm">{customer.shipping_state || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd className="text-sm">{customer.shipping_postal_code || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="text-sm">{customer.shipping_country || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
