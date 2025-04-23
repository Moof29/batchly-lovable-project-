
import CustomerPortalTabCard from "./CustomerPortalTabCard";
import ProfileContactInfo from "./ProfileContactInfo";
import ProfileBillingAddress from "./ProfileBillingAddress";

interface CustomerPortalProfileTabProps {
  customer: any;
}

export const CustomerPortalProfileTab = ({ customer }: CustomerPortalProfileTabProps) => (
  <section className="mt-8">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900">Welcome, {customer.display_name}</h2>
      <p className="text-gray-600 mt-1">
        View and manage your account information, invoices, and messages.
      </p>
    </div>
    <CustomerPortalTabCard className="max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileContactInfo customer={customer} />
        <ProfileBillingAddress customer={customer} />
      </div>
    </CustomerPortalTabCard>
  </section>
);

export default CustomerPortalProfileTab;
