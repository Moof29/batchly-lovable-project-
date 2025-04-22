
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CustomerPortalProfileCardProps {
  customer: any;
}

export const CustomerPortalProfileCard = ({ customer }: CustomerPortalProfileCardProps) => (
  <Card className="bg-white shadow-lg rounded-xl">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Your Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
          <div className="space-y-1">
            <div>
              <span className="font-medium">Name:</span> {customer.display_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {customer.email || "Not provided"}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {customer.phone || "Not provided"}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
          <div>
            {customer.billing_address_line1 ? (
              <address className="not-italic leading-relaxed text-sm">
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
);

export default CustomerPortalProfileCard;
