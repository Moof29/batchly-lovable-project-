
interface CustomerPortalPaymentsTabProps {
  isLoading: boolean;
  paymentsData: any[];
}

export const CustomerPortalPaymentsTab = ({
  isLoading,
  paymentsData
}: CustomerPortalPaymentsTabProps) => (
  <section className="mt-8">
    <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
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
            <tr className="hover:bg-gray-50 transition" key={pm.id}>
              <td className="px-4 py-2">{pm.payment_date ? new Date(pm.payment_date).toLocaleDateString() : "-"}</td>
              <td className="px-4 py-2">{pm.payment_method || pm.payment_gateway || "-"}</td>
              <td className="px-4 py-2">
                {pm.total_amount !== undefined && pm.total_amount !== null ?
                  "$" + Number(pm.total_amount).toFixed(2) : "-"}
              </td>
              <td className="px-4 py-2">{pm.payment_number || pm.reference_number || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default CustomerPortalPaymentsTab;
