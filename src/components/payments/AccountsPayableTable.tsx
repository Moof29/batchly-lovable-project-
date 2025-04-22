
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface AccountsPayableTableProps {
  bills: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const AccountsPayableTable = ({ 
  bills, 
  sorting, 
  filters, 
  onSort, 
  onFilter 
}: AccountsPayableTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("bill_number")}
                  className="flex items-center hover:text-primary"
                >
                  Bill #
                  {sorting.column === "bill_number" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.bill_number || ""}
                  onChange={(value) => onFilter("bill_number", value)}
                  placeholder="Filter bills..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("vendor_profile.display_name")}
                  className="flex items-center hover:text-primary"
                >
                  Vendor
                  {sorting.column === "vendor_profile.display_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters["vendor_profile.display_name"] || ""}
                  onChange={(value) => onFilter("vendor_profile.display_name", value)}
                  placeholder="Filter vendors..."
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills && bills.length > 0 ? (
            bills.map((bill) => (
              <TableRow key={bill.id} className="hover:bg-muted/50">
                <TableCell>{bill.bill_number}</TableCell>
                <TableCell>{bill.vendor_profile?.display_name}</TableCell>
                <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                <TableCell>${bill.total?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>${bill.balance_due?.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/purchases/bills/${bill.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No bills found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
