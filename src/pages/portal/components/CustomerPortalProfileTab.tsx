
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
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-gray-500 font-medium uppercase mb-3">Contact Information</h3>
          <div className="mb-2">
            <span className="text-gray-900 font-semibold block">{customer.display_name}</span>
            <span className="text-gray-900 block">{customer.email || <span className="text-gray-400">Not provided</span>}</span>
            <span className="text-gray-900 block">{customer.phone || <span className="text-gray-400">Not provided</span>}</span>
          </div>
        </div>
        <div>
          <h3 className="text-gray-500 font-medium uppercase mb-3">Billing Address</h3>
          {customer.billing_address_line1 ? (
            <address className="not-italic text-gray-900 text-sm leading-relaxed">
              {customer.billing_address_line1}<br />
              {customer.billing_address_line2 && <>{customer.billing_address_line2}<br /></>}
              {customer.billing_city}, {customer.billing_state} {customer.billing_postal_code}<br />
              {customer.billing_country}
            </address>
          ) : (
            <span className="text-gray-400">No billing address on file</span>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default CustomerPortalProfileTab;
