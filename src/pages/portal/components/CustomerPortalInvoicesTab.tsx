
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomerPortalInvoicesTabProps {
  invoiceSearch: string;
  setInvoiceSearch: (val: string) => void;
  isLoading: boolean;
  filteredInvoices: any[];
}

export const CustomerPortalInvoicesTab = ({
  invoiceSearch,
  setInvoiceSearch,
  isLoading,
  filteredInvoices
}: CustomerPortalInvoicesTabProps) => (
  <section className="mt-8">
    <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-4 gap-4">
      <Input
        value={invoiceSearch}
        onChange={e => setInvoiceSearch(e.target.value)}
        placeholder="Search invoices…"
        className="w-full max-w-md bg-gray-50 border-gray-300"
        aria-label="Search invoices"
      />
    </div>
    <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-3 text-left font-medium">#</th>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Amount</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">View</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-6">Loading invoices...</td>
            </tr>
          )}
          {!isLoading && filteredInvoices.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-6">You don't have any invoices yet.</td>
            </tr>
          )}
          {filteredInvoices.map(inv => (
            <tr className="hover:bg-gray-50 transition" key={inv.id}>
              <td className="px-4 py-2">{inv.invoice_number || "-"}</td>
              <td className="px-4 py-2">{inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : "-"}</td>
              <td className="px-4 py-2">${Number(inv.total).toFixed(2)}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  inv.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : inv.status === "draft"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <Button size="sm" variant="outline" aria-label="View Invoice">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default CustomerPortalInvoicesTab;
