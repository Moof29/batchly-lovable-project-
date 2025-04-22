
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "./FilterDropdown";

interface BillsTableProps {
  bills: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const BillsTable = ({ bills, sorting, filters, onSort, onFilter }: BillsTableProps) => {
  const handleVendorSort = (e: React.MouseEvent) => {
    e.preventDefault();
    onSort("vendor_profile.display_name");
  };
  
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
                  onClick={handleVendorSort}
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
                  onClick={() => onSort("bill_date")}
                  className="flex items-center hover:text-primary"
                >
                  Date
                  {sorting.column === "bill_date" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
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
                  onClick={() => onSort("status")}
                  className="flex items-center hover:text-primary"
                >
                  Status
                  {sorting.column === "status" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.status || ""}
                  onChange={(value) => onFilter("status", value)}
                  placeholder="Filter status..."
                />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills?.map((bill) => (
            <TableRow key={bill.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{bill.bill_number}</TableCell>
              <TableCell>
                {bill.vendor_profile?.display_name ? (
                  <Link 
                    to={`/people/vendors/${bill.vendor_id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bill.vendor_profile.display_name}
                  </Link>
                ) : '-'}
              </TableCell>
              <TableCell>{bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : '-'}</TableCell>
              <TableCell>${bill.total?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>
                <Badge 
                  variant={bill.status === 'paid' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {bill.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/purchases/bills/${bill.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
