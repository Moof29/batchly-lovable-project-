
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomerPortalTabCard from "./CustomerPortalTabCard";
import InvoiceRow from "./InvoiceRow";

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
    <CustomerPortalTabCard className="overflow-x-auto">
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
            <InvoiceRow invoice={inv} key={inv.id} />
          ))}
        </tbody>
      </table>
    </CustomerPortalTabCard>
  </section>
);

export default CustomerPortalInvoicesTab;
