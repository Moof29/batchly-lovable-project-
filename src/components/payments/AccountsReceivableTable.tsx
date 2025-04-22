
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface AccountsReceivableTableProps {
  invoices: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const AccountsReceivableTable = ({ 
  invoices, 
  sorting, 
  filters, 
  onSort, 
  onFilter 
}: AccountsReceivableTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("invoice_number")}
                  className="flex items-center hover:text-primary"
                >
                  Invoice #
                  {sorting.column === "invoice_number" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.invoice_number || ""}
                  onChange={(value) => onFilter("invoice_number", value)}
                  placeholder="Filter invoices..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("customer_profile.display_name")}
                  className="flex items-center hover:text-primary"
                >
                  Customer
                  {sorting.column === "customer_profile.display_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters["customer_profile.display_name"] || ""}
                  onChange={(value) => onFilter("customer_profile.display_name", value)}
                  placeholder="Filter customers..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("due_date")}
                  className="flex items-center hover:text-primary"
                >
                  Due Date
                  {sorting.column === "due_date" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("total")}
                  className="flex items-center hover:text-primary"
                >
                  Total
                  {sorting.column === "total" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("balance_due")}
                  className="flex items-center hover:text-primary"
                >
                  Balance Due
                  {sorting.column === "balance_due" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell>{invoice.invoice_number}</TableCell>
              <TableCell>{invoice.customer_profile?.display_name}</TableCell>
              <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
              <TableCell>${invoice.total?.toFixed(2)}</TableCell>
              <TableCell>${invoice.balance_due?.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
