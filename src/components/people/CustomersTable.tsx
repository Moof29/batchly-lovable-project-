
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterDropdown } from "@/components/common/FilterDropdown";

interface CustomersTableProps {
  customers: any[];
  sorting: { column: string; direction: "asc" | "desc" };
  filters: Record<string, string>;
  onSort: (column: string) => void;
  onFilter: (column: string, value: string) => void;
  visibleColumns: { key: string; label: string }[];
}

export const CustomersTable = ({ 
  customers, 
  sorting, 
  filters, 
  onSort, 
  onFilter,
  visibleColumns 
}: CustomersTableProps) => {
  const renderCell = (customer: any, key: string) => {
    switch (key) {
      case 'balance':
        return `$${customer[key]?.toFixed(2) || '0.00'}`;
      case 'credit_limit':
        return customer[key] ? `$${customer[key].toFixed(2)}` : '-';
      default:
        return customer[key] || '-';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {visibleColumns.map(({ key, label }) => (
              <TableHead key={key}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSort(key)}
                    className="flex items-center hover:text-primary"
                  >
                    {label}
                    {sorting.column === key && (
                      sorting.direction === "asc" ? 
                        <ArrowUpAZ className="ml-2 h-4 w-4" /> : 
                        <ArrowDownAZ className="ml-2 h-4 w-4" />
                    )}
                  </button>
                  <FilterDropdown
                    value={filters[key] || ""}
                    onChange={(value) => onFilter(key, value)}
                    placeholder={`Filter by ${label.toLowerCase()}...`}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers && customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-muted/50">
                {visibleColumns.map(({ key }) => (
                  <TableCell key={key}>{renderCell(customer, key)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/people/customers/${customer.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 1} className="text-center py-4">
                No customers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
