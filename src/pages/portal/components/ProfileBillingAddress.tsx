
interface ProfileBillingAddressProps {
  customer: any;
}
export const ProfileBillingAddress = ({ customer }: ProfileBillingAddressProps) => (
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
);

export default ProfileBillingAddress;
