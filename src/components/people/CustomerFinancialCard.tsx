
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerFinancialCardProps = {
  customer: any;
};

export const CustomerFinancialCard = ({ customer }: CustomerFinancialCardProps) => (
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
);
