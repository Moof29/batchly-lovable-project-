
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerContactCardProps = {
  customer: any;
};

export const CustomerContactCard = ({ customer }: CustomerContactCardProps) => (
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
);
