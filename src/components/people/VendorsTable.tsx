
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface VendorsTableProps {
  vendors: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
}

export const VendorsTable = ({ 
  vendors, 
  sorting, 
  filters, 
  onSort, 
  onFilter 
}: VendorsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("display_name")}
                  className="flex items-center hover:text-primary"
                >
                  Name
                  {sorting.column === "display_name" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.display_name || ""}
                  onChange={(value) => onFilter("display_name", value)}
                  placeholder="Filter by name..."
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("email")}
                  className="flex items-center hover:text-primary"
                >
                  Email
                  {sorting.column === "email" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.email || ""}
                  onChange={(value) => onFilter("email", value)}
                  placeholder="Filter by email..."
                />
              </div>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSort("account_number")}
                  className="flex items-center hover:text-primary"
                >
                  Account Number
                  {sorting.column === "account_number" && (
                    sorting.direction === "asc" ? <ArrowUpAZ className="ml-2 h-4 w-4" /> : <ArrowDownAZ className="ml-2 h-4 w-4" />
                  )}
                </button>
                <FilterDropdown
                  value={filters.account_number || ""}
                  onChange={(value) => onFilter("account_number", value)}
                  placeholder="Filter by account..."
                />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <TableRow key={vendor.id} className="hover:bg-muted/50">
                <TableCell>{vendor.display_name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>{vendor.account_number}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/people/vendors/${vendor.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No vendors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
