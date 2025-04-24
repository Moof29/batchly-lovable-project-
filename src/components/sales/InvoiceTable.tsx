
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ColumnConfig } from "@/hooks/useColumnSelection";

interface InvoiceTableProps {
  invoices: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns?: ColumnConfig[];
}

export const InvoiceTable = ({
  invoices,
  sorting,
  filters,
  onSort,
  onFilter,
  visibleColumns
}: InvoiceTableProps) => {
  // If no visibleColumns are provided, use the default columns
  const columnsToRender = visibleColumns || [
    { key: 'invoice_number', label: 'Invoice #', visible: true, order: 0 },
    { key: 'invoice_date', label: 'Date', visible: true, order: 1 },
    { key: 'customer_profile.display_name', label: 'Customer', visible: true, order: 2 },
    { key: 'status', label: 'Status', visible: true, order: 3 },
    { key: 'total', label: 'Total', visible: true, order: 4 },
    { key: 'balance_due', label: 'Balance Due', visible: true, order: 5 }
  ];

  // Convert column key to a more readable cell value
  const renderCell = (invoice: any, key: string) => {
    switch(key) {
      case 'invoice_number':
        return invoice.invoice_number;
      case 'invoice_date':
        return new Date(invoice.invoice_date).toLocaleDateString();
      case 'customer_profile.display_name': 
        return invoice.customer_profile?.display_name;
      case 'status':
        return (
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize bg-primary/10 text-primary">
            {invoice.status}
          </span>
        );
      case 'total':
        return `$${invoice.total.toFixed(2)}`;
      case 'balance_due':
        return `$${invoice.balance_due.toFixed(2)}`;
      default:
        return invoice[key] || '-';
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columnsToRender.map((column) => (
              <TableHead key={column.key}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSort(column.key)}
                    className="flex items-center hover:text-primary"
                  >
                    {column.label}
                    {sorting.column === column.key && (
                      sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                    )}
                  </button>
                  <FilterDropdown
                    value={filters[column.key] || ""}
                    onChange={(value) => onFilter(column.key, value)}
                    placeholder={`Filter by ${column.label.toLowerCase()}...`}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-muted/50">
                {columnsToRender.map((column) => (
                  <TableCell key={column.key}>{renderCell(invoice, column.key)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/sales/invoices/${invoice.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsToRender.length + 1} className="text-center py-4 text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
