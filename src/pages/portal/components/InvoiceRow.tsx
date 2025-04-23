
import { Button } from "@/components/ui/button";
interface InvoiceRowProps {
  invoice: any;
}
export const InvoiceRow = ({ invoice }: InvoiceRowProps) => (
  <tr className="hover:bg-gray-50 transition" key={invoice.id}>
    <td className="px-4 py-2">{invoice.invoice_number || "-"}</td>
    <td className="px-4 py-2">{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : "-"}</td>
    <td className="px-4 py-2">${Number(invoice.total).toFixed(2)}</td>
    <td className="px-4 py-2">
      <span className={`px-2 py-1 rounded text-xs font-semibold ${
        invoice.status === "paid"
          ? "bg-green-100 text-green-700"
          : invoice.status === "draft"
          ? "bg-gray-200 text-gray-700"
          : "bg-yellow-100 text-yellow-700"
      }`}>
        {invoice.status}
      </span>
    </td>
    <td className="px-4 py-2">
      <Button size="sm" variant="outline" aria-label="View Invoice">View</Button>
    </td>
  </tr>
);

export default InvoiceRow;
