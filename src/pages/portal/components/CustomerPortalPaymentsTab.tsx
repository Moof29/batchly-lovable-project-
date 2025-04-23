
import CustomerPortalTabCard from "./CustomerPortalTabCard";
import PaymentRow from "./PaymentRow";

interface CustomerPortalPaymentsTabProps {
  isLoading: boolean;
  paymentsData: any[];
}

export const CustomerPortalPaymentsTab = ({
  isLoading,
  paymentsData
}: CustomerPortalPaymentsTabProps) => (
  <section className="mt-8">
    <CustomerPortalTabCard className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Method</th>
            <th className="px-4 py-3 text-left font-medium">Amount</th>
            <th className="px-4 py-3 text-left font-medium">Applied To</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">Loading payments...</td>
            </tr>
          )}
          {!isLoading && (!paymentsData || paymentsData.length === 0) && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">No payment history found.</td>
            </tr>
          )}
          {paymentsData && paymentsData.map(pm => (
            <PaymentRow payment={pm} key={pm.id} />
          ))}
        </tbody>
      </table>
    </CustomerPortalTabCard>
  </section>
);

export default CustomerPortalPaymentsTab;
