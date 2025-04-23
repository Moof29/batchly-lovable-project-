
interface ProfileContactInfoProps {
  customer: any;
}
export const ProfileContactInfo = ({ customer }: ProfileContactInfoProps) => (
  <div>
    <h3 className="text-gray-500 font-medium uppercase mb-3">Contact Information</h3>
    <div className="mb-2">
      <span className="text-gray-900 font-semibold block">{customer.display_name}</span>
      <span className="text-gray-900 block">{customer.email || <span className="text-gray-400">Not provided</span>}</span>
      <span className="text-gray-900 block">{customer.phone || <span className="text-gray-400">Not provided</span>}</span>
    </div>
  </div>
);

export default ProfileContactInfo;
