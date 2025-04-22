
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerBillingCardProps = {
  customer: any;
};

export const CustomerBillingCard = ({ customer }: CustomerBillingCardProps) => (
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
);
