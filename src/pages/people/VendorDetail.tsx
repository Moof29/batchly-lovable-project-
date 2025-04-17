
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const VendorDetail = () => {
  const { id } = useParams();

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_profile")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!vendor) return <div>Vendor not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {vendor.display_name}
        </h1>
        <Badge variant={vendor.is_active ? "default" : "secondary"}>
          {vendor.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="billing">Billing Information</TabsTrigger>
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
                  <dd className="text-sm">{vendor.company_name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                  <dd className="text-sm">
                    {vendor.first_name && vendor.last_name
                      ? `${vendor.first_name} ${vendor.last_name}`
                      : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm">{vendor.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm">{vendor.phone || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                  <dd className="text-sm">{vendor.mobile || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="text-sm">{vendor.website || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                  <dd className="text-sm">{vendor.account_number || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                  <dd className="text-sm">{vendor.tax_id || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Terms</dt>
                  <dd className="text-sm">{vendor.payment_terms || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">1099 Vendor</dt>
                  <dd className="text-sm">{vendor.is_1099 ? "Yes" : "No"}</dd>
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
                    {vendor.billing_address_line1}
                    {vendor.billing_address_line2 && (
                      <>
                        <br />
                        {vendor.billing_address_line2}
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="text-sm">{vendor.billing_city || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="text-sm">{vendor.billing_state || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd className="text-sm">{vendor.billing_postal_code || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="text-sm">{vendor.billing_country || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {vendor.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{vendor.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
