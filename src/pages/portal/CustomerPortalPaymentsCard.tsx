
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface CustomerPortalPaymentsCardProps {
  isLoading: boolean;
  paymentMethods: any[];
}

export const CustomerPortalPaymentsCard = ({ isLoading, paymentMethods }: CustomerPortalPaymentsCardProps) => (
  <Card className="bg-white shadow-lg rounded-xl w-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Your Payment Methods</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 max-h-[280px] overflow-auto">
        {isLoading ? (
          <p>Loading payment methods...</p>
        ) : paymentMethods && paymentMethods.length > 0 ? (
          <div className="space-y-2">
            {paymentMethods.map((pm: any) => (
              <div key={pm.id} className="rounded border p-2 flex items-center justify-between bg-gray-50">
                <div>
                  <div className="font-medium">
                    {pm.card_brand} ending in {pm.last_four}
                    {pm.is_default && (
                      <span className="ml-2 text-brand-500 font-bold">(Default)</span>
                    )}
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
);

export default CustomerPortalPaymentsCard;
