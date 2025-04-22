
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomerPortalInvoicesTableProps {
  isLoading: boolean;
  invoices: any[];
}

export const CustomerPortalInvoicesTable = ({ isLoading, invoices }: CustomerPortalInvoicesTableProps) => (
  <Card className="bg-white shadow-lg rounded-xl w-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Your Invoices</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <p>Loading invoices...</p>
      ) : invoices && invoices.length > 0 ? (
        <div className="w-full max-h-[340px] overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Invoice #</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice: any) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{invoice.invoice_number || "-"}</td>
                  <td className="py-2 px-4">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">${invoice.total.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "draft"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">You don't have any invoices yet.</p>
      )}
    </CardContent>
  </Card>
);

export default CustomerPortalInvoicesTable;
