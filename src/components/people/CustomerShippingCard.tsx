
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerShippingCardProps = {
  customer: any;
};

export const CustomerShippingCard = ({ customer }: CustomerShippingCardProps) => (
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
);
